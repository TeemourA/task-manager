import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'taxprogramming@gmail.com',
    subject: 'Thanks for joining in!',
    text: `Welcome to the app ${name}. Hope you enjoy our product!`,
  });
};

export const sendCancelationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'taxprogramming@gmail.com',
    subject: 'We are sorry you are leaving :(',
    text: `Please ${name}, tell us why you are leaving? We would like to get better and have you back as our client`,
  });
};
