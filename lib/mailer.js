const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'okim1227@gmail.com',
    pass: 'mtsq amei wqwk zvmg',
  },
});

async function sendInvitationEmail(to, token) {
  const signinUrl = 'https://timetracking-webapp-9o41p4826-olivia-kims-projects-24fdab55.vercel.app/employee/signin';

  try {
    const info = await transporter.sendMail({
      from: '"Mercor Time Tracker" <okim1227@gmail.com>',
      to,
      subject: 'You have been invited to join Mercor Time Tracker!',
      html: `
        <p>Hello,</p>
        <p>You have been invited to join Mercor Time Tracker.</p>
        <p><strong>Step 1:</strong> Visit <a href="${signinUrl}">${signinUrl}</a></p>
        <p><strong>Step 2:</strong> Enter this verification token:</p>
        <p style="word-break: break-all;"><code>${token}</code></p>
      `,
    });

    console.log('Email sent to', to, 'Response:', info.response);
  } catch (error) {
    console.error('Failed to send email to', to, 'Error:', error.message);
    throw error; // rethrow so the route knows it failed
  }
}

module.exports = { sendInvitationEmail };
