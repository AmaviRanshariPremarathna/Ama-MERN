// Home.js
import React, { useEffect } from 'react';
import './Home.css';

const Home = () => {

  // Animate statistics counters
  useEffect(() => {
    const stats = document.querySelectorAll('.stat-number');

    const animateNumber = (el, target) => {
      let count = 0;
      const step = Math.ceil(target / 100);
      const interval = setInterval(() => {
        count += step;
        if (count >= target) {
          count = target;
          clearInterval(interval);
        }
        el.textContent = count;
      }, 20);
    };

    stats.forEach((el) => {
      animateNumber(el, parseInt(el.dataset.value));
    });
  }, []);

  return (
    <div className="home-container">

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-text">
          <h1>Exchange. Learn. Save.</h1>
          <p>Find, share, and exchange books with your university peers effortlessly.</p>
          <div className="hero-buttons">
            <button className="btn-primary">Get Started</button>
            <button className="btn-secondary">Browse Books</button>
          </div>
        </div>
        <div className="hero-image">
          <img src="https://i.ibb.co/3c8r7b2/hero-books.png" alt="Books Illustration" />
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step-card">
            <div className="step-icon">📚</div>
            <h3>List Your Book</h3>
            <p>Share the books you no longer need and help others.</p>
          </div>
          <div className="step-card">
            <div className="step-icon">🔍</div>
            <h3>Find Books</h3>
            <p>Search for books your peers are offering in your university.</p>
          </div>
          <div className="step-card">
            <div className="step-icon">🤝</div>
            <h3>Exchange & Save</h3>
            <p>Connect with students and exchange books safely and easily.</p>
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="featured-books">
        <h2>Featured Books</h2>
        <div className="book-grid">
          {[1,2,3,4].map((i) => (
            <div className="book-card" key={i}>
              <img src="https://i.ibb.co/ZYW3VTp/book-sample.png" alt="Book Cover" />
              <h4>Book Title {i}</h4>
              <p>Author Name</p>
              <span className="book-status available">Available</span>
              <button className="btn-primary">Request Book</button>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stat-item">
          <h3 className="stat-number" data-value="250">0</h3>
          <p>Books Listed</p>
        </div>
        <div className="stat-item">
          <h3 className="stat-number" data-value="150">0</h3>
          <p>Active Students</p>
        </div>
        <div className="stat-item">
          <h3 className="stat-number" data-value="75">0</h3>
          <p>Successful Exchanges</p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <h2>What Students Say</h2>
        <div className="testimonial-cards">
          <div className="testimonial-card">
            <p>"This platform helped me get all the textbooks I needed at no cost!"</p>
            <h4>- Jane Doe, 2nd Year</h4>
          </div>
          <div className="testimonial-card">
            <p>"I could easily exchange my old books and save a lot."</p>
            <h4>- John Smith, 3rd Year</h4>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
