import { useEffect, useState } from "react";
import axios from "axios";
import LayoutWrapper from '../components/layout/LayoutWrapper';
import { useAuth } from "../firebase/AuthProvider";
import { api } from "../api";
import { useParams } from "react-router-dom";

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
  <div className="p-6 flex flex-col mx-auto">
    <h1 className="text-3xl font-bold mb-2">{equipment.label}</h1>
    <span className="text-gray-700 mb-4">{equipment.description}</span>

    <div className="w-full max-w-xs space-y-4">
  <div className="flex justify-between items-center">
    <span className="text-gray-700 font-semibold">Usage Instructions:</span>
    <span className="text-gray-700">{equipment.usage_instructions}</span>
  </div>
  <div className="flex justify-between items-center">
    <span className="text-gray-700 font-semibold">Pantry Level:</span>
    <span className="text-gray-700">{equipment.pantry_id}</span>
  </div>
  <div>
    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${equipment.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
      {equipment.available ? "Available" : (equipment.used_by === user.uid ) 
        ? "You are currently using this equipment." 
        : " Equipment is currently being used by another user" } 
    </span>
  </div>
      {!equipment.available && (
        <p className="text-sm text-gray-500 mb-2"> 
          Currently being used by: {equipment.used_by} 
        </p>
      )}
      <div>
        {equipment.available ? (
          <button className="w-full btn-primary mt-4 hover:bg-gray-700"
            onClick={async () => {
              await api.checkIn(id);
              api.getEquipment(id)
              .then(res => setEquipment(res))
                .catch(err => console.error(err));
            }}>
            Check In
          </button>
        ) : (
          equipment.used_by === user.uid ? (
            <button className="w-full btn-primary mt-4 hover:bg-gray-700"
              onClick={async () => {
                await api.checkOut(id);
                api.getEquipment(id)
                  .then(res => setEquipment(res))
                  .catch(err => console.error(err));
              }}>
              Check Out
            </button>
          ) : (
            <button className="w-full btn-primary mt-4" disabled>
              Item in Use
            </button>
          )
        )}
      </div>
    </div>
  </div>
</LayoutWrapper>

      );
    }

    