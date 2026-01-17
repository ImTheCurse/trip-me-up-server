import zod from "zod";
import { extractValidatePlaces } from "../places/places.js";
import {
  replyToMessage,
  createUnlimitedFormattedPrompt,
} from "./conversationUtil.js";

export async function handleConversation(ws, req) {
  // Initialize context
  const init_message = JSON.stringify({
    message: "In what country would you like to start your trip?",
    route: null,
  });

  const now = new Date();
  const ctx = [];
  
  ctx.push({ 
    role: "system", 
    content: 
      `You are a helpful trip assistant. Extract parameters: country, cities, hobbies, start_date, duration. ` +
      `Use emojis and be cute. The current date is ${now.toISOString()}. ` +
      `IMPORTANT: When asked for data, return ONLY JSON. No extra text.`
  }, { 
    role: "assistant", 
    content: "In what country would you like to start your trip?" 
  });

  const params = [
    zod.object({ country: zod.string(), next: "city" }),
    zod.object({ city: zod.string(), next: "hobbies" }),
    zod.object({ hobbies: zod.string(), next: "start_date" }),
    zod.object({ start_date: zod.string(), next: "duration" }),
    zod.object({ duration: zod.string(), next: "null" }),
  ];

  const trip_structure = zod.object({
    full_name: zod.string(),
    desc: zod.string(),
  });

  const answered_params = [];
  let idx = 0;

  ws.send(init_message);

  ws.on("message", async (msg) => {
    try {
      await replyToMessage(msg, params[idx], answered_params, ctx, ws);
    } catch (err) {
      console.error(err);
      ws.send(JSON.stringify({ message: "Error processing message", route: null }));
    }
    
    idx++;

    if (idx >= params.length) {
      ws.send(JSON.stringify({ message: "Generating route... ✈️", route: null }));
      
      const parsed_params = answered_params.map((x) => JSON.parse(x));

      const trip = {
        country: parsed_params[0].country,
        city: parsed_params[1].city,
        hobbies: parsed_params[2].hobbies,
        start_date: parsed_params[3].start_date || new Date().toISOString().split('T')[0],
        duration: parsed_params[4].duration,
      };

      const gen_ctx = [
        {
          role: "user",
          content: `Give me places (specify the full name: place, city, country) to visit in ${trip.country} and in ${trip.city} `+
                   `for hobbies: ${trip.hobbies}. `+
                   `Duration: ${trip.duration}. Start Date: ${trip.start_date}. ` +
                   `Only give locations inside the cities stated. Return ONLY JSON.`,
        },
      ];

      const sites_structure = zod.object({
        places: zod.array(trip_structure),
        start_date: zod.string(),
      });

      try {
        const gen_route = await createUnlimitedFormattedPrompt(
          gen_ctx,
          sites_structure,
          0,
        );

        const p = JSON.parse(gen_route);
        
        const placesForValidation = p.places.map((x) => {
            return { name: x.full_name, desc: x.desc }
        });

        const validatedData = await extractValidatePlaces(placesForValidation);
        
        p.places = validatedData.places;

        const finalResponse = {
            ...p,
            route: "ready",
            message: "Redirecting you to your trip! 🗺️"
        };

        console.log("Sending final response:", finalResponse);
        ws.send(JSON.stringify(finalResponse));
        ws.close();

        return;
      } catch (err) {
        console.error("Error generating route:", err);
        ws.send(JSON.stringify({ message: "Sorry, something went wrong.", route: null }));
        ws.close();
      }
    }
  });

  ws.on("error", (err) => {
    console.error("WebSocket error:", err);
  });
}