import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Calendar, Users, FileText, Image, CheckCircle } from 'lucide-react';
import { iqacAPI, eventAPI } from '../../shared/services/api';

const PostEventDocumentationModal = ({ isOpen, onClose, proposal }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    attendance: { total: 0, percentage: 0, verified: false },
    registration: { total: 0, categories: { students: 0, faculty: 0, external: 0 } },
    brochure: null,
    photos: [],
    schedule: [],
    participantFeedback: { totalResponses: 0, satisfaction: 0, testimonials: [] },
    guestFeedback: [],
    eventReport: { executiveSummary: '', keyOutcomes: [], recommendations: [] }
  });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Step 1: Convert proposal to completed event
      const result = await iqacAPI.completeProposal(proposal.proposalId, {
        postEventData: formData,
        createdBy: 'IQAC Admin'
      });

      const eventId = result.event.eventId;

      // Step 2: Upload brochure if provided
      if (formData.brochure) {
        await eventAPI.uploadBrochure(eventId, formData.brochure);
      }

      // Step 3: Upload photos if provided
      if (formData.photos.length > 0) {
        await eventAPI.uploadPhotos(eventId, formData.photos, {
          locations: formData.photos.map(p => p.location || ''),
          captions: formData.photos.map(p => p.caption || ''),
          titles: formData.photos.map(p => p.title || '')
        });
      }

      alert('Event documentation submitted successfully!');
      onClose();
    } catch (error) {
      console.error('Error submitting documentation:', error);
      alert('Failed to submit documentation');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Post-Event Documentation</h2>
              <p className="text-sm text-gray-600 mt-1">{proposal?.eventTitle}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Step 1: Attendance & Registration */}
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Attendance & Registration</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Registered
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={formData.registration.total}
                    onChange={(e) => setFormData({
                      ...formData,
                      registration: { ...formData.registration, total: parseInt(e.target.value) }
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Attended
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={formData.attendance.total}
                    onChange={(e) => setFormData({
                      ...formData,
                      attendance: { ...formData.attendance, total: parseInt(e.target.value) }
                    })}
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Upload Brochure */}
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Event Brochure</h3>
              </div>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setFormData({ ...formData, brochure: e.target.files[0] })}
                className="input-field"
              />
              {formData.brochure && (
                <p className="text-sm text-green-600 mt-2">✓ {formData.brochure.name}</p>
              )}
            </div>

            {/* Step 3: Upload Photos */}
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <Image className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Event Photos</h3>
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setFormData({ ...formData, photos: Array.from(e.target.files) })}
                className="input-field"
              />
              {formData.photos.length > 0 && (
                <p className="text-sm text-green-600 mt-2">✓ {formData.photos.length} photos selected</p>
              )}
            </div>

            {/* Step 4: Event Report */}
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Executive Summary</h3>
              </div>
              <textarea
                className="input-field"
                rows="4"
                placeholder="Write a brief summary of the event..."
                value={formData.eventReport.executiveSummary}
                onChange={(e) => setFormData({
                  ...formData,
                  eventReport: { ...formData.eventReport, executiveSummary: e.target.value }
                })}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-4 border-t">
              <button onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary flex items-center gap-2"
              >
                {loading ? (
                  <>Processing...</>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Submit Documentation
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PostEventDocumentationModal;
