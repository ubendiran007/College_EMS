import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams, Navigate } from 'react-router-dom';
import { Edit } from 'lucide-react';
import EventHero from '../components/EventHero';
import BrochureSection from '../components/BrochureSection';
import ScheduleTimeline from '../components/ScheduleTimeline';
import RegistrationStats from '../components/RegistrationStats';
import AttendanceSection from '../components/AttendanceSection';
import GeoTagPhotos from '../components/GeoTagPhotos';
import ResourcePersonProfile from '../components/ResourcePersonProfile';
import ParticipantFeedback from '../components/ParticipantFeedback';
import GuestFeedback from '../components/GuestFeedback';
import EventReport from '../components/EventReport';
import EditEventModal from '../components/EditEventModal';
import { eventsData, getEventById } from '../data/eventsData';

const EventPostPage = () => {
  const { id } = useParams();
  const [eventData, setEventData] = useState(getEventById(id));
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleUpdateEvent = (updatedEvent) => {
    setEventData(updatedEvent);
    // Update in eventsData array
    const index = eventsData.findIndex(e => e.id === id);
    if (index !== -1) {
      eventsData[index] = updatedEvent;
    }
  };

  if (!eventData) {
    return <Navigate to="/events" replace />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-gray-50"
    >
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white py-20 pt-32">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="section-container relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            TechFest 2024
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto"
          >
            National Level Technical Festival - Innovation, Competition, Excellence
          </motion.p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="section-container text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-900 mb-8"
          >
            Recent Event Showcase
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 mb-8 max-w-2xl mx-auto"
          >
            Explore our comprehensive post-event documentation and see how we maintain
            excellence in academic and technical events.
          </motion.p>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit Event Details
          </button>
        </div>
      </section>

      <EventHero event={eventData.event} />
      <BrochureSection brochure={eventData.brochure} />
      <ScheduleTimeline schedule={eventData.schedule} />
      <RegistrationStats registration={eventData.registration} />
      <AttendanceSection
        attendance={eventData.attendance}
        registration={eventData.registration}
      />
      <GeoTagPhotos photos={eventData.gallery} />
      <ResourcePersonProfile persons={eventData.resourcePersons} />
      <ParticipantFeedback feedback={eventData.participantFeedback} />
      <GuestFeedback guestFeedback={eventData.guestFeedback} />
      <EventReport report={eventData.eventReport} />

      <footer className="bg-gray-900 text-white py-8">
        <div className="section-container text-center">
          <p className="text-gray-300">
            © 2024 Thiagarajar College of Engineering. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Event Management System - Post Event Documentation
          </p>
        </div>
      </footer>

      <EditEventModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        event={eventData}
        onUpdate={handleUpdateEvent}
      />
    </motion.div>
  );
};

export default EventPostPage;