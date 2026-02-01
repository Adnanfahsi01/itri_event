import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getReservations, deleteReservation } from '../../utils/api';

function AdminReservations() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    day: '',
    role: '',
    search: '',
  });

  useEffect(() => {
    loadReservations();
  }, [filters]);

  const loadReservations = async () => {
    try {
      const response = await getReservations(filters);
      setReservations(response.data || []);
    } catch (error) {
      console.error('Error loading reservations:', error);
      if (error.response?.status === 401) {
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this reservation?')) return;

    try {
      await deleteReservation(id);
      loadReservations();
    } catch (error) {
      console.error('Error deleting reservation:', error);
      alert('Failed to delete reservation');
    }
  };

  const handleExportToSheets = () => {
    // Simple CSV export
    const csv = [
      ['Name', 'Email', 'Phone', 'Role', 'Institution', 'Days', 'Seats', 'Ticket Code', 'Status'],
      ...reservations.map((r) => [
        `${r.first_name} ${r.last_name}`,
        r.email,
        r.phone,
        r.role === 'student' ? 'Étudiant' : 'Employé',
        r.institution_name || 'N/A',
        r.days?.map(d => d === 'day1' ? 'Jour 1' : d === 'day2' ? 'Jour 2' : 'Jour 3').join(' + ') || 'N/A',
        r.seat_numbers?.map(s => s.seat).join(', ') || 'N/A',
        r.ticket_code || 'N/A',
        r.is_used ? 'Utilisé' : 'Non utilisé',
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reservations.csv';
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary">Manage Reservations</h1>
            <Link
              to="/admin/dashboard"
              className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-accent"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Filter by Day</label>
              <select
                value={filters.day}
                onChange={(e) => setFilters({ ...filters, day: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="">All Days</option>
                <option value="day1">Jour 1</option>
                <option value="day2">Jour 2</option>
                <option value="day3">Jour 3</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Filter by Role</label>
              <select
                value={filters.role}
                onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="">All Roles</option>
                <option value="student">Student</option>
                <option value="employee">Employee</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Search</label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Name or email..."
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={handleExportToSheets}
                className="w-full bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600"
              >
                Export to CSV
              </button>
            </div>
          </div>
        </div>

        {/* Reservations Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left py-4 px-4">Name</th>
                <th className="text-left py-4 px-4">Email</th>
                <th className="text-left py-4 px-4">Phone</th>
                <th className="text-left py-4 px-4">Role</th>
                <th className="text-left py-4 px-4">Days</th>
                <th className="text-left py-4 px-4">Seats</th>
                <th className="text-left py-4 px-4">Ticket</th>
                <th className="text-left py-4 px-4">Status</th>
                <th className="text-left py-4 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center py-8">
                    Loading...
                  </td>
                </tr>
              ) : reservations.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-8 text-gray-600">
                    No reservations found
                  </td>
                </tr>
              ) : (
                reservations.map((reservation) => (
                  <tr key={reservation.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4 font-semibold">
                      {reservation.first_name} {reservation.last_name}
                    </td>
                    <td className="py-4 px-4">{reservation.email}</td>
                    <td className="py-4 px-4">{reservation.phone}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          reservation.role === 'student'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {reservation.role === 'student' ? 'Étudiant' : 'Employé'}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-semibold">
                      {reservation.days?.map(d => d === 'day1' ? 'J1' : d === 'day2' ? 'J2' : 'J3').join(', ') || 'N/A'}
                    </td>
                    <td className="py-4 px-4 font-bold text-primary">
                      {reservation.seat_numbers?.map(s => s.seat).join(', ') || 'N/A'}
                    </td>
                    <td className="py-4 px-4 font-mono text-sm">
                      {reservation.ticket_code || 'N/A'}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          reservation.is_used
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {reservation.is_used ? 'Utilisé' : 'Non utilisé'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleDelete(reservation.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminReservations;
