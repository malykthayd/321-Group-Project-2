// Library module for AQE Platform
// Handles library and reading functionality

class LibraryManager {
  constructor() {
    this.books = [];
    this.readingHistory = [];
    this.currentBook = null;
    this.bookmarks = {};
    
    this.init();
  }

  init() {
    this.loadBooks();
    this.loadReadingHistory();
    this.setupEventListeners();
  }

  // Load books from API (mock data for now)
  async loadBooks() {
    try {
      // In a real app, this would fetch from the API
      this.books = [
        {
          id: 1,
          title: 'Mathematics Fundamentals',
          author: 'Dr. Sarah Johnson',
          category: 'Mathematics',
          description: 'A comprehensive guide to mathematical principles and problem-solving techniques.',
          pages: 250,
          isbn: '978-0-123456-78-9',
          publishedYear: 2023,
          language: 'English',
          difficulty: 'Beginner',
          tags: ['math', 'fundamentals', 'beginner'],
          coverImage: 'https://via.placeholder.com/200x300/0066cc/ffffff?text=Math+Fundamentals',
          content: {
            chapters: [
              {
                id: 1,
                title: 'Introduction to Numbers',
                pages: 15,
                content: 'Understanding the basic number system and its applications...'
              },
              {
                id: 2,
                title: 'Basic Operations',
                pages: 25,
                content: 'Addition, subtraction, multiplication, and division...'
              }
            ]
          },
          rating: 4.5,
          reviews: 23,
          isAvailable: true,
          createdAt: new Date('2024-01-15')
        },
        {
          id: 2,
          title: 'History of the World',
          author: 'Prof. Michael Chen',
          category: 'History',
          description: 'An engaging journey through world history from ancient civilizations to modern times.',
          pages: 400,
          isbn: '978-0-987654-32-1',
          publishedYear: 2022,
          language: 'English',
          difficulty: 'Intermediate',
          tags: ['history', 'world', 'civilizations'],
          coverImage: 'https://via.placeholder.com/200x300/cc6600/ffffff?text=World+History',
          content: {
            chapters: [
              {
                id: 1,
                title: 'Ancient Civilizations',
                pages: 30,
                content: 'The rise and fall of ancient empires...'
              },
              {
                id: 2,
                title: 'Medieval Period',
                pages: 35,
                content: 'The Middle Ages and their impact on society...'
              }
            ]
          },
          rating: 4.2,
          reviews: 18,
          isAvailable: true,
          createdAt: new Date('2024-01-10')
        },
        {
          id: 3,
          title: 'Science Experiments for Kids',
          author: 'Dr. Emily Rodriguez',
          category: 'Science',
          description: 'Fun and educational science experiments that can be done at home.',
          pages: 180,
          isbn: '978-0-112233-44-5',
          publishedYear: 2023,
          language: 'English',
          difficulty: 'Beginner',
          tags: ['science', 'experiments', 'kids', 'hands-on'],
          coverImage: 'https://via.placeholder.com/200x300/00cc66/ffffff?text=Science+Experiments',
          content: {
            chapters: [
              {
                id: 1,
                title: 'Chemistry Basics',
                pages: 20,
                content: 'Simple chemical reactions and their explanations...'
              },
              {
                id: 2,
                title: 'Physics Fun',
                pages: 25,
                content: 'Basic physics concepts through experiments...'
              }
            ]
          },
          rating: 4.8,
          reviews: 31,
          isAvailable: true,
          createdAt: new Date('2024-01-20')
        },
        {
          id: 4,
          title: 'Advanced Programming Concepts',
          author: 'Alex Thompson',
          category: 'Computer Science',
          description: 'Deep dive into advanced programming concepts and best practices.',
          pages: 350,
          isbn: '978-0-556677-88-9',
          publishedYear: 2023,
          language: 'English',
          difficulty: 'Advanced',
          tags: ['programming', 'advanced', 'computer-science'],
          coverImage: 'https://via.placeholder.com/200x300/6600cc/ffffff?text=Programming',
          content: {
            chapters: [
              {
                id: 1,
                title: 'Design Patterns',
                pages: 40,
                content: 'Common design patterns and their implementations...'
              },
              {
                id: 2,
                title: 'Algorithm Optimization',
                pages: 35,
                content: 'Techniques for optimizing algorithms and data structures...'
              }
            ]
          },
          rating: 4.6,
          reviews: 15,
          isAvailable: true,
          createdAt: new Date('2024-01-25')
        }
      ];

      this.renderBooks();
      this.updateLibraryStats();
    } catch (error) {
      console.error('Error loading books:', error);
      this.showError('Failed to load books. Please try again.');
    }
  }

