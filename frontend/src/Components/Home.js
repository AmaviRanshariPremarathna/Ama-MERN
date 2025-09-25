import React, { useEffect } from "react";
import "./Home.css";
import Sidebar from "./Sidebar";

const Home = () => {
  useEffect(() => {
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    // Navbar scroll effect
    const navbar = document.querySelector(".navbar");
    const handleScroll = () => {
      if (window.scrollY > 80) {
        navbar.classList.add("navbar-scrolled");
      } else {
        navbar.classList.remove("navbar-scrolled");
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="app-layout">
      <Sidebar />

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
              <h3>Trusted Community</h3>
              <p>Trade with verified students safely.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Save Money</h3>
              <p>Save up to 70% and sell old books easily.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h3>Eco-Friendly</h3>
              <p>Give books a second life and reduce waste.</p>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="how-it-works" id="how-it-works">
          <h2 className="section-title">How It Works</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Create Account</h3>
              <p>Sign up using your university email.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>List or Search</h3>
              <p>Post books you want to sell or search for textbooks.</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Connect & Trade</h3>
              <p>Message other students and exchange books safely.</p>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <h3>Rate & Repeat</h3>
              <p>Leave reviews and keep trading.</p>
            </div>
          </div>
        </section>

        {/* Redesigned Footer */}
        <footer className="footer" id="contact">
          <div className="footer-container">
            <div className="footer-top">
              {/* Logo & Description */}
              <div className="footer-section footer-logo">
                <div className="logo-content">
                  <span className="logo-icon">📚</span>
                  <span className="logo-text">BookSwap</span>
                </div>
                <p>Connecting students, sharing knowledge, and promoting sustainable learning through our innovative textbook exchange platform.</p>
              </div>

              {/* Quick Links */}
              <div className="footer-section footer-links-section">
                <h4>Quick Links</h4>
                <ul>
                  <li><a href="#home">Home</a></li>
                  <li><a href="#features">Features</a></li>
                  <li><a href="#about">About Us</a></li>
                  <li><a href="#contact">Contact Us</a></li>
                </ul>
              </div>

              {/* Contact Info */}
              <div className="footer-section footer-contact">
                <h4>Contact Us</h4>
                <p><strong>Email:</strong> support@bookswap.com</p>
                <p><strong>Phone:</strong> +94 123 456 789</p>
                <p><strong>Address:</strong> Faculty of Computing, SLIIT, Malabe</p>
              </div>

              {/* Social Media */}
              <div className="footer-section footer-social">
                <h4>Follow Us</h4>
                <div className="social-icons">
                  <a href="#" aria-label="Facebook">
                    <img src="https://img.icons8.com/color/48/facebook-new.png" alt="Facebook" />
                  </a>
                  <a href="#" aria-label="Twitter">
                    <img src="https://img.icons8.com/color/48/twitter--v1.png" alt="Twitter" />
                  </a>
                  <a href="#" aria-label="Instagram">
                    <img src="https://img.icons8.com/color/48/instagram-new--v1.png" alt="Instagram" />
                  </a>
                  <a href="#" aria-label="LinkedIn">
                    <img src="https://img.icons8.com/color/48/linkedin.png" alt="LinkedIn" />
                  </a>
                </div>
              </div>
            </div>

            <div className="footer-bottom">
              <p>&copy; 2025 BookSwap. All rights reserved. | Privacy Policy | Terms of Service</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;