import React, { useState, useEffect } from 'react';
import { Search, Book, User, Calendar, Clock, CheckCircle, AlertCircle, Plus, Filter, Download } from 'lucide-react';

const BorrowReturnPage = () => {
  const [activeTab, setActiveTab] = useState('borrow');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Sample data - in real app this would come from your backend
  const [books] = useState([
    { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", isbn: "978-0743273565", available: 3, total: 5, category: "Classic Literature" },
    { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee", isbn: "978-0061120084", available: 1, total: 3, category: "Classic Literature" },
    { id: 3, title: "1984", author: "George Orwell", isbn: "978-0451524935", available: 0, total: 4, category: "Dystopian Fiction" },
    { id: 4, title: "Pride and Prejudice", author: "Jane Austen", isbn: "978-0141439518", available: 2, total: 2, category: "Romance" },
  ]);

  const [borrowedBooks] = useState([
    { id: 1, title: "The Catcher in the Rye", author: "J.D. Salinger", borrower: "John Smith", borrowDate: "2024-09-01", dueDate: "2024-09-15", status: "overdue", phone: "+1234567890" },
    { id: 2, title: "Harry Potter and the Sorcerer's Stone", author: "J.K. Rowling", borrower: "Emma Johnson", borrowDate: "2024-09-10", dueDate: "2024-09-24", status: "due-soon", phone: "+1234567891" },
    { id: 3, title: "The Hobbit", author: "J.R.R. Tolkien", borrower: "Michael Brown", borrowDate: "2024-09-05", dueDate: "2024-10-05", status: "active", phone: "+1234567892" },
  ]);

  const [selectedBook, setSelectedBook] = useState(null);
  const [borrowerInfo, setBorrowerInfo] = useState({ name: '', phone: '', email: '', duration: '14' });

  const getStatusColor = (status) => {
    switch (status) {
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      case 'due-soon': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleBorrow = () => {
    if (selectedBook && borrowerInfo.name && borrowerInfo.phone) {
      // In real app, this would make an API call
      alert(`Book "${selectedBook.title}" borrowed to ${borrowerInfo.name}`);
      setSelectedBook(null);
      setBorrowerInfo({ name: '', phone: '', email: '', duration: '14' });
    }
  };

  const handleReturn = (bookId) => {
    // In real app, this would make an API call
    alert(`Book returned successfully!`);
  };

  const filteredBorrowedBooks = borrowedBooks.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.borrower.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || book.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const filteredAvailableBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
  <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Book Exchange Management</h1>
              <p className="text-gray-600">Manage book borrowing and returns efficiently</p>
            </div>
            <div className="flex gap-3">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Download size={20} />
                Export Report
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab('borrow')}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${
                activeTab === 'borrow'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Plus className="inline mr-2" size={18} />
              New Borrow
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${
                activeTab === 'manage'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Book className="inline mr-2" size={18} />
              Manage Loans
            </button>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative min-w-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder={activeTab === 'borrow' ? "Search books to borrow..." : "Search borrowed books or borrowers..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {activeTab === 'manage' && (
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-[150px]"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="due-soon">Due Soon</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'borrow' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Available Books */}
            <div className="lg:col-span-2 min-w-0">
              <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6">
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                  <Book className="text-blue-600" size={24} />
                  Available Books
                </h2>
                <div className="space-y-4 max-h-[28rem] overflow-y-auto pr-1">
                  {filteredAvailableBooks.map((book) => (
                    <div
                      key={book.id}
                      className={`p-4 border rounded-xl transition-all cursor-pointer hover:shadow-md ${
                        selectedBook?.id === book.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                      } ${book.available === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={() => book.available > 0 && setSelectedBook(book)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{book.title}</h3>
                          <p className="text-gray-600 mb-2">by {book.author}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>ISBN: {book.isbn}</span>
                            <span className="bg-gray-100 px-2 py-1 rounded">{book.category}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-medium ${book.available > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {book.available > 0 ? `${book.available} available` : 'Out of stock'}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">of {book.total} total</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Borrow Form */}
            <div className="min-w-0">
              <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:sticky lg:top-6">
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                  <User className="text-blue-600" size={24} />
                  Borrower Details
                </h2>
                
                {selectedBook ? (
                  <div className="space-y-6">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h3 className="font-semibold text-blue-900">{selectedBook.title}</h3>
                      <p className="text-blue-700 text-sm">by {selectedBook.author}</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Borrower Name *</label>
                        <input
                          type="text"
                          value={borrowerInfo.name}
                          onChange={(e) => setBorrowerInfo({...borrowerInfo, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter full name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                        <input
                          type="tel"
                          value={borrowerInfo.phone}
                          onChange={(e) => setBorrowerInfo({...borrowerInfo, phone: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="+1234567890"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email (Optional)</label>
                        <input
                          type="email"
                          value={borrowerInfo.email}
                          onChange={(e) => setBorrowerInfo({...borrowerInfo, email: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="email@example.com"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Loan Duration</label>
                        <select
                          value={borrowerInfo.duration}
                          onChange={(e) => setBorrowerInfo({...borrowerInfo, duration: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="7">1 Week</option>
                          <option value="14">2 Weeks</option>
                          <option value="21">3 Weeks</option>
                          <option value="30">1 Month</option>
                        </select>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleBorrow}
                      disabled={!borrowerInfo.name || !borrowerInfo.phone}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                      Confirm Borrow
                    </button>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <Book size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Select a book to start borrowing process</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Manage Loans Tab */
          <div className="bg-white rounded-2xl shadow-xl overflow-x-auto">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Clock className="text-blue-600" size={24} />
                Active Loans ({filteredBorrowedBooks.length})
              </h2>
            </div>
            
            <div className="p-4 sm:p-6">
              <div className="space-y-4 min-w-[320px]">
                {filteredBorrowedBooks.map((loan) => (
                  <div key={loan.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">{loan.title}</h3>
                            <p className="text-gray-600 mb-3">by {loan.author}</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <User size={16} className="text-gray-400" />
                                <div>
                                  <span className="font-medium">{loan.borrower}</span>
                                  <div className="text-gray-500">{loan.phone}</div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Calendar size={16} className="text-gray-400" />
                                <div>
                                  <div className="text-gray-500">Borrowed</div>
                                  <span className="font-medium">{loan.borrowDate}</span>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Clock size={16} className="text-gray-400" />
                                <div>
                                  <div className="text-gray-500">Due Date</div>
                                  <span className="font-medium">{loan.dueDate}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(loan.status)}`}>
                              {loan.status === 'overdue' && <AlertCircle size={12} className="inline mr-1" />}
                              {loan.status === 'due-soon' && <Clock size={12} className="inline mr-1" />}
                              {loan.status === 'active' && <CheckCircle size={12} className="inline mr-1" />}
                              {loan.status.replace('-', ' ').toUpperCase()}
                            </span>
                            
                            <button
                              onClick={() => handleReturn(loan.id)}
                              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                            >
                              Mark as Returned
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredBorrowedBooks.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <Book size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No borrowed books found matching your criteria</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BorrowReturnPage;