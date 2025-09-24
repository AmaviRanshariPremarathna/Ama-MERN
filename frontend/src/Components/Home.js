import React, { useEffect } from "react";
import "./Home.css";

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
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">📚 BookSwap</div>
          <ul className="nav-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#how-it-works">How It Works</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
          <div className="nav-cta">
            <a href="#login" className="btn-login">Login</a>
            <a href="#signup" className="btn-primary">Join Now</a>
          </div>
        </div>
      </nav>

      {/* Main content wrapper for sidebar alignment */}
      <div className="home-main-content">
        {/* Hero Section */}
        <section className="hero" id="home">
          <div className="hero-overlay">
            <div className="hero-content">
              <h1>Exchange Books, Expand Knowledge</h1>
              <p>
                Connect with fellow students, trade textbooks, and build a
                sustainable learning community. Save money while sharing knowledge.
              </p>
              <div className="hero-buttons">
                <a href="#features" className="btn-primary">Get Started</a>
                <a href="#how-it-works" className="btn-secondary">Learn More</a>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
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

        {/* How It Works Section */}
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

        {/* Footer */}
        <footer className="footer" id="contact">
          <div className="footer-newsletter">
            <p>SUBSCRIBE TO OUR QUARTERLY NEWSLETTER</p>
            <div className="newsletter-input">
              <input type="email" placeholder="Enter your email address" />
              <button>SUBSCRIBE</button>
            </div>
          </div>
          <div className="footer-links-container">
            <div className="footer-column">
              <h4>BookSwap</h4>
              <p>123 College Street, City, Country</p>
              <p>contact@bookswap.com</p>
            </div>
            <div className="footer-column">
              <h4>Home</h4>
              <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#features">Features</a></li>
                <li><a href="#how-it-works">How It Works</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Services</h4>
              <ul>
                <li>Book Listing</li>
                <li>Book Search</li>
                <li>Trading Support</li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Events</h4>
              <ul>
                <li>Book Drives</li>
                <li>Swap Events</li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Follow</h4>
              <div className="social-icons">
                <a href="#">🐦</a>
                <a href="#">📘</a>
                <a href="#">📸</a>
                <a href="#">📺</a>
                <a href="#">📌</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>Terms & Conditions | Privacy Policy | Sitemap</p>
            <p>&copy; 2025 BookSwap. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Home;
