import React, { useState } from "react";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

function SearchBar({ data }) {
  const navigate = useNavigate();
  const [input, setInput] = useState(data ? data : "");

  const onSearchHandler = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    navigate("/course-list/" + encodeURIComponent(input.trim().toLowerCase()));
  };

  return (
    <form
      onSubmit={onSearchHandler}
      className="w-full max-w-2xl flex items-center bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-all duration-300 px-3"
    >
      <img
        src={assets.search_icon}
        alt="search"
        className="w-5 h-5 text-gray-400 mx-2"
      />

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        type="text"
        placeholder="Search for courses..."
        className="flex-1 py-3 px-2 text-sm md:text-base outline-none text-gray-600 placeholder-gray-400"
      />

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white text-sm md:text-base font-medium px-6 py-2 rounded-full transition-all duration-300"
      >
        Search
      </button>
    </form>
  );
}

export default SearchBar;
