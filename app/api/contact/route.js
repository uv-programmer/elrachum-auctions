import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request) {
  try {
    const { name, email, subject, message } = await request.json()

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    // Save to Supabase
    const sb = supabaseAdmin()
    if (sb) {
      const { error: dbError } = await sb
        .from('contact_submissions')
        .insert([{ name, email, subject, message }])
      if (dbError) console.error('Supabase contact insert error:', dbError)
    }

    // Forward to admin email
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: 'El Rachum Auctions Website <noreply@elrachumauctions.com>',
        to: process.env.ADMIN_EMAIL,
        replyTo: email,
        subject: `Contact Form: ${subject}`,
        html: `
          <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr />
          <p>${message.replace(/\n/g, '<br />')}</p>
        `,
      })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
