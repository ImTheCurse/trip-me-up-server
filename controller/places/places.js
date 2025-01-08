import { configDotenv } from "dotenv";
configDotenv();

export async function extractValidatePlaces(places) {
  const res = {
    places: [],
  };
  for (const place of places) {
    const name = place.split(" ").join("%2C");

    try {
      const connStr =
        `https://maps.googleapis.com/maps/api/place/findplacefromtext/json` +
        `?fields=formatted_address%2Cname%2Crating%2Copening_hours%2Cgeometry%2Cicon%2Cphotos` +
        `&input=${name}` +
        `&inputtype=textquery` +
        `&language=en` +
        `&key=${process.env.GOOGLE_PLACES_KEY}`;

      const resp = await fetch(connStr);

      const response = await resp.json();

      if (response.status != "OK") {
        continue;
      }

      res.places.push(response.candidates[0]);
    } catch (err) {
      console.log(err);
    }
  }
  return res;
}

const arr = ["Museum of arts new york", "Central park", "Joe's shawarma"];
