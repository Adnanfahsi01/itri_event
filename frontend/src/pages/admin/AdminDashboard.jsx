import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getStatistics, getReservations, getSpeakers, getPrograms } from '../../utils/api';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from 'recharts';

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [speakers, setSpeakers] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsRes, reservationsRes, speakersRes, programsRes] = await Promise.all([
        getStatistics(),
        getReservations(),
        getSpeakers(),
        getPrograms(),
      ]);

      setStats(statsRes.data);
      setReservations(reservationsRes.data || []);
      setSpeakers(speakersRes.data || []);
      
      // Programs come grouped by day
      const programData = programsRes.data;
      const allPrograms = [
        ...(programData.day1 || []),
        ...(programData.day2 || []),
        ...(programData.day3 || []),
      ];
      setPrograms(allPrograms);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      if (error.response?.status === 401) {
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-primary font-semibold">Loading dashboard...</div>
      </div>
    );
  }

  const COLORS = ['#006AD7', '#9AD9EA', '#21277B', '#5F83B1'];

  const roleData = [
    { name: 'Students', value: stats?.role_distribution?.students || 0 },
    { name: 'Employees', value: stats?.role_distribution?.employees || 0 },
  ];

  const dayData = [
    { name: 'Day 1', reservations: stats?.reservations_per_day?.day1 || 0 },
    { name: 'Day 2', reservations: stats?.reservations_per_day?.day2 || 0 },
    { name: 'Day 3', reservations: stats?.reservations_per_day?.day3 || 0 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary">Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Reservations</h3>
            <p className="text-4xl font-bold text-primary">{stats?.total_reservations || 0}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Occupancy Rate (Day 1)</h3>
            <p className="text-4xl font-bold text-accent">{stats?.seat_occupancy?.day1?.percentage || 0}%</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Speakers</h3>
            <p className="text-4xl font-bold text-primary">{speakers.length}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Sessions</h3>
            <p className="text-4xl font-bold text-accent">{programs.length}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Bar Chart */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-accent mb-4">Reservations by Day</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dayData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="reservations" fill="#006AD7" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-accent mb-4">Students vs Employees</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={roleData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {roleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Management Links */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Link
            to="/admin/reservations"
            className="bg-primary text-white p-6 rounded-lg shadow-lg hover:bg-accent transform hover:scale-105 transition-all text-center"
          >
            <h3 className="text-2xl font-bold mb-2">Manage Reservations</h3>
            <p>View and manage all event reservations</p>
          </Link>

          <Link
            to="/admin/speakers"
            className="bg-primary text-white p-6 rounded-lg shadow-lg hover:bg-accent transform hover:scale-105 transition-all text-center"
          >
            <h3 className="text-2xl font-bold mb-2">Manage Speakers</h3>
            <p>Add, edit, or remove speakers</p>
          </Link>

          <Link
            to="/admin/programs"
            className="bg-primary text-white p-6 rounded-lg shadow-lg hover:bg-accent transform hover:scale-105 transition-all text-center"
          >
            <h3 className="text-2xl font-bold mb-2">Manage Program</h3>
            <p>Create and update event schedule</p>
          </Link>

          <Link
            to="/admin/qr-scanner"
            className="bg-green-600 text-white p-6 rounded-lg shadow-lg hover:bg-green-700 transform hover:scale-105 transition-all text-center"
          >
            <h3 className="text-2xl font-bold mb-2">QR Scanner</h3>
            <p>Scan and validate tickets</p>
          </Link>
        </div>

        {/* Recent Reservations */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold text-accent mb-4">Recent Reservations</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-left py-3 px-4">Role</th>
                  <th className="text-left py-3 px-4">Day</th>
                  <th className="text-left py-3 px-4">Seat</th>
                </tr>
              </thead>
              <tbody>
                {reservations.slice(0, 5).map((reservation) => (
                  <tr key={reservation.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      {reservation.first_name} {reservation.last_name}
                    </td>
                    <td className="py-3 px-4">{reservation.email}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          reservation.role === 'Student'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {reservation.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">{reservation.day}</td>
                    <td className="py-3 px-4 font-semibold">{reservation.seat?.seat_number}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
