
document.addEventListener('DOMContentLoaded', () => {
    const bookForm = document.getElementById('book-form');
    const booksTableBody = document.querySelector('#books-table tbody');
    const searchBtn = document.getElementById('search-btn');
    const searchTitle = document.getElementById('search-title');
    const searchAuthor = document.getElementById('search-author');
    const searchIsbn = document.getElementById('search-isbn');
    const fetchBooks = () => {
        const title = searchTitle.value;
        const author = searchAuthor.value;
        const isbn = searchIsbn.value;
        // Build query string with search parameters
        const searchParams = new URLSearchParams();
        
        if (title) searchParams.append('title', title);
        if (author) searchParams.append('author', author);
        if (isbn) searchParams.append('isbn', isbn);
        // Fetch books with search query
        fetch(`/api/books?${searchParams.toString()}`)
            .then(response => response.json())
            
            .then(books => {
                booksTableBody.innerHTML = '';
                books.forEach(book => {
                    booksTableBody.innerHTML += `
                        <tr>
                            <td>${book.title}</td>
                            <td>${book.author}</td>
                            <td>${book.isbn}</td>
                            <td>${book.year}</td>
                            <td>${book.availability ? 'Yes' : 'No'}</td>
                            <td>
                                <button onclick="deleteBook(${book.id})">Delete</button>
                            </td>
                        </tr>
                    `;
                });
            })
            .catch(error => console.error('Error fetching books:', error));
    };

    // Add event listener for the search button
    searchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        fetchBooks();  // Trigger fetch with current search inputs
    });
// Add or update a book
bookForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const bookData = {
        title: document.getElementById('title').value,
        author: document.getElementById('author').value,
        isbn: document.getElementById('isbn').value,
        year: parseInt(document.getElementById('year').value, 10),
        availability: document.getElementById('availability').value === 'true'
    };

    fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData)
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to add book');
        fetchBooks();
        bookForm.reset();
    })
    .catch(error => {
        console.error('Error adding book:', error);
        alert('Failed to add book. Please try again.');
    });
});

// Delete a book with confirmation
window.deleteBook = (id) => {
    if (confirm('Are you sure you want to delete this book?')) {
        fetch(`/api/books/${id}`, { method: 'DELETE' })
            .then(response => {
                if (!response.ok) throw new Error('Failed to delete book');
                fetchBooks();
            })
            .catch(error => {
                console.error('Error deleting book:', error);
                alert('Failed to delete book. Please try again.');
            });
    }
};

    // Initialize book list
    fetchBooks();
});