  // Load reading history
  loadReadingHistory() {
    // In a real app, this would fetch from the API
    this.readingHistory = [
      { bookId: 1, pagesRead: 50, lastRead: new Date('2024-01-20'), timeSpent: 120 },
      { bookId: 2, pagesRead: 200, lastRead: new Date('2024-01-18'), timeSpent: 300 },
      { bookId: 3, pagesRead: 180, lastRead: new Date('2024-01-22'), timeSpent: 240 }
    ];

    // Load bookmarks from localStorage
    const savedBookmarks = localStorage.getItem('bookmarks');
    if (savedBookmarks) {
      this.bookmarks = JSON.parse(savedBookmarks);
    }
  }

  // Setup event listeners
  setupEventListeners() {
    // Library search
    const librarySearch = document.getElementById('librarySearch');
    if (librarySearch) {
      librarySearch.addEventListener('input', this.debounce(this.handleLibrarySearch.bind(this), 300));
    }

    // Filter buttons
    const filterButtons = document.querySelectorAll('.library-filter');
    filterButtons.forEach(button => {
      button.addEventListener('click', this.handleFilterClick.bind(this));
    });
  }

  // Render books grid
  renderBooks(filteredBooks = null) {
    const libraryGrid = document.getElementById('libraryGrid');
    if (!libraryGrid) return;

    const booksToRender = filteredBooks || this.books;
    
    if (booksToRender.length === 0) {
      libraryGrid.innerHTML = `
        <div class="col-12">
          <div class="text-center py-5">
            <i class="bi bi-book display-1 text-muted"></i>
            <h4 class="mt-3 text-muted">No books found</h4>
            <p class="text-muted">Try adjusting your search or filters.</p>
          </div>
        </div>
      `;
      return;
    }

    libraryGrid.innerHTML = booksToRender.map(book => this.createBookCard(book)).join('');
  }

