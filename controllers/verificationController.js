import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  logger: true,
  debug: true,
  auth: {
    user: 'taskplus.squad@gmail.com',
    pass: 'wtqm seou oiyg adxd',
  },
  tls: {
    rejectUnauthorized: true,
  },
});

async function sendVerificationEmail(userEmail, subject, text) {
  const mailOptions = {
    from: 'taskplus.squad@gmail.com',
    to: userEmail,
    subject: subject,
    text: `Your verification code: ${text}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  });
}

export { sendVerificationEmail };
