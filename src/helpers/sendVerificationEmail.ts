import {resend} from '@/lib/resend';
import {VerificationEmail} from '../../emails/VerifactionEmails';
import { ApiResponse } from '@/types/ApiResponse';

export async function sendVerificationEmail(
    email: string,
    username: string,
    verificationCode: string
    ): Promise<ApiResponse> {
        try {
            await resend.emails.send({
                from: 'you@example.com',
                to: email,
                subject: 'Verify your email address',
                react: VerificationEmail({
                    username,
                    otp:verificationCode,
                }),
            });
            return {success: true, message: 'Verification email sent'};

        } catch (emailError) {
            console.error('Error sending verification email:', emailError);
            return {
                success: false,
                message: 'Failed to send verification email',
            };
        }
    }