  // Create book card HTML
  createBookCard(book) {
    const readingProgress = this.getReadingProgress(book.id);
    const isRead = readingProgress === 100;
    const isCurrentlyReading = readingProgress > 0 && readingProgress < 100;

    return `
      <div class="col-md-6 col-lg-4">
        <div class="card library-item h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <span class="badge bg-primary">${book.category}</span>
              <div class="d-flex gap-1">
                <span class="badge bg-secondary">${book.difficulty}</span>
                ${isRead ? '<span class="badge bg-success">Read</span>' : ''}
                ${isCurrentlyReading ? '<span class="badge bg-warning">Reading</span>' : ''}
              </div>
            </div>
            
            <div class="text-center mb-3">
              <img src="${book.coverImage}" alt="${book.title}" class="img-fluid rounded" style="max-height: 150px; object-fit: cover;">
            </div>
            
            <h6 class="card-title">${book.title}</h6>
            <p class="card-text small text-muted">by ${book.author}</p>
            <p class="card-text small">${book.description}</p>
            
            <div class="d-flex justify-content-between align-items-center mb-2">
              <small class="text-muted">
                <i class="bi bi-file-text me-1"></i>
                ${book.pages} pages
              </small>
              <div class="d-flex align-items-center">
                <i class="bi bi-star-fill text-warning me-1"></i>
                <small class="text-muted">${book.rating} (${book.reviews})</small>
              </div>
            </div>
            
            ${isCurrentlyReading ? `
              <div class="mb-2">
                <div class="d-flex justify-content-between align-items-center mb-1">
                  <small class="text-muted">Reading Progress</small>
                  <small class="text-muted">${readingProgress}%</small>
                </div>
                <div class="progress" style="height: 4px;">
                  <div class="progress-bar" role="progressbar" style="width: ${readingProgress}%"></div>
                </div>
              </div>
            ` : ''}
            
            <div class="d-flex gap-2">
              ${!isRead ? `
                <button class="btn btn-primary btn-sm flex-grow-1" onclick="app.libraryManager.startReading(${book.id})">
                  ${isCurrentlyReading ? 'Continue Reading' : 'Start Reading'}
                </button>
              ` : `
                <button class="btn btn-success btn-sm flex-grow-1" disabled>
                  <i class="bi bi-check-circle me-1"></i>Completed
                </button>
              `}
              <button class="btn btn-outline-secondary btn-sm" onclick="app.libraryManager.showBookDetails(${book.id})">
                <i class="bi bi-info-circle"></i>
              </button>
              <button class="btn btn-outline-secondary btn-sm" onclick="app.libraryManager.toggleBookmark(${book.id})">
                <i class="bi bi-bookmark${this.isBookmarked(book.id) ? '-fill' : ''}"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Start reading a book
  startReading(bookId) {
    const book = this.books.find(b => b.id === bookId);
    if (!book) {
      this.showError('Book not found.');
      return;
    }

    this.currentBook = book;
    this.showBookReader();
  }

  // Show book reader
  showBookReader() {
    if (!this.currentBook) return;

    // Create book reader modal
    const modal = this.createBookReaderModal();
    document.body.appendChild(modal);
    
    // Show modal
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();

    // Load first chapter
    this.loadBookChapter(0);
  }

  // Create book reader modal
  createBookReaderModal() {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'bookReaderModal';
    modal.setAttribute('tabindex', '-1');
    modal.innerHTML = `
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="bookTitle">${this.currentBook.title}</h5>
            <div class="d-flex align-items-center gap-2">
              <button type="button" class="btn btn-outline-secondary btn-sm" onclick="app.libraryManager.toggleBookmark(${this.currentBook.id})">
                <i class="bi bi-bookmark${this.isBookmarked(this.currentBook.id) ? '-fill' : ''}"></i>
              </button>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-3">
                <div class="card">
                  <div class="card-header">
                    <h6 class="mb-0">Table of Contents</h6>
                  </div>
                  <div class="card-body p-0">
                    <div id="bookChapters" class="list-group list-group-flush">
                      <!-- Chapters will be populated here -->
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-9">
                <div id="bookContent" class="book-content">
                  <!-- Book content will be displayed here -->
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <div class="d-flex justify-content-between align-items-center w-100">
              <div>
                <small class="text-muted">Reading Progress: <span id="readingProgress">0%</span></small>
              </div>
              <div class="d-flex gap-2">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" id="nextChapterBtn" onclick="app.libraryManager.nextChapter()">Next Chapter</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    return modal;
  }

