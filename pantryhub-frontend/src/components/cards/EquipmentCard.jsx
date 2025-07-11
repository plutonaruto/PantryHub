import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function EquipmentCard({id, label, description, usage_instructions, pantry_id, available }) {

  const [warning, setWarning] = useState('');


  const navigate = useNavigate();

  return (
    <Link to = {`${id}`}>
    <div className=" bg-white rounded-lg shadow hover:shadow-md transition p-4 flex flex-col justify-between">
      
      <h3 className="text-lg font-bold text-gray-800">{label}</h3>
      <div className="text-sm text-gray-500 mt-1">
        <p>Description: {description}</p>
      </div>

    <div className="text-sm text-gray-500 mt-1">
        <p>Usage Instructions: {usage_instructions}</p>
      </div>

    <div className="text-sm text-gray-500 mt-1">
        <p>Pantry Level: {pantry_id}</p>
    </div>

     <div className="text-sm text-gray-500 mt-1">
        <p>Availability: {available  ? "Available" : "Item is currently in use"} </p>
    </div>



     
    </div>
  </Link>

    )
}