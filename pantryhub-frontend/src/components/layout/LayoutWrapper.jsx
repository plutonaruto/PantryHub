import Topbar from './Topbar';
import Navbar from '../Navbar'; 

export default function LayoutWrapper({ children }) {
  return (
    <div className="min-h-screen font-sans">
      <Navbar />
      <Topbar />
      <main className="p-6 bg-gray-50">{children}</main>
    </div>
  );
}
