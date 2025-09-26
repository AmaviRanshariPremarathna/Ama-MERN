import React, { useEffect } from "react";
import "./Home.css";

const Home = () => {
  useEffect(() => {
    // Smooth scrolling
    const anchors = document.querySelectorAll('a[href^="#"]');
    const handleClick = (e) => {
      const target = document.querySelector(e.currentTarget.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    };
    anchors.forEach((a) => a.addEventListener("click", handleClick));
    return () => anchors.forEach((a) => a.removeEventListener("click", handleClick));
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
              <p>
                Trade your textbooks, support peers, and build a thriving learning
                community together.
              </p>
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

        {/* Footer */}
        <footer className="footer">
          <div className="footer-container">
            <div className="footer-top">
              {/* Logo Section */}
              <div className="footer-section footer-logo">
                <div className="logo-content">
                  <span className="logo-icon">📚</span>
                  <span className="logo-text">BookSwap</span>
                </div>
                <p>
                  A student-driven book exchange platform that helps you save
                  money, share knowledge, and build a stronger learning community.
                </p>
              </div>

              {/* Links Section */}
              <div className="footer-section footer-links-section">
                <h4>Quick Links</h4>
                <ul>
                  <li><a href="#home">Home</a></li>
                  <li><a href="#features">Features</a></li>
                  <li><a href="#about">About</a></li>
                  <li><a href="#contact">Contact</a></li>
                </ul>
              </div>

              {/* Contact Section */}
              <div className="footer-section footer-contact">
                <h4>Contact Us</h4>
                <p><strong>Email:</strong> support@bookswap.com</p>
                <p><strong>Phone:</strong> +94 123 456 789</p>
                <p><strong>Address:</strong> Faculty of Computing, SLIIT, Malabe</p>
              </div>

              {/* Social Section */}
              <div className="footer-section footer-social">
                <h4>Follow Us</h4>
                <div className="social-icons">
                  <a href="https://facebook.com"><img src="https://img.icons8.com/color/48/facebook-new.png" alt="Facebook" /></a>
                  <a href="https://twitter.com"><img src="https://img.icons8.com/color/48/twitter--v1.png" alt="Twitter" /></a>
                  <a href="https://instagram.com"><img src="https://img.icons8.com/color/48/instagram-new--v1.png" alt="Instagram" /></a>
                  <a href="https://linkedin.com"><img src="https://img.icons8.com/color/48/linkedin.png" alt="LinkedIn" /></a>
                </div>
              </div>
            </div>

            {/* Bottom */}
            <div className="footer-bottom">
              <p>
                &copy; 2025 BookSwap. All rights reserved. | Privacy Policy | Terms
                of Service
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;
