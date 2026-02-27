import styled from 'styled-components';

const SimpleButton = ({name,isSelected,onClick}) => {
  return <Button $isSelected={isSelected} onClick={onClick}>{name}
  </Button>
}

export default SimpleButton

const Button= styled.button`
width: 100px;
height: 40px;
outline: none;
border: none;
border-radius: 10px;
font-weight: 900;
background-color:${({$isSelected})=> ($isSelected? "#f1897d":"white")};
color: ${({$isSelected})=> ($isSelected? "white":"#f1897d")};
/* border-radius: 15px 40px 15px 10px; */
&:hover{
  background-color: #f1897d;
  color:white ;
  border: 1px solid #f1897d;
  transition: all 0.2s ease-out;
  transform: translateY(-5px);
}
`;
