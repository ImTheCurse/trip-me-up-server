import zod from "zod";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod.mjs";

const getGroqClient = () => {
  return new OpenAI({
    apiKey: process.env.OPEN_AI_KEY,
    baseURL: "https://api.groq.com/openai/v1",
  });
};

export async function createUnformattedPrompt(context) {
  const openai = getGroqClient();
  const response = await openai.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_completion_tokens: 250,
    messages: context,
  });

  return response.choices[0].message.content;
}

export async function createUnlimitedUnformattedPrompt(context){
  const openai = getGroqClient();
  const response = await openai.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: context,
  });

  return response.choices[0].message.content;
}

export async function createformattedPrompt(context, fmt) {
  const openai = getGroqClient();
  const jsonContext = [
    ...context,
    { role: "system", content: "Extract the data and return it ONLY in valid JSON format." }
  ];
  const response = await openai.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_completion_tokens: 100,
    messages: jsonContext,
    response_format: { type: "json_object" },
  });
  return response.choices[0].message.content;
}

export async function createUnlimitedFormattedPrompt(context, fmt, choice_num) {
  const openai = getGroqClient();
  const jsonContext = [
    ...context,
    { role: "system", content: "Return the trip plan ONLY in valid JSON format." }
  ];
  const response = await openai.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: jsonContext,
    temperature:0.5,
    response_format: { type: "json_object" },
  });

  return response.choices[choice_num].message.content;
}

export async function replyToMessage(msg, fmt, answered_params, ctx, ws) {
  ctx.push({ role: "user", content: msg });
  const response_to_trip = await createformattedPrompt(ctx, fmt);
  answered_params.push(response_to_trip);

  if (fmt.shape.next === "null" || fmt.shape.next === null) {
    return; 
  }
  const promptCtx = [
    ...ctx,
    {
      role: "system",
      content: `Ask user in natural language for ${fmt.shape.next}. Use the word ${fmt.shape.next}. Keep it short and friendly. DO NOT use JSON.`
    }
  ];
  const response_to_user = await createUnformattedPrompt(chatCtx);

  ctx.push({ role: "assistant", content: response_to_user });
  ws.send(JSON.stringify({ message: response_to_user, route: null }));
}
