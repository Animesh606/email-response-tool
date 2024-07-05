import { Queue, Worker } from "bullmq";
import IOredis from "ioredis";
import { getGmailEmails } from "../services/gmailService";
import { getOutlookEmails } from "../services/outlookService";
import { analyzeEmailContent } from "../services/openaiService";
import { generateResponse } from "../services/responseGenerator";
import { googleOAuth2Client, outlookGraphClient } from "../config/oathConfig";
import { sendEmail } from "./emailSender";

const connection = new IOredis({
    // host: process.env.REDIS_HOST,
    // port: Number(process.env.REDIS_PORT),
    // password: process.env.REDIS_PASSWORD,
    maxRetriesPerRequest: null
});

const emailQueue = new Queue("emailQueue", { connection });

emailQueue.add("checkEmails", {}, { repeat: { every: 10000 } });

const worker = new Worker(
    "emailQueue",
    async (job) => {
        const gmailEmails = await getGmailEmails(googleOAuth2Client);
        const outlookEmails = await getOutlookEmails();
    
        const allEmails = [...gmailEmails, ...outlookEmails];
        console.log(allEmails);

        for (const email of allEmails) {
            const category = await analyzeEmailContent(
                email.bodyPreview || email.snippet
            );
            const response = (await generateResponse(category!, email.bodyPreview || email.snippet)) || "";
            await sendEmail(email, response);
        }
    },
    {
        connection
    }
);

worker.on("completed", async (job) => {
    console.log(`[${job.id}] entering job completion stage!`);
    console.log(`[${job.id}] has completed!`);
});

worker.on("failed", (job, err) => {
    console.error(`[${job?.id}] has failed with ${err.message}`);
    console.error(err);
});

worker.on("error", (err) => {
    console.error(`worker has errored with ${err.message}`);
});