  // Load book chapter
  loadBookChapter(chapterIndex) {
    if (!this.currentBook || !this.currentBook.content.chapters[chapterIndex]) return;

    const chapter = this.currentBook.content.chapters[chapterIndex];
    const bookContent = document.getElementById('bookContent');
    const bookChapters = document.getElementById('bookChapters');

    if (!bookContent || !bookChapters) return;

    // Update chapters navigation
    bookChapters.innerHTML = this.currentBook.content.chapters.map((chap, index) => `
      <button class="list-group-item list-group-item-action ${index === chapterIndex ? 'active' : ''}" 
              onclick="app.libraryManager.loadBookChapter(${index})">
        ${chap.title}
        <small class="d-block text-muted">${chap.pages} pages</small>
      </button>
    `).join('');

    // Update content
    bookContent.innerHTML = `
      <div class="card">
        <div class="card-header">
          <h6 class="mb-0">${chapter.title}</h6>
        </div>
        <div class="card-body">
          <div class="book-text">
            ${chapter.content}
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
          </div>
        </div>
      </div>
    `;

    // Update navigation buttons
    const nextBtn = document.getElementById('nextChapterBtn');
    if (nextBtn) {
      const isLastChapter = chapterIndex === this.currentBook.content.chapters.length - 1;
      nextBtn.textContent = isLastChapter ? 'Finish Book' : 'Next Chapter';
      nextBtn.onclick = isLastChapter ? 
        () => this.finishBook() : 
        () => this.nextChapter();
    }

    // Update reading progress
    this.updateReadingProgress(chapterIndex);
  }

  // Next chapter
  nextChapter() {
    const currentIndex = this.getCurrentChapterIndex();
    if (currentIndex < this.currentBook.content.chapters.length - 1) {
      this.loadBookChapter(currentIndex + 1);
    }
  }

  // Finish book
  finishBook() {
    if (!this.currentBook) return;

    // Update reading history
    this.updateReadingHistory(this.currentBook.id, this.currentBook.pages, 0);
    
    // Show completion message
    this.showNotification(`Congratulations! You finished reading "${this.currentBook.title}"`, 'success');
    
    // Close modal
    const modal = document.getElementById('bookReaderModal');
    if (modal) {
      const bsModal = bootstrap.Modal.getInstance(modal);
      bsModal.hide();
    }

    // Refresh library grid
    this.renderBooks();
    this.updateLibraryStats();
  }

  // Get current chapter index
  getCurrentChapterIndex() {
    const activeChapter = document.querySelector('#bookChapters .active');
    return Array.from(document.querySelectorAll('#bookChapters button')).indexOf(activeChapter);
  }

  // Update reading progress
  updateReadingProgress(chapterIndex) {
    if (!this.currentBook) return;

    const totalChapters = this.currentBook.content.chapters.length;
    const progress = Math.round(((chapterIndex + 1) / totalChapters) * 100);
    
    const progressElement = document.getElementById('readingProgress');
    if (progressElement) {
      progressElement.textContent = `${progress}%`;
    }

    // Update reading history
    const pagesRead = Math.round((progress / 100) * this.currentBook.pages);
    this.updateReadingHistory(this.currentBook.id, pagesRead, 0);
  }

  // Show book details
  showBookDetails(bookId) {
    const book = this.books.find(b => b.id === bookId);
    if (!book) return;

    // Create details modal
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${book.title}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-4">
                <img src="${book.coverImage}" alt="${book.title}" class="img-fluid rounded">
              </div>
              <div class="col-md-8">
                <p><strong>Author:</strong> ${book.author}</p>
                <p><strong>Category:</strong> ${book.category}</p>
                <p><strong>Difficulty:</strong> ${book.difficulty}</p>
                <p><strong>Pages:</strong> ${book.pages}</p>
                <p><strong>Published:</strong> ${book.publishedYear}</p>
                <p><strong>Language:</strong> ${book.language}</p>
                <p><strong>ISBN:</strong> ${book.isbn}</p>
                <div class="d-flex align-items-center mb-2">
                  <i class="bi bi-star-fill text-warning me-1"></i>
                  <span>${book.rating} (${book.reviews} reviews)</span>
                </div>
                <p><strong>Description:</strong></p>
                <p>${book.description}</p>
                <p><strong>Tags:</strong> ${book.tags.join(', ')}</p>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-outline-secondary" onclick="app.libraryManager.toggleBookmark(${book.id})">
              <i class="bi bi-bookmark${this.isBookmarked(book.id) ? '-fill' : ''} me-1"></i>
              ${this.isBookmarked(book.id) ? 'Remove Bookmark' : 'Add Bookmark'}
            </button>
            <button type="button" class="btn btn-primary" onclick="app.libraryManager.startReading(${book.id})">Start Reading</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
  }

