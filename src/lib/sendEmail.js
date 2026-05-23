import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOTPEmail(toEmail, otpCode) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: toEmail,
      subject: 'Your OTP Code',
      html: `
        <div>
          <h2>Your verification code</h2>
          <p style="font-size:18px; font-weight:bold;">
            ${otpCode}
          </p>
          <p>This code expires in 5 minutes.</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return false;
    }

    console.log('Email sent:', data);
    return true;

  } catch (err) {
    console.error('Send email failed:', err);
    return false;
  }
}