import zod from "zod";
import { extractValidatePlaces } from "../places/places.js";
import {
  replyToMessage,
  createUnlimitedFormattedPrompt,
} from "./conversationUtil.js";

export async function handleConversation(ws, req) {
  const init_message = JSON.stringify({
    message: "In what country would you like to start your trip?",
    route: null,
  });

  const now = new Date();
  const ctx = [];
  
  ctx.push({ 
    role: "system", 
    content: 
      `You are a helpful trip assistant. Talk to the user naturally and extract: country, cities, hobbies, duration. ` +
      `Use emojis and be cute. The current date is ${now.toISOString()}.` 
  }, { 
    role: "assistant", 
    content: "In what country would you like to start your trip?" 
  });

  const params = [
    zod.object({ country: zod.string(), next: "city" }),
    zod.object({ city: zod.string(), next: "hobbies" }),
    zod.object({ hobbies: zod.string(), next: "start date" }),
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
      const currentFmt = params[idx];

      await replyToMessage(msg, currentFmt, answered_params, ctx, ws);
    } catch (err) {
      console.error(err);
      ws.send(JSON.stringify({ message: `Error: ${err.message}`, route: null }));
    }
    idx++;

    if (idx >= params.length) {
      ws.send(JSON.stringify({ message: "Generating route...", route: null }));
      
      const parsed_params = answered_params.map((x) => JSON.parse(x));

      const trip = {
        country: parsed_params[0].country,
        city: parsed_params[1].city,
        hobbies: parsed_params[2].hobbies,
        start_date: parsed_params[3].start_date,
        duration: parsed_params[4].duration,
      };

      const jsonStructurePrompt = `Return the result in JSON format with this structure: { "places": [ { "full_name": "place, city, country", "desc": "description" } ], "start_date": "${trip.start_date}" }`;
      
      const gen_ctx = [
        {
          role: "user",
          content: `Give me places to visit in ${trip.country} and in the cities of ${trip.city} `+
                    `for a person interested in: ${trip.hobbies}. `+
                    `Duration: ${trip.duration}. Start Date: ${trip.start_date}. ` +
                    `Return ONLY JSON: ` + jsonStructurePrompt,
        },
      ];

      const sites_structure = zod.object({
        places: zod.array(trip_structure),
        start_date: zod.string(),
      });

      try {
        const gen_route = await createUnlimitedFormattedPrompt(gen_ctx, sites_structure, 0);
        let p = JSON.parse(gen_route);
        
        const placesToValidate = p.places.map((x) => ({ name: x.full_name || x.name, desc: x.desc }));
        
        const validatedResult = await extractValidatePlaces(placesToValidate);

        if (validatedResult.places.length <= 2) {
          const gen_route_alt = await createUnlimitedFormattedPrompt(
            gen_ctx,
            sites_structure,
            1,
          );
          const p_alt = JSON.parse(gen_route_alt);
          const validated_alt = await extractValidatePlaces(
            p_alt.places.map((x) => ({ name: x.full_name || x.name, desc: x.desc }))
            );
          p.places = validated_alt;
        }
        const finalPayload = {
          message: "Your trip is ready! Redirecting you now... ",
          route: "ready",
          places: validatedResult,
          start_date: p.start_date || trip.start_date
        };

        console.log("Sending final payload. Route is ready!");
        ws.send(JSON.stringify(finalPayload));
        ws.close();

      } catch (err) {
        console.error("Route generation failed:", err);
        ws.send(JSON.stringify({ message: "Sorry, I couldn't generate the route. Try again!", route: null }));
        ws.close();
      }
    }
  });

  ws.on("error", (err) => console.error("WebSocket error:", err));
}