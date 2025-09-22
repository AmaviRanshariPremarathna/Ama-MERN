import React from 'react';
import './BookDescription.css';

const BookDescription = ({ book, goBack }) => {
  const getBookDescription = (book) => {
    const descriptions = {
      'Introduction to Algorithms': 'A comprehensive guide to understanding algorithms and their implementation. This book covers fundamental concepts, advanced techniques, and practical applications in computer science. Written by K.K. Goyal, it provides clear explanations and numerous examples to help students master algorithmic thinking.',
      
      'Introduction to Computer Science': 'An essential primer for beginners in computer science. This book by Pery Donham explores core computing concepts, programming fundamentals, and the basics of computer architecture. Perfect for students starting their journey in computer science.',
      
      'The Art of Solving Problems': 'A masterful exploration of problem-solving techniques in computer science. This book teaches systematic approaches to tackle complex programming challenges, debug code effectively, and optimize solutions.',
      
      'Data Science for Beginners': 'An accessible introduction to the world of data science. Covers statistical analysis, machine learning basics, data visualization, and practical applications using popular tools and libraries.',
      
      'Everything An Exclusive': 'A comprehensive guide to cybersecurity fundamentals. This book covers network security, encryption, threat detection, and best practices for protecting digital assets.',
      
      'Hacking': 'An in-depth exploration of ethical hacking and penetration testing by Jon Erickson. Learn about security vulnerabilities, exploitation techniques, and how to protect systems from cyber threats.',
      
      'Application Software': 'A detailed guide to understanding and developing application software. Covers software development lifecycles, design patterns, and best practices in modern software engineering.',
      
      'Cyber Security Fundermentals': 'A thorough introduction to cybersecurity principles. This book by Rahesh Kumar covers essential security concepts, threat models, security protocols, and practical defense strategies.',
      
      'Statistic For Data Scientists': 'An in-depth guide to statistical methods used in data science. Covers probability, hypothesis testing, regression analysis, and advanced statistical concepts with practical applications.',
      
      'Applied Data Science': 'A practical approach to data science applications. This book by Jake VanderPlas covers real-world data analysis, machine learning implementation, and data visualization techniques.',
      
      'Java Programming': 'A comprehensive guide to Java programming by Joyce Farrell. Covers object-oriented programming concepts, Java syntax, data structures, and application development using Java.',
    };

    return descriptions[book.title] || "Detailed description coming soon. This book provides valuable insights into " + book.category + " concepts and practical applications.";
  };

  return (
    <div className="description-container">
      <div className="description-card">
        <img src={book.image} alt={book.title} className="description-image"/>
        <div className="description-info">
          <h2>{book.title}</h2>
          <p><strong>Author:</strong> {book.author}</p>
          <p><strong>Category:</strong> {book.category}</p>
          <p><strong>Condition:</strong> {book.condition}</p>
          <p><strong>Price:</strong> Rs {book.price.toLocaleString()}</p>
          <p><strong>Rating:</strong> {book.rating} ({book.reviews} reviews)</p>
          <div className="description-section">
            <h3>Book Description:</h3>
            <p>{getBookDescription(book)}</p>
          </div>
          <button className="back-btn" onClick={goBack}>Back to Category</button>
        </div>
      </div>
    </div>
  );
};

export default BookDescription;
