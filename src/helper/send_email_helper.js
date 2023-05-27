import sgMail from "@sendgrid/mail";

export async function sendEmail(email, text) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const templates = {
    sample: "d-03dc3f8259aa4f4babd7d6980430360e",
  };

  const msg = {
    to: email, // Change to your recipient
    from: "no.reply.hkmedia@gmail.com", // Change to your verified sender
    template_id: templates["sample"],
    dynamic_template_data: {
      resetEmail: email,
      otpCode: text,
    },
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

// d-03dc3f8259aa4f4babd7d6980430360e