  // Toggle bookmark
  toggleBookmark(bookId) {
    if (this.bookmarks[bookId]) {
      delete this.bookmarks[bookId];
      this.showNotification('Bookmark removed', 'info');
    } else {
      this.bookmarks[bookId] = {
        bookId: bookId,
        addedAt: new Date()
      };
      this.showNotification('Book added to bookmarks', 'success');
    }

    // Save to localStorage
    localStorage.setItem('bookmarks', JSON.stringify(this.bookmarks));

    // Refresh the display if we're in the library
    this.renderBooks();
  }

  // Check if book is bookmarked
  isBookmarked(bookId) {
    return !!this.bookmarks[bookId];
  }

  // Handle library search
  handleLibrarySearch(event) {
    const query = event.target.value.toLowerCase().trim();
    const filteredBooks = this.books.filter(book => 
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      book.description.toLowerCase().includes(query) ||
      book.category.toLowerCase().includes(query) ||
      book.tags.some(tag => tag.toLowerCase().includes(query))
    );
    
    this.renderBooks(filteredBooks);
  }

  // Handle filter click
  handleFilterClick(event) {
    const filter = event.target.dataset.filter;
    let filteredBooks = this.books;

    if (filter && filter !== 'all') {
      filteredBooks = this.books.filter(book => 
        book.category.toLowerCase() === filter.toLowerCase() ||
        book.difficulty.toLowerCase() === filter.toLowerCase()
      );
    }

    this.renderBooks(filteredBooks);
  }

  // Get reading progress
  getReadingProgress(bookId) {
    const history = this.readingHistory.find(h => h.bookId === bookId);
    if (!history) return 0;

    const book = this.books.find(b => b.id === bookId);
    if (!book) return 0;

    return Math.round((history.pagesRead / book.pages) * 100);
  }

  // Update reading history
  updateReadingHistory(bookId, pagesRead, timeSpent) {
    const existingIndex = this.readingHistory.findIndex(h => h.bookId === bookId);
    
    if (existingIndex >= 0) {
      this.readingHistory[existingIndex] = {
        ...this.readingHistory[existingIndex],
        pagesRead: Math.max(this.readingHistory[existingIndex].pagesRead, pagesRead),
        lastRead: new Date(),
        timeSpent: this.readingHistory[existingIndex].timeSpent + timeSpent
      };
    } else {
      this.readingHistory.push({
        bookId: bookId,
        pagesRead: pagesRead,
        lastRead: new Date(),
        timeSpent: timeSpent
      });
    }

    // In a real app, this would save to the API
    localStorage.setItem('readingHistory', JSON.stringify(this.readingHistory));
  }

  // Update library statistics
  updateLibraryStats() {
    const totalBooks = this.books.length;
    const booksRead = this.readingHistory.filter(h => {
      const book = this.books.find(b => b.id === h.bookId);
      return book && h.pagesRead >= book.pages;
    }).length;
    
    const totalReadingTime = this.readingHistory.reduce((total, h) => total + h.timeSpent, 0);
    const readingTimeHours = Math.round(totalReadingTime / 60);

    // Update UI elements
    this.updateElement('totalBooks', totalBooks);
    this.updateElement('booksRead', booksRead);
    this.updateElement('readingTime', `${readingTimeHours}h`);
  }

  // Update element content
  updateElement(id, content) {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = content;
    }
  }

  // Show error
  showError(message) {
    if (window.app) {
      window.app.showNotification(message, 'danger');
    }
  }

  // Show notification
  showNotification(message, type = 'info') {
    if (window.app) {
      window.app.showNotification(message, type);
    }
  }

  // Debounce function
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

// Initialize library manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (window.app) {
    window.app.libraryManager = new LibraryManager();
  }
});
