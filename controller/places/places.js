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

export async function getValidatedPlace(req,res){
  const {place} = req.query
  console.log(place)
  if(place == null){
    res.status(400).send({err:"no place was provided."})
    return;
  }
  const validated_place = await extractValidatePlaces([place])
  if (validated_place.places.length == 0){
    res.status(400).send()
    return
  }
  res.status(200).send(validated_place)
}