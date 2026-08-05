export const sendEmailJS = async ({ to_email, subject, message }) => {
  try {
    const serviceId = process.env.EMAILJS_SERVICE_ID;
    const templateId = process.env.EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.EMAILJS_PUBLIC_KEY;
    const privateKey = process.env.EMAILJS_PRIVATE_KEY; // Optional but recommended

    if (!serviceId || !templateId || !publicKey) {
      console.warn('EmailJS environment variables are not set. Skipping email send.');
      return false;
    }

    const payload = {
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      accessToken: privateKey,
      template_params: {
        to_email,
        subject,
        message,
      },
    };

    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      console.log(`Email successfully sent to ${to_email}`);
      return true;
    } else {
      const errorText = await response.text();
      console.error('EmailJS Error:', errorText);
      return false;
    }
  } catch (error) {
    console.error('Failed to send email via EmailJS:', error);
    return false;
  }
};
