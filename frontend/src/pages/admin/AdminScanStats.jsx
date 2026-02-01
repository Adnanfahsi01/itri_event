import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

/**
 * AdminScanStats Component
 * Displays scanning statistics and analytics for the admin
 */
function AdminScanStats() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    fetchScanStats();
  }, [navigate]);

  const fetchScanStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/admin/login');
        return;
      }

      const response = await fetch('http://localhost:8000/api/scan-statistics', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching scan stats:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading scan statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-md">
          <div className="container mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-primary">Scan Statistics</h1>
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
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Error: {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary">Scan Statistics</h1>
            <div className="flex gap-4">
              <Link
                to="/admin/qr-scanner"
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700"
              >
                QR Scanner
              </Link>
              <Link
                to="/admin/dashboard"
                className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-accent"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="text-3xl font-bold text-primary">{stats.summary.total_reservations}</div>
            <div className="text-gray-600">Total Reservations</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="text-3xl font-bold text-green-600">{stats.summary.total_scanned}</div>
            <div className="text-gray-600">People Scanned</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="text-3xl font-bold text-blue-600">{stats.summary.total_scans}</div>
            <div className="text-gray-600">Total Scans</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="text-3xl font-bold text-accent">{stats.summary.scan_rate}%</div>
            <div className="text-gray-600">Scan Rate</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Scans Per Day Chart */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-accent mb-4">Scans Per Day (Last 7 Days)</h2>
            <div className="space-y-4">
              {stats.scans_per_day.map((day, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-20 text-sm text-gray-600">{formatDate(day.date)}</div>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 rounded-full h-4 relative">
                      <div 
                        className="bg-primary h-4 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.max((day.count / Math.max(...stats.scans_per_day.map(d => d.count))) * 100, 5)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-12 text-right text-sm font-semibold">{day.count}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Comparison Chart */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-accent mb-4">Reservations vs Scans</h2>
            <div className="space-y-6">
              <div className="text-center">
                <div className="relative w-32 h-32 mx-auto">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845
                         a 15.9155 15.9155 0 0 1 0 31.831
                         a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845
                         a 15.9155 15.9155 0 0 1 0 31.831
                         a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#059669"
                      strokeWidth="3"
                      strokeDasharray={`${stats.summary.scan_rate}, 100`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-700">{stats.summary.scan_rate}%</span>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  {stats.summary.total_scanned} out of {stats.summary.total_reservations} reservations scanned
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Scanned</span>
                  <span className="text-sm font-semibold text-green-600">{stats.summary.total_scanned}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Not Scanned</span>
                  <span className="text-sm font-semibold text-red-600">{stats.summary.total_reservations - stats.summary.total_scanned}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scanned Reservations Table */}
        <div className="bg-white rounded-lg shadow-lg mt-8">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-accent">Scanned Reservations</h2>
            <p className="text-gray-600 text-sm mt-1">Latest scanned tickets</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-700">Ticket Code</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Name</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Email</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Scan Count</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Last Scanned</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Days</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stats.scanned_reservations.length > 0 ? (
                  stats.scanned_reservations.map((reservation) => (
                    <tr key={reservation.id} className="hover:bg-gray-50">
                      <td className="p-4">
                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                          {reservation.ticket_code}
                        </span>
                      </td>
                      <td className="p-4">{reservation.full_name}</td>
                      <td className="p-4 text-sm text-gray-600">{reservation.email}</td>
                      <td className="p-4">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                          {reservation.scan_count}
                        </span>
                      </td>
                      <td className="p-4 text-sm">{formatDateTime(reservation.scanned_at)}</td>
                      <td className="p-4">
                        <div className="flex gap-1">
                          {reservation.days.map((day) => (
                            <span key={day} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                              {day === 'day1' ? 'Day 1' : day === 'day2' ? 'Day 2' : 'Day 3'}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-sm ${
                          reservation.is_used 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {reservation.is_used ? 'Used' : 'Valid'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-gray-500">
                      No scanned reservations yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminScanStats;