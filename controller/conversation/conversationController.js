import zod from "zod";
import { extractValidatePlaces } from "../places/places.js";
import {
  replyToMessage,
  createUnlimitedFormattedPrompt,
} from "./conversationUtil.js";

export async function handleConversation(ws, req) {
  //Initalize contex with response from openai
  const init_message = JSON.stringify({
    message: "In what country would you like to start your trip?",
    route: null,
  });

  const ctx = [];

  // Create json formatted trip scheme
  const params = [
    zod.object({ country: zod.string(), next: "city" }),
    zod.object({ city: zod.string(), next: "hobbies" }),
    zod.object({ hobbies: zod.string(), next: "duration" }),
    zod.object({ duration: zod.number(), next: "purpose" }),
    zod.object({ purpose: zod.string(), next: "null" }),
  ];

  const trip_structure = zod.object({
    name: zod.string(),
    desc: zod.string(),
    num_of_stars_out_of_five: zod.number(),
    opening_hours: zod.string(),
  });

  const answered_params = [];
  let idx = 0;

  //Send assistant response on websocket
  ws.send(init_message);

  //websocket event listners
  ws.on("message", async (msg) => {
    try {
      await replyToMessage(msg, params[idx], answered_params, ctx, ws);
    } catch (err) {
      ws.send(`Error: ${err}`);
      ws.close();
    }
    idx++;

    if (idx >= params.length) {
      ws.send(JSON.stringify({ message: "Genrating route...", route: null }));
      const parsed_params = answered_params.map((x) => {
        return JSON.parse(x);
      });

      const trip = {
        country: parsed_params[0].country,
        city: parsed_params[1].city,
        hobbies: parsed_params[2].hobbies,
        duration: parsed_params[3].duration,
        purpose: parsed_params[4].purpose,
      };

      const gen_ctx = [
        {
          role: "user",
          content: `Give me places to visit in ${trip.country} and in ${trip.city}
                    for the following hobbies: ${trip.hobbies},
                    with the duration of ${trip.duration} with the purpose of ${trip.purpose}`,
        },
      ];
      const sites_structure = zod.object({
        places: zod.array(trip_structure),
      });

      try {
        const gen_route = await createUnlimitedFormattedPrompt(
          gen_ctx,
          sites_structure,
          0,
        );

        const p = JSON.parse(gen_route).places.map((x) => x.name);
        const places = await extractValidatePlaces(p);

        if (places.length <= 3) {
          const gen_route = await createUnlimitedFormattedPrompt(
            gen_ctx,
            sites_structure,
            1,
          );

          const p = JSON.parse(gen_route).places.map((x) => x.name);
          const places = await extractValidatePlaces(p);
        }

        ws.send(JSON.stringify(places));
        ws.close();

        return;
      } catch (err) {
        ws.send(`Error: ${err}`);
        ws.close();
      }
    }
  });
  ws.on("error", (err) => {
    console.error("WebSocket error:", err);
  });
  ws.on("close", (x) => console.log(x));
}
