import React, { useState } from "react";
import styled from "styled-components";
import { FiChevronRight, FiPhoneCall } from "react-icons/fi";
import { HiOutlineMail, HiOutlineLocationMarker } from "react-icons/hi";
import { BiMessageRoundedDots } from "react-icons/bi";

const BrandContact = () => {
  // 1. Setup State to hold form data (Added brand_name)
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    brand_name: "", // New Field
    subject: "General Inquiry", 
    message: "",
  });

  const [loading, setLoading] = useState(false);

  // 2. Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Submit to Django Backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/contact/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Success! Your message and brand info are in our database.");
        // Reset form
        setFormData({ 
          full_name: "", 
          email: "", 
          brand_name: "",
          subject: "General Inquiry", 
          message: "" 
        });
      } else {
        console.error("Backend Error:", data);
        alert(`Server error: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      console.error("Connection Error:", error);
      alert("Could not connect to the backend. Is your Django server running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <Header>
        <Logo>
          <small>CONTACT</small>
          <b>GlowUp</b>
        </Logo>
      </Header>

      <Container>
        <LayoutGrid>
          
          {/* LEFT COLUMN: THE FORM */}
          <FormCard>
            <IconBadge>
              <BiMessageRoundedDots size={22} />
            </IconBadge>

            <h1>Let’s talk.</h1>
            <p>Fill out the form below and our team will reach out shortly.</p>

            <form onSubmit={handleSubmit}>
              {/* ROW 1: Name and Email */}
              <Row>
                <Field>
                  <label>Full Name</label>
                  <input 
                    name="full_name"
                    type="text" 
                    placeholder="Arpana" 
                    value={formData.full_name}
                    onChange={handleChange}
                    required 
                  />
                </Field>
                <Field>
                  <label>Email Address</label>
                  <input 
                    name="email"
                    type="email" 
                    placeholder="arpana@gmail.com" 
                    value={formData.email}
                    onChange={handleChange}
                    required 
                  />
                </Field>
              </Row>

              {/* ROW 2: Brand Name and Subject */}
              <Row>
                <Field>
                  <label>Brand Name (Optional)</label>
                  <input 
                    name="brand_name"
                    type="text" 
                    placeholder="Lumiglora" 
                    value={formData.brand_name}
                    onChange={handleChange}
                  />
                </Field>
                <Field>
                  <label>Subject</label>
                  <select 
                    name="subject" 
                    value={formData.subject} 
                    onChange={handleChange}
                    className="select-input"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Customer Support">Customer Support</option>
                    <option value="Partnership">Partnership</option>
                  </select>
                </Field>
              </Row>

              {/* ROW 3: Message */}
              <Field>
                <label>Message</label>
                <textarea 
                  name="message"
                  placeholder="Tell us more about your inquiry..." 
                  value={formData.message}
                  onChange={handleChange}
                  required 
                />
              </Field>

              <FooterRow>
                <SubmitBtn type="submit" disabled={loading}>
                  {loading ? "Sending..." : "Send Message"}
                  <div className="circle"><FiChevronRight /></div>
                </SubmitBtn>
              </FooterRow>
            </form>
          </FormCard>

          {/* RIGHT COLUMN: INFO */}
          <Sidebar>
            <ContactCard>
              <h2>Reach Us</h2>
              <ContactItem>
                <div className="icon"><HiOutlineMail /></div>
                <div>
                  <label>Email</label>
                  <span>butterflies@glowup.com</span>
                </div>
              </ContactItem>

              <ContactItem>
                <div className="icon"><FiPhoneCall /></div>
                <div>
                  <label>Phone</label>
                  <span>+977 9800000000</span>
                </div>
              </ContactItem>

              <ContactItem>
                <div className="icon"><HiOutlineLocationMarker /></div>
                <div>
                  <label>Office</label>
                  <span>Pokhara, Nepal</span>
                </div>
              </ContactItem>

              <Hours>
                <label>Hours</label>
                <div className="time">Sun – Fri: 10am – 5pm</div>
                <div className="time">Sat: Closed</div>
              </Hours>
            </ContactCard>

            <FAQ>
              <label>FAQ</label>
              <details>
                <summary>Response time?</summary>
                <p>Usually within 24 business hours.</p>
              </details>
            </FAQ>
          </Sidebar>

        </LayoutGrid>
      </Container>
    </Page>
  );
};

export default BrandContact;

/* ===================== STYLES ===================== */

const Page = styled.div`
  min-height: 100vh;
  background: #f8faff;
  font-family: 'Inter', sans-serif;
  color: #fb8d80;
  padding-bottom: 50px;
`;

const Header = styled.header`
  max-width: 1100px;
  margin: 0 auto;
  padding: 30px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  small { display: block; font-size: 10px; color: #6d5dfc; font-weight: 800; }
  b { font-size: 22px; }
`;

const Nav = styled.nav`
  font-size: 13px; font-weight: 600; color: #94a3b8;
  display: flex; gap: 10px;
  a { text-decoration: none; color: inherit; }
  a:hover { color: #6d5dfc; }
`;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
`;

const LayoutGrid = styled.div`
  display: grid;
  grid-template-columns: 1.4fr 0.6fr;
  gap: 30px;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;

const FormCard = styled.div`
  background: white;
  padding: 40px;
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.04);
  border: 1px solid #f1f5f9;
  position: relative;
  h1 { font-size: 42px; margin: 0 0 10px; }
  p { color: #64748b; margin-bottom: 30px; }
`;

const IconBadge = styled.div`
  position: absolute; top: 40px; right: 40px;
  width: 45px; height: 45px; background: #f5f3ff;
  border-radius: 12px; display: grid; place-items: center; color: #6d5dfc;
`;

const Row = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 20px;
  @media (max-width: 600px) { grid-template-columns: 1fr; }
`;

const Field = styled.div`
  margin-bottom: 20px;
  label { display: block; font-size: 12px; font-weight: 700; color: #94a3b8; margin-bottom: 8px; text-transform: uppercase; }
  
  input, textarea, .select-input {
    width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 10px;
    background: #f8fafc; font-size: 14px; outline: none; transition: 0.2s;
    &:focus { border-color: #6d5dfc; background: white; }
  }
  
  .select-input {
    appearance: none;
    cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: 16px;
  }

  textarea { min-height: 120px; resize: vertical; }
`;

const SubmitBtn = styled.button`
  background: #fb8d80; color: white; border: none; padding: 10px 25px;
  border-radius: 50px; font-weight: 700; cursor: pointer;
  display: flex; align-items: center; gap: 10px; transition: 0.3s;
  opacity: ${props => props.disabled ? 0.6 : 1};
  pointer-events: ${props => props.disabled ? 'none' : 'auto'};
  
  &:hover { background: #5b4dec; transform: translateY(-2px); }
  .circle { background: rgba(255,255,255,0.2); width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center; }
`;

const FooterRow = styled.div`
  display: flex; justify-content: space-between; align-items: center; margin-top: 10px;
  small { color: #94a3b8; max-width: 200px; font-size: 11px; line-height: 1.4; }
`;

const Sidebar = styled.div` display: flex; flex-direction: column; gap: 20px; `;

const ContactCard = styled.div`
  background: white; padding: 30px; border-radius: 24px; border: 1px solid #f1f5f9;
  h2 { font-size: 20px; margin-bottom: 20px; }
`;

const ContactItem = styled.div`
  display: flex; gap: 15px; margin-bottom: 15px;
  .icon { color: #6d5dfc; margin-top: 3px; }
  label { display: block; font-size: 11px; color: #94a3b8; font-weight: 700; }
  span { font-size: 14px; font-weight: 600; }
`;

const Hours = styled.div`
  margin-top: 20px; padding-top: 20px; border-top: 1px solid #f1f5f9;
  label { display: block; font-size: 11px; color: #94a3b8; font-weight: 700; margin-bottom: 5px; }
  .time { font-size: 13px; font-weight: 600; color: #64748b; }
`;

const FAQ = styled.div`
  label { display: block; font-size: 11px; color: #94a3b8; font-weight: 700; margin-bottom: 10px; }
  details { background: white; padding: 10px; border-radius: 12px; margin-bottom: 8px; border: 1px solid #f1f5f9; }
  summary { font-size: 13px; font-weight: 600; cursor: pointer; outline: none; }
  p { font-size: 12px; color: #64748b; margin-top: 5px; line-height: 1.5; }
`;