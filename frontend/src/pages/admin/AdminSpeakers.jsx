import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSpeakers, createSpeaker, updateSpeaker, deleteSpeaker } from '../../utils/api';

function AdminSpeakers() {
  const navigate = useNavigate();
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    job_title: '',
    bio: '',
    photo: null,
  });

  useEffect(() => {
    loadSpeakers();
  }, []);

  const loadSpeakers = async () => {
    try {
      const response = await getSpeakers();
      setSpeakers(response.data || []);
    } catch (error) {
      console.error('Error loading speakers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editMode) {
        await updateSpeaker(formData.id, formData);
      } else {
        await createSpeaker(formData);
      }

      setShowForm(false);
      setFormData({ id: null, name: '', job_title: '', bio: '', photo: null });
      setEditMode(false);
      loadSpeakers();
    } catch (error) {
      console.error('Error saving speaker:', error);
      alert('Failed to save speaker');
    }
  };

  const handleEdit = (speaker) => {
    setFormData({
      id: speaker.id,
      name: speaker.name,
      job_title: speaker.job_title,
      bio: speaker.bio,
      photo: null,
    });
    setEditMode(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this speaker?')) return;

    try {
      await deleteSpeaker(id);
      loadSpeakers();
    } catch (error) {
      console.error('Error deleting speaker:', error);
      alert('Failed to delete speaker');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary">Manage Speakers</h1>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowForm(!showForm);
                  setEditMode(false);
                  setFormData({ id: null, name: '', job_title: '', bio: '', photo: null });
                }}
                className="bg-green-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600"
              >
                {showForm ? 'Cancel' : 'Add Speaker'}
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
              {editMode ? 'Edit Speaker' : 'Add New Speaker'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Job Title *</label>
                  <input
                    type="text"
                    value={formData.job_title}
                    onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Bio *</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  required
                  rows="4"
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, photo: e.target.files[0] })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <button
                type="submit"
                className="bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-accent"
              >
                {editMode ? 'Update Speaker' : 'Add Speaker'}
              </button>
            </form>
          </div>
        )}

        {/* Speakers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-3 text-center py-8">Loading speakers...</div>
          ) : speakers.length === 0 ? (
            <div className="col-span-3 text-center py-8 text-gray-600">
              No speakers added yet
            </div>
          ) : (
            speakers.map((speaker) => (
              <div key={speaker.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  {speaker.photo ? (
                    <img
                      src={`http://localhost:8000/storage/${speaker.photo}`}
                      alt={speaker.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-white text-5xl font-bold">
                      {speaker.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-accent mb-2">{speaker.name}</h3>
                  <p className="text-primary font-semibold mb-2">{speaker.job_title}</p>
                  <p className="text-gray-700 text-sm mb-4">{speaker.bio.substring(0, 100)}...</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(speaker)}
                      className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(speaker.id)}
                      className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminSpeakers;
