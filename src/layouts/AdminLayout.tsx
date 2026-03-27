import { Outlet } from 'react-router-dom';

function AdminSidebar() {
  // TODO
  return null;
}

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-grow p-6">
        <Outlet />
      </main>
    </div>
  );
}
