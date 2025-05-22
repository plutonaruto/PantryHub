export default function QuantityControl({ value, onIncrement, onDecrement }) {
    return (
      <div className="flex items-center gap-2">
        <button onClick={onDecrement}>−</button>
        <input value={value} readOnly className="w-12 text-center" />
        <button onClick={onIncrement}>+</button>
      </div>
    );
  }
  