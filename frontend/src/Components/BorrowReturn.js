/**
 * BorrowReturn.js - Book Exchange Management System (Fixed)
 * Handles borrowing and returning books (defensive + fewer runtime errors)
 */

class BorrowReturnApp {
  constructor() {
    this.state = {
      activeTab: 'borrow',
      selectedBook: null,
      searchTerm: '',
      statusFilter: 'all',
      borrowerInfo: {
        name: '',
        phone: '',
        email: '',
        duration: '14'
      },
      isLoading: false
    };

    this.modalConfirmCallback = null;

    this.init();
  }

  // Initialize the application
  init() {
    this.bindEvents();
    this.loadInitialData();
    this.render();
  }

  // Event Binding
  bindEvents() {
    // Tab switching (use dataset from the button itself to avoid target-inner-element issues)
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        if (tab) this.switchTab(tab);
      });
    });

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.handleSearch(e.target.value);
      });
    }

    // Status filter
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
      statusFilter.addEventListener('change', (e) => {
        this.handleStatusFilter(e.target.value);
      });
    }

    // Export button (use explicit ID to avoid false positives)
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
      exportBtn.addEventListener('click', (e) => {
        this.exportData();
      });
    }

    // Global click handler for book selection and other actions
    document.addEventListener('click', this.handleGlobalClick.bind(this));

    // Form submission (uses event delegation)
    document.addEventListener('submit', this.handleFormSubmit.bind(this));
  }

  // Global click handler
  handleGlobalClick(e) {
    const bookItem = e.target.closest('.book-item');
    const returnBtn = e.target.closest('.btn-return');
    const modalOverlay = e.target.closest('.modal-overlay');

    if (bookItem) {
      const bookId = parseInt(bookItem.dataset.bookId, 10);
      if (!Number.isNaN(bookId)) this.selectBook(bookId);
    }

    if (returnBtn) {
      const loanId = parseInt(returnBtn.dataset.loanId, 10);
      if (!Number.isNaN(loanId)) this.showReturnConfirmation(loanId);
    }

    // close modal if clicked on overlay (but not if clicking inside modal)
    if (modalOverlay && e.target === modalOverlay) {
      this.hideModal();
    }
  }

  // Form submission handler
  handleFormSubmit(e) {
    if (e.target && e.target.id === 'borrowForm') {
      e.preventDefault();
      this.processBorrow(e.target);
    }
  }

  // Load initial data (in production, replace with API calls)
  loadInitialData() {
    // Sample books data
    this.books = [
      {
        id: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        isbn: "978-0743273565",
        available: 3,
        total: 5,
        category: "Classic Literature"
      },
      {
        id: 2,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        isbn: "978-0061120084",
        available: 1,
        total: 3,
        category: "Classic Literature"
      },
      {
        id: 3,
        title: "1984",
        author: "George Orwell",
        isbn: "978-0451524935",
        available: 0,
        total: 4,
        category: "Dystopian Fiction"
      },
      {
        id: 4,
        title: "Pride and Prejudice",
        author: "Jane Austen",
        isbn: "978-0141439518",
        available: 2,
        total: 2,
        category: "Romance"
      },
      {
        id: 5,
        title: "The Catcher in the Rye",
        author: "J.D. Salinger",
        isbn: "978-0316769174",
        available: 1,
        total: 3,
        category: "Coming of Age"
      },
      {
        id: 6,
        title: "Lord of the Flies",
        author: "William Golding",
        isbn: "978-0571056781",
        available: 2,
        total: 4,
        category: "Adventure"
      }
    ];

    // Sample borrowed books data
    this.borrowedBooks = [
      {
        id: 1,
        title: "Harry Potter and the Philosopher's Stone",
        author: "J.K. Rowling",
        borrower: "John Smith",
        borrowDate: "2024-09-01",
        dueDate: "2024-09-15",
        status: "overdue",
        phone: "+1234567890",
        email: "john.smith@email.com"
      },
      {
        id: 2,
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        borrower: "Emma Johnson",
        borrowDate: "2024-09-10",
        dueDate: "2024-09-24",
        status: "due-soon",
        phone: "+1234567891",
        email: "emma.johnson@email.com"
      },
      {
        id: 3,
        title: "Dune",
        author: "Frank Herbert",
        borrower: "Michael Brown",
        borrowDate: "2024-09-05",
        dueDate: "2024-10-05",
        status: "active",
        phone: "+1234567892",
        email: "michael.brown@email.com"
      },
      {
        id: 4,
        title: "The Fellowship of the Ring",
        author: "J.R.R. Tolkien",
        borrower: "Sarah Davis",
        borrowDate: "2024-09-12",
        dueDate: "2024-10-12",
        status: "active",
        phone: "+1234567893",
        email: "sarah.davis@email.com"
      }
    ];

    // Update loan statuses based on current date
    this.updateLoanStatuses();
  }

  // Update loan statuses based on due dates
  updateLoanStatuses() {
    if (!Array.isArray(this.borrowedBooks)) return;
    this.borrowedBooks.forEach(loan => {
      loan.status = this.getStatusFromDueDate(loan.dueDate);
    });
  }

  // Utility Functions
  formatDate(dateString) {
    if (!dateString) return '-';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString(undefined, options);
  }

  getDaysUntilDue(dueDate) {
    const today = new Date();
    const due = new Date(dueDate);
    if (Number.isNaN(due.getTime())) return Infinity;
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  getStatusFromDueDate(dueDate) {
    const daysUntilDue = this.getDaysUntilDue(dueDate);
    if (!isFinite(daysUntilDue)) return 'active';
    if (daysUntilDue < 0) return 'overdue';
    if (daysUntilDue <= 3) return 'due-soon';
    return 'active';
  }

  generateId() {
    return `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  }

  // Tab Management
  switchTab(tabName) {
    if (!tabName || tabName === this.state.activeTab) return;

    this.state.activeTab = tabName;

    // Update tab buttons safely
    document.querySelectorAll('.tab-btn').forEach(btn => {
      try {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
      } catch (err) { /* ignore */ }
    });

    // Update tab content safely
    document.querySelectorAll('.tab-content').forEach(content => {
      try {
        content.classList.toggle('active', content.id === `${tabName}Tab`);
      } catch (err) { /* ignore */ }
    });
    const tabElement = document.getElementById(`${tabName}Tab`);
    if (tabElement) tabElement.classList.add('active');

    // Update search placeholder and filter visibility
    const searchInput = document.getElementById('searchInput');
    const filterSection = document.getElementById('filterSection');

    if (searchInput) {
      if (tabName === 'borrow') {
        searchInput.placeholder = 'Search books to borrow...';
      } else {
        searchInput.placeholder = 'Search borrowed books or borrowers...';
      }
      searchInput.value = '';
      this.state.searchTerm = '';
    }

    if (filterSection) {
      filterSection.style.display = tabName === 'borrow' ? 'none' : 'flex';
    }

    // Re-render appropriate content
    if (tabName === 'borrow') {
      this.renderBooks();
      this.renderBorrowForm();
    } else {
      this.renderLoans();
    }
  }

  // Search and Filter
  handleSearch(searchTerm) {
    this.state.searchTerm = searchTerm || '';
    if (this.state.activeTab === 'borrow') {
      this.renderBooks();
    } else {
      this.renderLoans();
    }
  }

  handleStatusFilter(status) {
    this.state.statusFilter = status || 'all';
    this.renderLoans();
  }

  // Book Selection
  selectBook(bookId) {
    const book = this.books.find(b => b.id === bookId);
    if (!book) return;
    if (book.available === 0) {
      // allow viewing but not selecting for borrow
      this.showNotification('Selected book is out of stock', 'error');
      return;
    }

    if (this.state.selectedBook && this.state.selectedBook.id === bookId) {
      this.state.selectedBook = null;
    } else {
      this.state.selectedBook = book;
    }
    this.renderBooks();
    this.renderBorrowForm();
  }

  // Borrow Processing
  processBorrow(form) {
    if (!this.state.selectedBook) {
      this.showNotification('Please select a book first', 'error');
      return;
    }

    const formData = new FormData(form);
    const borrowerData = {
      name: (formData.get('name') || '').trim(),
      phone: (formData.get('phone') || '').trim(),
      email: (formData.get('email') || '').trim(),
      duration: formData.get('duration') || '14'
    };

    // Validation
    if (!borrowerData.name || !borrowerData.phone) {
      this.showNotification('Please fill in required fields', 'error');
      return;
    }

    if (!this.validatePhone(borrowerData.phone)) {
      this.showNotification('Please enter a valid phone number', 'error');
      return;
    }

    if (borrowerData.email && !this.validateEmail(borrowerData.email)) {
      this.showNotification('Please enter a valid email address', 'error');
      return;
    }

    this.state.isLoading = true;
    this.renderBorrowForm(); // show loading

    // Simulate API call
    setTimeout(() => {
      this.completeBorrow(this.state.selectedBook, borrowerData);
    }, 800);
  }

  completeBorrow(book, borrowerData) {
    try {
      // Update book availability
      const bookIndex = this.books.findIndex(b => b.id === book.id);
      if (bookIndex !== -1) {
        this.books[bookIndex].available = Math.max(0, this.books[bookIndex].available - 1);
      }

      // Calculate due date
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + parseInt(borrowerData.duration, 10));

      // Create new loan
      const newLoan = {
        id: this.generateId(),
        title: book.title,
        author: book.author,
        borrower: borrowerData.name,
        borrowDate: new Date().toISOString().split('T')[0],
        dueDate: dueDate.toISOString().split('T')[0],
        status: 'active',
        phone: borrowerData.phone,
        email: borrowerData.email
      };

      if (!Array.isArray(this.borrowedBooks)) this.borrowedBooks = [];
      this.borrowedBooks.push(newLoan);

      // Reset form state
      this.state.selectedBook = null;
      this.state.isLoading = false;

      // Update UI
      this.renderBooks();
      this.renderBorrowForm();
      this.updateLoanCount();

      this.showNotification(`Book "${book.title}" successfully borrowed to ${borrowerData.name}`, 'success');
    } catch (error) {
      this.state.isLoading = false;
      this.showNotification('An error occurred while processing the borrow request', 'error');
    }
  }

  // Return Processing
  showReturnConfirmation(loanId) {
    const loan = (this.borrowedBooks || []).find(l => l.id === loanId);
    if (!loan) return;

    this.showModal({
      title: 'Confirm Return',
      message: `Are you sure you want to mark "${loan.title}" as returned?`,
      confirmText: 'Mark as Returned',
      confirmClass: 'btn-success',
      onConfirm: () => this.processReturn(loanId)
    });
  }

  processReturn(loanId) {
    const loanIndex = (this.borrowedBooks || []).findIndex(loan => loan.id === loanId);
    if (loanIndex === -1) return;

    const loan = this.borrowedBooks[loanIndex];

    // Simulate API call
    setTimeout(() => {
      // Update book availability (match by title & author)
      const book = this.books.find(b =>
        b.title === loan.title && b.author === loan.author
      );
      if (book) {
        book.available = (book.available || 0) + 1;
        if (book.available > book.total) book.available = book.total;
      }

      // Remove loan
      this.borrowedBooks.splice(loanIndex, 1);

      // Update UI
      this.renderLoans();
      this.renderBooks();

      this.showNotification(`Book "${loan.title}" successfully returned`, 'success');
      this.hideModal();
    }, 300);
  }

  // Validation Functions
  validatePhone(phone) {
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{8,}$/;
    return phoneRegex.test(phone);
  }

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Rendering Functions
  render() {
    this.renderBooks();
    this.renderBorrowForm();
    this.renderLoans();
    this.updateLoanCount();
  }

  renderBooks() {
    const booksList = document.getElementById('booksList');
    if (!booksList) return;

    try {
      const term = (this.state.searchTerm || '').toLowerCase();
      const filteredBooks = (this.books || []).filter(book =>
        (book.title || '').toLowerCase().includes(term) ||
        (book.author || '').toLowerCase().includes(term) ||
        (book.category || '').toLowerCase().includes(term)
      );

      if (filteredBooks.length === 0) {
        booksList.innerHTML = `
          <div class="empty-state">
            <i class="fas fa-book"></i>
            <p>No books found matching your search</p>
          </div>
        `;
        return;
      }

      booksList.innerHTML = filteredBooks.map(book => `
        <div class="book-item ${this.state.selectedBook?.id === book.id ? 'selected' : ''} ${book.available === 0 ? 'unavailable' : ''}" 
             data-book-id="${book.id}">
          <div class="book-header">
            <div class="book-info">
              <h3>${this.escapeHtml(book.title)}</h3>
              <p class="author">by ${this.escapeHtml(book.author)}</p>
              <div class="book-meta">
                <span>ISBN: ${this.escapeHtml(book.isbn || '-')}</span>
                <span class="category">${this.escapeHtml(book.category || '')}</span>
              </div>
            </div>
            <div class="book-availability">
              <div class="availability-status ${book.available > 0 ? 'available' : 'unavailable'}">
                ${book.available > 0 ? `${book.available} available` : 'Out of stock'}
              </div>
              <div class="availability-total">of ${book.total || 0} total</div>
            </div>
          </div>
        </div>
      `).join('');
    } catch (err) {
      // avoid breaking UI
      booksList.innerHTML = `<div class="empty-state"><p>Error rendering books</p></div>`;
      console.error(err);
    }
  }

  renderBorrowForm() {
    const borrowFormContainer = document.getElementById('borrowForm');
    if (!borrowFormContainer) return;

    try {
      if (!this.state.selectedBook) {
        borrowFormContainer.innerHTML = `
          <div class="no-book-selected">
            <i class="fas fa-book book-icon-large"></i>
            <p>Select a book to start borrowing process</p>
          </div>
        `;
        return;
      }

      if (this.state.isLoading) {
        borrowFormContainer.innerHTML = `
          <div class="loading">
            <i class="fas fa-spinner"></i>
            Processing borrow request...
          </div>
        `;
        return;
      }

      borrowFormContainer.innerHTML = `
        <div class="selected-book-info">
          <h3>${this.escapeHtml(this.state.selectedBook.title)}</h3>
          <p class="author">by ${this.escapeHtml(this.state.selectedBook.author)}</p>
        </div>

        <form id="borrowForm">
          <div class="form-group">
            <label class="form-label">Borrower Name *</label>
            <input type="text" name="name" class="form-input" placeholder="Enter full name" required>
          </div>

          <div class="form-group">
            <label class="form-label">Phone Number *</label>
            <input type="tel" name="phone" class="form-input" placeholder="+1234567890" required>
          </div>

          <div class="form-group">
            <label class="form-label">Email (Optional)</label>
            <input type="email" name="email" class="form-input" placeholder="email@example.com">
          </div>

          <div class="form-group">
            <label class="form-label">Loan Duration</label>
            <select name="duration" class="form-select">
              <option value="7">1 Week</option>
              <option value="14" selected>2 Weeks</option>
              <option value="21">3 Weeks</option>
              <option value="30">1 Month</option>
            </select>
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%;">
            <i class="fas fa-check"></i>
            Confirm Borrow
          </button>
        </form>
      `;
    } catch (err) {
      borrowFormContainer.innerHTML = `<div class="empty-state"><p>Error rendering borrow form</p></div>`;
      console.error(err);
    }
  }

  renderLoans() {
    const loansList = document.getElementById('loansList');
    if (!loansList) return;

    try {
      this.updateLoanStatuses();

      const term = (this.state.searchTerm || '').toLowerCase();
      const filteredLoans = (this.borrowedBooks || []).filter(loan => {
        const matchesSearch = (loan.title || '').toLowerCase().includes(term) ||
                              (loan.borrower || '').toLowerCase().includes(term) ||
                              (loan.author || '').toLowerCase().includes(term);
        const matchesFilter = this.state.statusFilter === 'all' || loan.status === this.state.statusFilter;
        return matchesSearch && matchesFilter;
      });

      if (filteredLoans.length === 0) {
        loansList.innerHTML = `
          <div class="empty-state">
            <i class="fas fa-book"></i>
            <p>No borrowed books found matching your criteria</p>
          </div>
        `;
        return;
      }

      loansList.innerHTML = filteredLoans.map(loan => {
        const daysUntilDue = this.getDaysUntilDue(loan.dueDate);
        let statusIcon = '';
        let daysText = '';

        switch (loan.status) {
          case 'overdue':
            statusIcon = '<i class="fas fa-exclamation-circle"></i>';
            daysText = `<div class="detail-label" style="color: #dc2626;">${Math.abs(daysUntilDue)} days overdue</div>`;
            break;
          case 'due-soon':
            statusIcon = '<i class="fas fa-clock"></i>';
            daysText = `<div class="detail-label" style="color: #d97706;">${daysUntilDue} days remaining</div>`;
            break;
          case 'active':
          default:
            statusIcon = '<i class="fas fa-check-circle"></i>';
            daysText = `<div class="detail-label">${daysUntilDue === Infinity ? '-' : `${daysUntilDue} days remaining`}</div>`;
            break;
        }

        return `
          <div class="loan-item">
            <div class="loan-content">
              <div class="loan-main">
                <div class="loan-info">
                  <h3>${this.escapeHtml(loan.title)}</h3>
                  <p class="author">by ${this.escapeHtml(loan.author)}</p>

                  <div class="loan-details">
                    <div class="detail-item">
                      <i class="fas fa-user"></i>
                      <div>
                        <div class="detail-value">${this.escapeHtml(loan.borrower)}</div>
                        <div class="detail-label">${this.escapeHtml(loan.phone || '')}</div>
                        ${loan.email ? `<div class="detail-label">${this.escapeHtml(loan.email)}</div>` : ''}
                      </div>
                    </div>

                    <div class="detail-item">
                      <i class="fas fa-calendar"></i>
                      <div>
                        <div class="detail-label">Borrowed</div>
                        <div class="detail-value">${this.formatDate(loan.borrowDate)}</div>
                      </div>
                    </div>

                    <div class="detail-item">
                      <i class="fas fa-calendar-check"></i>
                      <div>
                        <div class="detail-label">Due Date</div>
                        <div class="detail-value">${this.formatDate(loan.dueDate)}</div>
                        ${daysText}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="loan-actions">
                <span class="status-badge ${this.escapeHtml(loan.status)}">
                  ${statusIcon}
                  ${this.escapeHtml((loan.status || '').replace('-', ' ').toUpperCase())}
                </span>

                <button class="btn btn-success btn-small btn-return" data-loan-id="${loan.id}">
                  <i class="fas fa-check"></i>
                  Mark as Returned
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('');

      this.updateLoanCount();
    } catch (err) {
      loansList.innerHTML = `<div class="empty-state"><p>Error rendering loans</p></div>`;
      console.error(err);
    }
  }

  updateLoanCount() {
    const loanCount = document.getElementById('loanCount');
    if (!loanCount) return;

    const term = (this.state.searchTerm || '').toLowerCase();
    const filteredCount = (this.borrowedBooks || []).filter(loan => {
      const matchesSearch = (loan.title || '').toLowerCase().includes(term) ||
                           (loan.borrower || '').toLowerCase().includes(term) ||
                           (loan.author || '').toLowerCase().includes(term);
      const matchesFilter = this.state.statusFilter === 'all' || loan.status === this.state.statusFilter;
      return matchesSearch && matchesFilter;
    }).length;

    loanCount.textContent = filteredCount;
  }

  // Utility function to escape HTML
  escapeHtml(text) {
    if (text === undefined || text === null) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Modal Management (programmatic creation - no inline onclick)
  showModal({ title, message, confirmText = 'Confirm', cancelText = 'Cancel', confirmClass = 'btn-primary', onConfirm }) {
    // Remove existing modal if present
    const existingModal = document.querySelector('.modal-overlay');
    if (existingModal) existingModal.remove();

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    const modal = document.createElement('div');
    modal.className = 'modal';

    const header = document.createElement('div');
    header.className = 'modal-header';
    const h3 = document.createElement('h3');
    h3.className = 'modal-title';
    h3.textContent = title || '';

    header.appendChild(h3);

    const body = document.createElement('div');
    body.className = 'modal-body';
    body.textContent = message || '';

    const actions = document.createElement('div');
    actions.className = 'modal-actions';

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'btn btn-secondary';
    cancelBtn.textContent = cancelText || 'Cancel';
    cancelBtn.addEventListener('click', () => this.hideModal());

    const confirmBtn = document.createElement('button');
    confirmBtn.className = `btn ${confirmClass}`;
    confirmBtn.textContent = confirmText || 'Confirm';
    confirmBtn.addEventListener('click', () => {
      // call provided callback safely
      try {
        if (typeof onConfirm === 'function') onConfirm();
        if (this.modalConfirmCallback) this.modalConfirmCallback();
      } catch (err) {
        console.error(err);
      }
      this.hideModal();
    });

    actions.appendChild(cancelBtn);
    actions.appendChild(confirmBtn);

    modal.appendChild(header);
    modal.appendChild(body);
    modal.appendChild(actions);
    overlay.appendChild(modal);

    // click on overlay (outside modal) closes it
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) this.hideModal();
    });

    document.body.appendChild(overlay);
    this.modalConfirmCallback = onConfirm || null;

    // animate in
    requestAnimationFrame(() => overlay.classList.add('active'));
  }

  hideModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
      modal.classList.remove('active');
      setTimeout(() => {
        if (modal.parentNode) modal.parentNode.removeChild(modal);
      }, 200);
    }
    this.modalConfirmCallback = null;
  }

  // Notification System
  showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease forwards';
      setTimeout(() => {
        if (notification.parentNode) notification.parentNode.removeChild(notification);
      }, 300);
    }, 4000);
  }

  // Export Functionality
  exportData() {
    const data = {
      exportDate: new Date().toISOString(),
      totalBooks: (this.books || []).length,
      availableBooks: (this.books || []).reduce((sum, book) => sum + (book.available || 0), 0),
      totalLoans: (this.borrowedBooks || []).length,
      overdueLoans: (this.borrowedBooks || []).filter(loan => loan.status === 'overdue').length,
      books: this.books,
      loans: this.borrowedBooks
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `book-exchange-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.showNotification('Report exported successfully', 'success');
  }
}

/* Small slideOut animation for notifications (kept from original) */
const additionalStyles = `
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;

/* Initialize the application when DOM is loaded */
document.addEventListener('DOMContentLoaded', () => {
  // Add additional styles
  const style = document.createElement('style');
  style.textContent = additionalStyles;
  document.head.appendChild(style);

  // Create global instance
  window.borrowReturnApp = new BorrowReturnApp();
});

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BorrowReturnApp;
}
