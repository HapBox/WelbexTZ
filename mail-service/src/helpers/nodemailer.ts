import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: 'smtp-mail.outlook.com',
  port: 587,
  secure: false,
  tls: {
    ciphers:'SSLv3'
 },
  auth: {
    user: 'matyashnotests@outlook.com',
    pass: 'myToDojs12',
  },
});
