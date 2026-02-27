import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components'; // Added keyframes import
import SimpleButton from './elementComponent/Button/simpleButton';
import ProductCard from './elementComponent/ProductCard';
import SearchResults from './elementComponent/SearchResults';
import useUserStore from '../store/useUserStore';
import RecommendedProductCard from './elementComponent/RecommendedProductCard';

const ProductPage = () => {
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [data, setData] = useState(null);
  const [selectedFilterBtn, setSelectedFilterBtn] = useState("All");
  const [filteredProduct, setFilteredData] = useState(null);
  const [searchStatus, setSearchStatus] = useState(false);
  const [recommend, setRecommend] = useState(true);
  
  const [cartItemIds, setCartItemIds] = useState([]);
  const { email } = useUserStore(); 

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; 

  useEffect(() => {
    const fetchCartIds = async () => {
      if (!email) {
        setCartItemIds([]); 
        return;
      }
      try {
        const response = await fetch(`http://127.0.0.1:8000/product/cart/view/?email=${email}`);
        const cartData = await response.json();
        const ids = cartData.map(item => item.product_id); 
        setCartItemIds(ids);
      } catch (error) {
        console.error("Error fetching cart IDs:", error);
      }
    };
    fetchCartIds();
  }, [email]);

  const handleAddToCart = async (productId) => {
    if (!email) {
      alert("Please login first!");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/product/cart/add/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, product_id: productId })
      });

      if (response.ok) {
        setCartItemIds(prev => [...prev, productId]);
      }
    } catch (error) {
      console.error("Cart Error:", error);
    }
  };

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/product/view/", { method: "GET" });
        const json = await response.json();
        setData(json);
        setFilteredData(json);
      } catch (error) {
        console.error("Fetch Error:", error);
      }
    };
    fetchProductData();
  }, []);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (email) {
        try {
          const response = await fetch(`http://127.0.0.1:8000/product/recommend/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email })
          });
          const json = await response.json();
          setRecommendedProducts(json);
        } catch (error) {
          console.error("Recommendation Error:", error);
        }
      }
    };
    fetchRecommendations();
  }, [email]);

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProduct?.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil((filteredProduct?.length || 0) / itemsPerPage);

  const filterData = (type) => {
    setCurrentPage(1); 
    setRecommend(false);
    if (type === "All") {
      setRecommend(true);
      setFilteredData(data);
      setSelectedFilterBtn("All");
      return;
    }
    const filter = data?.filter((product) =>
      product.product_type.toLowerCase().includes(type.toLowerCase())
    );
    setFilteredData(filter);
    setSelectedFilterBtn(type);
  };

  const searchproduct = (e) => {
    setCurrentPage(1); 
    setSearchStatus(true);
    setRecommend(false);
    const searchValue = e.target.value;
    if (searchValue === "") {
      setSearchStatus(false);
      setRecommend(true);
    }
    const filter = data?.filter((product) =>
      product.product_name.toLowerCase().includes(searchValue.toLowerCase()) ||
      product.product_type.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredData(filter);
  };

  const filterButtons = [
    { name: "All", type: "All" },
    { name: "Face Wash", type: "Face Wash" },
    { name: "Toner", type: "Toner" },
    { name: "Serum", type: "Serum" },
    { name: "Moisturizer", type: "Moisturizer" },
    { name: "Sunscreen", type: "Sunscreen" },
  ];

  return (
    <MainContainer>
      <div className="headBar">
        <div className="filterContainer">
          {filterButtons.map((productType) => (
            <SimpleButton
              name={productType.name}
              key={productType.name}
              isSelected={selectedFilterBtn === productType.type}
              onClick={() => filterData(productType.type)}
            />
          ))}
        </div>
        <div className="searchBar">
          <input type="text" placeholder="Search here..." onChange={searchproduct} />
          <SimpleButton name="Search" />
        </div>
      </div>

      {!searchStatus && (
        <ProductContainer>
          {recommend && recommendedProducts.length > 0 && (
            <>
              <h3 className="fade-in">Recommended for you</h3>
              {/* Added slide-in class here */}
              <div className="RecommendedProducts slide-in">
                {recommendedProducts.map((item, index) => {
                  const p = item.product || item;
                  return (
                    <div key={index} className='productCardContaineer'>
                      <RecommendedProductCard 
                        product={p} 
                        onAddToCart={() => handleAddToCart(p.id)}
                        isInCart={cartItemIds.includes(p.id)} 
                      />
                    </div>
                  );
                })}
              </div>
            </>
          )}

          <h3 className="fade-in delay-1">Products</h3>
          {/* Added fade-in class here */}
          <div className="products fade-in delay-2">
            {currentProducts?.map((product, index) => (
              <div key={index} className='productCardContaineer'>
                <ProductCard 
                  product={product} 
                  onAddToCart={() => handleAddToCart(product.id)}
                  isInCart={cartItemIds.includes(product.id)}
                />
              </div>
            ))}
          </div>

          {filteredProduct?.length > itemsPerPage && (
            <PaginationWrapper>
              <button className="pageBtn" disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>Previous</button>
              <span className="pageInfo">Page <strong>{currentPage}</strong> of {totalPages}</span>
              <button className="pageBtn" disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}>Next</button>
            </PaginationWrapper>
          )}
        </ProductContainer>
      )}

      {searchStatus && (
        <SearchResults 
          products={filteredProduct} 
          onAddToCart={handleAddToCart}
          cartItemIds={cartItemIds}
        />
      )}
    </MainContainer>
  );
};

export default ProductPage;

// --- ANIMATIONS ---
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideLeft = keyframes`
  from { opacity: 0; transform: translateX(100px); }
  to { opacity: 1; transform: translateX(0); }
`;

const MainContainer = styled.main`
  .headBar {
    width: 100%; height: 90px; display: flex; align-items: center;
    background: rgba(255, 255, 255, 0.65); backdrop-filter: blur(15px);
    padding: 20px; position: sticky; top: 0; z-index: 10;
  }
  .filterContainer { width: 100%; display: flex; gap: 20px; overflow-x: auto; }
  .searchBar { display: flex; padding: 20px; gap: 10px; input { width: 200px; height: 40px; padding: 10px; } }
  
  /* Applying Animations */
  .fade-in {
    opacity: 0;
    animation: ${fadeUp} 1s forwards;
  }

  .slide-in {
    opacity: 0;
    animation: ${slideLeft} 1.2s ease-out forwards;
  }

  .delay-1 { animation-delay: 0.3s; }
  .delay-2 { animation-delay: 0.6s; }

  .RecommendedProducts {
    padding: 30px;
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    gap: 20px;
    width: 100%;
    scroll-behavior: smooth;
    scrollbar-width: none;
    &::-webkit-scrollbar { height: 6px; }
    &::-webkit-scrollbar-thumb { background: #ccc; border-radius: 10px; }
  }

  .productCardContaineer {
    flex-shrink: 0;
    display: inline-block;
  }

  .products {
    padding: 20px; display: flex; flex-wrap: wrap; 
    justify-content: center; gap: 20px;
  }
`;

const ProductContainer = styled.section`
  display: flex; flex-direction: column; align-items: center; padding: 20px;
  h3 { color: black; align-self: flex-start; margin-left: 20px; font-size: 1.5rem; }
`;

const PaginationWrapper = styled.div`
  display: flex; justify-content: center; align-items: center; gap: 20px; margin: 40px 0;
  .pageBtn { padding: 8px 20px; background: #fff; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; }
  .pageInfo { color: black; }
`;