import { useState } from "react";
import "../styles/autocomplete.css";

const categories = [
  "Mobile",
  "Electronics",
  "Furniture",
  "Clothing",
  "Grocery",
  "Restaurant",
  "Salon",
  "Gym",
  "Education",
  "Medical",
  "Automobile",
  "Real Estate",
  "Services",
];

export default function CategorySelect({ value, onChange }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = categories.filter((c) =>
    c.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="autocomplete-wrapper">
      <input
        className="autocomplete-input"
        placeholder="Search category..."
        value={value || query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
      />

      {open && query && (
        <div className="autocomplete-list">
          {filtered.map((c, i) => (
            <div
              key={i}
              className="autocomplete-item"
              onClick={() => {
                onChange(c);
                setQuery("");
                setOpen(false);
              }}
            >
              {c}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
