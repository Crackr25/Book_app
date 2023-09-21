// frontend/components/AddBookForm.tsx

import React, { useState } from "react";

const AddBookForm: React.FC = () => {
  const [title, setTitle] = useState("");

  const handleAddBook = async () => {
    try {
      const response = await fetch("http://localhost:8000/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          state: "to-read", // or any other valid state value
        }),
      });
      if (response.status === 200) {
        // Book successfully added, refresh the list
        window.location.reload();
      } else {
        console.log(title);
        console.log(response.status);
        // console.error("Failed to add book");
      }
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-2">Add New Book</h2>
      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="Book Title"
          className="border border-gray-400 p-2 rounded w-3/4"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white p-2 rounded"
          onClick={handleAddBook}
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default AddBookForm;
