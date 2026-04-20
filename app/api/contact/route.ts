import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(req: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  try {
    const body = await req.json()
    const { name, email, message } = body

    const { error } = await resend.emails.send({
      from: 'KSPS Admissions <no-reply@kingdomscholars.com.ng>',
      to: ['ayomidepaul784@gmail.com'],
      reply_to: email,
      subject: `New Message from ${name} — KSPS Website`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1B2A4A;">
          <div style="background: #1B2A4A; padding: 24px 32px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 20px;">New Contact Message</h1>
            <p style="color: rgba(245,240,232,0.7); margin: 4px 0 0; font-size: 13px;">Kingdom Scholars Private School</p>
          </div>

          <div style="background: white; padding: 32px; border: 1px solid #F5F0E8; border-top: none; border-radius: 0 0 8px 8px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #F5F0E8; color: #666; font-size: 13px; width: 30%;">Name</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #F5F0E8; font-weight: 600; font-size: 14px;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #F5F0E8; color: #666; font-size: 13px;">Email</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #F5F0E8; font-size: 14px;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #666; font-size: 13px; vertical-align: top;">Message</td>
                <td style="padding: 10px 0; font-size: 14px; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</td>
              </tr>
            </table>

            <p style="margin-top: 24px; font-size: 12px; color: #999;">
              This message was submitted via the KSPS website contact form. Reply directly to this email to respond.
            </p>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact route error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
