import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="landing">

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-text">
          <div className="Badge">Intelligent Beauty</div>
          <h1 className="fade-in">Radiance Simplified, <br/>Just for You.</h1>
          <p className="fade-in delay-1">
            Stop guessing and start glowing. Our advanced AI analyzes your unique skin profile to curate a 
            high-performance skincare routine that actually works.
          </p>
          <button className="btn fade-in delay-2"
          onClick={() => navigate("/facescanpage")}>
            Start My Free Scan →
          </button>
        </div>

        <div className="hero-image slide-in">
          <img
            src="https://plus.unsplash.com/premium_photo-1682096423780-41ca1b04af68?w=900&auto=format&fit=crop&q=60"
            alt="Glowing Skincare"
          />
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <div className="card">
          <h3>Value Driven</h3>
          <p>Get professional-grade skincare recommendations without the luxury price tag.</p>
        </div>

        <div className="card">
          <h3>AI-Powered</h3>
          <p>We use pixel-level analysis to detect your skin's true needs in real-time.</p>
        </div>

        <div className="card">
          <h3>Clean & Kind</h3>
          <p>All recommended products are 100% cruelty-free and dermatologically tested.</p>
        </div>
      </section>

      {/* ✅ HORIZONTAL PRODUCTS SECTION */}
      <section className="products">
        <h2> Skincare Essentials</h2>

        <div className="horizontal-product">
          <img
            src="https://images.unsplash.com/photo-1696025522422-aa9a74e4f3d5?w=900&auto=format&fit=crop&q=60"
            alt="Serum"
          />
          <div className="product-info">
            <h4> Serum</h4>
            <p>
            A skincare serum is a lightweight, fast-absorbing liquid packed with high concentrations of active ingredients, designed to target specific skin concerns like hydration, brightening, anti-aging, or acne.
            </p>
          </div>
        </div>

        <div className="horizontal-product reverse">
          <img
            src="https://images.unsplash.com/photo-1770717984643-2a1545902579?w=900&auto=format&fit=crop&q=60"
            alt="Hydrating Cream"
          />
          <div className="product-info">
            <h4>Toner</h4>
            <p>
            A skincare toner is a liquid applied after cleansing to help remove leftover impurities, balance the skin’s pH, and prep the skin for better absorption of other products.
            </p>
          </div>
        </div>

        <div className="horizontal-product">
          <img
            src="https://images.unsplash.com/photo-1623676714504-edd78728155e?w=900&auto=format&fit=crop&q=60"
            alt="Vitamin C"
          />
          <div className="product-info">
            <h4>Sunscreen</h4>
            <p>
            A sunscreen is a skincare product that protects the skin from harmful ultraviolet (UV) rays, helping prevent sunburn, premature aging, and skin damage.
            </p>
          </div>
        </div>


        <div className="horizontal-product reverse">
          <img
            src="https://images.unsplash.com/photo-1629732047847-50219e9c5aef?w=900&auto=format&fit=crop&q=60"
            alt="Hydrating Cream"
          />
          <div className="product-info">
            <h4>Moisturizer</h4>
            <p>
            A moisturizer is a skincare product that hydrates and locks in moisture to keep the skin soft, smooth, and healthy while strengthening the skin barrier.
            </p>
          </div>
        </div>

        <div className="horizontal-product">
          <img
            src="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=900&auto=format&fit=crop&q=60"
            alt="Hydrating Cream"
          />
          <div className="product-info">
            <h4>Face Wash</h4>
            <p>
            A face wash is a cleansing skincare product used to remove dirt, oil, makeup, and impurities from the skin, leaving you feeling fresh.
            </p>
          </div>
        </div>
      </section>

      {/* FORUM HIGHLIGHT SECTION */}
      <section className="forum-highlight">
        <div className="forum-container">
          <div className="forum-image">
             <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&auto=format&fit=crop&q=60" alt="Community" />
          </div>
          <div className="forum-content">
            <h2>Join Our Beauty Community</h2>
            <p>
              Got questions about your routine? Want to share your 30-day transformation? 
              Connect with thousands of others on our Discussion Forum. Swap tips, review products, 
              and grow together.
            </p>
            <button className="btn" onClick={() => navigate("/forum/disscussionForum")}>
              Visit the Forum
            </button>
          </div>
        </div>
      </section>

      {/* UPDATED SERVICES SECTION WITH 4 UNIQUE PILLARS */}
      <section className="services">
        <h2>Our Core Expertise</h2>
        <div className="services-container">
          
          <div className="service-card">
            <h3>AI Tone Analysis</h3>
            <p>Advanced pixel-level scanning to accurately identify your unique skin tone and undertones.</p>
            <button className="service-btn" onClick={() => navigate("/facescanpage")}>Analyze Now</button>
          </div>

          <div className="service-card">
            <h3>Custom Matching</h3>
            <p>Get a routine curated specifically for your skin concerns, whether it's acne, aging, or sensitivity.</p>
            <button className="service-btn" onClick={() => navigate("/datafillup")}>Get Routine</button>
          </div>

          <div className="service-card">
            <h3>Global Community</h3>
            <p>Access our massive discussion hub to share experiences and learn from skincare enthusiasts.</p>
            <button className="service-btn" onClick={() => navigate("/forum/disscussionForum")}>Join Talk</button>
          </div>

          <div className="service-card">
            <h3>E-Commerce Shop</h3>
            <p>Shop high-performance, cruelty-free products directly from our curated marketplace.</p>
            <button className="service-btn" onClick={() => navigate("/product")}>Start Shopping</button>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-brand">
            <h3>GlowUp</h3>
            <p>Your AI-powered skincare companion ✨</p>
          </div>

          <div className="footer-links">
            <div className="link-group">
              <h4>Company</h4>
              <a onClick={() => navigate("/AboutUs")} style={{cursor: 'pointer'}}>About Us</a>
              {/* <a onClick={() => navigate("/forum/disscussionForum")}>Forum</a> */}
            </div>

            <div className="link-group">
              <h4>Support</h4>
              <a onClick={() => navigate("/brandContact")} style={{cursor: 'pointer'}}>Contact</a>
              <a href="#">FAQ</a>
              <a onClick={() => navigate("/feedback")} style={{cursor: 'pointer'}}>Feedback</a>
            </div>

            <div className="link-group">
              <h4>Services</h4>
              <a onClick={() => navigate("/facescanpage")} style={{cursor: 'pointer'}}>AI Face Scan</a>
              <a onClick={() => navigate("/datafillup")} style={{cursor: 'pointer'}}>Skin Data Form</a>
              <a onClick={() => navigate("/product")} style={{cursor: 'pointer'}}>Products</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>©️ 2026 GlowUp. All rights reserved.</p>
        </div>
      </footer>

      {/* CSS */}
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Poppins', sans-serif; }
        .landing { background: #fdf6f3; color: #333; overflow-x: hidden; }

        .hero { display: flex; align-items: center; justify-content: space-between; padding: 80px 10%; flex-wrap: wrap; }
        .hero-text { flex: 1; min-width: 300px; }
        .hero-text h1 { font-size: 48px; color: #b76e79; margin-bottom: 20px; line-height: 1.2; }
        .hero-text p { font-size: 18px; margin-bottom: 30px; color: #666; line-height: 1.6; }
        .hero-image { flex: 1; min-width: 300px; text-align: center; }
        .hero-image img { width: 90%; border-radius: 25px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }

        .Badge {
          display: inline-block;
          background: #fff5f4;
          color: #b76e79;
          padding: 5px 15px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 15px;
          border: 1px solid #fce8e6;
        }

        .btn {
          background: #b76e79;
          color: white;
          padding: 15px 40px;
          border: none;
          border-radius: 30px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.3s ease;
        }
        .btn:hover { transform: scale(1.05); box-shadow: 0 10px 20px rgba(183,110,121,0.4); }

        .features { display: flex; justify-content: center; gap: 30px; padding: 80px 10%; flex-wrap: wrap; background: #f7e9e4; }
        .card { background: white; padding: 40px 30px; width: 300px; border-radius: 24px; text-align: center; box-shadow: 0 10px 20px rgba(0,0,0,0.05); transition: 0.3s ease; }
        .card:hover { transform: translateY(-10px); }

        .products { padding: 80px 10%; text-align: center; }
        .products h2 { font-size: 36px; color: #b76e79; margin-bottom: 40px; }
        .horizontal-product { display: flex; align-items: center; gap: 50px; background: #ffffff; padding: 40px; margin-bottom: 50px; border-radius: 30px; box-shadow: 0 20px 50px rgba(0,0,0,0.06); transition: 0.4s ease; }
        .horizontal-product:hover { transform: translateY(-8px); }
        .horizontal-product.reverse { flex-direction: row-reverse; }
        .horizontal-product img { width: 320px; height: 320px; object-fit: cover; border-radius: 25px; }
        
        .product-info { flex: 1; text-align: center; max-width: 500px; display: flex; flex-direction: column; align-items: center; }
        .product-info h4 { font-size: 26px; color: #b76e79; margin-bottom: 15px; }
        .product-info p { font-size: 16px; line-height: 1.6; color: #666; margin-bottom: 25px; }

        .forum-highlight {
          padding: 80px 10%;
          background: #fffafa;
        }
        .forum-container {
          display: flex;
          align-items: center;
          gap: 60px;
          background: white;
          border-radius: 40px;
          overflow: hidden;
          box-shadow: 0 30px 60px rgba(0,0,0,0.05);
        }
        .forum-image { flex: 1; height: 450px; }
        .forum-image img { width: 100%; height: 100%; object-fit: cover; }
        .forum-content { flex: 1; padding: 40px; text-align: left; }
        .forum-content h2 { font-size: 36px; color: #b76e79; margin-bottom: 20px; }
        .forum-content p { font-size: 18px; color: #666; line-height: 1.8; margin-bottom: 30px; }

        .services { padding: 80px 10%; background: #fff0f3; text-align: center; }
        .services h2 { font-size: 40px; color: #b76e79; margin-bottom: 60px; }
        .services-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 40px; justify-items: center; }
        .service-card { background: white; padding: 40px 30px; border-radius: 30px; width: 100%; max-width: 400px; box-shadow: 0 25px 50px rgba(183,110,121,0.1); transition: 0.4s ease; }
        .service-card:hover { transform: translateY(-8px); }
        .service-card .icon { font-size: 40px; margin-bottom: 15px; }
        .service-btn { background: #b76e79; color: white; padding: 10px 30px; border: none; border-radius: 40px; cursor: pointer; margin-top: 15px; transition: 0.4s ease; }

        .footer { background: #fef7f5; color: #333; padding: 80px 10% 40px; }
        .footer-container { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 40px; border-bottom: 1px solid rgba(183,110,121,0.1); padding-bottom: 40px; margin-bottom: 30px; }
        .footer-brand h3 { color: #b76e79; font-size: 32px; margin-bottom: 15px; }
        .footer-links { display: flex; flex-wrap: wrap; gap: 60px; }
        .link-group h4 { color: #b76e79; margin-bottom: 20px; font-size: 16px; }
        .link-group a { display: block; color: #666; text-decoration: none; font-size: 14px; margin-bottom: 12px; cursor: pointer; transition: 0.3s; }
        .link-group a:hover { color: #b76e79; padding-left: 5px; }
        .footer-bottom { text-align: center; font-size: 14px; color: #a38b88; }

        .fade-in { opacity: 0; animation: fadeUp 1s forwards; transform: translateY(30px); }
        .delay-1 { animation-delay: 0.3s; }
        .delay-2 { animation-delay: 0.6s; }
        .slide-in { opacity: 0; transform: translateX(50px); animation: slideLeft 1.2s forwards; }
        @keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }
        @keyframes slideLeft { to { opacity: 1; transform: translateX(0); } }

        @media (max-width: 992px) {
          .forum-container { flex-direction: column; }
          .forum-image { height: 300px; width: 100%; }
          .forum-content { text-align: center; }
        }

        @media (max-width: 768px) {
          .hero { flex-direction: column; text-align: center; }
          .horizontal-product, .horizontal-product.reverse { flex-direction: column; padding: 20px; }
          .horizontal-product img { width: 100%; height: auto; }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;