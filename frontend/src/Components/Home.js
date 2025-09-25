import React, { useEffect } from "react";
import "./Home.css";
// ...existing code...

const Home = () => {
  useEffect(() => {
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener("click", function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth" });
        }
      });
    });
  }, []);

  return (
    <div className="app-layout">
      <div className="main-content">
        {/* Navbar */}
        <nav className="navbar">
          <div className="nav-container">
            <div className="logo-section">
              <span className="logo-icon">📚</span>
              <span className="logo-text">BookSwap</span>
            </div>
            <ul className="nav-links">
              <li><a href="#home">Home</a></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#contact">Contact Us</a></li>
              <li><a href="#login" className="btn-login">Login</a></li>
              <li><a href="#signup" className="btn-primary">Sign Up</a></li>
            </ul>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="hero" id="home">
          <div className="hero-overlay">
            <div className="hero-content">
              <h1>Books That Travel, Knowledge That Lasts</h1>
              <p>Trade your textbooks, support peers, and build a thriving learning community together.</p>
              <div className="hero-buttons">
                <a href="#features" className="btn-primary">Get Started</a>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="features" id="features">
          <h2 className="section-title">Why Choose BookSwap?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Smart Search</h3>
              <p>Find textbooks quickly with advanced filters.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h3>Peer-to-Peer Exchange</h3>
              <p>Connect with fellow students for direct book swaps.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📦</div>
              <h3>Inventory Alerts</h3>
              <p>Get notified when your favorite books are available.</p>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="about" id="about">
          <h2 className="section-title">About Us</h2>
          <div className="about-content">
            <p>BookSwap is a student-driven platform designed to make textbook exchange easy, affordable, and sustainable. Our mission is to empower learners by facilitating access to educational resources and fostering a collaborative academic community.</p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="contact" id="contact">
          <h2 className="section-title">Contact Us</h2>
          <div className="contact-content">
            <form className="contact-form">
              <input type="text" placeholder="Your Name" required />
              <input type="email" placeholder="Your Email" required />
              <textarea placeholder="Your Message" required></textarea>
              <button type="submit" className="btn-primary">Send Message</button>
            </form>
            <div className="contact-info">
              <h4>Contact Us</h4>
              <p><strong>Email:</strong> support@bookswap.com</p>
              <p><strong>Phone:</strong> +94 123 456 789</p>
              <p><strong>Address:</strong> Faculty of Computing, SLIIT, Malabe</p>
            </div>

            {/* Social Media */}
            <div className="footer-section footer-social">
              <h4>Follow Us</h4>
              <div className="social-icons">
                <button type="button" className="icon-btn" aria-label="Facebook" style={{background: 'none', border: 'none', padding: 0}}>
                  <img src="https://img.icons8.com/color/48/facebook-new.png" alt="Facebook" />
                </button>
                <button type="button" className="icon-btn" aria-label="Twitter" style={{background: 'none', border: 'none', padding: 0}}>
                  <img src="https://img.icons8.com/color/48/twitter--v1.png" alt="Twitter" />
                </button>
                <button type="button" className="icon-btn" aria-label="Instagram" style={{background: 'none', border: 'none', padding: 0}}>
                  <img src="https://img.icons8.com/color/48/instagram-new--v1.png" alt="Instagram" />
                </button>
                <button type="button" className="icon-btn" aria-label="LinkedIn" style={{background: 'none', border: 'none', padding: 0}}>
                  <img src="https://img.icons8.com/color/48/linkedin.png" alt="LinkedIn" />
                </button>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2025 BookSwap. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;