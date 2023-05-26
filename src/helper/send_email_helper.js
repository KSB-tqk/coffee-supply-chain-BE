import sgMail from "@sendgrid/mail";

export async function sendEmail(email, subject, text) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: email, // Change to your recipient
    from: "no.reply.hkmedia@gmail.com", // Change to your verified sender
    subject: subject,
    text: text,
    html: "<strong>" + text + "</strong>",
  };
  const result = await sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
      return "Email sent";
    })
    .catch((error) => {
      console.error(error);
      return null;
    });
  return result;
}
