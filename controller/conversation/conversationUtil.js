import zod from 'zod'
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod.mjs';



export async function is_relavent(context){
    const api_key = process.env.OPEN_AI_KEY

    const is_relavent = zod.object({
        is_relavent: zod.boolean({
            required_error: "relavence is required.",
            invalid_type_error:"relavence must be a boolean."
        })
    })

    const openai = new OpenAI({apiKey:api_key});
    console.log(context)
    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        max_completion_tokens:250,
        messages: [
            ...context,
            {role: "user", content: "Is the last message relavent to the context of the conversation?"},
        ],
        response_format:zodResponseFormat(is_relavent,"relavent") 
    });

    return JSON.parse(response.choices[0].message.content).is_relavent

}

export async function createUnformattedPrompt(context){
    const api_key = process.env.OPEN_AI_KEY
    const openai = new OpenAI({apiKey:api_key});
    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        max_completion_tokens:250,
        messages: context
    });

    return response.choices[0].message.content
}

export async function createformattedPrompt(context,fmt){
    const api_key = process.env.OPEN_AI_KEY
    const openai = new OpenAI({apiKey:api_key});
    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        max_completion_tokens:100,
        messages: context,
        response_format:zodResponseFormat(fmt,"trip-params")
    });

    return response.choices[0].message.content
}

export async function replyToMessage(msg,fmt,answered_params,ctx,ws){
        ctx.push({ role:"user",content:msg })
        
        const is_rel = await is_relavent(ctx);
        if (!is_rel){
            ctx.pop()
            const response = await createUnformattedPrompt(ctx)
            ws.send(response)
            return;
        }


        

        const response_to_trip = await createformattedPrompt(ctx,fmt)

        ctx.push({
            role:"system",content:`Ask user in natural language for ${fmt.shape.name}, use the word
            ${fmt.shape.name} in your message. and only about it, keep your answer short.`
        })

        const response_to_user = await createUnformattedPrompt(ctx) 

        answered_params.push(response_to_trip)

        ctx.push({
            role:"assistant", 
            content:response_to_user
        })
        ws.send(response_to_user)
    }
