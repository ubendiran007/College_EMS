import { useState, useEffect } from 'react';
import { Calendar, Users, CheckCircle, Clock, XCircle, FileText } from 'lucide-react';
import { iqacAPI } from '../../shared/services/api';
import { useAuth } from '../../shared/context/AuthContext';
import ProposalCreationModal from '../components/ProposalCreationModal';
import ProposalDetailsModal from '../components/ProposalDetailsModal';
import PostEventDocumentationModal from '../components/PostEventDocumentationModal';

const IQACDashboardApproval = () => {
  const { user } = useAuth();
  const [proposals, setProposals] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDocModal, setShowDocModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      const data = await iqacAPI.getAllProposals();
      setProposals(data);
    } catch (error) {
      console.error('Error fetching proposals:', error);
    }
  };

  const handleDelete = async (proposalId) => {
    try {
      await iqacAPI.deleteProposal(proposalId);
      fetchProposals();
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting proposal:', error);
    }
  };

  const handleApproval = async (proposalId, action, comments) => {
    try {
      const statusMap = {
        faculty: action === 'approve' ? 'Faculty_Approved' : 'Rejected',
        hod: action === 'approve' ? 'HOD_Approved' : 'Rejected',
        principal: action === 'approve' ? 'Principal_Approved' : 'Rejected'
      };

      await iqacAPI.updateProposalStatus(proposalId, {
        status: statusMap[user.role],
        approver: user.name,
        approverRole: user.role,
        comments
      });

      fetchProposals();
      setShowDetailsModal(false);
    } catch (error) {
      console.error('Error updating proposal:', error);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Faculty_Approved': 'bg-blue-100 text-blue-800',
      'HOD_Approved': 'bg-indigo-100 text-indigo-800',
      'Principal_Approved': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800',
      'Completed': 'bg-gray-100 text-gray-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const canApprove = (proposal) => {
    if (proposal.status === 'Pending' && user.role === 'faculty') return true;
    if (proposal.status === 'Faculty_Approved' && user.role === 'hod') return true;
    if (proposal.status === 'HOD_Approved' && user.role === 'principal') return true;
    return false;
  };

  const filteredProposals = proposals.filter(p => {
    if (filter === 'all') return true;
    if (filter === 'pending') return canApprove(p);
    if (filter === 'approved') return p.status === 'Principal_Approved';
    if (filter === 'completed') return p.status === 'Completed';
    return true;
  });

  const stats = {
    total: proposals.length,
    pending: proposals.filter(p => ['Pending', 'Faculty_Approved', 'HOD_Approved'].includes(p.status)).length,
    approved: proposals.filter(p => p.status === 'Principal_Approved').length,
    completed: proposals.filter(p => p.status === 'Completed').length
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">IQAC Dashboard</h1>
          <button
            onClick={() => {
              console.log('Button clicked');
              setShowCreateModal(true);
              console.log('showCreateModal set to true');
            }}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium shadow-sm"
          >
            + Create New Proposal
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border">
            <FileText className="w-8 h-8 text-accent mb-2" />
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-sm text-gray-600">Total Proposals</p>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <Clock className="w-8 h-8 text-yellow-600 mb-2" />
            <p className="text-2xl font-bold">{stats.pending}</p>
            <p className="text-sm text-gray-600">Pending Approval</p>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <CheckCircle className="w-8 h-8 text-green-600 mb-2" />
            <p className="text-2xl font-bold">{stats.approved}</p>
            <p className="text-sm text-gray-600">Approved</p>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <Users className="w-8 h-8 text-blue-600 mb-2" />
            <p className="text-2xl font-bold">{stats.completed}</p>
            <p className="text-sm text-gray-600">Completed</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {['all', 'pending', 'approved', 'completed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg ${filter === f ? 'bg-accent text-white' : 'bg-white border'}`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredProposals.map(proposal => (
            <div key={proposal._id} className="bg-white p-6 rounded-lg border hover:shadow-md transition">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{proposal.eventTitle}</h3>
                  <div className="flex gap-4 text-sm text-gray-600 mb-3">
                    <span>📅 {new Date(proposal.eventDate).toLocaleDateString()}</span>
                    <span>🏢 {proposal.department}</span>
                    <span>📍 {proposal.venue}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(proposal.status)}`}>
                      {proposal.status.replace('_', ' ')}
                    </span>
                    {proposal.currentApprover && proposal.status !== 'Completed' && (
                      <span className="text-xs text-gray-500">
                        Awaiting: {proposal.currentApprover.toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setSelectedProposal(proposal); setShowDetailsModal(true); }}
                    className="px-4 py-2 border border-accent text-accent rounded-lg hover:bg-accent-light"
                  >
                    View Details
                  </button>
                  {proposal.status === 'Principal_Approved' && (
                    <button
                      onClick={() => { setSelectedProposal(proposal); setShowDocModal(true); }}
                      className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover"
                    >
                      Add Documentation
                    </button>
                  )}
                  <button
                    onClick={() => setDeleteConfirm(proposal)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {proposal.approvalHistory.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm font-medium mb-2">Approval Timeline:</p>
                  <div className="flex gap-4">
                    {proposal.approvalHistory.map((h, i) => (
                      <div key={i} className="text-xs">
                        <span className="font-medium">{h.approverRole.toUpperCase()}</span>
                        <span className={h.action.includes('Approved') ? 'text-green-600' : 'text-red-600'}>
                          {' '}✓ {h.action}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {showCreateModal && (
        <ProposalCreationModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={async (proposalData) => {
            try {
              const proposal = {
                proposalId: `PROP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
                eventTitle: proposalData.title,
                department: proposalData.department,
                eventType: proposalData.eventType,
                eventDate: proposalData.proposedDate,
                venue: proposalData.venue,
                description: proposalData.description,
                budget: proposalData.budget,
                resourcePersons: proposalData.resourcePersons ? [{ name: proposalData.resourcePersons }] : [],
                requirements: {
                  foodRefreshment: proposalData.foodRefreshment,
                  guestTravel: proposalData.guestTravel,
                  guestAccommodation: proposalData.guestAccommodation,
                  itSupport: proposalData.itSupport,
                  audioVideoSupport: proposalData.audioVideoSupport
                }
              };
              await iqacAPI.createProposal(proposal);
              fetchProposals();
              setShowCreateModal(false);
            } catch (error) {
              console.error('Error:', error);
              alert('Failed to create proposal');
            }
          }}
        />
      )}

      {showDetailsModal && selectedProposal && (
        <ProposalDetailsModal
          proposal={selectedProposal}
          onClose={() => setShowDetailsModal(false)}
          onApprove={(comments) => handleApproval(selectedProposal.proposalId, 'approve', comments)}
          onReject={(comments) => handleApproval(selectedProposal.proposalId, 'reject', comments)}
          canApprove={canApprove(selectedProposal)}
        />
      )}

      {showDocModal && selectedProposal && (
        <PostEventDocumentationModal
          proposal={selectedProposal}
          onClose={() => setShowDocModal(false)}
          onSubmit={() => { setShowDocModal(false); fetchProposals(); }}
        />
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Delete Proposal</h3>
            <p className="text-gray-700 mb-2">Are you sure you want to delete:</p>
            <p className="font-semibold text-gray-900 mb-6">"{deleteConfirm.eventTitle}"</p>
            <p className="text-sm text-red-600 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.proposalId)}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IQACDashboardApproval;
