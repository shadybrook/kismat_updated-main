// =============================================
// FILE: src/utils/email.ts
// Email notification system
// =============================================

const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY;
const FROM_EMAIL = 'onboarding@resend.dev'; // Change to findyourkismat@gmail.com after domain verification

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

async function sendEmail({ to, subject, html }: SendEmailParams) {
  if (!RESEND_API_KEY) {
    console.warn('⚠️ RESEND_API_KEY not configured - email not sent');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [to],
        subject,
        html,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to send email');
    }

    return { success: true, data };
  } catch (error: any) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
}

export async function sendConfirmationEmail(params: {
  to: string;
  userName: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  amount: number;
}) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Booking Confirmed!</h1>
      </div>
      
      <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none;">
        <p style="font-size: 16px; margin-bottom: 20px;">Hi <strong>${params.userName}</strong>,</p>
        
        <p style="font-size: 16px;">Your booking for <strong>${params.eventTitle}</strong> has been confirmed!</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #667eea;">
          <h3 style="margin-top: 0; color: #667eea;">📅 Event Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Date:</td>
              <td style="padding: 8px 0;">${params.eventDate}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Time:</td>
              <td style="padding: 8px 0;">${params.eventTime}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Location:</td>
              <td style="padding: 8px 0;">${params.eventLocation}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Amount Paid:</td>
              <td style="padding: 8px 0; color: #10b981;">₹${params.amount}</td>
            </tr>
          </table>
        </div>

        <p style="font-size: 16px; margin: 20px 0;">We'll send you a reminder on the morning of the event! 📱</p>
        
        <p style="font-size: 16px;">Looking forward to seeing you there! 🚀</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
          <p style="color: #6b7280; font-size: 14px; margin: 5px 0;">Questions? Reply to this email or contact us at</p>
          <p style="margin: 5px 0;">
            <a href="mailto:findyourkismat@gmail.com" style="color: #667eea; text-decoration: none; font-weight: bold;">findyourkismat@gmail.com</a>
          </p>
        </div>
      </div>
      
      <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
        <p>© 2025 Kismat. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: params.to,
    subject: `✅ Booking Confirmed: ${params.eventTitle}`,
    html,
  });
}

export async function sendReminderEmail(params: {
  to: string;
  userName: string;
  eventTitle: string;
  eventTime: string;
  eventLocation: string;
}) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">⏰ Event Today!</h1>
      </div>
      
      <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none;">
        <p style="font-size: 16px; margin-bottom: 20px;">Hi <strong>${params.userName}</strong>,</p>
        
        <p style="font-size: 16px;">Just a friendly reminder that your event is <strong>TODAY</strong>!</p>
        
        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #f59e0b;">
          <h3 style="margin-top: 0; color: #f59e0b;">📍 ${params.eventTitle}</h3>
          <p style="font-size: 18px; margin: 10px 0;"><strong>🕒 Time:</strong> ${params.eventTime}</p>
          <p style="font-size: 18px; margin: 10px 0;"><strong>📍 Location:</strong> ${params.eventLocation}</p>
        </div>

        <p style="font-size: 16px; margin: 20px 0;">See you there! Have an amazing time! 🎉</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
          <p style="color: #6b7280; font-size: 14px; margin: 5px 0;">Need help? Contact us at</p>
          <p style="margin: 5px 0;">
            <a href="mailto:findyourkismat@gmail.com" style="color: #f59e0b; text-decoration: none; font-weight: bold;">findyourkismat@gmail.com</a>
          </p>
        </div>
      </div>
      
      <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
        <p>© 2025 Kismat. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: params.to,
    subject: `⏰ Reminder: ${params.eventTitle} is TODAY!`,
    html,
  });
}