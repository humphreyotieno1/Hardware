import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, emailTemplates } from '@/lib/email'
import { contactFormSchema } from '@/lib/validations/contact'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Validate using Zod
        const result = contactFormSchema.safeParse(body)

        if (!result.success) {
            const firstError = result.error.issues[0]?.message || 'Invalid form data'
            return NextResponse.json(
                { error: firstError, details: result.error.format() },
                { status: 400 }
            )
        }

        const { name, email, phone, subject, message } = result.data

        // Send notification email to company
        const notificationTemplate = emailTemplates.contactFormSubmission({ name, email, phone, subject, message })
        await sendEmail({
            to: process.env.CONTACT_EMAIL || 'grahadventureslimited@gmail.com',
            subject: notificationTemplate.subject,
            html: notificationTemplate.html,
            replyTo: email,
        })

        // Send confirmation email to user
        const confirmationTemplate = emailTemplates.contactFormConfirmation({ name })
        await sendEmail({
            to: email,
            subject: confirmationTemplate.subject,
            html: confirmationTemplate.html,
        })

        return NextResponse.json({
            success: true,
            message: 'Your message has been sent successfully! We will get back to you soon.',
        })
    } catch (error) {
        console.error('Contact form error:', error)
        return NextResponse.json(
            { error: 'Failed to send message. Please try again later.' },
            { status: 500 }
        )
    }
}
