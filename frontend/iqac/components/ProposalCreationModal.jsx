import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { X, Upload, Calendar, Users, MapPin, FileText, Image, Coffee, Plane, Hotel, Wifi, Mic, CheckCircle2, Info, Sparkles, AlertCircle } from 'lucide-react';

const ProposalCreationModal = ({ onClose, onSubmit }) => {
  const [step, setStep] = useState(1);
  const formScrollRef = useRef(null);
  const [validationErrors, setValidationErrors] = useState({});
  const fieldRefs = useRef({});
  const [formData, setFormData] = useState({
    title: '', eventType: 'workshop', department: '', proposedDate: '', venue: '', expectedParticipants: '', budget: '', objective: '', description: '', resourcePersons: '', requestLetter: null,
    mediaRequirements: { poster: false, brochure: false, photos: false, videos: false, certificates: false },
    foodRefreshment: { required: false, isVIP: false, isGuest: false, vipCount: '', guestCount: '', breakfast: false, lunch: false, teaBreak: false, dinner: false, count: '' },
    guestTravel: { required: false, mode: 'flight', from: '', to: '', guestCount: '' },
    guestAccommodation: { required: false, hotelType: '3star', rooms: '', nights: '' },
    itSupport: { required: false, venue: '', desktops: '', lan: false, wifi: false, users: '' },
    audioVideoSupport: { required: false, venue: '', microphones: '', displays: '', speakers: false, projector: false }
  });

  const steps = [
    { num: 1, title: 'Basic Info', icon: FileText, desc: 'Event details', color: 'from-blue-500 to-cyan-500' },
    { num: 2, title: 'Description', icon: Info, desc: 'Objectives & budget', color: 'from-purple-500 to-pink-500' },
    { num: 3, title: 'Requirements', icon: Coffee, desc: 'Media, food & travel', color: 'from-orange-500 to-amber-500' },
    { num: 4, title: 'Technical', icon: Wifi, desc: 'IT & AV support', color: 'from-green-500 to-emerald-500' },
    { num: 5, title: 'Review', icon: CheckCircle2, desc: 'Confirm details', color: 'from-indigo-500 to-purple-500' }
  ];

  const handleSubmit = (e) => { 
    e.preventDefault(); 
    e.stopPropagation(); 
    onSubmit(formData); 
  };
  
  const validateStep = () => {
    const errors = {};
    let firstErrorField = null;
    
    if (step === 1) {
      if (!formData.title) { errors.title = true; if (!firstErrorField) firstErrorField = 'title'; }
      if (!formData.eventType) { errors.eventType = true; if (!firstErrorField) firstErrorField = 'eventType'; }
      if (!formData.department) { errors.department = true; if (!firstErrorField) firstErrorField = 'department'; }
      if (!formData.proposedDate) { errors.proposedDate = true; if (!firstErrorField) firstErrorField = 'proposedDate'; }
      if (!formData.venue) { errors.venue = true; if (!firstErrorField) firstErrorField = 'venue'; }
    }
    if (step === 2) {
      if (!formData.expectedParticipants) { errors.expectedParticipants = true; if (!firstErrorField) firstErrorField = 'expectedParticipants'; }
      if (!formData.budget) { errors.budget = true; if (!firstErrorField) firstErrorField = 'budget'; }
      if (!formData.objective) { errors.objective = true; if (!firstErrorField) firstErrorField = 'objective'; }
      if (!formData.description) { errors.description = true; if (!firstErrorField) firstErrorField = 'description'; }
    }
    
    setValidationErrors(errors);
    
    if (firstErrorField && fieldRefs.current[firstErrorField]) {
      fieldRefs.current[firstErrorField].scrollIntoView({ behavior: 'smooth', block: 'center' });
      fieldRefs.current[firstErrorField].focus();
    }
    
    return Object.keys(errors).length === 0;
  };
  
  const nextStep = () => { 
    if (validateStep()) {
      setStep(step + 1);
      setValidationErrors({});
      if (formScrollRef.current) {
        formScrollRef.current.scrollTop = 0;
      }
    }
  };
  
  const prevStep = () => { 
    setStep(step - 1);
    if (formScrollRef.current) {
      formScrollRef.current.scrollTop = 0;
    }
  };

  useEffect(() => {
    if (formScrollRef.current) {
      formScrollRef.current.scrollTop = 0;
    }
  }, [step]);

  return (
    <AnimatePresence>
      <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" />

          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="min-h-screen px-4 flex items-center justify-center">
              <motion.div initial={{ opacity: 0, scale: 0.9, y: 100 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 100 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-6xl my-8">
                <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5" />
              <div className="relative">
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 z-10 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-lg">
                        <Sparkles className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-black text-white drop-shadow-lg">Create Event Proposal</h2>
                        <p className="text-blue-100 mt-1 font-semibold">Step {step} of 5 • {steps[step-1].desc}</p>
                      </div>
                    </div>
                    <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} onClick={onClose} className="p-3 bg-white/20 hover:bg-white/30 backdrop-blur-xl rounded-2xl transition-all shadow-lg">
                      <X className="w-6 h-6 text-white" />
                    </motion.button>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    {steps.map((s) => {
                      const Icon = s.icon;
                      const isActive = step >= s.num;
                      const isCurrent = step === s.num;
                      return (
                        <div key={s.num} className="flex items-center flex-1">
                          <div className="relative">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold transition-all shadow-lg ${isActive ? `bg-gradient-to-br ${s.color} text-white` : 'bg-white/20 text-white/50'}`}>
                              {step > s.num ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                            </div>
                            <div className="text-center mt-2">
                              <p className="text-xs font-bold text-white drop-shadow">{s.title}</p>
                            </div>
                          </div>
                          {s.num < 5 && (
                            <div className="flex-1 mx-2">
                              <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: step > s.num ? '100%' : '0%' }} transition={{ duration: 0.5 }} className={`h-full bg-gradient-to-r ${s.color}`} />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()} ref={formScrollRef} className="p-6 space-y-6 max-h-[calc(95vh-200px)] overflow-y-auto">
                  {step === 1 && (
                    <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-6">
                      <motion.div whileHover={{ scale: 1.02 }} className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white to-blue-50 p-8 shadow-xl border-2 border-blue-200">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full -mr-16 -mt-16" />
                        <label className="block text-lg font-black text-gray-900 mb-4 flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                            <FileText className="w-6 h-6 text-white" />
                          </div>
                          Event Title *
                        </label>
                        <input type="text" required ref={el => fieldRefs.current['title'] = el} value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className={`w-full px-6 py-5 rounded-2xl border-3 focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-xl font-bold bg-white shadow-inner ${validationErrors.title ? 'border-red-500 animate-pulse' : 'border-blue-300'}`} placeholder="e.g., AI & Machine Learning Workshop" />
                      </motion.div>

                      <div className="grid grid-cols-2 gap-6">
                        <motion.div whileHover={{ scale: 1.02 }} className="rounded-3xl bg-gradient-to-br from-white to-purple-50 p-8 shadow-xl border-2 border-purple-200">
                          <label className="block text-lg font-black text-gray-900 mb-4">Event Type *</label>
                          <select ref={el => fieldRefs.current['eventType'] = el} value={formData.eventType} onChange={(e) => setFormData({...formData, eventType: e.target.value})} className={`w-full px-6 py-5 rounded-2xl border-3 focus:ring-4 focus:ring-purple-500/50 transition-all text-lg font-bold bg-white shadow-inner ${validationErrors.eventType ? 'border-red-500 animate-pulse' : 'border-purple-300'}`}>
                            <option value="workshop">🎓 Workshop</option>
                            <option value="seminar">📚 Seminar</option>
                            <option value="conference">🎤 Conference</option>
                            <option value="webinar">💻 Webinar</option>
                            <option value="competition">🏆 Competition</option>
                          </select>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.02 }} className="rounded-3xl bg-gradient-to-br from-white to-green-50 p-8 shadow-xl border-2 border-green-200">
                          <label className="block text-lg font-black text-gray-900 mb-4">Department *</label>
                          <input type="text" required ref={el => fieldRefs.current['department'] = el} value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} className={`w-full px-6 py-5 rounded-2xl border-3 focus:ring-4 focus:ring-green-500/50 transition-all text-lg font-bold bg-white shadow-inner ${validationErrors.department ? 'border-red-500 animate-pulse' : 'border-green-300'}`} placeholder="Computer Science" />
                        </motion.div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <motion.div whileHover={{ scale: 1.02 }} className="rounded-3xl bg-gradient-to-br from-white to-pink-50 p-8 shadow-xl border-2 border-pink-200">
                          <label className="block text-lg font-black text-gray-900 mb-4 flex items-center gap-3">
                            <Calendar className="w-6 h-6 text-pink-600" />
                            Proposed Date *
                          </label>
                          <input type="date" required ref={el => fieldRefs.current['proposedDate'] = el} value={formData.proposedDate} onChange={(e) => setFormData({...formData, proposedDate: e.target.value})} className={`w-full px-6 py-5 rounded-2xl border-3 focus:ring-4 focus:ring-pink-500/50 transition-all text-lg font-bold bg-white shadow-inner ${validationErrors.proposedDate ? 'border-red-500 animate-pulse' : 'border-pink-300'}`} />
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.02 }} className="rounded-3xl bg-gradient-to-br from-white to-orange-50 p-8 shadow-xl border-2 border-orange-200">
                          <label className="block text-lg font-black text-gray-900 mb-4 flex items-center gap-3">
                            <MapPin className="w-6 h-6 text-orange-600" />
                            Venue *
                          </label>
                          <input type="text" required ref={el => fieldRefs.current['venue'] = el} value={formData.venue} onChange={(e) => setFormData({...formData, venue: e.target.value})} className={`w-full px-6 py-5 rounded-2xl border-3 focus:ring-4 focus:ring-orange-500/50 transition-all text-lg font-bold bg-white shadow-inner ${validationErrors.venue ? 'border-red-500 animate-pulse' : 'border-orange-300'}`} placeholder="Main Auditorium" />
                        </motion.div>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <motion.div whileHover={{ scale: 1.02 }} className="rounded-3xl bg-gradient-to-br from-white to-blue-50 p-8 shadow-xl border-2 border-blue-200">
                          <label className="block text-lg font-black text-gray-900 mb-4 flex items-center gap-3">
                            <Users className="w-6 h-6 text-blue-600" />
                            Expected Participants *
                          </label>
                          <input type="number" required ref={el => fieldRefs.current['expectedParticipants'] = el} value={formData.expectedParticipants} onChange={(e) => setFormData({...formData, expectedParticipants: e.target.value})} min="1" className={`w-full px-6 py-5 rounded-2xl border-3 focus:ring-4 focus:ring-blue-500/50 transition-all text-xl font-bold bg-white shadow-inner ${validationErrors.expectedParticipants ? 'border-red-500 animate-pulse' : 'border-blue-300'}`} placeholder="150" />
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.02 }} className="rounded-3xl bg-gradient-to-br from-white to-green-50 p-8 shadow-xl border-2 border-green-200">
                          <label className="block text-lg font-black text-gray-900 mb-4">Budget (₹) *</label>
                          <input type="number" required ref={el => fieldRefs.current['budget'] = el} value={formData.budget} onChange={(e) => setFormData({...formData, budget: e.target.value})} min="1" className={`w-full px-6 py-5 rounded-2xl border-3 focus:ring-4 focus:ring-green-500/50 transition-all text-xl font-bold bg-white shadow-inner ${validationErrors.budget ? 'border-red-500 animate-pulse' : 'border-green-300'}`} placeholder="50000" />
                        </motion.div>
                      </div>
                      <motion.div whileHover={{ scale: 1.01 }} className="rounded-3xl bg-gradient-to-br from-white to-purple-50 p-8 shadow-xl border-2 border-purple-200">
                        <label className="block text-lg font-black text-gray-900 mb-4">Objective *</label>
                        <textarea required ref={el => fieldRefs.current['objective'] = el} value={formData.objective} onChange={(e) => setFormData({...formData, objective: e.target.value})} rows="4" className={`w-full px-6 py-5 rounded-2xl border-3 focus:ring-4 focus:ring-purple-500/50 transition-all text-lg font-medium bg-white shadow-inner ${validationErrors.objective ? 'border-red-500 animate-pulse' : 'border-purple-300'}`} placeholder="Main objective of the event..." />
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.01 }} className="rounded-3xl bg-gradient-to-br from-white to-indigo-50 p-8 shadow-xl border-2 border-indigo-200">
                        <label className="block text-lg font-black text-gray-900 mb-4">Description *</label>
                        <textarea required ref={el => fieldRefs.current['description'] = el} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows="5" className={`w-full px-6 py-5 rounded-2xl border-3 focus:ring-4 focus:ring-indigo-500/50 transition-all text-lg font-medium bg-white shadow-inner ${validationErrors.description ? 'border-red-500 animate-pulse' : 'border-indigo-300'}`} placeholder="Detailed description..." />
                      </motion.div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-6">
                      <motion.div whileHover={{ scale: 1.01 }} className="rounded-3xl bg-gradient-to-br from-white to-purple-50 p-8 shadow-xl border-2 border-purple-200">
                        <label className="block text-lg font-black text-gray-900 mb-5 flex items-center gap-3">
                          <Image className="w-7 h-7 text-purple-600" />
                          Media Requirements
                        </label>
                        <div className="grid grid-cols-3 gap-4">
                          {[{key:'poster',label:'📋 Poster',c:'blue'},{key:'brochure',label:'📄 Brochure',c:'green'},{key:'photos',label:'📸 Photos',c:'pink'},{key:'videos',label:'🎥 Videos',c:'orange'},{key:'certificates',label:'🏅 Certificates',c:'purple'}].map(item => (
                            <motion.label whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} key={item.key} className={`flex items-center gap-3 p-5 border-3 rounded-2xl cursor-pointer transition-all shadow-lg ${formData.mediaRequirements[item.key] ? `bg-gradient-to-br from-${item.c}-500 to-${item.c}-600 border-${item.c}-400 text-white` : 'bg-white border-gray-300 hover:border-blue-400'}`}>
                              <input type="checkbox" checked={formData.mediaRequirements[item.key]} onChange={(e) => setFormData({...formData, mediaRequirements: {...formData.mediaRequirements, [item.key]: e.target.checked}})} className="w-6 h-6 rounded-lg" />
                              <span className="font-bold text-base">{item.label}</span>
                            </motion.label>
                          ))}
                        </div>
                      </motion.div>

                      <motion.div whileHover={{ scale: 1.01 }} className="rounded-3xl bg-gradient-to-br from-white to-orange-50 p-8 shadow-xl border-2 border-orange-200">
                        <div className="flex items-center justify-between mb-5">
                          <label className="flex items-center gap-4 cursor-pointer">
                            <input type="checkbox" checked={formData.foodRefreshment.required} onChange={(e) => setFormData({...formData, foodRefreshment: {...formData.foodRefreshment, required: e.target.checked}})} className="w-7 h-7 rounded-xl" />
                            <Coffee className="w-7 h-7 text-orange-600" />
                            <span className="text-lg font-black text-gray-900">Food & Refreshment</span>
                          </label>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); setFormData({...formData, foodRefreshment: { required: false, isVIP: false, isGuest: false, vipCount: '', guestCount: '', breakfast: false, lunch: false, teaBreak: false, dinner: false, count: '' }}); }}
                              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-bold text-sm transition-colors"
                            >
                              None
                            </button>
                            <motion.label whileHover={{ scale: 1.05 }} className="flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-xl cursor-pointer border-2 border-orange-300">
                              <input type="checkbox" checked={formData.foodRefreshment.isVIP} onChange={(e) => setFormData({...formData, foodRefreshment: {...formData.foodRefreshment, isVIP: e.target.checked}})} className="w-5 h-5" />
                              <span className="font-bold text-sm">👑 VIP</span>
                            </motion.label>
                            <motion.label whileHover={{ scale: 1.05 }} className="flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-xl cursor-pointer border-2 border-orange-300">
                              <input type="checkbox" checked={formData.foodRefreshment.isGuest} onChange={(e) => setFormData({...formData, foodRefreshment: {...formData.foodRefreshment, isGuest: e.target.checked}})} className="w-5 h-5" />
                              <span className="font-bold text-sm">🎭 Guest</span>
                            </motion.label>
                          </div>
                        </div>
                        {formData.foodRefreshment.required && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4 pl-10 border-l-4 border-orange-400">
                            <div className="grid grid-cols-2 gap-3">
                              {['breakfast','lunch','teaBreak','dinner'].map(meal => (
                                <motion.label whileHover={{ scale: 1.05 }} key={meal} className="flex items-center gap-3 p-4 bg-orange-100 rounded-xl cursor-pointer border-2 border-orange-300">
                                  <input type="checkbox" checked={formData.foodRefreshment[meal]} onChange={(e) => setFormData({...formData, foodRefreshment: {...formData.foodRefreshment, [meal]: e.target.checked}})} className="w-5 h-5" />
                                  <span className="font-bold capitalize">{meal.replace(/([A-Z])/g,' $1')}</span>
                                </motion.label>
                              ))}
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                              {formData.foodRefreshment.isVIP && (
                                <input type="number" placeholder="VIP Count" value={formData.foodRefreshment.vipCount} onChange={(e) => setFormData({...formData, foodRefreshment: {...formData.foodRefreshment, vipCount: e.target.value}})} min="1" className="px-5 py-4 rounded-xl border-3 border-yellow-300 focus:ring-4 focus:ring-yellow-500/50 font-bold" />
                              )}
                              {formData.foodRefreshment.isGuest && (
                                <input type="number" placeholder="Guest Count" value={formData.foodRefreshment.guestCount} onChange={(e) => setFormData({...formData, foodRefreshment: {...formData.foodRefreshment, guestCount: e.target.value}})} min="1" className="px-5 py-4 rounded-xl border-3 border-purple-300 focus:ring-4 focus:ring-purple-500/50 font-bold" />
                              )}
                              <input type="number" placeholder="Total People" value={formData.foodRefreshment.count} onChange={(e) => setFormData({...formData, foodRefreshment: {...formData.foodRefreshment, count: e.target.value}})} min="1" className="px-5 py-4 rounded-xl border-3 border-orange-300 focus:ring-4 focus:ring-orange-500/50 font-bold" />
                            </div>
                          </motion.div>
                        )}
                      </motion.div>

                      <div className="grid grid-cols-2 gap-6">
                        <motion.div whileHover={{ scale: 1.01 }} className="rounded-3xl bg-gradient-to-br from-white to-blue-50 p-8 shadow-xl border-2 border-blue-200">
                          <div className="flex items-center justify-between mb-5">
                            <label className="flex items-center gap-4 cursor-pointer">
                              <input type="checkbox" checked={formData.guestTravel.required} onChange={(e) => setFormData({...formData, guestTravel: {...formData.guestTravel, required: e.target.checked}})} className="w-7 h-7 rounded-xl" />
                              <Plane className="w-7 h-7 text-blue-600" />
                              <span className="text-lg font-black text-gray-900">Guest Travel</span>
                            </label>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); setFormData({...formData, guestTravel: { required: false, mode: 'flight', from: '', to: '', guestCount: '' }}); }}
                              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-bold text-xs transition-colors"
                            >
                              None
                            </button>
                          </div>
                          {formData.guestTravel.required && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 pl-10 border-l-4 border-blue-400">
                              <select value={formData.guestTravel.mode} onChange={(e) => setFormData({...formData, guestTravel: {...formData.guestTravel, mode: e.target.value}})} className="w-full px-5 py-4 rounded-xl border-3 border-blue-300 focus:ring-4 focus:ring-blue-500/50 font-bold">
                                <option value="flight">✈️ Flight</option>
                                <option value="train">🚂 Train</option>
                                <option value="car">🚗 Car</option>
                              </select>
                              <input type="text" placeholder="From" value={formData.guestTravel.from} onChange={(e) => setFormData({...formData, guestTravel: {...formData.guestTravel, from: e.target.value}})} className="w-full px-5 py-4 rounded-xl border-3 border-blue-300 focus:ring-4 focus:ring-blue-500/50 font-bold" />
                              <input type="text" placeholder="To" value={formData.guestTravel.to} onChange={(e) => setFormData({...formData, guestTravel: {...formData.guestTravel, to: e.target.value}})} className="w-full px-5 py-4 rounded-xl border-3 border-blue-300 focus:ring-4 focus:ring-blue-500/50 font-bold" />
                            </motion.div>
                          )}
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.01 }} className="rounded-3xl bg-gradient-to-br from-white to-indigo-50 p-8 shadow-xl border-2 border-indigo-200">
                          <div className="flex items-center justify-between mb-5">
                            <label className="flex items-center gap-4 cursor-pointer">
                              <input type="checkbox" checked={formData.guestAccommodation.required} onChange={(e) => setFormData({...formData, guestAccommodation: {...formData.guestAccommodation, required: e.target.checked}})} className="w-7 h-7 rounded-xl" />
                              <Hotel className="w-7 h-7 text-indigo-600" />
                              <span className="text-lg font-black text-gray-900">Accommodation</span>
                            </label>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); setFormData({...formData, guestAccommodation: { required: false, hotelType: '3star', rooms: '', nights: '' }}); }}
                              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-bold text-xs transition-colors"
                            >
                              None
                            </button>
                          </div>
                          {formData.guestAccommodation.required && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 pl-10 border-l-4 border-indigo-400">
                              <select value={formData.guestAccommodation.hotelType} onChange={(e) => setFormData({...formData, guestAccommodation: {...formData.guestAccommodation, hotelType: e.target.value}})} className="w-full px-5 py-4 rounded-xl border-3 border-indigo-300 focus:ring-4 focus:ring-indigo-500/50 font-bold">
                                <option value="3star">⭐⭐⭐ 3 Star</option>
                                <option value="4star">⭐⭐⭐⭐ 4 Star</option>
                                <option value="5star">⭐⭐⭐⭐⭐ 5 Star</option>
                              </select>
                              <input type="number" placeholder="Rooms" value={formData.guestAccommodation.rooms} onChange={(e) => setFormData({...formData, guestAccommodation: {...formData.guestAccommodation, rooms: e.target.value}})} min="1" className="w-full px-5 py-4 rounded-xl border-3 border-indigo-300 focus:ring-4 focus:ring-indigo-500/50 font-bold" />
                            </motion.div>
                          )}
                        </motion.div>
                      </div>
                    </motion.div>
                  )}

                  {step === 4 && (
                    <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-6">
                      <motion.div whileHover={{ scale: 1.01 }} className="rounded-3xl bg-gradient-to-br from-white to-blue-50 p-8 shadow-xl border-2 border-blue-200">
                        <div className="flex items-center justify-between mb-5">
                          <label className="flex items-center gap-4 cursor-pointer">
                            <input type="checkbox" checked={formData.itSupport.required} onChange={(e) => setFormData({...formData, itSupport: {...formData.itSupport, required: e.target.checked}})} className="w-7 h-7 rounded-xl" />
                            <Wifi className="w-7 h-7 text-blue-600" />
                            <span className="text-lg font-black text-gray-900">IT Support</span>
                          </label>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setFormData({...formData, itSupport: { required: false, venue: '', desktops: '', lan: false, wifi: false, users: '' }}); }}
                            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-bold text-xs transition-colors"
                          >
                            None
                          </button>
                        </div>
                        {formData.itSupport.required && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 pl-10 border-l-4 border-blue-400">
                            <input type="text" placeholder="Venue" value={formData.itSupport.venue} onChange={(e) => setFormData({...formData, itSupport: {...formData.itSupport, venue: e.target.value}})} className="w-full px-5 py-4 rounded-xl border-3 border-blue-300 focus:ring-4 focus:ring-blue-500/50 font-bold" />
                            <input type="number" placeholder="Desktops" value={formData.itSupport.desktops} onChange={(e) => setFormData({...formData, itSupport: {...formData.itSupport, desktops: e.target.value}})} min="0" className="w-full px-5 py-4 rounded-xl border-3 border-blue-300 focus:ring-4 focus:ring-blue-500/50 font-bold" />
                            <div className="grid grid-cols-2 gap-3">
                              <motion.label whileHover={{ scale: 1.05 }} className="flex items-center gap-3 p-4 bg-blue-100 rounded-xl cursor-pointer border-2 border-blue-300">
                                <input type="checkbox" checked={formData.itSupport.lan} onChange={(e) => setFormData({...formData, itSupport: {...formData.itSupport, lan: e.target.checked}})} className="w-5 h-5" />
                                <span className="font-bold">🔌 LAN</span>
                              </motion.label>
                              <motion.label whileHover={{ scale: 1.05 }} className="flex items-center gap-3 p-4 bg-blue-100 rounded-xl cursor-pointer border-2 border-blue-300">
                                <input type="checkbox" checked={formData.itSupport.wifi} onChange={(e) => setFormData({...formData, itSupport: {...formData.itSupport, wifi: e.target.checked}})} className="w-5 h-5" />
                                <span className="font-bold">📶 WiFi</span>
                              </motion.label>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>

                      <motion.div whileHover={{ scale: 1.01 }} className="rounded-3xl bg-gradient-to-br from-white to-purple-50 p-8 shadow-xl border-2 border-purple-200">
                        <div className="flex items-center justify-between mb-5">
                          <label className="flex items-center gap-4 cursor-pointer">
                            <input type="checkbox" checked={formData.audioVideoSupport.required} onChange={(e) => setFormData({...formData, audioVideoSupport: {...formData.audioVideoSupport, required: e.target.checked}})} className="w-7 h-7 rounded-xl" />
                            <Mic className="w-7 h-7 text-purple-600" />
                            <span className="text-lg font-black text-gray-900">Audio/Video Support</span>
                          </label>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setFormData({...formData, audioVideoSupport: { required: false, venue: '', microphones: '', displays: '', speakers: false, projector: false }}); }}
                            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-bold text-xs transition-colors"
                          >
                            None
                          </button>
                        </div>
                        {formData.audioVideoSupport.required && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 pl-10 border-l-4 border-purple-400">
                            <input type="text" placeholder="Venue" value={formData.audioVideoSupport.venue} onChange={(e) => setFormData({...formData, audioVideoSupport: {...formData.audioVideoSupport, venue: e.target.value}})} className="w-full px-5 py-4 rounded-xl border-3 border-purple-300 focus:ring-4 focus:ring-purple-500/50 font-bold" />
                            <div className="grid grid-cols-2 gap-3">
                              <input type="number" placeholder="🎤 Microphones" value={formData.audioVideoSupport.microphones} onChange={(e) => setFormData({...formData, audioVideoSupport: {...formData.audioVideoSupport, microphones: e.target.value}})} min="0" className="px-5 py-4 rounded-xl border-3 border-purple-300 focus:ring-4 focus:ring-purple-500/50 font-bold" />
                              <input type="number" placeholder="🖥️ Displays" value={formData.audioVideoSupport.displays} onChange={(e) => setFormData({...formData, audioVideoSupport: {...formData.audioVideoSupport, displays: e.target.value}})} min="0" className="px-5 py-4 rounded-xl border-3 border-purple-300 focus:ring-4 focus:ring-purple-500/50 font-bold" />
                            </div>
                          </motion.div>
                        )}
                      </motion.div>

                      <motion.div whileHover={{ scale: 1.01 }} className="rounded-3xl bg-gradient-to-br from-white to-green-50 p-8 shadow-xl border-2 border-green-200">
                        <label className="block text-lg font-black text-gray-900 mb-4">Resource Persons</label>
                        <textarea value={formData.resourcePersons} onChange={(e) => setFormData({...formData, resourcePersons: e.target.value})} rows="3" className="w-full px-6 py-5 rounded-2xl border-3 border-green-300 focus:ring-4 focus:ring-green-500/50 transition-all text-lg font-medium bg-white shadow-inner" placeholder="List resource persons..." />
                      </motion.div>

                      <motion.div whileHover={{ scale: 1.01 }} className="rounded-3xl bg-gradient-to-br from-white to-indigo-50 p-8 shadow-xl border-2 border-indigo-200">
                        <label className="block text-lg font-black text-gray-900 mb-5 flex items-center gap-3">
                          <Upload className="w-7 h-7 text-indigo-600" />
                          Request Letter
                        </label>
                        <motion.label whileHover={{ scale: 1.02 }} className="block border-4 border-dashed border-indigo-400 rounded-3xl p-12 text-center hover:border-indigo-600 hover:bg-indigo-50 transition-all cursor-pointer bg-gradient-to-br from-indigo-50 to-purple-50">
                          <Upload className="w-20 h-20 text-indigo-500 mx-auto mb-5" />
                          <p className="text-lg font-black text-gray-900 mb-2">
                            {formData.requestLetter ? formData.requestLetter.name : 'Click to upload or drag and drop'}
                          </p>
                          <p className="text-sm text-gray-600 font-medium">PDF, DOC up to 10MB</p>
                          <input 
                            type="file" 
                            className="hidden" 
                            accept=".pdf,.doc,.docx" 
                            onChange={(e) => setFormData({...formData, requestLetter: e.target.files[0]})}
                          />
                        </motion.label>
                        {formData.requestLetter && (
                          <div className="mt-4 p-4 bg-green-100 border-2 border-green-300 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <CheckCircle2 className="w-6 h-6 text-green-600" />
                              <div>
                                <p className="font-bold text-gray-900">{formData.requestLetter.name}</p>
                                <p className="text-sm text-gray-600">{(formData.requestLetter.size / 1024).toFixed(2)} KB</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); setFormData({...formData, requestLetter: null}); }}
                              className="text-red-600 hover:text-red-800 font-bold"
                            >
                              Remove
                            </button>
                          </div>
                        )}
                      </motion.div>
                    </motion.div>
                  )}

                  {step === 5 && (
                    <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-300">
                        <h3 className="text-2xl font-black text-gray-900 mb-2 flex items-center gap-3">
                          <CheckCircle2 className="w-8 h-8 text-green-600" />
                          Review Your Proposal
                        </h3>
                        <p className="text-gray-700 font-medium">Please review all details before submitting</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white rounded-xl p-4 border-2 border-blue-200 shadow">
                          <label className="text-xs font-bold text-gray-500 uppercase">Event Title</label>
                          <p className="text-base font-bold text-gray-900 mt-1">{formData.title}</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 border-2 border-purple-200 shadow">
                          <label className="text-xs font-bold text-gray-500 uppercase">Event Type</label>
                          <p className="text-base font-bold text-gray-900 mt-1 capitalize">{formData.eventType}</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 border-2 border-green-200 shadow">
                          <label className="text-xs font-bold text-gray-500 uppercase">Department</label>
                          <p className="text-base font-bold text-gray-900 mt-1">{formData.department}</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 border-2 border-pink-200 shadow">
                          <label className="text-xs font-bold text-gray-500 uppercase">Date</label>
                          <p className="text-base font-bold text-gray-900 mt-1">{formData.proposedDate}</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 border-2 border-orange-200 shadow">
                          <label className="text-xs font-bold text-gray-500 uppercase">Venue</label>
                          <p className="text-base font-bold text-gray-900 mt-1">{formData.venue}</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 border-2 border-blue-200 shadow">
                          <label className="text-xs font-bold text-gray-500 uppercase">Participants</label>
                          <p className="text-base font-bold text-gray-900 mt-1">{formData.expectedParticipants}</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 border-2 border-green-200 shadow">
                          <label className="text-xs font-bold text-gray-500 uppercase">Budget</label>
                          <p className="text-base font-bold text-gray-900 mt-1">₹ {formData.budget}</p>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl p-4 border-2 border-purple-200 shadow">
                        <label className="text-xs font-bold text-gray-500 uppercase">Objective</label>
                        <p className="text-gray-900 mt-2 text-sm leading-relaxed">{formData.objective}</p>
                      </div>

                      {formData.description && (
                        <div className="bg-white rounded-xl p-4 border-2 border-indigo-200 shadow">
                          <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                          <p className="text-gray-900 mt-2 text-sm leading-relaxed">{formData.description}</p>
                        </div>
                      )}

                      {(formData.mediaRequirements.poster || formData.mediaRequirements.brochure || formData.mediaRequirements.photos || formData.mediaRequirements.videos || formData.mediaRequirements.certificates) && (
                        <div className="bg-white rounded-xl p-4 border-2 border-purple-200 shadow">
                          <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Media Requirements</label>
                          <div className="flex flex-wrap gap-2">
                            {formData.mediaRequirements.poster && <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">📋 Poster</span>}
                            {formData.mediaRequirements.brochure && <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">📄 Brochure</span>}
                            {formData.mediaRequirements.photos && <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-bold">📸 Photos</span>}
                            {formData.mediaRequirements.videos && <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">🎥 Videos</span>}
                            {formData.mediaRequirements.certificates && <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">🏅 Certificates</span>}
                          </div>
                        </div>
                      )}

                      {formData.foodRefreshment.required && (
                        <div className="bg-white rounded-xl p-4 border-2 border-orange-200 shadow">
                          <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Food & Refreshment</label>
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              {formData.foodRefreshment.isVIP && <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">👑 VIP: {formData.foodRefreshment.vipCount || 0}</span>}
                              {formData.foodRefreshment.isGuest && <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">🎭 Guest: {formData.foodRefreshment.guestCount || 0}</span>}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {formData.foodRefreshment.breakfast && <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">🍳 Breakfast</span>}
                              {formData.foodRefreshment.lunch && <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">🍱 Lunch</span>}
                              {formData.foodRefreshment.teaBreak && <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">☕ Tea Break</span>}
                              {formData.foodRefreshment.dinner && <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">🍽️ Dinner</span>}
                            </div>
                            {formData.foodRefreshment.count && <p className="text-gray-900 font-bold text-sm">Total: {formData.foodRefreshment.count} people</p>}
                          </div>
                        </div>
                      )}

                      {formData.guestTravel.required && (
                        <div className="bg-white rounded-xl p-4 border-2 border-blue-200 shadow">
                          <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Guest Travel</label>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <p className="text-gray-900"><span className="font-bold">Mode:</span> {formData.guestTravel.mode}</p>
                            <p className="text-gray-900"><span className="font-bold">Route:</span> {formData.guestTravel.from} → {formData.guestTravel.to}</p>
                            {formData.guestTravel.guestCount && <p className="text-gray-900"><span className="font-bold">Guests:</span> {formData.guestTravel.guestCount}</p>}
                          </div>
                        </div>
                      )}

                      {formData.guestAccommodation.required && (
                        <div className="bg-white rounded-xl p-4 border-2 border-indigo-200 shadow">
                          <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Guest Accommodation</label>
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <p className="text-gray-900"><span className="font-bold">Hotel:</span> {formData.guestAccommodation.hotelType}</p>
                            <p className="text-gray-900"><span className="font-bold">Rooms:</span> {formData.guestAccommodation.rooms}</p>
                            <p className="text-gray-900"><span className="font-bold">Nights:</span> {formData.guestAccommodation.nights}</p>
                          </div>
                        </div>
                      )}

                      {formData.itSupport.required && (
                        <div className="bg-white rounded-xl p-4 border-2 border-blue-200 shadow">
                          <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">IT Support</label>
                          <div className="space-y-2 text-sm">
                            <p className="text-gray-900"><span className="font-bold">Venue:</span> {formData.itSupport.venue}</p>
                            <p className="text-gray-900"><span className="font-bold">Desktops:</span> {formData.itSupport.desktops}</p>
                            <div className="flex gap-2">
                              {formData.itSupport.lan && <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">🔌 LAN</span>}
                              {formData.itSupport.wifi && <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">📶 WiFi</span>}
                            </div>
                          </div>
                        </div>
                      )}

                      {formData.audioVideoSupport.required && (
                        <div className="bg-white rounded-xl p-4 border-2 border-purple-200 shadow">
                          <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Audio/Video Support</label>
                          <div className="space-y-2 text-sm">
                            <p className="text-gray-900"><span className="font-bold">Venue:</span> {formData.audioVideoSupport.venue}</p>
                            <div className="grid grid-cols-2 gap-2">
                              <p className="text-gray-900"><span className="font-bold">Microphones:</span> {formData.audioVideoSupport.microphones}</p>
                              <p className="text-gray-900"><span className="font-bold">Displays:</span> {formData.audioVideoSupport.displays}</p>
                            </div>
                            <div className="flex gap-2">
                              {formData.audioVideoSupport.speakers && <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">🔊 Speakers</span>}
                              {formData.audioVideoSupport.projector && <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">📽️ Projector</span>}
                            </div>
                          </div>
                        </div>
                      )}

                      {formData.resourcePersons && (
                        <div className="bg-white rounded-xl p-4 border-2 border-green-200 shadow">
                          <label className="text-xs font-bold text-gray-500 uppercase">Resource Persons</label>
                          <p className="text-gray-900 mt-2 text-sm leading-relaxed">{formData.resourcePersons}</p>
                        </div>
                      )}

                      {formData.requestLetter && (
                        <div className="bg-white rounded-xl p-4 border-2 border-indigo-200 shadow">
                          <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Request Letter</label>
                          <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                            <div>
                              <p className="font-bold text-gray-900 text-sm">{formData.requestLetter.name}</p>
                              <p className="text-xs text-gray-600">{(formData.requestLetter.size / 1024).toFixed(2)} KB</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  <div className="flex justify-between p-6 border-t-2 border-gray-200 bg-gray-50" onClick={(e) => e.stopPropagation()}>
                    {step > 1 && (
                      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="button" onClick={(e) => { e.stopPropagation(); prevStep(); }} className="px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl font-bold text-base shadow-lg">
                        ← Previous
                      </motion.button>
                    )}
                    {step < 5 ? (
                      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="button" onClick={(e) => { e.stopPropagation(); nextStep(); }} className="ml-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-base shadow-lg">
                        Next →
                      </motion.button>
                    ) : (
                      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" className="ml-auto px-10 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold text-lg shadow-lg">
                        ✓ Submit Proposal
                      </motion.button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      </>
    </AnimatePresence>
  );
};

export default ProposalCreationModal;
