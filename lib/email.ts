import nodemailer from 'nodemailer'

// Email configuration
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
})

interface SendEmailOptions {
    to: string
    subject: string
    html: string
    replyTo?: string
}

export async function sendEmail({ to, subject, html, replyTo }: SendEmailOptions) {
    try {
        const info = await transporter.sendMail({
            from: `"Grahad Ventures Limited" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
            to,
            subject,
            html,
            replyTo,
        })
        console.log('Email sent:', info.messageId)
        return { success: true, messageId: info.messageId }
    } catch (error) {
        console.error('Email error:', error)
        throw error
    }
}

// Email templates
export const emailTemplates = {
    contactFormSubmission: (data: { name: string; email: string; phone?: string; subject: string; message: string }) => ({
        subject: `New Contact Form Submission: ${data.subject}`,
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1a1a2e; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #555; }
          .value { margin-top: 5px; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Contact Form Submission</h1>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">Name:</div>
              <div class="value">${data.name}</div>
            </div>
            <div class="field">
              <div class="label">Email:</div>
              <div class="value">${data.email}</div>
            </div>
            ${data.phone ? `
            <div class="field">
              <div class="label">Phone:</div>
              <div class="value">${data.phone}</div>
            </div>
            ` : ''}
            <div class="field">
              <div class="label">Subject:</div>
              <div class="value">${data.subject}</div>
            </div>
            <div class="field">
              <div class="label">Message:</div>
              <div class="value">${data.message.replace(/\n/g, '<br>')}</div>
            </div>
          </div>
          <div class="footer">
            <p>Grahad Ventures Limited</p>
            <p>Siaya-Bondo Highway Opp. Siaya Prison, Siaya, Kenya</p>
            <p>Phone: +254 796 305 689 | Email: grahadventureslimited@gmail.com</p>
          </div>
        </div>
      </body>
      </html>
    `,
    }),

    contactFormConfirmation: (data: { name: string }) => ({
        subject: 'Thank you for contacting Grahad Ventures Limited',
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1a1a2e; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thank You for Contacting Us</h1>
          </div>
          <div class="content">
            <p>Dear ${data.name},</p>
            <p>Thank you for reaching out to Grahad Ventures Limited. We have received your message and will get back to you as soon as possible.</p>
            <p>Our team typically responds within 24 hours during business days.</p>
            <p>In the meantime, feel free to:</p>
            <ul>
              <li>Browse our product catalog at our website</li>
              <li>Call us directly at +254 796 305 689</li>
              <li>Visit our store at Siaya-Bondo Highway</li>
            </ul>
            <p>Best regards,<br>The Grahad Ventures Team</p>
          </div>
          <div class="footer">
            <p>Grahad Ventures Limited</p>
            <p>Siaya-Bondo Highway Opp. Siaya Prison, Siaya, Kenya</p>
            <p>Phone: +254 796 305 689 | Email: grahadventureslimited@gmail.com</p>
          </div>
        </div>
      </body>
      </html>
    `,
    }),

    welcomeEmail: (data: { name: string; email: string }) => ({
        subject: 'Welcome to Grahad Ventures Limited!',
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .cta { text-align: center; margin: 20px 0; }
          .btn { display: inline-block; background: #e94560; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; }
          .features { margin: 20px 0; }
          .feature { display: flex; margin-bottom: 15px; }
          .feature-icon { margin-right: 10px; color: #e94560; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Grahad Ventures!</h1>
            <p>Your trusted partner for construction and hardware supplies</p>
          </div>
          <div class="content">
            <p>Dear ${data.name},</p>
            <p>Welcome to the Grahad Ventures family! We're thrilled to have you join our community of builders, contractors, and DIY enthusiasts.</p>
            
            <p><strong>What you can expect:</strong></p>
            <ul>
              <li>🛠️ Quality construction and hardware products</li>
              <li>💰 Competitive prices and bulk discounts</li>
              <li>🚚 Reliable delivery across Kenya</li>
              <li>📞 24/7 Technical support</li>
              <li>❤️ Easy wishlist and order management</li>
            </ul>

            <div class="cta">
              <a href="https://grahadventures.co.ke/search" class="btn">Start Shopping</a>
            </div>

            <p>If you have any questions, don't hesitate to reach out. Our team is here to help!</p>
            <p>Best regards,<br>The Grahad Ventures Team</p>
          </div>
          <div class="footer">
            <p>Grahad Ventures Limited</p>
            <p>Siaya-Bondo Highway Opp. Siaya Prison, Siaya, Kenya</p>
            <p>Phone: +254 796 305 689 | Email: grahadventureslimited@gmail.com</p>
            <p>© 2025 Grahad Ventures Limited. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    }),
}
