import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPrograms, getSpeakers, createProgram, updateProgram, deleteProgram } from '../../utils/api';

function AdminPrograms() {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState([]);
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    title: '',
    day: 'Day 1',
    time: '',
    speaker_id: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [programsRes, speakersRes] = await Promise.all([getPrograms(), getSpeakers()]);
      // Programs come grouped by day
      const allPrograms = [
        ...(programsRes.data.day1 || []).map(p => ({ ...p, day: 'Day 1' })),
        ...(programsRes.data.day2 || []).map(p => ({ ...p, day: 'Day 2' })),
        ...(programsRes.data.day3 || []).map(p => ({ ...p, day: 'Day 3' })),
      ];
      setPrograms(allPrograms);
      setSpeakers(speakersRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editMode) {
        await updateProgram(formData.id, formData);
      } else {
        await createProgram(formData);
      }

      setShowForm(false);
      setFormData({ id: null, title: '', day: 'Day 1', time: '', speaker_id: '' });
      setEditMode(false);
      loadData();
    } catch (error) {
      console.error('Error saving program:', error);
      alert('Failed to save program');
    }
  };

  const handleEdit = (program) => {
    setFormData({
      id: program.id,
      title: program.title,
      day: program.day,
      time: program.time,
      speaker_id: program.speaker_id,
    });
    setEditMode(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this program?')) return;

    try {
      await deleteProgram(id);
      loadData();
    } catch (error) {
      console.error('Error deleting program:', error);
      alert('Failed to delete program');
    }
  };

  const groupedPrograms = {
    'Day 1': programs.filter((p) => p.day === 'Day 1'),
    'Day 2': programs.filter((p) => p.day === 'Day 2'),
    'Day 3': programs.filter((p) => p.day === 'Day 3'),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary">Manage Programs</h1>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowForm(!showForm);
                  setEditMode(false);
                  setFormData({ id: null, title: '', day: 'Day 1', time: '', speaker_id: '' });
                }}
                className="bg-green-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600"
              >
                {showForm ? 'Cancel' : 'Add Session'}
              </button>
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
        {/* Form */}
        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
            <h2 className="text-2xl font-bold text-accent mb-4">
              {editMode ? 'Edit Session' : 'Add New Session'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Day *</label>
                  <select
                    value={formData.day}
                    onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="Day 1">Day 1</option>
                    <option value="Day 2">Day 2</option>
                    <option value="Day 3">Day 3</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Time *</label>
                  <input
                    type="text"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    placeholder="09:00 - 10:00"
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Speaker *</label>
                  <select
                    value={formData.speaker_id}
                    onChange={(e) => setFormData({ ...formData, speaker_id: e.target.value })}
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="">Select Speaker</option>
                    {speakers.map((speaker) => (
                      <option key={speaker.id} value={speaker.id}>
                        {speaker.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-accent"
              >
                {editMode ? 'Update Session' : 'Add Session'}
              </button>
            </form>
          </div>
        )}

        {/* Programs by Day */}
        {loading ? (
          <div className="text-center py-8">Loading programs...</div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedPrograms).map(([day, dayPrograms]) => (
              <div key={day} className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-accent mb-4">{day}</h2>
                {dayPrograms.length === 0 ? (
                  <p className="text-gray-600">No sessions scheduled for this day</p>
                ) : (
                  <div className="space-y-4">
                    {dayPrograms.map((program) => (
                      <div
                        key={program.id}
                        className="border-l-4 border-primary pl-4 py-3 hover:bg-gray-50"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <span className="bg-primary text-white px-3 py-1 rounded font-semibold text-sm">
                                {program.time}
                              </span>
                              <h3 className="text-xl font-bold text-accent">{program.title}</h3>
                            </div>
                            {program.speaker && (
                              <p className="text-gray-700">
                                <strong>Speaker:</strong> {program.speaker.name} -{' '}
                                {program.speaker.job_title}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(program)}
                              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(program.id)}
                              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPrograms;
