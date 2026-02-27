import React from 'react'; 
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom'; 

const RecommendedProductCard = ({ product, onAddToCart, isInCart }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/productDetailPage/${product.id}`);
  };

  const handleQuickAdd = (e) => {
    e.stopPropagation(); 
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
    <StyledCard onClick={handleCardClick}>
      {/* Visual background element for interest */}
      <CardGlow color={isInCart ? "#28a745" : "#6d5dfc"} />
      
      {/* <Badge>Recommended</Badge> */}

      <Content>
        <ImageSection>
          <img src={product.picture_src} alt={product.product_name} />
          {/* Quick Add Overlay that covers the image area on hover */}
          <QuickAddOverlay className="overlay" onClick={handleQuickAdd} isAdded={isInCart}>
            {isInCart ? "In Bag ✓" : "Quick Add +"}
          </QuickAddOverlay>
        </ImageSection>

        <TextSection>
          <div>
            <BrandHeader>
              <span className="brand-name">{product.brand}</span>
              <div className="rating">★ {product.rating}</div>
            </BrandHeader>
            <ProductTitle>{product.product_name}</ProductTitle>
          </div>

          <FooterRow>
            <PriceTag>Rs. {product.price}</PriceTag>
            <SkinTypeGroup>
              {skinTypes.slice(0, 1).map((type, index) => (
                <Tag key={index}>{type}</Tag>
              ))}
            </SkinTypeGroup>
          </FooterRow>
        </TextSection>
      </Content>
    </StyledCard>
  );
};

export default RecommendedProductCard;


const StyledCard = styled.div`
  width: 340px;
  height: 140px;
  background: #ffffff;
  border-radius: 24px;
  position: relative;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;
  padding: 12px;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
    border-color: #6d5dfc33;
  }
`;

const CardGlow = styled.div`
  position: absolute;
  top: -50%;
  right: -20%;
  width: 150px;
  height: 150px;
  background: ${props => props.color};
  filter: blur(70px);
  opacity: 0.08;
  pointer-events: none;
`;

const Badge = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 9px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #6d5dfc;
  background: #6d5dfc15;
  padding: 4px 10px;
  border-radius: 100px;
`;

const Content = styled.div`
  display: flex;
  gap: 15px;
  height: 100%;
`;

const ImageSection = styled.div`
  width: 110px;
  height: 110px;
  background: #f8f9ff;
  border-radius: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;

  img {
    width: 80%;
    height: 80%;
    object-fit: contain;
    transition: transform 0.5s ease;
  }

  ${StyledCard}:hover & img {
    transform: scale(1.1) rotate(-5deg);
  }
`;

const QuickAddOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: ${props => props.isAdded ? 'rgba(40, 167, 69, 0.9)' : 'rgba(109, 93, 252, 0.9)'};
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: 700;
  font-size: 13px;
  opacity: 0;
  transition: opacity 0.3s ease;
  backdrop-filter: blur(4px);

  ${ImageSection}:hover & {
    opacity: 1;
  }
`;

const TextSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 5px 5px 5px 0;
`;

const BrandHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;

  .brand-name {
    font-size: 10px;
    font-weight: 700;
    color: #94a3b8;
    text-transform: uppercase;
  }

  .rating {
    font-size: 11px;
    font-weight: 700;
    color: #f59e0b;
  }
`;

const ProductTitle = styled.h4`
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const FooterRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

const PriceTag = styled.div`
  font-size: 17px;
  font-weight: 800;
  color: #1e293b;
`;

const SkinTypeGroup = styled.div`
  display: flex;
  gap: 5px;
`;

const Tag = styled.span`
  font-size: 10px;
  padding: 3px 8px;
  background: #f1f5f9;
  color: #64748b;
  border-radius: 6px;
  font-weight: 600;
`;