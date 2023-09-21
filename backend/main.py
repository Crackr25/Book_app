# backend/main.py

from fastapi import FastAPI, HTTPException, Depends
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from pydantic import BaseModel
import sqlite3

app = FastAPI()



class Book(BaseModel):
    title: str
    state: str

class UpdateBookStatusRequest(BaseModel):
    book_id: int
    new_status: str

# Define a SQLite database connection
conn = sqlite3.connect("books.db")
cursor = conn.cursor()

# Create a books table if it doesn't exist
cursor.execute(
    """
    CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        status TEXT
    )
    """
)
conn.commit()

# Enable CORS to allow communication with the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_methods=["*"],  # Allow all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allow all headers
)

class BookRepository:
    def __init__(self):
        self.conn = sqlite3.connect("books.db", timeout=10)
        self.cursor = self.conn.cursor()

    def add_book(self, title: str, state: str):
        self.cursor.execute("INSERT INTO books (title, status) VALUES (?, ?)", (title, state))
        self.conn.commit()

    def get_books(self):
        self.cursor.execute("SELECT id, title, status FROM books")
        books = [{"id": row[0], "title": row[1], "state": row[2]} for row in self.cursor.fetchall()]
        return books

    def update_book_status(self, book_id: int, new_status: str):
        self.cursor.execute("UPDATE books SET status = ? WHERE id = ?", (new_status, book_id))
        self.conn.commit()

    def delete_book(self, book_id: int):
        self.cursor.execute("SELECT title FROM books WHERE id = ?", (book_id,))
        book = self.cursor.fetchone()
        if not book:
            raise HTTPException(status_code=404, detail="Book not found")
        self.cursor.execute("DELETE FROM books WHERE id = ?", (book_id,))
        self.conn.commit()
        return {"title": book[0]}

    def close(self):
        self.conn.close()

@app.post("/books/", response_model=Book)
def create_book(book: Book, db: BookRepository = Depends(BookRepository)):
    db.add_book(book.title, book.state)
    return book

@app.get("/books/", response_model=List[Book])
def get_books(db: BookRepository = Depends(BookRepository)):
    books = db.get_books()
    db.close()
    return books

@app.put("/books/", response_model=UpdateBookStatusRequest)
def update_book_status(book: UpdateBookStatusRequest, db: BookRepository = Depends(BookRepository)):
    db.update_book_status(book.book_id, book.new_status)
    return book

@app.delete("/books/{book_id}/", response_model=Book)
def delete_book(book_id: int, db: BookRepository = Depends(BookRepository)):
    book = db.delete_book(book_id)
    db.close()
    return book
