import React from 'react';
import ReactDOMServer from 'react-dom/server';

// -----------------------------------------------------------------------------
// NEXT.js-friendly Email Templates
// - These are React components that render email-compatible HTML (inline styles)
// - Use ReactDOMServer.renderToStaticMarkup(component) to get an HTML string
// - Example Next.js API route included at the bottom (nodemailer)
// -----------------------------------------------------------------------------

// -----------------------------
// Helper: wrap with basic HTML
// -----------------------------
export function wrapHtml(bodyHtml, title = 'Notification') {
  return `<!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <title>${title}</title>
    </head>
    <body style="margin:0;padding:0;font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;">
      ${bodyHtml}
    </body>
  </html>`;
}

// ---------------------------------
// 1) Simple Welcome / Account Email
// ---------------------------------
export function WelcomeEmail({ name = 'Friend', actionUrl = '#', supportUrl = '#' }) {
  return (
    <table width="100%" cellPadding="0" cellSpacing="0" role="presentation" style={{backgroundColor: '#f6f9fc', padding: '32px 0'}}>
      <tbody>
        <tr>
          <td align="center">
            <table width="600" cellPadding="0" cellSpacing="0" role="presentation" style={{background: '#ffffff', borderRadius: 8, overflow: 'hidden'}}>
              <tbody>
                <tr>
                  <td style={{padding: '24px', textAlign: 'center', borderBottom: '1px solid #eef2f6'}}>
                    <h1 style={{margin: 0, fontSize: 20}}>Welcome, {name} 👋</h1>
                    <p style={{margin: '8px 0 0', color: '#616e7c'}}>Thanks for joining — we're happy to have you.</p>
                  </td>
                </tr>

                <tr>
                  <td style={{padding: '28px'}}>
                    <p style={{marginTop: 0}}>To get started, confirm your account:</p>
                    <div style="text-align:center; margin: 20px 0;">
                      <a href={actionUrl} style={{display: 'inline-block', padding: '12px 20px', borderRadius: 6, textDecoration: 'none', backgroundColor: '#2563eb', color: '#fff', fontWeight: 600}}>Confirm your account</a>
                    </div>
                    <p style={{fontSize: 13, color: '#6b7280'}}>If that button doesn't work, copy and paste this link into your browser:</p>
                    <p style={{fontSize: 12, wordBreak: 'break-all'}}>{actionUrl}</p>
                  </td>
                </tr>

                <tr>
                  <td style={{padding: '16px 24px', background: '#f9fafb', fontSize: 13, color: '#6b7280'}}>
                    <p style={{margin: 0}}>Need help? <a href={supportUrl} style={{color: '#2563eb'}}>Contact support</a></p>
                  </td>
                </tr>

              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

// ---------------------------------
// 2) Password Reset
// ---------------------------------
export function PasswordResetEmail({ name = 'User', resetUrl = '#' }) {
  return (
    <table width="100%" cellPadding="0" cellSpacing="0" role="presentation" style={{backgroundColor: '#f6f9fc', padding: '32px 0'}}>
      <tbody>
        <tr>
          <td align="center">
            <table width="600" cellPadding="0" cellSpacing="0" role="presentation" style={{background: '#ffffff', borderRadius: 8}}>
              <tbody>
                <tr>
                  <td style={{padding: '22px', borderBottom: '1px solid #eef2f6'}}>
                    <h2 style={{margin: 0}}>Reset your password</h2>
                  </td>
                </tr>
                <tr>
                  <td style={{padding: '28px'}}>
                    <p style={{marginTop: 0}}>Hi {name},</p>
                    <p>We received a request to reset your password. Click the button below to choose a new password. This link will expire in 1 hour.</p>

                    <div style={{textAlign: 'center', margin: '20px 0'}}>
                      <a href={resetUrl} style={{display: 'inline-block', padding: '12px 20px', borderRadius: 6, textDecoration: 'none', backgroundColor: '#ef4444', color: '#fff', fontWeight: 600}}>Reset password</a>
                    </div>

                    <p style={{fontSize: 13, color: '#6b7280'}}>If you didn't request this, you can safely ignore this email.</p>
                  </td>
                </tr>

                <tr>
                  <td style={{padding: '16px 24px', background: '#f9fafb', fontSize: 13, color: '#6b7280'}}>
                    <p style={{margin: 0}}>If the button doesn't work, copy-paste: <span style={{wordBreak: 'break-all'}}>{resetUrl}</span></p>
                  </td>
                </tr>

              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

// ---------------------------------
// 3) Simple Notification / Digest
// ---------------------------------
export function NotificationEmail({ headline = 'Here’s your update', items = [] }) {
  return (
    <table width="100%" cellPadding="0" cellSpacing="0" role="presentation" style={{backgroundColor: '#f6f9fc', padding: 32}}>
      <tbody>
        <tr>
          <td align="center">
            <table width="600" role="presentation" style={{background: '#fff', borderRadius: 8}}>
              <tbody>
                <tr>
                  <td style={{padding: 20, borderBottom: '1px solid #eef2f6'}}>
                    <h3 style={{margin: 0}}>{headline}</h3>
                  </td>
                </tr>

                <tr>
                  <td style={{padding: 20}}>
                    {items.length === 0 ? (
                      <p style={{marginTop: 0}}>No new items.</p>
                    ) : (
                      <ul style={{paddingLeft: 16}}>
                        {items.map((it, idx) => (
                          <li key={idx} style={{marginBottom: 8}}>
                            <strong>{it.title}</strong>
                            <div style={{fontSize: 13, color: '#6b7280'}}>{it.summary}</div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                </tr>

                <tr>
                  <td style={{padding: '12px 20px', background: '#f9fafb', fontSize: 13, color: '#6b7280'}}>
                    <p style={{margin: 0}}>You're receiving this because you're subscribed to updates.</p>
                  </td>
                </tr>

              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

// ---------------------------------
// 4) Plain-text fallback generator
// ---------------------------------
export function plainTextFromProps(props) {
  // Simple fallback for clients that prefer plain text
  if (props.resetUrl) return `Reset your password: ${props.resetUrl}`;
  if (props.actionUrl) return `Confirm your account: ${props.actionUrl}`;
  return 'Hello — open the HTML version of this email.';
}

// ---------------------------------
// 5) Utility: render component to full HTML string
// ---------------------------------
export function renderEmailToHtml(component, title = 'Message') {
  const body = ReactDOMServer.renderToStaticMarkup(component);
  return wrapHtml(body, title);
}

// ---------------------------------
// Example: Next.js API route (pages/api/send-email.js)
// ---------------------------------
/*
Example usage (save as pages/api/send-email.js in a Next.js project that uses the pages router):

import nodemailer from 'nodemailer';
import { renderEmailToHtml, WelcomeEmail } from '../../path/to/this/file';

export default async function handler(req, res) {
  const { to, name, actionUrl } = req.body;

  // 1) Render HTML
  const html = renderEmailToHtml(<WelcomeEmail name={name} actionUrl={actionUrl} />, 'Welcome');
  const text = plainTextFromProps({ actionUrl });

  // 2) Create transporter (use environment variables for auth)
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false, // true for 465
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // 3) Send
  const info = await transporter.sendMail({
    from: `My App <${process.env.SMTP_FROM}>`,
    to,
    subject: 'Welcome to My App!',
    text,
    html,
  });

  return res.status(200).json({ ok: true, info });
}

Notes:
- Use environment variables for SMTP credentials (never commit them)
- For production email deliverability use a transactional email service (SendGrid, Mailgun, Amazon SES, Postmark)
- If you use the Next.js App Router, place the API route in app/api/send/route.ts and adapt to the new handler shape.
*/

// ---------------------------------
// Quick examples (JS calls you can paste in a script)
// ---------------------------------
/*****
// Example: render and log HTML (Node script)
import fs from 'fs';
const html = renderEmailToHtml(<WelcomeEmail name="Kundan" actionUrl="https://example.com/confirm" />,'Welcome');
fs.writeFileSync('./welcome.html', html);
*****
*/

// Default export (optional small helper)
export default function ExampleExport() {
  return <div>Use the named exports to render emails (WelcomeEmail, PasswordResetEmail, ...)</div>;
}
