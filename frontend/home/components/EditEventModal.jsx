import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Upload, Plus, Trash2 } from 'lucide-react';

const EditEventModal = ({ isOpen, onClose, event, onUpdate }) => {
  const [formData, setFormData] = useState({
    event: {},
    schedule: [],
    registration: {},
    attendance: {},
    participantFeedback: { testimonials: [] },
    guestFeedback: [],
    eventReport: {}
  });

  useEffect(() => {
    if (event) {
      setFormData(event);
    }
  }, [event]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
    onClose();
  };

  const addScheduleItem = () => {
    setFormData({
      ...formData,
      schedule: [...formData.schedule, { time: '', topic: '', speaker: '', type: 'session' }]
    });
  };

  const updateScheduleItem = (index, field, value) => {
    const newSchedule = [...formData.schedule];
    newSchedule[index][field] = value;
    setFormData({ ...formData, schedule: newSchedule });
  };

  const removeScheduleItem = (index) => {
    const newSchedule = formData.schedule.filter((_, i) => i !== index);
    setFormData({ ...formData, schedule: newSchedule });
  };

  const addTestimonial = () => {
    setFormData({
      ...formData,
      participantFeedback: {
        ...formData.participantFeedback,
        testimonials: [...formData.participantFeedback.testimonials, { name: '', role: '', rating: 5, comment: '' }]
      }
    });
  };

  const updateTestimonial = (index, field, value) => {
    const newTestimonials = [...formData.participantFeedback.testimonials];
    newTestimonials[index][field] = value;
    setFormData({
      ...formData,
      participantFeedback: { ...formData.participantFeedback, testimonials: newTestimonials }
    });
  };

  const removeTestimonial = (index) => {
    const newTestimonials = formData.participantFeedback.testimonials.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      participantFeedback: { ...formData.participantFeedback, testimonials: newTestimonials }
    });
  };

  if (!isOpen || !event) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center z-10">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Edit Event Details</h2>
              <p className="text-sm text-gray-600 mt-1">{event.event.title}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Basic Info */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.event.title || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      event: { ...formData.event, title: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.event.department || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      event: { ...formData.event, department: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Venue</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.event.venue || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      event: { ...formData.event, venue: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    className="input-field"
                    value={formData.event.date?.split('T')[0] || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      event: { ...formData.event, date: e.target.value }
                    })}
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows="3"
                  className="input-field"
                  value={formData.event.description || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    event: { ...formData.event, description: e.target.value }
                  })}
                />
              </div>
            </div>

            {/* Registration & Attendance */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Registration & Attendance</h3>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Registered</label>
                  <input
                    type="number"
                    className="input-field"
                    value={formData.registration?.total || 0}
                    onChange={(e) => setFormData({
                      ...formData,
                      registration: { ...formData.registration, total: parseInt(e.target.value) }
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Students</label>
                  <input
                    type="number"
                    className="input-field"
                    value={formData.registration?.categories?.students || 0}
                    onChange={(e) => setFormData({
                      ...formData,
                      registration: {
                        ...formData.registration,
                        categories: { ...formData.registration.categories, students: parseInt(e.target.value) }
                      }
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Faculty</label>
                  <input
                    type="number"
                    className="input-field"
                    value={formData.registration?.categories?.faculty || 0}
                    onChange={(e) => setFormData({
                      ...formData,
                      registration: {
                        ...formData.registration,
                        categories: { ...formData.registration.categories, faculty: parseInt(e.target.value) }
                      }
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Attended</label>
                  <input
                    type="number"
                    className="input-field"
                    value={formData.attendance?.total || 0}
                    onChange={(e) => setFormData({
                      ...formData,
                      attendance: { ...formData.attendance, total: parseInt(e.target.value) }
                    })}
                  />
                </div>
              </div>
            </div>

            {/* Schedule */}
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Event Schedule</h3>
                <button type="button" onClick={addScheduleItem} className="btn-secondary text-sm flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Item
                </button>
              </div>
              <div className="space-y-3">
                {formData.schedule?.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-start">
                    <input
                      type="text"
                      placeholder="Time"
                      className="input-field col-span-2"
                      value={item.time}
                      onChange={(e) => updateScheduleItem(index, 'time', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Topic"
                      className="input-field col-span-4"
                      value={item.topic}
                      onChange={(e) => updateScheduleItem(index, 'topic', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Speaker"
                      className="input-field col-span-3"
                      value={item.speaker}
                      onChange={(e) => updateScheduleItem(index, 'speaker', e.target.value)}
                    />
                    <select
                      className="input-field col-span-2"
                      value={item.type}
                      onChange={(e) => updateScheduleItem(index, 'type', e.target.value)}
                    >
                      <option value="session">Session</option>
                      <option value="break">Break</option>
                      <option value="lab">Lab</option>
                      <option value="registration">Registration</option>
                      <option value="closing">Closing</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => removeScheduleItem(index)}
                      className="col-span-1 text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Participant Feedback */}
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Participant Testimonials</h3>
                <button type="button" onClick={addTestimonial} className="btn-secondary text-sm flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Testimonial
                </button>
              </div>
              <div className="space-y-4">
                {formData.participantFeedback?.testimonials?.map((testimonial, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-12 gap-3">
                      <input
                        type="text"
                        placeholder="Name"
                        className="input-field col-span-4"
                        value={testimonial.name}
                        onChange={(e) => updateTestimonial(index, 'name', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Role"
                        className="input-field col-span-4"
                        value={testimonial.role}
                        onChange={(e) => updateTestimonial(index, 'role', e.target.value)}
                      />
                      <select
                        className="input-field col-span-3"
                        value={testimonial.rating}
                        onChange={(e) => updateTestimonial(index, 'rating', parseInt(e.target.value))}
                      >
                        <option value="5">5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="2">2 Stars</option>
                        <option value="1">1 Star</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => removeTestimonial(index)}
                        className="col-span-1 text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <textarea
                        placeholder="Comment"
                        rows="2"
                        className="input-field col-span-12"
                        value={testimonial.comment}
                        onChange={(e) => updateTestimonial(index, 'comment', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Event Report */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Event Report</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Executive Summary</label>
                <textarea
                  rows="4"
                  className="input-field"
                  value={formData.eventReport?.executiveSummary || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    eventReport: { ...formData.eventReport, executiveSummary: e.target.value }
                  })}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-4 border-t sticky bottom-0 bg-white">
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EditEventModal;
