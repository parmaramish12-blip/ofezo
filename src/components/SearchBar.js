import React from "react";
import "./SearchBar.css";

const SearchBar = ({
  city,
  setCity,
  category,
  setCategory,
  onSearch,
}) => {
  return (
    <div className="search-wrapper">
      <h1 className="search-title">
        Discover Best Local Offers Near You
      </h1>

      <div className="search-box">
        {/* City */}
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
        >
          <option value="">Select City</option>
          <option value="Vadodara">Vadodara</option>
          <option value="Anand">Anand</option>
          <option value="Ahmedabad">Ahmedabad</option>
          <option value="Surat">Surat</option>
          <option value="Nadiad">Nadiad</option>
        </select>

        {/* Category */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Food">Food</option>
          <option value="Electronics">Electronics</option>
          <option value="Furniture">Furniture</option>
          <option value="Fashion">Fashion</option>
          <option value="Grocery">Grocery</option>
        </select>

        {/* Search */}
        <button onClick={onSearch}>Search</button>
      </div>
    </div>
  );
};

export default SearchBar;
