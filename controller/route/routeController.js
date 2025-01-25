import { sql } from "../../index.js";
import { extractValidatePlaces } from "../places/places.js";

export async function addRouteToDB(req, res) {
  const { user_id, locations } = req.body;

  try {
    if (user_id == null || locations == null) {
      res.status(400).send();
      return;
    }

    const places = locations.map((loc) => {
      return {
        lat: loc.geometry.location.lat,
        lng: loc.geometry.location.lng,
        address: loc.formatted_address,
        icon_url: loc.icon,
        name: loc.name,
        rating: loc.rating ? loc.rating : null,
        photo_refs: loc.photos.map((x) => x.photo_reference),
        desc: loc.desc,
      };
    });

    // TODO: add notes to db
    const result = await sql`
        insert into place(name,lng,lat,icon_url,rating,address,photo_ref,description)
        values ${sql(places.map((row) => [row.name, row.lng, row.lat, row.icon_url, row.rating, row.address, row.photo_refs, row.desc]))}
        returning id;
      `;

    if (result.length === 0) {
      res.status(400).send();
      return;
    }

    const ids = result.map((row) => row.id);

    // TODO: Add start + end date
    const route_res = await sql`
      insert into routes(user_id,places) values (${user_id},${ids})
      returning *
      `;

    if (route_res.length === 0) {
      res.status(400).send();
      return;
    }

    res.status(200).send(route_res);
  } catch (err) {
    console.log(err);
    res.status(500).send({ err: err });
  }
}

export async function updateRoute(req, res) {
  const { user_id, route_id, locations } = req.body;

  try {
    if (user_id == null || locations == null || route_id == null) {
      res.status(400).send();
      return;
    }

    const places = locations.map((loc) => {
      return {
        lat: loc.geometry.location.lat,
        lng: loc.geometry.location.lng,
        address: loc.formatted_address,
        icon_url: loc.icon,
        name: loc.name,
        rating: loc.rating ? loc.rating : null,
        photo_refs: loc.photos,
        desc: loc.desc,
        notes: loc.notes,
      };
    });

    const result = await sql`
        insert into place(name,lng,lat,icon_url,rating,address,photo_ref,description,notes)
        values ${sql(
          places.map((row) => [
            row.name,
            row.lng,
            row.lat,
            row.icon_url,
            row.rating,
            row.address,
            row.photo_refs,
            row.desc,
            row.notes,
          ]),
        )}
        returning id;
      `;

    if (result.length === 0) {
      res.status(400).send();
      return;
    }

    const ids = result.map((row) => row.id);

    const updated_route = await sql`
        update routes
        set places = ${ids}
        where ${route_id} = id
        returning *;
      `;

    if (updated_route.length === 0) {
      res.status(400).send();
      return;
    }

    res.status(200).send(updated_route[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
}

export async function deleteRoute(req, res) {
  const { route_id } = req.body;

  if (route_id == null) {
    res.status(400).send();
    return;
  }
  try {
    const result = await sql`
          select places from routes where ${route_id} = id;
        `;
    if (res.length === 0) {
      res.status(400).send();
      return;
    }

    const place_del_res = await sql`
          delete from place where id = ANY(${result[0].places})
          returning id;
        `;

    if (place_del_res.length === 0) {
      res.status(400).send();
      return;
    }

    const route_del_res = await sql`
        delete from routes where id = ${route_id}
        returning id;
      `;

    if (route_del_res.length === 0) {
      res.status(400).send();
      return;
    }

    res.status(200).send(route_del_res);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
}

export async function getRoute(req, res) {
  const { id } = req.params;

  try {
    if (id == null) {
      res.status(400).send();
      return;
    }

    const route_result = await sql`
          select * from routes where id = ${id};
        `;

    if (route_result.length === 0) {
      res.status(400).send();
      return;
    }
    console.log(route_result);
    const place_res = await sql`
        select * from place where id = ANY(${route_result[0].places})
      `;
    if (place_res.length === 0) {
      res.status(400).send();
      return;
    }
    route_result[0].places = place_res;

    res.status(200).send({places:route_result,permission:req.permissions});
  } catch (err) {
    console.error(err);
  }
}
