import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request) {
  try {
    const { name, email, phone, lots, slot, notes } = await request.json()

    if (!name || !email || !phone || !lots || !slot) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Save to Supabase
    const sb = supabaseAdmin()
    if (sb) {
      const { error: dbError } = await sb
        .from('bookings')
        .insert([{ name, email, phone, lots, slot, notes: notes || '' }])
      if (dbError) console.error('Supabase insert error:', dbError)
    }

    // Confirmation email to customer
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: 'El Rachum Auctions <noreply@elrachumauctions.com>',
        to: email,
        subject: `Pickup Booking Confirmed — ${slot}`,
        html: `
          <div style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;padding:24px;">
            <div style="background:#111;padding:20px 24px;border-radius:12px;margin-bottom:24px;border-bottom:3px solid #C0392B;">
              <h1 style="color:white;font-size:20px;margin:0;">Pickup Confirmed ✓</h1>
            </div>
            <p style="color:#374151;">Hi <strong>${name}</strong>,</p>
            <p style="color:#374151;">Your pickup slot has been booked. Here are your details:</p>
            <div style="background:#F9FAFB;border-radius:12px;padding:16px;margin:20px 0;border:1px solid #E5E7EB;">
              <table style="width:100%;border-collapse:collapse;">
                <tr><td style="padding:6px 0;color:#6B7280;font-size:13px;width:100px;">Slot</td><td style="padding:6px 0;font-weight:600;color:#111;font-size:13px;">${slot}</td></tr>
                <tr><td style="padding:6px 0;color:#6B7280;font-size:13px;">Lots</td><td style="padding:6px 0;font-weight:600;color:#111;font-size:13px;">${lots}</td></tr>
                <tr><td style="padding:6px 0;color:#6B7280;font-size:13px;">Phone</td><td style="padding:6px 0;font-weight:600;color:#111;font-size:13px;">${phone}</td></tr>
                ${notes ? `<tr><td style="padding:6px 0;color:#6B7280;font-size:13px;">Notes</td><td style="padding:6px 0;color:#111;font-size:13px;">${notes}</td></tr>` : ''}
              </table>
            </div>
            <p style="color:#374151;font-size:14px;">Please bring a valid photo ID when you arrive. To reschedule, reply to this email or contact us at <a href="mailto:contact@elrachumauctions.com" style="color:#C0392B;">contact@elrachumauctions.com</a>.</p>
            <p style="color:#999;font-size:13px;margin-top:24px;">— El Rachum Auctions LLC</p>
          </div>
        `,
      })

      // Admin alert
      await resend.emails.send({
        from: 'El Rachum Auctions <noreply@elrachumauctions.com>',
        to: process.env.ADMIN_EMAIL,
        subject: `New Pickup Booking — ${name}`,
        html: `
          <p><strong>New booking received:</strong></p>
          <ul>
            <li><strong>Name:</strong> ${name}</li>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Phone:</strong> ${phone}</li>
            <li><strong>Slot:</strong> ${slot}</li>
            <li><strong>Lots:</strong> ${lots}</li>
            ${notes ? `<li><strong>Notes:</strong> ${notes}</li>` : ''}
          </ul>
        `,
      })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    console.error('Book-pickup API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
