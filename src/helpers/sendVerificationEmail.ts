import {resend} from '@/lib/resend';
import {VerificationEmail} from '../../emails/VerifactionEmails';
import { ApiResponse } from '@/types/ApiResponse';

export async function sendVerificationEmail(
    email: string,
    verificationCode: string
    ): Promise<ApiResponse> {
        try {
            await resend.emails.send({
                from: ''

        } catch (error) {
            
        }