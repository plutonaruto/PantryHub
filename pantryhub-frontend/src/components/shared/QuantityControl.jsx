export default function QuantityControl({ value, onChange }) {
  const handleDecrement = () => {
    if (value > 0) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    onChange(value + 1);
  };

  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={handleDecrement}>−</button>
      <input value={value} readOnly className="w-12 text-center" />
      <button type="button" onClick={handleIncrement}>+</button>
    </div>
  );
}