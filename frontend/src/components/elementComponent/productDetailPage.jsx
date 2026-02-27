import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import styled from "styled-components";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSingleProduct = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/product/view/${id}/`);
        if (!response.ok) throw new Error("Product not found");
        
        const data = await response.json();
        setProduct(data);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
      }
    };
    fetchSingleProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const parseList = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    try {
      return JSON.parse(data.replace(/'/g, '"'));
    } catch (err) {
      console.log(err)
      return String(data).replace(/[[\]']/g, '').split(',').map(s => s.trim());
    }
  };

  if (loading) return <StatusMessage>Loading amazing products...</StatusMessage>;
  if (!product) return (
    <StatusMessage>
      Oops! Product not found. 
      <br />
      <button onClick={() => navigate('/product')}>Go Back Home</button>
    </StatusMessage>
  );

  const skinTypes = parseList(product.skin_type);
  const effects = parseList(product.notable_effects);

  return (
    <Page>
      <Wrap>
        <BackButton onClick={() => navigate(-1)}>← Back to Shop</BackButton>
        
        <Grid>
          {/* 1. IMAGE CARD */}
          <Card className="image-card">
            <MainImage>
              <img src={product.picture_src} alt={product.product_name} />
            </MainImage>
          </Card>

          {/* 2. PRODUCT INFO CARD */}
          <Card className="product-card">
            <BrandBadge>{product.brand}</BrandBadge>
            <h1>{product.product_name}</h1>

            <Subtitle>{product.product_type}</Subtitle>

            <PriceRow>
              <Price>Rs {product.price}</Price>
              <RatingBadge>⭐ {product.rating} Rating</RatingBadge>
            </PriceRow>

            <Actions>
              <BtnPrimary>Buy now</BtnPrimary>
            </Actions>
          </Card>

          {/* 3. SKIN PROFILE CARD */}
          <Card className="profile-card">
            <Section>
              <strong>Suitable for Skin Types</strong>
              <Options>
                {['Oily', 'Combination', 'Dry', 'Normal'].map(type => (
                  <Option 
                    key={type} 
                    className={skinTypes.includes(type) ? "active" : ""}
                  >
                    {type}
                  </Option>
                ))}
              </Options>
            </Section>

            <Section>
              <strong>Notable Effects</strong>
              <Options>
                {effects.map((effect, index) => (
                  <Option key={index} className="active">{effect}</Option>
                ))}
              </Options>
            </Section>
          </Card>
        </Grid>

        {/* 4. FULL DESCRIPTION */}
        <DescriptionBox>
          <h2>Description</h2>
          <p>{product.description}</p>
        </DescriptionBox>
      </Wrap>
    </Page>
  );
};

export default ProductDetail;

// --- STYLED COMPONENTS ---

const Page = styled.main`
  --bg: #fffafa; /* Snowy Peach background */
  --primary: #f4a299;
  --primary2: #f1897d; /* Your main color */
  --text-dark: #d16b5f;
  --muted: #a38b88;
  --card-shadow: 0 15px 35px rgba(241, 137, 125, 0.08);

  min-height: 100vh;
  background-color: var(--bg);
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: #4A5568;
`;

const Wrap = styled.div`
  max-width: 1200px;
  margin: auto;
  padding: 40px 20px;
`;

const BackButton = styled.button`
  background: none; border: none; color: var(--primary2);
  font-weight: 700; cursor: pointer; margin-bottom: 20px;
  display: flex; align-items: center; gap: 8px;
  transition: all 0.2s;
  &:hover { color: var(--text-dark); transform: translateX(-4px); }
`;

const StatusMessage = styled.div`
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  height: 100vh; font-size: 20px; color: #f1897d;
  button { 
    margin-top: 20px; padding: 12px 24px; border-radius: 12px; border: none; 
    background: #f1897d; color: white; cursor: pointer; font-weight: 600;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 1.4fr 0.8fr;
  gap: 26px;
  @media (max-width: 980px) { grid-template-columns: 1fr; }
`;

const Card = styled.section`
  background: #ffffff;
  border-radius: 26px;
  border: 1px solid #fce8e6;
  box-shadow: var(--card-shadow);
  padding: 32px;
  &.image-card { padding: 24px; }
  &.product-card h1 { 
    font-size: 32px; 
    margin-bottom: 12px; 
    color: var(--text-dark);
    font-weight: 800;
  }
`;

const BrandBadge = styled.span`
  background: #fff5f4; 
  color: var(--primary2);
  padding: 6px 14px; 
  border-radius: 10px;
  font-size: 13px; 
  font-weight: 700; 
  text-transform: uppercase;
  display: inline-block;
  margin-bottom: 15px;
  border: 1px solid #fce8e6;
`;

const MainImage = styled.div`
  height: 400px; 
  border-radius: 22px; 
  overflow: hidden;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  img { 
    width: 100%; 
    height: 100%; 
    object-fit: contain; 
    transition: transform 0.3s ease;
    &:hover { transform: scale(1.05); }
  }
`;

const Subtitle = styled.p`
  font-size: 16px; color: var(--muted); margin-bottom: 24px;
`;

const PriceRow = styled.div`
  display: flex; gap: 20px; align-items: center; margin-bottom: 28px;
`;

const Price = styled.div` 
    font-size: 32px; 
    font-weight: 800; 
    color: var(--text-dark);
`;

const RatingBadge = styled.span`
    background: #fff8f7;
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    color: #d16b5f;
`;

const Actions = styled.div` display: flex; gap: 14px; `;

const BtnPrimary = styled.button`
  background: var(--primary2);
  border: none; color: #fff; padding: 16px 40px; border-radius: 999px; 
  font-weight: 700; cursor: pointer; font-size: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(241, 137, 125, 0.2);
  
  &:hover { 
    background: var(--text-dark); 
    transform: translateY(-3px);
    box-shadow: 0 12px 25px rgba(241, 137, 125, 0.3);
  }
`;

const Section = styled.div`
  margin-bottom: 22px;
  strong { 
    display: block; 
    font-size: 15px; 
    margin-bottom: 12px; 
    color: var(--text-dark);
    font-weight: 700;
  }
`;

const Options = styled.div`
  display: flex; flex-wrap: wrap; gap: 10px;
`;

const Option = styled.div`
  padding: 10px 18px; 
  border-radius: 999px; 
  border: 1.5px solid #fce8e6;
  text-align: center; 
  font-size: 13px; 
  color: var(--primary2);
  background: white;
  font-weight: 600;
  
  &.active { 
    background: #fdf0ee; /* Soft Selection */
    color: var(--text-dark); 
    border-color: var(--primary2); 
    box-shadow: 0 4px 10px rgba(241, 137, 125, 0.1);
  }
`;

const DescriptionBox = styled.section`
  margin-top: 40px; 
  background: #ffffff; 
  border-radius: 26px;
  padding: 36px; 
  box-shadow: var(--card-shadow);
  border: 1px solid #fce8e6;
  
  h2 { 
    margin-bottom: 16px; 
    font-size: 26px; 
    color: var(--text-dark);
    font-weight: 800;
  }
  p { 
    color: #64748B; 
    line-height: 1.8; 
    font-size: 15px; 
  }
`;