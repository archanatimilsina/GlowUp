import React from "react";
import confetti from "canvas-confetti";

// Destructure { skin_tone, isOpen, onClose } from props
const Alertbox1 = ({ skin_tone, isOpen, onClose }) => {
  
  // Trigger confetti only when the popup opens
  React.useEffect(() => {
    if (isOpen) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f76454', '#4CAF50', '#ffffff']
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const outsideClick = (e) => {
    if (e.target.classList.contains("popup")) {
      onClose();
    }
  };

  return (
    <>
      <style>{`
        .popup {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          display: flex;
          justify-content: center;
          align-items: center;
          backdrop-filter: blur(8px);
          z-index: 9999;
        }

        .popup-box {
          width: 380px;
          background: white;
          border-radius: 24px;
          padding: 35px;
          text-align: center;
          box-shadow: 0 25px 60px rgba(0,0,0,0.2);
          animation: popIn 0.5s cubic-bezier(0.26, 0.53, 0.74, 1.48);
          position: relative;
        }

        @keyframes popIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .close-icon {
          position: absolute;
          top: 15px;
          right: 20px;
          font-size: 22px;
          color: #ccc;
          cursor: pointer;
        }

        .icon-circle {
          width: 80px;
          height: 80px;
          margin: 0 auto 20px;
          border-radius: 50%;
          background: #edf3ee;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
        }

        .result-badge {
          margin: 20px 0;
          padding: 15px;
          background: #fdf6f3;
          border: 2px dashed #f76454;
          border-radius: 15px;
          font-size: 18px;
          color: #333;
        }

        .btn-done {
          background: #f76454;
          color: white;
          border: none;
          padding: 12px 30px;
          border-radius: 30px;
          font-weight: 600;
          cursor: pointer;
          width: 100%;
        }
      `}</style>

      <div className="popup" onClick={outsideClick}>
        <div className="popup-box">
          <div className="close-icon" onClick={onClose}>✕</div>
          <div className="icon-circle">✨</div>
          <h2>Scan Success!</h2>
          <p style={{color: '#666'}}>AI has identified your skin tone:</p>
          
          <div className="result-badge">
            <b>{skin_tone}</b>
          </div>

          <button className="btn-done" onClick={onClose}>
            View Profile
          </button>
        </div>
      </div>
    </>
  );
};

export default Alertbox1;