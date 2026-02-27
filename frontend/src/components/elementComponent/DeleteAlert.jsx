import React from "react";
import styled from "styled-components";
import { AlertTriangle, X } from "lucide-react";

const AlertBox = ({ isOpen, msg, onDelete, onCancel }) => {
  if (!isOpen) return null;

  return (
    <Overlay>
      <ModalContainer>
        <CloseButton onClick={onCancel}>
          <X size={20} />
        </CloseButton>
        
        <IconWrapper>
          <AlertTriangle size={32} color="#b76e79" />
        </IconWrapper>

        <Content>
          <h3>Are you sure?</h3>
          <p>{msg || "Do you really want to delete this? This action cannot be undone."}</p>
        </Content>

        <ButtonGroup>
          <CancelButton onClick={onCancel}>Cancel</CancelButton>
          <DeleteButton onClick={onDelete}>Delete</DeleteButton>
        </ButtonGroup>
      </ModalContainer>
    </Overlay>
  );
};

export default AlertBox;

// --- STYLED COMPONENTS ---

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
`;

const ModalContainer = styled.div`
  background: white;
  width: 100%;
  max-width: 400px;
  border-radius: 24px;
  padding: 35px 30px;
  position: relative;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  color: #ccc;
  cursor: pointer;
  transition: 0.2s;
  &:hover { color: #333; }
`;

const IconWrapper = styled.div`
  background: #fdf6f3;
  width: 65px;
  height: 65px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
`;

const Content = styled.div`
  margin-bottom: 30px;
  h3 { color: #333; font-size: 1.4rem; margin-bottom: 10px; }
  p { color: #777; font-size: 0.95rem; line-height: 1.5; }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const BaseButton = styled.button`
  flex: 1;
  padding: 14px;
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
  border: none;
`;

const CancelButton = styled(BaseButton)`
  background: #f5f5f5;
  color: #666;
  &:hover { background: #eeeeee; }
`;

const DeleteButton = styled(BaseButton)`
  background: #b76e79;
  color: white;
  &:hover { background: #a55d68; box-shadow: 0 5px 15px rgba(183, 110, 121, 0.3); }
`;