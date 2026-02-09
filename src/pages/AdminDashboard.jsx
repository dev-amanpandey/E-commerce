import { useAuth } from '../context/AuthContext'

const AdminDashboard = () => {
  const { user } = useAuth()

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
      <p className="text-gray-700 mb-8">
        Welcome, <span className="font-semibold">{user?.name}</span>. This is a protected admin-only area.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-2">Orders Overview</h2>
          <p className="text-gray-600 text-sm">
            Here you could show recent orders, revenue stats, and order statuses.
          </p>
        </div>
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-2">Products</h2>
          <p className="text-gray-600 text-sm">
            Manage products, inventory levels, and pricing from this section.
          </p>
        </div>
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-2">Users</h2>
          <p className="text-gray-600 text-sm">
            View and manage customer accounts and permissions.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard


