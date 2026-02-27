import styled from 'styled-components';

const AddToCartButton = ({name,link,onClick}) => {
  return <a href={link}>
    <AddToCartBtn onClick={onClick}>{name} 
  </AddToCartBtn>
  </a>
}

export default AddToCartButton

const AddToCartBtn= styled.button`
width: 150px;
height: 40px;
outline: none;
border: none;
border-radius: 10px;
font-weight: 900;
background-color:#f1897d ;
color: white;

&:hover{
  background-color: white;
  color:#f1897d ;
  border: 1px solid #f1897d;
  transition: all 0.2s ease-out;
  transform: translateY(-5px);

}
`;
