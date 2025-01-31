import { createUnlimitedUnformattedPrompt} from "../conversation/conversationUtil.js";

export async function extractValidatePlaces(places) {
  const res = {
    places: [],
  };
  for (const place of places) {
    const name = place.name.split(" ").join("%2C");

    try {

      const connStrFindPlace =
              `https://maps.googleapis.com/maps/api/place/findplacefromtext/json` +
              `?fields=place_id`+
              `&input=${name}` +
              `&inputtype=textquery` +
              `&language=en` +
              `&key=${process.env.GOOGLE_PLACES_KEY}`;


      const respPid = await fetch(connStrFindPlace);
      const responsePid = await respPid.json();

      if (responsePid.status != "OK") {
          continue;
      }
      const place_id = responsePid.candidates[0].place_id;

      const connStrPlaceDetails =
        `https://maps.googleapis.com/maps/api/place/details/json` +
        `?fields=formatted_address,name,rating,opening_hours,geometry,icon,photos` +
        `&place_id=${place_id}` +
        `&language=en` +
        `&key=${process.env.GOOGLE_PLACES_KEY}`;

      const resp = await fetch(connStrPlaceDetails);
      const response = await resp.json();

      if (response.status != "OK") {
        continue;
      }
      response.result.desc = place.desc;
      response.result.photos = response.result.photos.slice(0,4);

      const photoUrls = await Promise.all(
        response.result.photos.map(async (photo) => {
          const photo_ref = photo.photo_reference;
          const photo_resp = await fetch(
            `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1000&photo_reference=${photo_ref}&key=${process.env.GOOGLE_PLACES_KEY}`
          );
          return photo_resp.ok ? photo_resp.url : null;
        })
      );
      
      // Filter out null values to skip bad api calls
      response.result.photos = photoUrls.filter(url => url !== null);

      res.places.push(response.result);
    } catch (err) {
      console.log(err);
    }
  }
  return res;
}

export async function getValidatedPlace(req, res) {
  const { place } = req.query;
  if (place == null) {
    res.status(400).send({ err: "no place was provided." });
    return;
  }
  const ctx = {
    role:"user",
    content:`give me description of the place: ${place}`
  }
  const desc = await createUnlimitedUnformattedPrompt([ctx])
  const p = {name:place,desc:desc}

  const validated_place = await extractValidatePlaces([p]);
  if (validated_place.places.length == 0) {
    res.status(400).send();
    return;
  }

  res.status(200).send(validated_place);
}
