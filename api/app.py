from flask import Flask, request, jsonify, render_template
import mysql.connector

app = Flask(__name__, template_folder="templates", static_folder="static")

# Database connection
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="{pwd}",
        database="library"
    )

# Create a new book
@app.route('/api/books', methods=['POST'])
def create_book():
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    query = "INSERT INTO books (title, author, isbn, year, availability) VALUES (%s, %s, %s, %s, %s)"
    cursor.execute(query, (data['title'], data['author'], data['isbn'], data['year'], data['availability']))
    conn.commit()
    conn.close()
    return jsonify({"message": "Book added successfully!"})

# Read/search books
@app.route('/api/books', methods=['GET'])
def read_books():
    title = request.args.get('title')
    author = request.args.get('author')
    isbn = request.args.get('isbn')

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    query = "SELECT * FROM books WHERE (%s IS NULL OR title LIKE %s) AND (%s IS NULL OR author LIKE %s) AND (%s IS NULL OR isbn LIKE %s)"
    cursor.execute(query, (title, f"%{title}%", author, f"%{author}%", isbn, f"%{isbn}%"))
    books = cursor.fetchall()
    conn.close()
    return jsonify(books)

# Update book information
@app.route('/api/books/<int:book_id>', methods=['PUT'])
def update_book(book_id):
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    query = "UPDATE books SET title = %s, author = %s, isbn = %s, year = %s, availability = %s WHERE id = %s"
    cursor.execute(query, (data['title'], data['author'], data['isbn'], data['year'], data['availability'], book_id))
    conn.commit()
    conn.close()
    return jsonify({"message": "Book updated successfully!"})

# Delete a book
@app.route('/api/books/<int:book_id>', methods=['DELETE'])
def delete_book(book_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    query = "DELETE FROM books WHERE id = %s"
    cursor.execute(query, (book_id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Book deleted successfully!"})

# Serve frontend
@app.route('/')
def index():
    print("Rendering index.html")
    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True)
