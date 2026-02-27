import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Navigate } from 'react-router-dom';
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
import { eventAPI } from '../../shared/services/api';

const EventPostPage = () => {
  const { id } = useParams();
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const data = await eventAPI.getEventById(id);
      setEventData(data);
    } catch (error) {
      console.error('Error fetching event:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <p className="text-gray-600">Loading event...</p>
      </div>
    );
  }

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
            Event Documentation
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 mb-8 max-w-2xl mx-auto"
          >
            Comprehensive post-event documentation showcasing excellence in academic and technical events.
          </motion.p>
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
    </motion.div>
  );
};

export default EventPostPage;