import logo from '../assets/logo.png';
import basket from '../assets/basket.png';

export default function LeftLogin() {
    return (
        <div className = "min-h-screen content-center flex flex-col bg-[#9C6B98] container rounded-xl text-center gap-2 items-center justify-center" >
        
              <img src ={logo} 
              alt="PantryHub Logo"  
              className="absolute top-3 left-3 object-contain w-20 h-20" />
              <h1 className= "text-white text-3xl font-bold mb-6">Welcome to PantryHub!</h1>
              <h2 className = "text-white text-lg font-semibold mb-6"> A recipe for responsibility.</h2>
                <img src={basket} alt="Basket" className="object-contain max-w-[300px] mb-6" />
        </div>
    )
    
}