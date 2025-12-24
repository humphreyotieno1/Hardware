import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, emailTemplates } from '@/lib/email'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { name, email } = body

        if (!name || !email) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        const template = emailTemplates.welcomeEmail({ name, email })
        await sendEmail({
            to: email,
            subject: template.subject,
            html: template.html,
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Welcome email error:', error)
        return NextResponse.json(
            { error: 'Failed to send welcome email' },
            { status: 500 }
        )
    }
}
