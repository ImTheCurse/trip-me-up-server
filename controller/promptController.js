import OpenAI from 'openai'

export async function handlePrompt(req,res){
    const api_key = process.env.OPEN_AI_KEY
    try{
        const prompt = req.body.prompt;

        const openai = new OpenAI({apiKey:api_key});
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "Make all output in json." },
                {
                    role: "user",
                    content: prompt,
                },
            ],
        })

        console.log(completion.choices[0].message)
        res.status(200).send();
    }catch(error){
        res.status(400).json({
            "error":error.error
        })
    }
    
}

