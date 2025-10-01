import React, { useState } from 'react'; 
import Sidebar from './Components/Sidebar';
import Home from './Components/Home';   
import Dashboard from './Components/Dashboard';
import Product from './Components/Product';
import Category from './Components/Category';
import Alerts from './Components/Alerts';
import Report from './Components/Report'; // ✅ Import Report
import BookDescription from './Components/BookDescription';
import Supplier from './Components/Supplier';
import Profile from './Components/Profile'; // ✅ Import Profile
import BorrowReturn from './Components/BorrowReturn';
import { DashboardProvider } from './contexts/DashboardContext';

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
        return <Home setCurrentPage={setCurrentPage} />;
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
      case 'report': // ✅ New Report page
        return <Report />;
      case 'suppliers': 
        return <Supplier />;
      case 'profile': // ✅ New Profile page
        return <Profile />;
      case 'borrowReturn':
        return <BorrowReturn />;
      default:
        return <Home setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <DashboardProvider>
      <div className="app-container" style={{ display: 'flex', minHeight: '100vh' }}>
        {/* Only show sidebar when not on home page */}
        {currentPage !== 'home' && (
          <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
        )}
        <main style={{ 
          flex: 1, 
          padding: currentPage === 'home' ? '0' : '20px',
          width: currentPage === 'home' ? '100%' : 'calc(100% - 180px)'
        }}>
          {renderPage()}
        </main>
      </div>
    </DashboardProvider>
  );
}

export default App;