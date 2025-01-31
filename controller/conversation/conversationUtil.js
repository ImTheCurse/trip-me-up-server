import zod from "zod";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod.mjs";

export async function createUnformattedPrompt(context) {
  const api_key = process.env.OPEN_AI_KEY;
  const openai = new OpenAI({ apiKey: api_key });
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    max_completion_tokens: 250,
    messages: context,
  });

  return response.choices[0].message.content;
}

export async function createUnlimitedUnformattedPrompt(context){
  const api_key = process.env.OPEN_AI_KEY;
  const openai = new OpenAI({ apiKey: api_key });
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: context,
  });

  return response.choices[0].message.content;
}

export async function createformattedPrompt(context, fmt) {
  const api_key = process.env.OPEN_AI_KEY;
  const openai = new OpenAI({ apiKey: api_key });
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    max_completion_tokens: 100,
    messages: context,
    response_format: zodResponseFormat(fmt, "trip-params"),
  });
  return response.choices[0].message.content;
}

export async function createUnlimitedFormattedPrompt(context, fmt, choice_num) {
  const api_key = process.env.OPEN_AI_KEY;
  const openai = new OpenAI({ apiKey: api_key });

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: context,
    temperature:0.5,
    response_format: zodResponseFormat(fmt, "trip-params"),
  });

  return response.choices[choice_num].message.content;
}

export async function replyToMessage(msg, fmt, answered_params, ctx, ws) {
  ctx.push({ role: "user", content: msg });
  const response_to_trip = await createformattedPrompt(ctx, fmt);

  if (fmt.shape.next === "null") {
    answered_params.push(response_to_trip);
    return;
  }
  ctx.push({
    role: "system",
    content: `Ask user in natural language for ${fmt.shape.next}, use the word
            ${fmt.shape.next} in your message. and only about it, keep your answer short.`,
  });

  const response_to_user = await createUnformattedPrompt(ctx);

  answered_params.push(response_to_trip);

  ctx.push({
    role: "assistant",
    content: response_to_user,
  });
  const resp = {
    message: response_to_user,
    route: null,
  };

  ws.send(JSON.stringify(resp));
}
