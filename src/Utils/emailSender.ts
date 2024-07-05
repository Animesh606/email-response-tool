import { google } from "googleapis";
import { googleOAuth2Client, outlookGraphClient } from "../config/oathConfig";
import nodemailer from "nodemailer";

async function sendEmailGmail(email: any, response: string) {
    const gmail = google.gmail({ version: "v1", auth: googleOAuth2Client });

    const base64EncodedEmail = Buffer.from(`To: ${email.to}\r\nSubject: Re: ${email.subject}\r\n\r\n${response}`)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

    await gmail.users.messages.send({
        userId: "me",
        requestBody: {
            raw: base64EncodedEmail,
        },
    });
}

export async function sendEmailOutlook(email: any, response: string) {
    const outlookEmail = {
        message: {
            subject: `Re: ${email.subject}`,
            body: {
                contentType: "Text",
                content: response,
            },
            toRecipients: [
                {
                    emailAddress: {
                        address: email.to,
                    },
                },
            ],
        },
        // saveToSentItems: "true",
    };

    await outlookGraphClient.api("/me/sendMail").post(outlookEmail);
}

export async function sendEmail(email: any, response: string) {
    if(email.provider === "gmail") {
        await sendEmailGmail(email, response);
    }
    else if(email.provider === "outlook") {
        await sendEmailOutlook(email, response);
    }
}