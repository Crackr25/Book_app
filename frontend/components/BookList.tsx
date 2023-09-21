import React from "react";

interface Book {
  id: number;
  title: string;
  state: string;
}

interface BookListProps {
  books: Book[];
}

const BookList: React.FC<BookListProps> = ({ books }) => {
  const handleTransition = async (book: number, newState: string) => {
    try {
      console.log(book);
      console.log(newState);
      const response = await fetch(`http://localhost:8000/books/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          book_id: book,
          new_status: newState, // or any other valid state value
        }), // Send the new state in the request body
      });

      if (response.status === 200) {
        window.location.reload();
        // Book transition was successful, you can handle it here
      } else {
        console.error("Failed to transition book");
      }
    } catch (error) {
      console.error("Error transitioning book:", error);
    }
  };

  return (
    <ul className="space-y-2">
      {books.map((book, index) => (
        <li key={index} className="bg-white p-2 rounded shadow">
          {book.title}
          <button onClick={() => handleTransition(index, "in-progress")}>
            Move to In Progress
          </button>
          <button onClick={() => handleTransition(index, "completed")}>
            Mark as Completed
          </button>
        </li>
      ))}
    </ul>
  );
};

export default BookList;
