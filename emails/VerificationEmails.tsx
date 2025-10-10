// emails/VerificationEmails.tsx
import { Html } from "@react-email/html";
import { Text } from "@react-email/text";
import * as React from "react";

export const VerificationEmail = ({ username, otp }: { username: string; otp: string }) => {
  return (
    <Html>
      <Text>Hi {username},</Text>
      <Text>Your verification code is: <b>{otp}</b></Text>
      <Text>This code will expire in 10 minutes.</Text>
    </Html>
  );
};

export default VerificationEmail;
