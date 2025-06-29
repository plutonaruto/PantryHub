import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/layout/Topbar";
import { api } from "../api";

export default function ItemPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);

  const navigate = useNavigate();

  const handleFileChange = (e) => {
  setSelectedFile(e.target.files[0]);
};

  useEffect(() => {
    api.fetchItem(id)
      .then(res => setItem(res))
      .catch(err => console.error(err));
  }, [id]);

  // handle form with current item data
  const handleEditClick = () => {
    setEditForm({
      name: item.name || "",
      description: item.description || "",
      imageUrl: item.image_url || "",
      expiryDate: item.expiry_date || "",
      quantity: item.quantity || 1,
    });
    setIsEditing(true);
  };

  // handle form edits
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value, }));
  };

  // submission of edited form
  const handleEditSubmit = async(e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', editForm.name);
    formData.append('expiry_date', editForm.expiryDate);
    formData.append('quantity', editForm.quantity);
    if (selectedFile) {
      formData.append('image', selectedFile);
    }
    await api.updateItem(id, formData); 
    alert("Item updated successfully");
    setIsEditing(false);
};


  if (!item) return <div>Loading...</div>;

  return (
    <div className="flex min-h-screen gap-2">
      <div className="w-64 bg-primary text-white flex flex-col p-2 flex-shrink-0">
        <Sidebar />
      </div>
      <div className= "flex-1 p-4">
        <img src={`http://localhost:5000${item.image_url}`} alt={item.name} className="rounded w-96 mb-4" />
        <h1 className="text-2xl font-bold">{item.name}</h1>
        <p className="mt-2 text-gray-600">{item.description}</p>
        <p>Expiry Date: {item.expiry_date}</p>
        <p>Quantity: {item.quantity}</p>
        <div className = 'flex flex-row gap-4 mt-4'>
          {/* EDIT ITEM */}
          <button className="mt-4 bg-white text-black px-4 py-2 rounded"
          onClick= {handleEditClick}>
            Edit Item Information
          </button>

          {/* DELETE ITEM */}
          <button className="mt-4 bg-black text-white px-4 py-2 rounded"
          onClick = { async () => {
            try {
              await api.deleteItem(id);
              alert("Item removed successfully");
              navigate("/inventory");
            } catch (error) {
              console.error("Error removing item:", error);
              alert("Failed to remove item. Please try again.");
            }
          }}>
            Remove
          </button>

          {/* OFFER ON MARKETPLACE */}
          <button className="mt-4 bg-white text-black px-4 py-2 rounded"
          onClick= { () => {
            navigate("/marketplace", {
              state: {
                prefill: {
                  name: item.name || "",
                  description: item.description || "",
                  imageUrl: item.image_url || "",
                  expiryDate: item.expiry_date || "",
                  quantity: item.quantity || 1,
                },
              },
            });
          }}>Offer on Marketplace</button>
        </div>

        {/* EDIT FORM */}
        { isEditing && (
          <div className= "p-6 bg-white rounded-lg shadow-md">
            <form
             className="bg-white shadow-lg w-full rounded p-8"
              onSubmit={handleEditSubmit}
            >
              <h2 className="font-bold mb-4"> Edit Item </h2>
              <label className="block mb-2">
                Name:
                <input
                  className="border rounded w-full p-2"
                  name = "name"
                  value = {editForm.name}
                  onChange={handleEditChange}
                  required
                />
              </label>

              <label className="block mb-2">
                Image:
                <input
                  className="border rounded w-full p-2"
                  name = "imageUrl"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  
                />
              </label>

              <label className="block mb-2">
                Expiry Date:
                <input
                  className="border rounded w-full p-2"
                  name = "expiryDate"
                  type = "date"
                  value = {editForm.expiryDate}
                  onChange={handleEditChange}
                />
              </label>

              <label className="block mb-2">
                Quantity:
                <input
                  className="border rounded w-full p-2"
                  name = "quantity"
                  type = "number"
                  min = "1"
                  value = {editForm.quantity}
                  onChange={handleEditChange}
                  required
                />
              </label>

              <div className= "flex flex-row gap-2">
                <button
                  type="submit"
                  className= "bg-primary text-white p-4 rounded hover:bg-gray-300 transition-colors"
                >
                  Save
                </button>

                <button
                  type="button"
                  className= "bg-gray-300 text-black p-4 rounded hover:bg-white transition-colors"
                  onClick = {() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>

              
            </form>
          </div>
        )}

        
        


      </div>
    </div>
  );
}