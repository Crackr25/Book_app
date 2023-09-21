// frontend/pages/index.tsx

import { useEffect, useState } from "react";
import BookList from "../components/BookList";
import AddBookForm from "../components/AddBookForm";

export default function Home() {
  interface Book {
    id: number;
    title: string;
    state: string;
  }

  const [books, setBooks] = useState<Book[]>([]);

  // Fetch books from the backend API and update the state
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("http://localhost:8000/books");
        if (!response.ok) {
          throw new Error(`Request failed with status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Response Data:", data); // Log the response data
        setBooks(data);
        console.log("hello");
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };
    fetchBooks();
  }, []);

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-semibold mb-4">Book Tracking App</h1>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">To Read</h2>
          <BookList books={books.filter((book) => book.state === "to-read")} />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">In Progress</h2>
          <BookList
            books={books.filter((book) => book.state === "in-progress")}
          />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Completed</h2>
          <BookList
            books={books.filter((book) => book.state === "completed")}
          />
        </div>
      </div>
      <AddBookForm />
    </div>
  );
}
