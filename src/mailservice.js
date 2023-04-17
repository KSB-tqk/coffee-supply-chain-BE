// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
import sgMail from "@sendgrid/mail";
sgMail.setApiKey(
  "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"
);
const msg = {
  to: "19521686@gm.uit.edu.vn", // Change to your recipient
  from: "linh05602@gmail.com", // Change to your verified sender
  subject: "Sending with SendGrid is Fun",
  text: "and easy to do anywhere, even with Node.js",
  html: "<strong>and easy to do anywhere, even with Node.js</strong>",
};
sgMail
  .send(msg)
  .then(() => {
    console.log("Email sent");
  })
  .catch((error) => {
    console.error(error);
  });
