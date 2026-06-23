import { useLocation, useNavigate } from "react-router-dom";

function Paymentpage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const amountToPay = location.state?.amount || 0;

  return (
    <>
      <style>{`
        * { margin:0; padding:0; box-sizing:border-box; font-family: "Inter", sans-serif; }
        .payment-body { background: #ebedee; display:flex; justify-content:center; align-items:center; height:100vh; }
        .modal { width:380px; background: white; border-radius:18px; display:flex; flex-direction:column; overflow:hidden; box-shadow:0 15px 40px rgba(0,0,0,0.1); }
        .header { padding:18px; text-align:center; font-weight:600; border-bottom:1px solid #eee; position:relative; }
        .close { position:absolute; right:18px; top:16px; cursor:pointer; color:#888; }
        .section-title { font-size:12px; color:#999; padding:15px 18px 5px; text-transform:uppercase; }
        .payment-option { display:flex; align-items:center; justify-content:space-between; padding:14px 18px; cursor:pointer; }
        .payment-option:hover { background:#f8f9ff; }
        .icon { width:40px; height:40px; border-radius:10px; background: #eef2ff; display:flex; justify-content:center; align-items:center; font-size:18px; }
        .footer { padding:18px; border-top:1px solid #eee; background:#fafafa; margin-top:20px; }
        .pay-btn { width:100%; padding:12px; border:none; border-radius:12px; background: #fb8d80; color:white; font-weight:600; cursor:pointer; margin-top:10px; }
      `}</style>

      <div className="payment-body">
        <div className="modal">
          <div className="header">
            Select Payment Method
            <div className="close" onClick={() => navigate(-1)}>✕</div>
          </div>

          {/* <div className="section-title">Recommended</div> */}
          <label className="payment-option">
            <div style={{display:'flex', gap:'12px', alignItems:'center'}}>
              <div className="icon">💳</div>
              <div><p style={{margin:0, fontSize:'14px'}}>Card</p>
              {/* <small style={{color:'#777'}}>Visa / Mastercard</small> */}
              </div>
            </div>
            <input type="radio" name="pay" defaultChecked />
          </label>

          <label className="payment-option">
            <div style={{display:'flex', gap:'12px', alignItems:'center'}}>
              <div className="icon" style={{background:'#f3e8ff', color:'#9333ea'}}>K</div>
              <div><p style={{margin:0, fontSize:'14px'}}>Khalti</p></div>
            </div>
            <input type="radio" name="pay" />
          </label>

          <label className="payment-option">
            <div style={{display:'flex', gap:'12px', alignItems:'center'}}>
              <div className="icon">💵</div>
              <div><p style={{margin:0, fontSize:'14px'}}>Cash on Delivery</p></div>
            </div>
            <input type="radio" name="pay" />
          </label>

          <div className="footer">
            {/* <div style={{display:'flex', justifyContent:'space-between', marginBottom:'5px'}}>
              <span>Subtotal</span><span>Rs. {amountToPay.toLocaleString()}</span>
            </div> */}
            <div style={{display:'flex', justifyContent:'space-between', fontWeight:'bold', color:'#4f46e5'}}>
              <span>Total</span><span>Rs. {amountToPay.toLocaleString()}</span>
            </div>
            <button className="pay-btn" onClick={() => alert("No payment connection")}>
              Confirm & Pay
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Paymentpage;


