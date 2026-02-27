const nodemailer = require('nodemailer');

// Hardcoded approver emails
const APPROVER_EMAILS = {
  faculty: 'ubendiran2007@gmail.com',
  hod: 'ubendiranl2007@gmail.com',
  principal: 'vigneshasvj@gmail.com'
};

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

const sendApprovalEmail = async (approverRole, proposalData) => {
  const to = APPROVER_EMAILS[approverRole];
  if (!to) return;

  if (!process.env.EMAIL_PASSWORD || process.env.EMAIL_PASSWORD === 'your-app-password') {
    console.log(`⚠️ Email skipped (not configured): ${approverRole}`);
    return;
  }

  const subject = `Event Proposal Approval Required - ${proposalData.eventTitle}`;
  const html = `
    <h2>Event Proposal Approval Request</h2>
    <p>Dear ${approverRole.toUpperCase()},</p>
    <p>A new event proposal requires your approval:</p>
    <ul>
      <li><strong>Event Title:</strong> ${proposalData.eventTitle}</li>
      <li><strong>Department:</strong> ${proposalData.department}</li>
      <li><strong>Event Type:</strong> ${proposalData.eventType}</li>
      <li><strong>Date:</strong> ${new Date(proposalData.eventDate).toLocaleDateString()}</li>
    </ul>
    <p>Please login to review and approve/reject this proposal.</p>
  `;

  try {
    await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, html });
    console.log(`✅ Email sent to ${approverRole}: ${to}`);
  } catch (error) {
    console.error('❌ Email failed:', error.message);
  }
};

const sendStatusUpdateEmail = async (to, proposalData, status, comments) => {
  if (!process.env.EMAIL_PASSWORD || process.env.EMAIL_PASSWORD === 'your-app-password') {
    console.log(`⚠️ Email skipped (not configured)`);
    return;
  }

  const subject = `Event Proposal ${status} - ${proposalData.eventTitle}`;
  const html = `
    <h2>Event Proposal Status Update</h2>
    <p>Your event proposal has been ${status.toLowerCase()}:</p>
    <ul>
      <li><strong>Event Title:</strong> ${proposalData.eventTitle}</li>
      <li><strong>Status:</strong> ${status}</li>
      <li><strong>Comments:</strong> ${comments || 'No comments'}</li>
    </ul>
  `;

  try {
    await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, html });
  } catch (error) {
    console.error('❌ Email failed:', error.message);
  }
};

module.exports = { sendApprovalEmail, sendStatusUpdateEmail };
