import {AWSError} from "aws-sdk";
import {SendEmailResponse} from "aws-sdk/clients/ses";
const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: 'AKIAYNPS5DEJ53KEFX7Q',
    secretAccessKey: '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',
    region: 'us-east-2',
});
const SES = new AWS.SES({ apiVersion: '2010-12-01' });

export function sendEmail(subject:string, msg:any, toMail:string) {
    console.log("Sending Email..::")
    console.log(subject);
    console.log(toMail);
    const params = {
        Destination: {
            ToAddresses: [toMail],
        },
        Message: {
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: msg,
                },
            },
            Subject: { Charset: 'UTF-8', Data: subject },
        },
        Source: 'pfft@pfft.ai',
    };

    SES.sendEmail(params, (err:AWSError, data:SendEmailResponse) => {
        if (err) {
            console.error('Error sending email:', err.message);
        } else {
            console.log('Email sent successfully:', data.MessageId);
        }
    });
}

export function sendSignUpEmail(user: any, credit: any, cost: any) {
    const content = getSignUpEmailContent()
        .replace('[Customer Name]', user.name)
        .replace('[number of credits a month]', credit)
        .replace('[cost a month]', '$'+cost);

    const subject = "Welcome to PFFT.AI! Your Subscription Confirmation";

    return sendEmail(subject, content, user.email);
}
export function sendVerificationEmail(user: any, link: any) {
    const content = getVerificationEmailContent()
        .replace('[Customer Name]', user.username)
        .replace('[Verification Link]', link);

    const subject = "Please Confirm Your Email for PFFT.AI";

    return sendEmail(subject, content, user.email);
}

export function getSignUpEmailContent() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to PFFT.AI! Your Subscription Confirmation</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
  </style>
</head>
<body style="font-family: 'Arial', sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
  <div style="padding-top: 20px;padding-bottom: 20px">
      <div style="max-width: 600px; margin: 50px auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <p>Dear [Customer Name],</p>
        <p>Thank you for choosing PFFT.AI! We hope you enjoy the PFFTs. This email is to confirm your subscription to our service.</p>
        <h2>Subscription Details:</h2>
        <p><strong>Subscription Plan:</strong> [number of credits a month] credits per month</p>
        <p><strong>Monthly Cost:</strong> [cost a month]</p>
        <p>We hope that you PFFT the PFFTs in the way you PFFT the best.</p>
        <p>Please note, the credits will renew monthly, and you can upgrade, downgrade, or cancel your subscription at any time. We're here to support you, so if you have any questions or need assistance, don't hesitate to reach out.</p>
        <p>Welcome to the future of AI, welcome to PFFT.AI!</p>
        <p>Best regards,<br>The PFFT.AI Team</p>
      </div>
  </div>
</body>
</html>
`;
}

export function getVerificationEmailContent() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to PFFT.AI</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
  </style>
</head>
<body style="font-family: 'Arial', sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
  
  <div style="padding-top: 20px;padding-bottom: 20px">
      <div style="max-width: 600px; margin: 50px auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);box-sizing: border-box;">
        <p>Dear [Customer Name],</p>
        <p>Thanks for signing up for a free PFFT.AI account! Please confirm your email address by clicking the link below:</p>
        <p><a href="[Verification Link]">Click Here to Verify Your Account.</a></p>
        <p>Once confirmed, you'll be all set to use your free credits.</p>
        <p>Cheers,<br>The PFFT.AI Team</p>
      </div>
  </div>
</body>
</html>
`;
}
