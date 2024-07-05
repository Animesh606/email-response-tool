import { google } from "googleapis";
import { ClientSecretCredential } from "@azure/identity";
import { Client } from "@microsoft/microsoft-graph-client";
import { config } from "dotenv";
config();

export const googleOAuth2Client = new google.auth.OAuth2({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI,
});

export const outlookClientSecretCredential = new ClientSecretCredential(
    process.env.OUTLOOK_TENANT_ID!,
    process.env.OUTLOOK_CLIENT_ID!,
    process.env.OUTLOOK_CLIENT_SECRET!,
    {
        authorityHost: "https://login.microsoftonline.com/consumers"
    }
);

export const outlookGraphClient = Client.initWithMiddleware({
    authProvider: {
        getAccessToken: async () => {
            const token = await outlookClientSecretCredential.getToken([
                "https://graph.microsoft.com/.default"
            ]);
            return token.token;
        },
    },
});
