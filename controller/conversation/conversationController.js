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
  ctx.push({ role: "developer", content: 
    `you are a helpful trip assistant, and you are expected to extract `+
    `parameters about a future trip. the parameters are: `+
    `country, cities, hobbies, duration. try to use emojies and be cute.`
  },{role:"system",content:"In what country would you like to start your trip?"});

  // Create json formatted trip scheme
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
      ws.send(JSON.stringify({ message: "Generating route...", route: null }));
      const parsed_params = answered_params.map((x) => {
        return JSON.parse(x);
      });

      const trip = {
        country: parsed_params[0].country,
        city: parsed_params[1].city,
        hobbies: parsed_params[2].hobbies,
        start_date: parsed_params[3].start_date,
        duration: parsed_params[4].duration,
      };

      const gen_ctx = [
        {
          role: "user",
          content: `Give me places (specify the full name: place, city, country) to visit in the country of ${trip.country} and in the cities of ${trip.city} `+
                    `for a person who is intrested in the following hobbies: ${trip.hobbies}. `+
                    `the trip should be a duration of ${trip.duration}, and the person should start the trip on the date of ${trip.start_date}.` +
                    `the person should be able to drive within the timeframe `+
                    `to all the location. only give locations inside the cities stated, and atleast one per city stated. `,
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

        const p = JSON.parse(gen_route)
        console.log(p);
        p.places = p.places.map((x) => {return {name:x.full_name,desc:x.desc}});
        p.places = await extractValidatePlaces(p.places);

        if (p.places.length <= 3) {
          const gen_route = await createUnlimitedFormattedPrompt(
            gen_ctx,
            sites_structure,
            1,
          );

          const p = JSON.parse(gen_route)
          p.places = p.places.map((x) => {return {name:x.name,desc:x.desc}});
          p.places = await extractValidatePlaces(p.places);
        }

        ws.send(JSON.stringify(p));
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
