import { useState } from "react";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function SaveToPlannerDropdown({ onSave }) {
  const [selectedDay, setSelectedDay] = useState("");

  return (
    <div className="flex gap-2 items-center">
      <select
        className="border rounded px-2 py-1 text-sm"
        value={selectedDay}
        onChange={(e) => setSelectedDay(e.target.value)}
      >
        <option value="">Select Day</option>
        {days.map(day => (
          <option key={day} value={day}>{day}</option>
        ))}
      </select>
      <button
        className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-primary-dark disabled:opacity-50"
        onClick={() => {
          if (selectedDay) {
            onSave(selectedDay);
            setSelectedDay(""); // reset
          }
        }}
        disabled={!selectedDay}
      >
        Save to Planner
      </button>
    </div>
  );
}
