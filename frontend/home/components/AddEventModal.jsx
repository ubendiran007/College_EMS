import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus } from 'lucide-react';

const AddEventModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    type: 'Workshop',
    date: '',
    venue: '',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const eventId = `EVT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    
    const newEvent = {
      id: eventId,
      event: {
        id: eventId,
        title: formData.title,
        department: formData.department,
        organizer: formData.department,
        type: formData.type,
        date: formData.date,
        time: '09:00 AM - 05:00 PM',
        venue: formData.venue,
        status: 'Completed',
        description: formData.description
      },
      brochure: { filename: '', size: '', pages: 0, downloadUrl: '#' },
      schedule: [],
      registration: { total: 0, categories: { students: 0, faculty: 0, external: 0 }, period: '', mode: 'Online' },
      attendance: { total: 0, percentage: 0, verified: false, uploadDate: new Date().toISOString() },
      gallery: [],
      resourcePersons: [],
      participantFeedback: { totalResponses: 0, responseRate: 0, satisfaction: 0, ratings: [], testimonials: [] },
      guestFeedback: [],
      eventReport: { participants: 0, sessions: 0, completionRate: 0, satisfaction: 0, executiveSummary: '', keyOutcomes: [], recommendations: [], publishDate: new Date().toISOString() },
      certificates: { template: '', issued: 0, mediaArchive: { photos: 0, videos: 0, presentations: 0 } }
    };

    onAdd(newEvent);
    setFormData({ title: '', department: '', type: 'Workshop', date: '', venue: '', description: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Add New Event</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Title *</label>
              <input
                type="text"
                required
                className="input-field"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Advanced Machine Learning Workshop"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
              <input
                type="text"
                required
                className="input-field"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="e.g., Department of Computer Science"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Type *</label>
                <select
                  required
                  className="input-field"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="Workshop">Workshop</option>
                  <option value="Seminar">Seminar</option>
                  <option value="Conference">Conference</option>
                  <option value="Competition">Competition</option>
                  <option value="Webinar">Webinar</option>
                  <option value="Training">Training</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Date *</label>
                <input
                  type="date"
                  required
                  className="input-field"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Venue *</label>
              <input
                type="text"
                required
                className="input-field"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                placeholder="e.g., Seminar Hall, Block A"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea
                required
                rows="3"
                className="input-field"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the event..."
              />
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t">
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Event
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddEventModal;
