import { useEffect, useState } from "react";
import axios from "axios";
import LayoutWrapper from '../components/layout/LayoutWrapper';
import { useAuth } from "../firebase/AuthProvider";
import { api } from "../api";

export default function EquipmentPage() {
  const { id } = useParams();
  const [equipment, setEquipment] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    api.getEquipment(id)
      .then(res => setEquipment(res))
      .catch(err => console.error(err));
  }, [id]);

    

  if (!equipment) return <p>Loading...</p>;

  return (
    <LayoutWrapper>
    <div className="p-6">
      <h1 className="text-2xl font-bold">{equipment.label}</h1>
      <p className="mt-2 text-gray-600">{equipment.description}</p>
      <p className="mt-2 text-gray-600">Usage Instructions: {equipment.usage_instructions}</p>
      <p className="mt-2 text-gray-600">Pantry Level: {equipment.pantry_id}</p>
      <p>{equipment.available ? "Available" : (equipment.used_by === user.uid ) 
      ? "You are currently using this equipment." 
      : " Equipment is currently being used by another user" } </p>

      {!equipment.available && (
        <p>Currently being used by: {equipment.used_by} </p>
      )}

      {equipment.available ? (
        <button className= "btn-primary mt-4" 
        onClick = { async () => { await api.checkIn(id);
            api.getEquipment(id)
            .then(res => setEquipment(res))
            .catch(err => console.error(err) );
        }} >
            Check In
        </button>

        ) : ( // item not avail
            equipment.used_by === user.uid ? (
                <button className= "btn-primary mt-4"
                onClick = { async() => { await api.checkOut(id);
                    api.getEquipment(id)
                    .then(res => setEquipment(res))
                    .catch(err => console.error(err) );
                }} >
                    Check Out
                </button>
            ) : (
            
                <button className= "btn-primary mt-4" disabled>
                    Item in Use
                </button>
            

        )
        )}
      
    </div>
  </LayoutWrapper>

);
}