import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const BuyPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get items passed from CartPage
  const items = location.state?.items || [];

  const shipping = 50;
  const discountPercent = 20; 

  // Math Calculations
  const rawSubtotal = items.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const discountAmount = (rawSubtotal * discountPercent) / 100;
  const finalSubtotal = rawSubtotal - discountAmount;
  const totalToPay = finalSubtotal + shipping;

  const handleGoToPayment = () => {
    navigate('/paymentpage', { state: { amount: totalToPay } });
  };

  if (items.length === 0) {
    return (
      <div style={{textAlign:'center', marginTop:'100px'}}>
        <p>No items selected to buy.</p>
        <button onClick={() => navigate('/cart')} style={{padding: '10px 20px', cursor: 'pointer'}}>Go to Cart</button>
      </div>
    );
  }

  return (
    <>
      <style>{`
        :root { 
          --primary: #fb8d80; 
          --bg: #f0f2f5; 
          --text: #1e293b; 
          --muted: #64748b; 
        }
        body { background: var(--bg); font-family: 'Inter', sans-serif; margin: 0; }
        
        .checkout-wrapper { max-width: 800px; margin: 40px auto; padding: 20px; }
        
        .checkout-card { background: white; border-radius: 24px; box-shadow: 0 10px 40px rgba(0,0,0,0.05); overflow: hidden; }
        
        /* Back Button Styling */
        .back-nav {
          padding: 20px 30px 0px 30px;
        }
        .btn-back {
          background: none;
          border: none;
          color: var(--primary);
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          padding: 0;
          transition: 0.2s;
        }
        .btn-back:hover {
          opacity: 0.7;
          transform: translateX(-3px);
        }

        .section { padding: 30px; border-bottom: 1px solid #f1f5f9; }
        .section-title { font-weight: 700; margin-bottom: 20px; font-size: 18px; color: var(--text); }

        .mini-item { display: flex; align-items: center; gap: 15px; margin-bottom: 15px; }
        .mini-img { width: 65px; height: 65px; border-radius: 12px; object-fit: cover; background: #f8fafc; border: 1px solid #eee; }
        
        .price-summary { background: #f8fafc; padding: 25px; border-radius: 20px; }
        .row { display: flex; justify-content: space-between; margin-bottom: 12px; color: var(--muted); font-size: 15px; }
        .row.total { border-top: 1px solid #e2e8f0; padding-top: 15px; font-weight: 800; font-size: 20px; color: var(--text); }
        
        .btn-pay { 
          width: 100%; 
          background: var(--primary); 
          color: white; 
          border: none; 
          padding: 20px; 
          border-radius: 18px; 
          font-size: 16px; 
          font-weight: 700; 
          cursor: pointer; 
          margin-top: 25px; 
          transition: 0.3s;
        }
        .btn-pay:hover {
          box-shadow: 0 10px 20px rgba(109, 93, 252, 0.3);
        }

        .discount-tag { background: #dcfce7; color: #22c55e; padding: 2px 8px; border-radius: 6px; font-size: 12px; font-weight: 700; }
      `}</style>

      <div className="checkout-wrapper">
        <div className="checkout-card">
          
          {/* Top Back Button */}
          <div className="back-nav">
            <button className="btn-back" onClick={() => navigate(-1)}>
              ← Back to Cart
            </button>
          </div>

          <div className="section">
            <h2 style={{margin: 0}}>Order Confirmation</h2>
            <p style={{color: 'var(--muted)', fontSize: '14px', margin: '5px 0 0'}}>Review your items before payment</p>
          </div>

          <div className="section">
            <div className="section-title">📦 Selected Products</div>
            {items.map(item => (
              <div className="mini-item" key={item.id}>
                <img src={item.image} className="mini-img" alt={item.title} />
                <div style={{flex:1}}>
                  <h4 style={{margin:0, fontSize: '15px'}}>{item.title || item.product_name}</h4>
                  <p style={{margin:0, fontSize:'13px', color:'var(--muted)'}}>Quantity: {item.qty}</p>
                </div>
                <div style={{fontWeight:'700', color: 'var(--text)'}}>
                  Rs. {(item.price * item.qty).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          <div className="section">
            <div className="section-title">💰 Payment Summary</div>
            <div className="price-summary">
              <div className="row">
                <span>Items Subtotal</span>
                <span>Rs. {rawSubtotal.toLocaleString()}</span>
              </div>
              <div className="row">
                <span>Discount <span className="discount-tag">{discountPercent}% OFF</span></span>
                <span style={{color:'#22c55e'}}>- Rs. {discountAmount.toLocaleString()}</span>
              </div>
              <div className="row">
                <span>Shipping Fee</span>
                <span>Rs. {shipping}</span>
              </div>
              <div className="row total">
                <span>Total to Pay</span>
                <span style={{color:'#ef4444'}}>Rs. {totalToPay.toLocaleString()}</span>
              </div>
            </div>

            <button className="btn-pay" onClick={handleGoToPayment}>
              Confirm & Pay Rs. {totalToPay.toLocaleString()}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BuyPage;