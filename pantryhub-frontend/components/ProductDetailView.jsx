import { useState } from "react"; 
import { FaMinus, FaPlus } from "react-icons/fa";
import SearchBar from "./SearchBar";

const sampleProduct = {
  id: 1,
  name: "Chocolate Cake",
  description: "Chocolate cake from Awfully Chocolate.",
  expiry_date: "08/07/25",
  imageUrl: "Desktop/PantryHub/pantryhub-frontend/uploads/chocolatecake.jpeg",
  quantity: 1
};


export default function ProductView() {
    const[quantity, setQuantity] = useState(sampleProduct.quantity);

    const incrementQuantity = () => setQuantity(quantity +1);
    const decrementQuantity = () => setQuantity(Math.max(1, quantity -1));

    return (
        <>
            <SearchBar />

            {/* left col */}
            <div className = "flex flex-col items-center p-6 space-y-6">
                <div className="w-full max-w-md">
                    <img src={sampleProduct.imageUrl} alt={sampleProduct.name} className="w-full h-auto rounded-lg" />
                </div>

                {/* right col */ }
                <div className = "flex flex-col items-start space-y-4">
                    <h2 className="text-2xl font-semibold">{sampleProduct.name}</h2>
                    <p className="text-gray-600">{sampleProduct.description}</p>
                    <p className="font-bold">Expiry Date: {sampleProduct.expiry_date}</p>
                </div>

                {/* quantity button */}

                <div className= "flex items-center space-x-2">
                    <button onClick= {decrementQuantity} className= "bg-gray-200 p-2 rounded">
                        <FaMinus />
                    </button>
                    <span>{quantity}</span>

                    <button onClick={incrementQuantity} className= "bg-gray-200 p-2 rounded">
                        <FaPlus />
                    </button>
                </div>

                {/*remove n offer */}
                <div className = "flex space-x-4 mt-4">
                    <button className="bg-red-500 text-white py-2 px-4 rounded">Remove</button>
                    <button className="bg-green-500 text-white py-2 px-4 rounded">Offer on Marketplace</button>
                </div>

                <button className="mt-4 underline text-blue-500">Edit Item Information</button>
            </div>

        </>

    );
}
