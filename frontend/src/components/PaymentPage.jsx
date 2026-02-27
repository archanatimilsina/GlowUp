import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Paymentpage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Receive the total amount from BuyPage
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





// import React from "react";

// function Paymentpage() {
//   return (
//     <>
//       <style>{`
//         *{
//           margin:0;
//           padding:0;
//           box-sizing:border-box;
//           font-family: "Inter", Arial, sans-serif;
//         }

//         .payment-body{
//           background: linear-gradient(135deg, #fdfbfb, #ebedee);
//           display:flex;
//           justify-content:center;
//           align-items:center;
//           height:100vh;
//         }

//         .modal{
//           width:380px;
//           height:680px;
//           background: rgba(255,255,255,0.9);
//           backdrop-filter: blur(12px);
//           border-radius:18px;
//           box-shadow:0 15px 40px rgba(0,0,0,0.12);
//           display:flex;
//           flex-direction:column;
//           overflow:hidden;
//         }

//         .header{
//           padding:18px;
//           text-align:center;
//           font-weight:600;
//           font-size:16px;
//           border-bottom:1px solid #eee;
//           position:relative;
//         }

//         .close{
//           position:absolute;
//           right:18px;
//           top:16px;
//           font-size:18px;
//           cursor:pointer;
//           color:#888;
//           transition:0.3s;
//         }

//         .close:hover{
//           color:#000;
//         }

//         .section-title{
//           font-size:12px;
//           font-weight:600;
//           color:#999;
//           padding:15px 18px 6px;
//           text-transform:uppercase;
//           letter-spacing:0.5px;
//         }

//         .payment-option{
//           display:flex;
//           align-items:center;
//           justify-content:space-between;
//           padding:14px 18px;
//           cursor:pointer;
//           transition:0.3s ease;
//           border-radius:12px;
//           margin:4px 10px;
//         }

//         .payment-option:hover{
//           background:#f8f9ff;
//         }

//         .left{
//           display:flex;
//           align-items:center;
//           gap:12px;
//         }

//         .icon{
//           width:42px;
//           height:42px;
//           border-radius:12px;
//           background:#eef2ff;
//           display:flex;
//           justify-content:center;
//           align-items:center;
//           font-size:18px;
//           font-weight:bold;
//           color:#4f46e5;
//         }

//         .details span{
//           font-size:14px;
//           font-weight:500;
//         }

//         .details small{
//           font-size:12px;
//           color:#777;
//         }

//         .radio{
//           appearance:none;
//           width:18px;
//           height:18px;
//           border:2px solid #bbb;
//           border-radius:50%;
//           cursor:pointer;
//           position:relative;
//           transition:0.3s;
//         }

//         .radio:checked{
//           border-color:#4f46e5;
//         }

//         .radio:checked::after{
//           content:"";
//           width:10px;
//           height:10px;
//           background:#4f46e5;
//           border-radius:50%;
//           position:absolute;
//           top:50%;
//           left:50%;
//           transform:translate(-50%,-50%);
//         }

//         .footer{
//           margin-top:auto;
//           padding:18px;
//           border-top:1px solid #eee;
//           background:#fafafa;
//         }

//         .amount-row{
//           display:flex;
//           justify-content:space-between;
//           font-size:14px;
//           margin-bottom:6px;
//         }

//         .total{
//           font-weight:600;
//           font-size:16px;
//           color:#4f46e5;
//         }

//         .pay-btn{
//           width:100%;
//           margin-top:15px;
//           padding:12px;
//           border:none;
//           border-radius:12px;
//           background: linear-gradient(135deg,#4f46e5,#6366f1);
//           color:#fff;
//           font-weight:600;
//           cursor:pointer;
//           transition:0.3s;
//         }

//         .pay-btn:hover{
//           transform:translateY(-2px);
//           box-shadow:0 8px 20px rgba(79,70,229,0.3);
//         }
//       `}</style>

//       <div className="payment-body">
//         <div className="modal">

//           <div className="header">
//             Select Payment Method
//             <div className="close">✕</div>
//           </div>

//           <div className="section-title">Recommended</div>

//           <label className="payment-option">
//             <div className="left">
//               <div className="icon">💳</div>
//               <div className="details">
//                 <span>Credit / Debit Card</span>
//                 <small>Visa, Mastercard, RuPay</small>
//               </div>
//             </div>
//             <input type="radio" name="payment" className="radio" />
//           </label>

//           <div className="section-title">Saved Methods</div>

//           <label className="payment-option">
//             <div className="left">
//               <div
//                 className="icon"
//                 style={{ background: "#dcfce7", color: "#16a34a" }}
//               >
//                 e
//               </div>
//               <div className="details">
//                 <span>Arpana •••• anal</span>
//               </div>
//             </div>
//             <input
//               type="radio"
//               name="payment"
//               className="radio"
//               defaultChecked
//             />
//           </label>

//           <div className="section-title">Other Methods</div>

//           <label className="payment-option">
//             <div className="left">
//               <div
//                 className="icon"
//                 style={{ background: "#f3e8ff", color: "#9333ea" }}
//               >
//                 K
//               </div>
//               <div className="details">
//                 <span>Khalti Wallet</span>
//                 <small>Fast & secure mobile payment</small>
//               </div>
//             </div>
//             <input type="radio" name="payment" className="radio" />
//           </label>

//           <label className="payment-option">
//             <div className="left">
//               <div className="icon">💵</div>
//               <div className="details">
//                 <span>Cash on Delivery</span>
//               </div>
//             </div>
//             <input type="radio" name="payment" className="radio" />
//           </label>

//           <div className="footer">
//             <div className="amount-row">
//               <span>Subtotal</span>
//               <span>Rs. 959</span>
//             </div>
//             <div className="amount-row total">
//               <span>Total</span>
//               <span>Rs. 959</span>
//             </div>
//             <button className="pay-btn">Confirm & Pay</button>
//           </div>

//         </div>
//       </div>
//     </>
//   );
// }

// export default Paymentpage;