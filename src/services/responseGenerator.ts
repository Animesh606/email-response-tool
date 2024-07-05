import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function generateResponse(category: string, content: string) {
    let prompt = "";
    switch (category) {
        case "Interested":
            prompt =
                "Generate a response asking for a demo call with available time slots.";
            break;
        case "Not Interested":
            prompt = "Generate a polite response thanking for their time.";
            break;
        case "More information":
            prompt =
                "Generate a response providing more information and asking if they need further details.";
            break;
    }
    const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "system", content: `${prompt} for the reply of this content: ${content}` }]
    })
    return completion.choices[0].message.content?.trim();
}
