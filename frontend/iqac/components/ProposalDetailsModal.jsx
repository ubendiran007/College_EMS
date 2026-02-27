import { useState } from 'react';
import { X } from 'lucide-react';

const ProposalDetailsModal = ({ proposal, onClose, onApprove, onReject, canApprove }) => {
  const [comments, setComments] = useState('');
  const [action, setAction] = useState(null);

  const handleSubmit = () => {
    if (action === 'approve') {
      onApprove(comments);
    } else if (action === 'reject') {
      onReject(comments);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Proposal Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">{proposal.eventTitle}</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Department:</span> {proposal.department}
              </div>
              <div>
                <span className="font-medium">Event Type:</span> {proposal.eventType}
              </div>
              <div>
                <span className="font-medium">Date:</span> {new Date(proposal.eventDate).toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium">Venue:</span> {proposal.venue}
              </div>
              <div>
                <span className="font-medium">Budget:</span> ₹{proposal.budget}
              </div>
              <div>
                <span className="font-medium">Status:</span> {proposal.status}
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Description</h4>
            <p className="text-gray-700">{proposal.description}</p>
          </div>

          {proposal.resourcePersons?.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Resource Persons</h4>
              {proposal.resourcePersons.map((person, i) => (
                <div key={i} className="bg-gray-50 p-3 rounded mb-2">
                  <p className="font-medium">{person.name}</p>
                  <p className="text-sm text-gray-600">{person.designation}, {person.organization}</p>
                </div>
              ))}
            </div>
          )}

          {proposal.approvalHistory?.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Approval History</h4>
              {proposal.approvalHistory.map((h, i) => (
                <div key={i} className="border-l-4 border-green-500 pl-4 py-2 mb-2">
                  <p className="font-medium">{h.approverRole.toUpperCase()} - {h.approver}</p>
                  <p className="text-sm text-gray-600">{h.action} on {new Date(h.date).toLocaleString()}</p>
                  {h.comments && <p className="text-sm italic">"{h.comments}"</p>}
                </div>
              ))}
            </div>
          )}

          {canApprove && (
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2">Your Decision</h4>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Add comments (optional)"
                className="w-full border rounded-lg p-3 mb-4"
                rows="3"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => { setAction('approve'); handleSubmit(); }}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => { setAction('reject'); handleSubmit(); }}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProposalDetailsModal;
