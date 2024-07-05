import { Request, Response } from "express";
import { Client } from "@microsoft/microsoft-graph-client";
import { googleOAuth2Client, outlookClientSecretCredential, outlookGraphClient } from "../config/oathConfig";

export const googleAuth = (req: Request, res: Response) => {
    const url = googleOAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: ["https://www.googleapis.com/auth/gmail.readonly"],
    });
    res.redirect(url);
};

export const googleCallback = (req: Request, res: Response) => {
    const code = req.query.code as string;
    googleOAuth2Client.getToken(code, (err, tokens) => {
        if (err) {
            return res.status(500).send(err);
        }
        googleOAuth2Client.setCredentials(tokens!);
        // Save tokens in the database if needed
        res.redirect("/"); // Redirect to a success page or dashboard
    });
};

export const outlookAuth = (req: Request, res: Response) => {
    const clientId = process.env.OUTLOOK_CLIENT_ID;
    const redirectUri = process.env.OUTLOOK_REDIRECT_URI;
    const authUrl = `https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&response_mode=query&scope=openid%20profile%20offline_access%20https://graph.microsoft.com/Mail.Read&state=12345`;
    res.redirect(authUrl);
};

export const outlookCallback = async (req: Request, res: Response) => {
    const code = req.query.code as string;
    const credential = outlookClientSecretCredential;
    const token = await credential.getToken(
        ["https://graph.microsoft.com/.default"]
    );
    // Save tokens in the database if needed
    res.redirect("/"); // Redirect to a success page or dashboard
};
