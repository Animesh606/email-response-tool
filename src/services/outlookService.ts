import { outlookGraphClient } from "../config/oathConfig";

export async function getOutlookEmails() {
    const res = await outlookGraphClient.api("/me/messages").filter("isRead eq false").get();
    return res.value.map((msg: any) => ({
        id: msg.id,
        subject: msg.subject,
        bodyPreview: msg.bodyPreview,
        body: msg.body.content,
        to: msg.toRecipients[0]?.emailAddress?.address,
        provider: "outlook"
    }));
}
