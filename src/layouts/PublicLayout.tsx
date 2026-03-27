import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

function Footer() {
  // TODO
  return null;
}

function WhatsAppButton() {
  // TODO
  return null;
}

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow pt-24">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
