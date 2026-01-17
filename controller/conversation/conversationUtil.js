import OpenAI from "openai";

export async function createUnformattedPrompt(context) {
  const api_key = process.env.OPEN_AI_KEY; 
  const openai = new OpenAI({ 
    apiKey: api_key, 
    baseURL: "https://api.groq.com/openai/v1" 
  });
  
  const response = await openai.chat.completions.create({
    model: "llama3-70b-8192",
    messages: context,
  });

  return response.choices[0].message.content;
}

export async function createUnlimitedUnformattedPrompt(context){
  const api_key = process.env.OPEN_AI_KEY;
  const openai = new OpenAI({ 
    apiKey: api_key, 
    baseURL: "https://api.groq.com/openai/v1" 
  });

  const response = await openai.chat.completions.create({
    model: "llama3-70b-8192",
    messages: context,
  });

  return response.choices[0].message.content;
}

export async function createformattedPrompt(context, fmt) {
  const api_key = process.env.OPEN_AI_KEY;
  const openai = new OpenAI({ 
    apiKey: api_key, 
    baseURL: "https://api.groq.com/openai/v1" 
  });

  const jsonContext = [
    ...context,
    { role: "system", content: "OUTPUT ONLY JSON OBJECT." }
  ];

  const response = await openai.chat.completions.create({
    model: "llama3-70b-8192",
    max_tokens: 100,
    messages: jsonContext,
    response_format: { type: "json_object" },
  });
  
  return response.choices[0].message.content;
}

export async function createUnlimitedFormattedPrompt(context, fmt, choice_num) {
  const api_key = process.env.OPEN_AI_KEY;
  const openai = new OpenAI({ 
    apiKey: api_key, 
    baseURL: "https://api.groq.com/openai/v1" 
  });

  const response = await openai.chat.completions.create({
    model: "llama3-70b-8192",
    messages: context,
    temperature: 0.5,
    response_format: { type: "json_object" }, // JSON Mode
  });

  return response.choices[choice_num]?.message?.content || response.choices[0].message.content;
}

export async function replyToMessage(msg, fmt, answered_params, ctx, ws) {
  ctx.push({ role: "user", content: msg });

  const response_to_trip = await createformattedPrompt(ctx, fmt);
  answered_params.push(response_to_trip);

  if (fmt.shape.next === "null" || fmt.shape.next === null) {
    return;
  }

  const questionCtx = [
    ...ctx,
    {
      role: "system",
      content: `Ask user in natural language for ${fmt.shape.next}. 
                Use the word ${fmt.shape.next} in your message. 
                Keep it cute and short. DO NOT use JSON format here.`
    }
  ];

  const response_to_user = await createUnformattedPrompt(questionCtx);

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