import { useState, useEffect } from 'react';
import { getPrograms } from '../utils/api';

function Program() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState('Day 1');

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    try {
      const response = await getPrograms();
      // Response is grouped by day: { day1: [], day2: [], day3: [] }
      const allPrograms = [
        ...(response.data.day1 || []).map(p => ({ ...p, day: 'Day 1' })),
        ...(response.data.day2 || []).map(p => ({ ...p, day: 'Day 2' })),
        ...(response.data.day3 || []).map(p => ({ ...p, day: 'Day 3' })),
      ];
      setPrograms(allPrograms);
    } catch (error) {
      console.error('Error loading programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProgramsByDay = (day) => {
    return programs.filter((program) => program.day === day);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-primary font-semibold">Loading program...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 pt-32">
      {/* Header */}
      <div className="container mx-auto px-6 mb-40 text-center">
        <h1 className="text-5xl font-bold text-center text-accent mb-8">
          Event Program
        </h1>
        <p className="text-lg text-center text-gray-700 max-w-4xl mx-auto leading-relaxed">
          Explore our comprehensive 3-day program featuring workshops, keynotes, and
          networking sessions.
        </p>
      </div>

      {/* Day Selector */}
      <div className="container mx-auto px-6 mt-16 mb-20 flex justify-center">
        <div className="flex justify-center gap-6 flex-wrap">
          {['Day 1', 'Day 2', 'Day 3'].map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-10 py-4 rounded-lg font-bold text-lg transition-all ${
                selectedDay === day
                  ? 'bg-primary text-white shadow-lg transform scale-105'
                  : 'bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Program Schedule */}
      <div className="container mx-auto px-6 mt-16">
        {filterProgramsByDay(selectedDay).length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600">
              Program for {selectedDay} will be announced soon.
            </p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            {filterProgramsByDay(selectedDay).map((session) => (
              <div
                key={session.id}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transform hover:-translate-y-1 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  {/* Time */}
                  <div className="mb-4 md:mb-0">
                    <div className="inline-block bg-primary text-white px-4 py-2 rounded-lg font-bold">
                      {session.time}
                    </div>
                  </div>

                  {/* Session Details */}
                  <div className="flex-1 md:px-6">
                    <h3 className="text-2xl font-bold text-accent mb-2">
                      {session.title}
                    </h3>
                    {session.speaker && (
                      <div className="flex items-center text-gray-700">
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <span className="font-semibold">{session.speaker.name}</span>
                        <span className="mx-2">•</span>
                        <span className="text-primary">{session.speaker.job_title}</span>
                      </div>
                    )}
                  </div>

                  {/* Day Badge */}
                  <div className="mt-4 md:mt-0">
                    <span className="inline-block bg-secondary text-accent px-4 py-2 rounded-lg font-semibold">
                      {session.day}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Program;
