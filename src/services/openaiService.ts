import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function analyzeEmailContent(content: string) {
    const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
            {
                role: "system",
                content: `Categorize the email content: "${content}" into one of the following categories: Interested, Not Interested, More information.`,
            },
        ]
    });
    return completion.choices[0].message.content?.trim();
}
