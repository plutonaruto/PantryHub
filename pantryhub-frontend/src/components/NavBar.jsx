import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <nav>
      <Link to="/">Home</Link> |{" "}
      <Link to="/inventory">Inventory</Link> |{" "}
      <Link to="/marketplace">Marketplace</Link>
    </nav>
  );
}