// =============================================
// FILE: src/api/send-approval-email.ts
// Send email when admin approves an event
// =============================================

import { supabase } from '../utils/supabase';

interface EmailData {
  to: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
}

export async function sendApprovalEmail(data: EmailData) {
  try {
    // You can use any email service here
    // Options: Resend, SendGrid, AWS SES, or Supabase Edge Functions
    
    const emailHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #000; color: #fff; padding: 30px; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; }
            .event-card { background: #fff; border: 2px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0; }
            .event-detail { margin: 10px 0; }
            .event-detail strong { color: #000; }
            .button { display: inline-block; background: #22c55e; color: #fff; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Your Event is Approved!</h1>
            </div>
            
            <div class="content">
              <p>Great news! Your event has been approved by our admin team.</p>
              
              <div class="event-card">
                <h2 style="color: #22c55e; margin-top: 0;">✓ ${data.eventTitle}</h2>
                
                <div class="event-detail">
                  <strong>📅 Date:</strong> ${data.eventDate}
                </div>
                
                <div class="event-detail">
                  <strong>🕐 Time:</strong> ${data.eventTime}
                </div>
                
                <div class="event-detail">
                  <strong>📍 Location:</strong> ${data.eventLocation}
                </div>
              </div>
              
              <p><strong>What happens next?</strong></p>
              <ul>
                <li>Your event is now live on the Kismat platform</li>
                <li>People can see and join your event</li>
                <li>You can chat with participants once they join</li>
                <li>Event chat will open when minimum participants are reached</li>
              </ul>
              
              <center>
                <a href="https://yourapp.com/events" class="button">View Your Event</a>
              </center>
            </div>
            
            <div class="footer">
              <p>Questions? Email us at <a href="mailto:findyourkismat@gmail.com">findyourkismat@gmail.com</a></p>
              <p>&copy; 2025 Kismat. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // OPTION 1: Using Resend (Recommended)
    const resendApiKey = 're_your_resend_api_key'; // Replace with your key
    
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Kismat <noreply@yourapp.com>',
        to: data.to,
        subject: `🎉 Your event "${data.eventTitle}" is approved!`,
        html: emailHTML
      })
    });

    if (resendResponse.ok) {
      console.log('✅ Approval email sent successfully to:', data.to);
      return { success: true };
    } else {
      console.error('❌ Failed to send email:', await resendResponse.text());
      return { success: false, error: 'Failed to send email' };
    }

  } catch (error) {
    console.error('Exception sending approval email:', error);
    return { success: false, error: 'Failed to send email' };
  }
}

// OPTION 2: Using Supabase Edge Function (Free Alternative)
export async function sendApprovalEmailViaSupabase(data: EmailData) {
  try {
    const { data: result, error } = await supabase.functions.invoke('send-approval-email', {
      body: {
        to: data.to,
        eventTitle: data.eventTitle,
        eventDate: data.eventDate,
        eventTime: data.eventTime,
        eventLocation: data.eventLocation
      }
    });

    if (error) {
      console.error('Error invoking email function:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Exception sending email via Supabase:', error);
    return { success: false, error: 'Failed to send email' };
  }
}