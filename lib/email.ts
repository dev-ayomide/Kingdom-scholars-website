import { Resend } from 'resend'

const FROM = 'Kingdom Scholars Portal <no-reply@kingdomscholars.com.ng>'

export interface Mail {
  to: string
  subject: string
  html: string
}

export function esc(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// Base URL used in email links. Set NEXT_PUBLIC_SITE_URL in production.
export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')
}

function layout(heading: string, body: string) {
  return `
  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1B2A4A;">
    <div style="background: #1B2A4A; padding: 24px 32px; border-radius: 8px 8px 0 0;">
      <h1 style="color: white; margin: 0; font-size: 20px;">${esc(heading)}</h1>
      <p style="color: rgba(245,240,232,0.7); margin: 4px 0 0; font-size: 13px;">Kingdom Scholars Private School</p>
    </div>
    <div style="background: white; padding: 32px; border: 1px solid #F5F0E8; border-top: none; border-radius: 0 0 8px 8px; font-size: 14px; line-height: 1.6;">
      ${body}
      <p style="margin-top: 28px; font-size: 12px; color: #999;">
        Kingdom Scholars Private School, Abeokuta. If you weren't expecting this email, you can ignore it.
      </p>
    </div>
  </div>`
}

function button(href: string, label: string) {
  return `<p style="margin: 24px 0;"><a href="${esc(href)}" style="background: #722F37; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px;">${esc(label)}</a></p>`
}

export function accountMail(to: string, fullName: string, link: string, kind: 'invite' | 'reset'): Mail {
  if (kind === 'invite') {
    return {
      to,
      subject: 'Your Kingdom Scholars portal account',
      html: layout(
        'Welcome to the KSPS Portal',
        `<p>Hello ${esc(fullName)},</p>
         <p>The school has created a portal account for you. Use the button below to choose your password and sign in.</p>
         ${button(link, 'Set my password')}
         <p style="color:#666;font-size:13px;">This link works once and expires, so please use it soon. If it has expired, open the sign-in page and choose "Forgot password" to get a new one.</p>`
      ),
    }
  }
  return {
    to,
    subject: 'Reset your Kingdom Scholars portal password',
    html: layout(
      'Reset your password',
      `<p>Hello ${esc(fullName)},</p>
       <p>Use the button below to choose a new password.</p>
       ${button(link, 'Choose a new password')}
       <p style="color:#666;font-size:13px;">If you didn't ask for this, you can ignore this email and your password will stay the same.</p>`
    ),
  }
}

export function reportsReadyMail(
  to: string,
  parentName: string,
  items: { child: string; label: string }[]
): Mail {
  const list = items
    .map((i) => `<li><strong>${esc(i.child)}</strong>: ${esc(i.label)}</li>`)
    .join('')
  return {
    to,
    subject: 'A new report sheet is ready',
    html: layout(
      'Report sheet ready',
      `<p>Hello ${esc(parentName)},</p>
       <p>A new report sheet has been added:</p>
       <ul>${list}</ul>
       <p>Sign in to the parent portal to download it.</p>
       ${button(`${siteUrl()}/portal`, 'Open the parent portal')}`
    ),
  }
}

// Sends in batches of 100 (Resend's batch limit). Never throws.
export async function sendMails(mails: Mail[]): Promise<{ sent: number; failed: string[] }> {
  if (mails.length === 0) return { sent: 0, failed: [] }
  if (!process.env.RESEND_API_KEY) {
    return { sent: 0, failed: mails.map((m) => m.to) }
  }
  const resend = new Resend(process.env.RESEND_API_KEY)
  let sent = 0
  const failed: string[] = []

  for (let i = 0; i < mails.length; i += 100) {
    const chunk = mails.slice(i, i + 100)
    try {
      const { error } = await resend.batch.send(
        chunk.map((m) => ({ from: FROM, to: [m.to], subject: m.subject, html: m.html }))
      )
      if (error) {
        console.error('Resend batch error:', error)
        failed.push(...chunk.map((m) => m.to))
      } else {
        sent += chunk.length
      }
    } catch (err) {
      console.error('Resend batch exception:', err)
      failed.push(...chunk.map((m) => m.to))
    }
  }
  return { sent, failed }
}
