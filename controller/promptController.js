import OpenAI from "openai";

export async function handlePrompt(req, res) {
  const api_key = process.env.OPEN_AI_KEY;
  try {
    const prompt = req.body.prompt;

    const openai = new OpenAI({ 
      apiKey: api_key,
      baseURL: "https://api.groq.com/openai/v1"
    });
    const completion = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "You are a helpful assistant. Make all output in valid JSON format." },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    });

    console.log(completion.choices[0].message);
    res.status(200).send(completion.choices[0].message);
  } catch (error) {
    res.status(400).json({
      error: error.error,
    });
  }
}
