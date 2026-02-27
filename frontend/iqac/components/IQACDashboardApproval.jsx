import { useState, useEffect } from 'react';
import { Calendar, Users, CheckCircle, Clock, XCircle, FileText, TrendingUp, Award, Sparkles, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
      let newStatus;
      if (user.role === 'faculty') {
        newStatus = action === 'approve' ? 'Faculty_Approved' : 'Rejected';
      } else if (user.role === 'hod') {
        newStatus = action === 'approve' ? 'HOD_Approved' : 'Rejected';
      } else if (user.role === 'principal') {
        newStatus = action === 'approve' ? 'Principal_Approved' : 'Rejected';
      }

      await iqacAPI.updateProposalStatus(proposalId, {
        status: newStatus,
        approver: user.name,
        approverRole: user.role,
        comments
      });

      setShowDetailsModal(false);
      await fetchProposals();
      alert(`Proposal ${action === 'approve' ? 'approved' : 'rejected'} successfully!`);
    } catch (error) {
      console.error('Error updating proposal:', error);
      alert('Failed to update proposal status');
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
    // If created by student, faculty can approve when status is Pending
    if (proposal.createdByRole === 'student' && proposal.status === 'Pending' && user.role === 'faculty') return true;
    // If created by faculty, skip faculty approval - HOD approves when Pending
    if (proposal.createdByRole === 'faculty' && proposal.status === 'Pending' && user.role === 'hod') return true;
    // HOD approves after faculty approval
    if (proposal.status === 'Faculty_Approved' && user.role === 'hod') return true;
    // Principal approves after HOD approval
    if (proposal.status === 'HOD_Approved' && user.role === 'principal') return true;
    return false;
  };

  const hasUserApproved = (proposal) => {
    return proposal.approvalHistory?.some(h => h.approverRole === user.role);
  };

  const canCreate = user.role === 'student' || user.role === 'faculty';
  const canViewAll = user.role === 'faculty' || user.role === 'hod' || user.role === 'principal';
  const isCreator = (proposal) => proposal.createdBy === user.email || proposal.createdBy === user.name;

  const filteredProposals = proposals.filter(p => {
    // Students and Faculty can only see their own proposals
    if ((user.role === 'student' || user.role === 'faculty') && !isCreator(p)) return false;
    
    // Apply status filters
    if (filter === 'all') return true;
    if (filter === 'pending') return canApprove(p);
    if (filter === 'approved') return p.status === 'Principal_Approved';
    if (filter === 'completed') return p.status === 'Completed';
    return true;
  });

  // Calculate stats based on what user can see
  const visibleProposals = proposals.filter(p => {
    if ((user.role === 'student' || user.role === 'faculty') && !isCreator(p)) return false;
    return true;
  });

  const stats = {
    total: visibleProposals.length,
    pending: visibleProposals.filter(p => ['Pending', 'Faculty_Approved', 'HOD_Approved'].includes(p.status)).length,
    approved: visibleProposals.filter(p => p.status === 'Principal_Approved').length,
    completed: visibleProposals.filter(p => p.status === 'Completed').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 pt-20 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with gradient */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-4xl font-black text-gray-900 mb-2 flex items-center gap-3">
              <Sparkles className="w-10 h-10 text-accent" />
              IQAC Dashboard
            </h1>
            <p className="text-gray-600 font-medium">
              {user.role === 'student' ? 'Create and track your event proposals' :
               user.role === 'faculty' ? 'Create proposals and approve student requests' : 
               user.role === 'hod' ? 'Review and approve department proposals' :
               'Final approval and event management'}
            </p>
          </div>
          {canCreate && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="px-8 py-4 bg-gradient-to-r from-accent to-red-600 text-white rounded-xl hover:shadow-2xl hover:shadow-accent/50 font-bold text-lg transition-all duration-300 flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Create New Proposal
            </motion.button>
          )}
        </motion.div>

        {/* Stats Cards with animations */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-2xl border-2 border-blue-200 shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            <FileText className="w-10 h-10 text-accent mb-3" />
            <p className="text-4xl font-black text-gray-900">{stats.total}</p>
            <p className="text-sm font-semibold text-gray-600 mt-1">Total Proposals</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-gradient-to-br from-white to-yellow-50 p-6 rounded-2xl border-2 border-yellow-200 shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            <Clock className="w-10 h-10 text-yellow-600 mb-3" />
            <p className="text-4xl font-black text-gray-900">{stats.pending}</p>
            <p className="text-sm font-semibold text-gray-600 mt-1">Pending Approval</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-gradient-to-br from-white to-green-50 p-6 rounded-2xl border-2 border-green-200 shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            <CheckCircle className="w-10 h-10 text-green-600 mb-3" />
            <p className="text-4xl font-black text-gray-900">{stats.approved}</p>
            <p className="text-sm font-semibold text-gray-600 mt-1">Approved</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-gradient-to-br from-white to-purple-50 p-6 rounded-2xl border-2 border-purple-200 shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            <Award className="w-10 h-10 text-purple-600 mb-3" />
            <p className="text-4xl font-black text-gray-900">{stats.completed}</p>
            <p className="text-sm font-semibold text-gray-600 mt-1">Completed</p>
          </motion.div>
        </div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex gap-3 mb-8"
        >
          {['all', 'pending', 'approved', 'completed'].map((f, i) => (
            <motion.button
              key={f}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(f)}
              className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                filter === f
                  ? 'bg-gradient-to-r from-accent to-red-600 text-white shadow-lg shadow-accent/30'
                  : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-accent'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </motion.button>
          ))}
        </motion.div>

        {/* Proposals List */}
        <div className="space-y-6">
          <AnimatePresence>
            {filteredProposals.map((proposal, index) => (
              <motion.div
                key={proposal._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-white p-8 rounded-2xl border-2 border-gray-200 hover:border-accent hover:shadow-2xl transition-all duration-300"
              >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-2xl font-black text-gray-900 mb-3">{proposal.eventTitle}</h3>
                  <div className="flex gap-6 text-sm text-gray-600 mb-4">
                    <span className="flex items-center gap-2 font-medium">
                      <Calendar className="w-4 h-4 text-accent" />
                      {new Date(proposal.eventDate).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-2 font-medium">
                      <Users className="w-4 h-4 text-accent" />
                      {proposal.department}
                    </span>
                    <span className="flex items-center gap-2 font-medium">
                      <TrendingUp className="w-4 h-4 text-accent" />
                      {proposal.venue}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(proposal.status)}`}>
                      {proposal.status.replace('_', ' ')}
                    </span>
                    {hasUserApproved(proposal) && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border-2 border-green-300 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        You Approved
                      </span>
                    )}
                    {proposal.currentApprover && proposal.status !== 'Completed' && (
                      <span className="text-xs text-gray-500">
                        Awaiting: {proposal.currentApprover.toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-3 relative z-10">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { setSelectedProposal(proposal); setShowDetailsModal(true); }}
                    className="px-6 py-3 bg-white border-2 border-accent text-accent rounded-xl hover:bg-accent hover:text-white font-bold transition-all duration-300 flex items-center gap-2 shadow-md"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </motion.button>
                  {proposal.status === 'Principal_Approved' && (user.role === 'hod' || user.role === 'principal') && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => { setSelectedProposal(proposal); setShowDocModal(true); }}
                      className="px-6 py-3 bg-gradient-to-r from-accent to-red-600 text-white rounded-xl hover:shadow-xl font-bold transition-all duration-300 shadow-md"
                    >
                      Add Documentation
                    </motion.button>
                  )}
                  {(user.role === 'hod' || user.role === 'principal') && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setDeleteConfirm(proposal)}
                      className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 hover:shadow-xl font-bold transition-all duration-300 shadow-md"
                    >
                      Delete
                    </motion.button>
                  )}
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
            </motion.div>
          ))}
          </AnimatePresence>
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
                },
                createdBy: user.email,
                createdByName: user.name,
                createdByRole: user.role
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
