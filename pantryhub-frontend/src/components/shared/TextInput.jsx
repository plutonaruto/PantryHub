export default function TextInput({ label, name, value, onChange, type = "text", required = false }) {
    return (
      <div>
        <label>{label}</label>
        <input
          type={type}
          name={name}
          value={value}
          required={required}
          onChange={onChange}
          className="border p-2 w-full"
        />
      </div>
    );
  }
  