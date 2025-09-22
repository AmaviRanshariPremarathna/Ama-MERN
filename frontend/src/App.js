import React, { useState } from 'react'; 
import Sidebar from './Components/Sidebar';
import Home from './Components/Home';   
import Dashboard from './Components/Dashboard';
import Product from './Components/Product';
import Category from './Components/Category';
import Alerts from './Components/Alerts';
import BookDescription from './Components/BookDescription';
import Supplier from './Components/Supplier';
import Profile from './Components/Profile'; // ✅ Import Profile

function App() {
  const [currentPage, setCurrentPage] = useState('home'); // Default page is Home
  const [selectedBook, setSelectedBook] = useState(null);

  const renderPage = () => {
    // Book description page
    if (currentPage === 'bookDescription' && selectedBook) {
      return (
        <BookDescription
          book={selectedBook}
          goBack={() => setCurrentPage('categories')}
        />
      );
    }

    // Render other pages based on currentPage
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <Product />;
      case 'categories':
        return (
          <Category
            viewBookDescription={(book) => {
              setSelectedBook(book);
              setCurrentPage('bookDescription');
            }}
          />
        );
      case 'alerts':
        return <Alerts />;
      case 'suppliers': 
        return <Supplier />;
      case 'profile': // ✅ New Profile page
        return <Profile />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="app-container" style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main style={{ flex: 1, padding: '20px' }}>
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
