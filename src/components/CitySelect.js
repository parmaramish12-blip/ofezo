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
      isSearchable={true}
      placeholder="Search or select city..."
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
          minWidth: 200,
          padding: "8px 12px",
          borderRadius: 0,
          borderColor: "transparent",
          backgroundColor: "transparent",
          boxShadow: "none",
          border: "none",
          cursor: "pointer",
        }),

        singleValue: (base) => ({
          ...base,
          color: "#002f34",
          fontWeight: 500,
          fontSize: "14px",
        }),

        input: (base) => ({
          ...base,
          color: "#002f34",
          fontSize: "14px",
        }),

        placeholder: (base) => ({
          ...base,
          color: "#6c757d",
        }),

        option: (base, state) => ({
          ...base,
          color: "#002f34",
          backgroundColor: state.isFocused
            ? "#f0f9ff"
            : "#ffffff",
        }),

        menu: (base) => ({
          ...base,
          zIndex: 9999,
          borderRadius: "4px",
          border: "1px solid #e0e0e0",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        }),

        dropdownIndicator: () => null,
        indicatorSeparator: () => null,
      }}
    />
  );
}
