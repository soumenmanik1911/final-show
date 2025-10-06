import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface MeetingLinksEmailData {
  guestName: string;
  meetingName: string;
  summaryText?: string;
  recordingUrl?: string;
  hostName?: string;
}

export async function sendMeetingLinksEmail(
  to: string,
  data: MeetingLinksEmailData
) {
  try {
    const { guestName, meetingName, summaryText, recordingUrl, hostName } = data;

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Meeting Summary & Recording - ${meetingName}</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2563eb;">Meeting Completed: ${meetingName}</h1>

            <p>Hi ${guestName},</p>

            <p>The meeting "${meetingName}" has ended. Here are the resources you requested:</p>

            ${summaryText ? `
              <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #2563eb; border-radius: 5px;">
                <h3 style="margin: 0 0 10px 0; color: #2563eb;">📋 Meeting Summary</h3>
                <p style="margin: 0; white-space: pre-wrap; font-family: monospace; font-size: 14px; line-height: 1.4;">${summaryText}</p>
              </div>
            ` : ''}

            ${recordingUrl ? `
              <div style="margin: 20px 0;">
                <div style="margin-bottom: 15px;">
                  <a href="${recordingUrl}" style="background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                    🎥 Download Recording
                  </a>
                </div>
                <p style="margin: 5px 0; font-size: 14px; color: #666;">
                  Full video recording of the meeting.
                </p>
              </div>
            ` : ''}

            ${hostName ? `<p>Hosted by: ${hostName}</p>` : ''}

            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

            <p style="font-size: 12px; color: #666;">
              This email was sent automatically. If you have any questions, please contact the meeting host.
            </p>
          </div>
        </body>
      </html>
    `;

    const emailText = `
Meeting Completed: ${meetingName}

Hi ${guestName},

The meeting "${meetingName}" has ended. Here are the resources you requested:

${summaryText ? `📋 Meeting Summary:
${summaryText}

` : ''}${recordingUrl ? `🎥 Download Recording: ${recordingUrl}
Full video recording of the meeting.

` : ''}${hostName ? `Hosted by: ${hostName}

` : ''}---
This email was sent automatically. If you have any questions, please contact the meeting host.
    `;

    // For Resend testing domain, we can only send to authorized emails
    // Send to the test email but personalize for the guest
    const testEmail = process.env.TEST_EMAIL || 'soumenmanik1911@gmail.com';

    // Note: To send to actual guest emails, you need to:
    // 1. Add guest emails to "Authorized Emails" in Resend dashboard, or
    // 2. Verify your own domain instead of using onboarding@resend.dev

    const result = await resend.emails.send({
      from: 'onboarding@resend.dev', // Use your verified Netlify domain
      to: [to], // Send directly to guest email
      subject: `Meeting Summary & Recording - ${meetingName}`,
      html: emailHtml,
      text: emailText,
    });

    console.log('Email send result:', result);
    console.log('Attempted to send to:', testEmail, '(personalized for guest:', guestName, 'at', to + ')');

    // Check if the result indicates success
    if (result.data?.id) {
      return { success: true, result };
    } else {
      console.error('Email send failed:', result);
      return { success: false, error: result };
    }
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
}