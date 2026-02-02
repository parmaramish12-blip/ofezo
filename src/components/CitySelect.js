import Select from "react-select";
import indiaCities from "../data/indiaCities";

export default function CitySelect({ value, onChange }) {
  const options = indiaCities.map((c) => ({
    label: `${c.city}, ${c.state}`,
    value: c.city,
  }));

  return (
    <Select
      options={options}
      isSearchable
      placeholder="Search city..."
      value={
        value
          ? {
              label: value,
              value: value,
            }
          : null
      }
      onChange={(val) => onChange(val.value)}
      styles={{
        control: (base) => ({
          ...base,
          minWidth: 220,
          padding: 6,
          borderRadius: 10,
          borderColor: "#2563eb",
          backgroundColor: "#ffffff",
        }),

        singleValue: (base) => ({
          ...base,
          color: "#111827", // 🔥 DARK TEXT
          fontWeight: 500,
        }),

        input: (base) => ({
          ...base,
          color: "#111827", // 🔥 typing color
        }),

        placeholder: (base) => ({
          ...base,
          color: "#6b7280", // grey
        }),

        option: (base, state) => ({
          ...base,
          color: "#111827",
          backgroundColor: state.isFocused
            ? "#e0e7ff"
            : "#ffffff",
        }),

        menu: (base) => ({
          ...base,
          zIndex: 9999,
        }),
      }}
    />
  );
}
