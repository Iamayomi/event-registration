import moment from "moment";

/**
 * Content of the mail sent after a user successfully registers for an event.
 * @param username Receiver's name
 * @param eventTitle Title of the event
 * @param eventDate Date of the event
 * @param subject Subject of the message
 * @returns {Object} HTML, text, and subject of the email
 */
export const eventRegistrationTemplate = (username: string, eventTitle: string, eventDate: Date, timestamp: Date = new Date(), subject?: string) => {
  return {
    subject: subject || `🎉 You’re registered for ${eventTitle}!`,

    text: `Dear ${username}, your registration for "${eventTitle}" has been confirmed. The event is scheduled for ${moment(eventDate).format("MMMM Do YYYY, h:mm:ss a")}. See you there!`,

    html: `<!doctype html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <style>
              *,
              * > * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                color: #333;
              }
  
              body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f9f9f9;
                padding: 2rem;
              }
  
              .container {
                max-width: 600px;
                margin: auto;
                background: white;
                border-radius: 8px;
                padding: 2rem;
                box-shadow: 0 0 10px rgba(0,0,0,0.05);
              }
  
              h1 {
                font-size: 1.5rem;
                color: #222;
                margin-bottom: 1rem;
              }
  
              p {
                margin: 0.5rem 0;
                line-height: 1.5;
              }
  
              .footer {
                margin-top: 2rem;
                font-size: 0.85rem;
                color: #888;
                text-align: center;
              }
  
            </style>
          </head>
          <body>
            <div class="container">
              <h1>🎉 Event Registration Confirmed!</h1>
              <p>Dear ${username},</p>
              <p>We're happy to confirm your registration for the event:</p>
              <p><strong>${eventTitle}</strong></p>
              <p><strong>Date:</strong> ${moment(timestamp).format("MMMM Do YYYY, h:mm:ss a")}</p>
              <p>Thank you for registering. We look forward to having you at the event!</p>
  
              <div class="footer">
                <p>This email was sent to ${username}. If you didn’t register for this event, please ignore this message.</p>
              </div>
            </div>
          </body>
        </html>`,
  };
};
