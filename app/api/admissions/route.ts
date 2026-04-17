import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      parentName,
      email,
      phone,
      numberOfChildren,
      classApplyingFor,
      questions,
    } = body

    const { error } = await resend.emails.send({
      from: 'KSPS Admissions <onboarding@resend.dev>',
      to: ['info@kingdomscholars.com.ng'],
      reply_to: email,
      subject: 'New Admission Enquiry — KSPS',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1B2A4A;">
          <div style="background: #1B2A4A; padding: 24px 32px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 20px;">New Admission Enquiry</h1>
            <p style="color: rgba(245,240,232,0.7); margin: 4px 0 0; font-size: 13px;">Kingdom Scholars Private School</p>
          </div>

          <div style="background: white; padding: 32px; border: 1px solid #F5F0E8; border-top: none; border-radius: 0 0 8px 8px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #F5F0E8; color: #666; font-size: 13px; width: 40%;">Parent / Guardian</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #F5F0E8; font-weight: 600; font-size: 14px;">${parentName}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #F5F0E8; color: #666; font-size: 13px;">Email</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #F5F0E8; font-size: 14px;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #F5F0E8; color: #666; font-size: 13px;">Phone</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #F5F0E8; font-size: 14px;">${phone}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #F5F0E8; color: #666; font-size: 13px;">No. of Children</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #F5F0E8; font-size: 14px;">${numberOfChildren}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #F5F0E8; color: #666; font-size: 13px;">Class Applying For</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #F5F0E8; font-size: 14px; font-weight: 600; color: #722F37;">${classApplyingFor}</td>
              </tr>
              ${
                questions
                  ? `
              <tr>
                <td style="padding: 10px 0; color: #666; font-size: 13px; vertical-align: top;">Questions</td>
                <td style="padding: 10px 0; font-size: 14px; line-height: 1.6;">${questions}</td>
              </tr>`
                  : ''
              }
            </table>

            <p style="margin-top: 24px; font-size: 12px; color: #999;">
              This enquiry was submitted via the KSPS website admissions form. Reply directly to this email to respond to the parent.
            </p>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Admissions route error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
