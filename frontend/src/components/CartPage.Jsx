import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../store/useUserStore";
import AlertBox from "../components/elementComponent/DeleteAlert"; // Assumes you saved the previous component here

const CartPage = () => {
  const navigate = useNavigate();
  const { email } = useUserStore();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Alert States ---
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      if (!email) return;
      try {
        const response = await fetch(`http://127.0.0.1:8000/product/cart/view/?email=${email}`);
        const data = await response.json();
        
        const formattedData = data.map(item => ({
          ...item,
          selected: false,
          qty: item.quantity || 1 
        }));
        
        setCartItems(formattedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cart:", error);
        setLoading(false);
      }
    };

    fetchCart();
  }, [email]);

  const toggleSelect = (id) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const toggleAll = () => {
    const allSelected = cartItems.length > 0 && cartItems.every(item => item.selected);
    setCartItems(prev => prev.map(item => ({ ...item, selected: !allSelected })));
  };

  const updateQty = async (id, delta, currentQty) => {
    const newQty = Math.max(1, currentQty + delta);
    setCartItems(prev =>
      prev.map(item => (item.id === id ? { ...item, qty: newQty } : item))
    );

    try {
      await fetch("http://127.0.0.1:8000/product/cart/update/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart_id: id, quantity: newQty })
      });
    } catch (error) {
      console.error("Failed to sync quantity", error);
    }
  };

  // --- Updated Delete Logic ---
  const openDeleteAlert = (id) => {
    setItemToDelete(id);
    setIsAlertOpen(true);
  };

  const confirmRemoveItem = async () => {
    if (!itemToDelete) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/product/cart/delete/${itemToDelete}/`, {
        method: "DELETE",
      });

      if (response.ok) {
        setCartItems(prev => prev.filter(item => item.id !== itemToDelete));
        setIsAlertOpen(false);
        setItemToDelete(null);
      } else {
        alert("Failed to delete item from server.");
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const selectedItems = cartItems.filter(item => item.selected);
  const totalPrice = selectedItems.reduce((acc, item) => acc + (item.price * item.qty), 0);

  const handleProceedToBuy = () => {
    navigate('/buypage', { state: { items: selectedItems } });
  };

  if (!email) {
    return <div style={{color: '#333', textAlign: 'center', marginTop: '50px'}}>Please login to view your bag.</div>;
  }

  return (
    <>
      {/* Custom Alert Box */}
      <AlertBox 
        isOpen={isAlertOpen}
        msg="Are you sure you want to remove this item from your skincare bag?"
        onDelete={confirmRemoveItem}
        onCancel={() => setIsAlertOpen(false)}
      />

      <style>{`
        :root {
          --accent: #b76e79;
          --accent-soft: #fdf6f3;
          --text: #333333;
          --muted: #94a3b8;
          --bg: #fdf6f3;
        }
        body { background-color: var(--bg); }
        .header { padding: 40px 20px 20px; max-width: 900px; margin: 0 auto; display: flex; justify-content: space-between; align-items: flex-end; }
        .header h1 { font-size: 32px; color: var(--accent); font-weight: 800; margin: 0; }
        .header p { color: var(--muted); margin-top: 5px; }
        .select-all-btn { background: none; border: 1px solid var(--accent); color: var(--accent); padding: 8px 16px; border-radius: 20px; font-weight: 600; cursor: pointer; font-size: 14px; transition: 0.3s; }
        .select-all-btn:hover { background: var(--accent); color: white; }
        
        .cart-container { max-width: 900px; margin: 0 auto; padding: 0 20px 100px; }
        .product-card { background: white; border-radius: 24px; padding: 25px; margin-bottom: 20px; display: flex; gap: 25px; box-shadow: 0 10px 30px rgba(0,0,0,0.03); border: 2px solid transparent; transition: 0.3s ease; align-items: center; }
        .product-card.selected { border-color: var(--accent); background: #fffafa; }
        
        .custom-cb { width: 24px; height: 24px; border: 2px solid #ddd; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
        .custom-cb.active { background: var(--accent); border-color: var(--accent); }
        .custom-cb.active::after { content: '✔'; color: white; font-size: 12px; }
        
        .img-box { width: 130px; height: 130px; background: #fff; border-radius: 20px; overflow: hidden; flex-shrink: 0; border: 1px solid #f1f5f9; }
        .img-box img { width: 100%; height: 100%; object-fit: contain; padding: 10px; }
        
        .info-box { flex: 1; display: flex; flex-direction: column; }
        .brand-tag { font-size: 11px; color: var(--accent); font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; margin-bottom: 5px; }
        .info-top h3 { font-size: 18px; color: var(--text); margin: 0 0 10px 0; font-weight: 600; }
        
        .controls-row { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; }
        .qty-picker { display: flex; align-items: center; background: var(--accent-soft); border-radius: 12px; padding: 4px; }
        .qty-picker button { width: 32px; height: 32px; border: none; background: white; color: var(--accent); border-radius: 10px; font-weight: 700; cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
        .qty-picker span { padding: 0 15px; font-weight: 700; color: var(--text); }
        
        .price-tag { font-size: 18px; font-weight: 700; color: var(--text); text-align: right; }
        .price-tag small { font-size: 11px; color: var(--muted); display: block; }
        
        .action-row { display: flex; justify-content: space-between; margin-top: 15px; padding-top: 15px; border-top: 1px solid #f5f5f5; }
        .remove-link { color: #e74c3c; font-size: 13px; font-weight: 600; cursor: pointer; transition: 0.2s; }
        .remove-link:hover { opacity: 0.7; }
        
        .sticky-footer { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); width: 90%; max-width: 860px; background: #333; padding: 20px 35px; border-radius: 25px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 20px 40px rgba(0,0,0,0.2); color: white; z-index: 1000; }
        .pay-btn { background: var(--accent); color: white; border: none; padding: 15px 35px; border-radius: 18px; font-weight: 700; cursor: pointer; transition: 0.3s; }
        .pay-btn:hover { transform: translateY(-3px); box-shadow: 0 5px 15px rgba(183,110,121,0.4); }
      `}</style>

      <div className="header">
        <div>
          <h1>Your Bag</h1>
          <p>You have {cartItems.length} items waiting for you.</p>
        </div>
        {cartItems.length > 0 && (
          <button className="select-all-btn" onClick={toggleAll}>
            {cartItems.every(i => i.selected) ? "Deselect All" : "Select All Items"}
          </button>
        )}
      </div>

      <div className="cart-container">
        {loading ? (
          <p style={{textAlign: 'center', color: 'var(--text)', marginTop: '40px'}}>Loading your glow-up kit...</p>
        ) : (
          cartItems.map((item) => (
            <div className={`product-card ${item.selected ? 'selected' : ''}`} key={item.id}>
              <div className="checkbox-wrapper">
                <div 
                  className={`custom-cb ${item.selected ? 'active' : ''}`} 
                  onClick={() => toggleSelect(item.id)}
                />
              </div>

              <div className="img-box">
                <img src={item.image} alt={item.title} />
              </div>

              <div className="info-box">
                <div className="info-top">
                  <span className="brand-tag">{item.brand}</span>
                  <h3>{item.title}</h3>
                </div>

                <div className="controls-row">
                  <div className="qty-picker">
                    <button onClick={() => updateQty(item.id, -1, item.qty)}>-</button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1, item.qty)}>+</button>
                  </div>
                  <div className="price-tag">
                    <small>Subtotal</small>
                    Rs. {(item.price * item.qty).toLocaleString()}
                  </div>
                </div>

                <div className="action-row">
                  <span className="remove-link" onClick={() => openDeleteAlert(item.id)}>Remove Item</span>
                  <span style={{fontSize: '12px', color: '#b76e79', fontWeight: '600'}}>Ready to Ship</span>
                </div>
              </div>
            </div>
          ))
        )}

        {!loading && cartItems.length === 0 && (
          <div style={{textAlign: 'center', padding: '100px 20px'}}>
            <h2 style={{color: 'var(--accent)'}}>Your bag is empty!</h2>
            <p style={{color: '#777', marginBottom: '20px'}}>Looks like you haven't added any magic yet.</p>
            <button onClick={() => navigate('/product')} className="pay-btn">Explore Products</button>
          </div>
        )}
      </div>

      {selectedItems.length > 0 && (
        <div className="sticky-footer">
          <div className="total-details">
            <span style={{color: '#bbb', fontSize: '13px'}}>Total for {selectedItems.length} products</span>
            <div style={{fontSize: '24px', fontWeight: 'bold'}}>Rs. {totalPrice.toLocaleString()}</div>
          </div>
          <button className="pay-btn" onClick={handleProceedToBuy}>
            Checkout Now
          </button>
        </div>
      )}
    </>
  );
};

export default CartPage;