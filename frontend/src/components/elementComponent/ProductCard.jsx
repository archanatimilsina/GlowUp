import React from 'react'; 
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom'; 
import AddToCartButton from './Button/AddToCartBtn';

const ProductCard = ({ product, onAddToCart, isInCart }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/productDetailPage/${product.id}`);
  };

  const handleButtonClick = (e) => {
    e.stopPropagation(); 
    // We only call the add function if the item isn't already there
    if (!isInCart) {
      onAddToCart();   
    }
  };

  const cleanSkinTypes = () => {
    const rawData = product.skin_type || "";
    const typeString = Array.isArray(rawData) ? rawData.join(',') : String(rawData);
    return typeString
      .replace(/[[\]']/g, '')
      .split(',')
      .map(item => item.trim())
      .filter(item => item !== "");
  };

  const skinTypes = cleanSkinTypes();

  return (
    <Card onClick={handleCardClick}>
      <ImageWrapper>
        <img src={product.picture_src} alt={product.product_name} />
      </ImageWrapper>

      <Info>
        <BrandRow>
          <span className="brand">{product.brand}</span>
          <span className="rating">⭐ {product.rating}</span>
        </BrandRow>
        
        <h4>{product.product_name}</h4>
        
        <SkinTagContainer>
          {skinTypes.slice(0, 3).map((type, index) => (
            <SkinTag key={index}>{type}</SkinTag>
          ))}
        </SkinTagContainer>

        <PriceRow>
          <span className="price">Rs {product.price}</span>
          
          <div onClick={handleButtonClick}>
            <AddToCartButton 
              name={isInCart ? "In Cart ✓" : "Add to Cart"} 
              disabled={isInCart}
              style={{
                backgroundColor: isInCart ? "#28a745" : "#000000", 
                color: "#ffffff",
                cursor: isInCart ? "default" : "pointer",
                border: "none",
                transition: "0.3s ease"
              }}
            />
          </div>
        </PriceRow>
      </Info>
    </Card>
  );
};

export default ProductCard;

// --- STYLED COMPONENTS ---

const Card = styled.div` 
  width: 280px; 
  background: #ffffff; 
  border-radius: 20px; 
  padding: 15px; 
  display: flex; 
  flex-direction: column; 
  transition: all 0.3s ease; 
  position: relative; 
  border: 1px solid #f0f0f0; 
  cursor: pointer; 
  &:hover { 
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); 
    transform: translateY(-5px); 
  } 
`;

const ImageWrapper = styled.div` 
  width: 100%; 
  height: 200px; 
  background: #f9f9f9; 
  border-radius: 15px; 
  display: flex; 
  justify-content: center; 
  align-items: center; 
  overflow: hidden; 
  margin-bottom: 15px; 
  img { 
    max-width: 85%; 
    max-height: 85%; 
    object-fit: contain; 
    transition: 0.5s; 
  } 
  ${Card}:hover & img { 
    transform: scale(1.1); 
  } 
`;

const Info = styled.div` 
  display: flex; 
  flex-direction: column; 
  gap: 8px; 
  h4 { 
    font-size: 15px; 
    font-weight: 600; 
    color: #333; 
    height: 40px; 
    overflow: hidden; 
  } 
`;

const BrandRow = styled.div` 
  display: flex; 
  justify-content: space-between; 
  .brand { 
    font-size: 11px; 
    color: #999; 
    font-weight: bold; 
  } 
  .rating { 
    font-size: 12px; 
    font-weight: bold; 
  } 
`;

const SkinTagContainer = styled.div` 
  display: flex; 
  gap: 4px; 
`;

const SkinTag = styled.span` 
  font-size: 9px; 
  padding: 3px 8px; 
  border-radius: 6px; 
  background: #f0f0f0; 
  color: #666; 
`;

const PriceRow = styled.div` 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  margin-top: 10px; 
  border-top: 1px solid #f9f9f9; 
  padding-top: 10px; 
  .price { 
    font-size: 16px; 
    font-weight: 800; 
    color: #222; 
  } 
`;