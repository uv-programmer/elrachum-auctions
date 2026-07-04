import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request) {
  try {
    const { name, phone, email, service, date, time } = await request.json()

    // Validate required fields
    if (!name || !phone || !email || !service || !date || !time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Save to Supabase
    const { error: dbError } = await supabaseAdmin()
      .from('bookings')
      .insert([{ name, phone, email, service, date, time }])

    if (dbError) {
      console.error('Supabase insert error:', dbError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    // Send confirmation email to customer
    await resend.emails.send({
      from: 'El Rachum Auctions <noreply@yourdomain.ca>',
      to: email,
      subject: `Pickup Confirmed — ${date} at ${time}`,
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px;">
          <div style="background: #0F1E3C; padding: 20px 24px; border-radius: 12px; margin-bottom: 24px;">
            <h1 style="color: white; font-size: 20px; margin: 0;">Pickup Confirmed ✓</h1>
          </div>
          <p style="color: #374151;">Hi <strong>${name}</strong>,</p>
          <p style="color: #374151;">Your pickup appointment has been confirmed. Here are your details:</p>
          <div style="background: #F9FAFB; border-radius: 12px; padding: 16px; margin: 20px 0; border: 1px solid #E5E7EB;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 6px 0; color: #6B7280; font-size: 13px;">Service</td><td style="padding: 6px 0; font-weight: 500; color: #111827; font-size: 13px;">${service}</td></tr>
              <tr><td style="padding: 6px 0; color: #6B7280; font-size: 13px;">Date</td><td style="padding: 6px 0; font-weight: 500; color: #111827; font-size: 13px;">${date}</td></tr>
              <tr><td style="padding: 6px 0; color: #6B7280; font-size: 13px;">Time</td><td style="padding: 6px 0; font-weight: 500; color: #111827; font-size: 13px;">${time}</td></tr>
              <tr><td style="padding: 6px 0; color: #6B7280; font-size: 13px;">Phone</td><td style="padding: 6px 0; font-weight: 500; color: #111827; font-size: 13px;">${phone}</td></tr>
            </table>
          </div>
          <p style="color: #374151; font-size: 14px;">
            Please bring a valid photo ID and your invoice number. If you need to reschedule,
            contact us as soon as possible at <a href="mailto:info@yourdomain.ca" style="color: #C0392B;">info@yourdomain.ca</a>.
          </p>
          <p style="color: #6B7280; font-size: 13px; margin-top: 24px;">— El Rachum Auctions LLC</p>
        </div>
      `,
    })

    // Notify admin of new booking
    await resend.emails.send({
      from: 'El Rachum Auctions <noreply@yourdomain.ca>',
      to: process.env.ADMIN_EMAIL,
      subject: `New Pickup Booking — ${name}`,
      html: `
        <p><strong>New booking received:</strong></p>
        <ul>
          <li>Name: ${name}</li>
          <li>Phone: ${phone}</li>
          <li>Email: ${email}</li>
          <li>Service: ${service}</li>
          <li>Date: ${date}</li>
          <li>Time: ${time}</li>
        </ul>
      `,
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    console.error('Booking API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Admin: GET all bookings (protected by auth middleware)
export async function GET() {
  const { data, error } = await supabaseAdmin()
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
