import { google } from "googleapis";

export async function getGmailEmails(auth: any) {
    const gmail = google.gmail({ version: "v1", auth });
    const res = await gmail.users.messages.list({
        userId: "me",
        q: "is:unread",
    });
    const messages = res.data.messages || [];
    const emailPromises = messages.map(async (message) => {
        const msg = await gmail.users.messages.get({ userId: "me", id: message.id! });
        const emailData = {
            id: message.id,
            threadId: msg.data.threadId,
            snippet: msg.data.snippet,
            payload: msg.data.payload,
            to: msg.data.payload?.headers?.find((header) => header.name === "To")?.value,
            subject: msg.data.payload?.headers?.find((header) => header.name === "Subject")?.value,
            provider: "gmail"
        };
        return emailData;
    });
    return Promise.all(emailPromises);
}
