import { sql } from "../../index.js";
import { extractValidatePlaces } from "../places/places.js";

export async function addRouteToDB(req, res) {
  const { locations, start_date } = req.body;

  try {
    if (locations == null || start_date == null) {
      res.status(400).send({ err: 'locations or start_date are null' });
      return;
    }
    const { id } = req.user;
    if(id == null){
      res.status(400).send({ err: 'user is not logged in' });
      return;
    }
    const startDate = new Date(start_date);
    if (isNaN(startDate)) {
      res.status(400).send({ err: 'Invalid start_date format' });
      return;
    }

    const user_id = id;

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
        opening_hours: loc.opening_hours ? loc.opening_hours.weekday_text : null
      };
    });

    const result = await sql`
        insert into place(name,lng,lat,icon_url,rating,address,photo_ref,description, opening_hours)
        values ${sql(places.map((row) => [row.name, row.lng, row.lat, row.icon_url, row.rating, row.address, row.photo_refs, row.desc, row.opening_hours]))}
        returning id;
      `;

    if (result.length === 0) {
      res.status(400).send();
      return;
    }

    const ids = result.map((row) => row.id);

    const route_res = await sql`
      insert into routes(user_id,places,start_date) values (${user_id},${ids},${startDate})
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
  const { route_id, locations } = req.body;

  const { id } = req.user;
    if(id == null){
      res.status(400).send();
      return;
    }
  const user_id = id;

  try {
    if (locations == null || route_id == null) {
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
    const place_res = await sql`
        select * from place where id = ANY(${route_result[0].places})
      `;
    if (place_res.length === 0) {
      res.status(400).send();
      return;
    }
    route_result[0].places = place_res;
    route_result[0].start_date = route_result[0].start_date.toISOString().split('T')[0];

    res.status(200).send({route:route_result,permission:req.permissions});
  } catch (err) {
    console.error(err);
  }
}

export async function getRouteSummary(req,res){
  const {id} = req.params;
  
  try{
    if (id == null) {
      res.status(400).send();
      return;
    }
    const result = await sql`
      SELECT p.id,p.name,p.photo_ref
      FROM routes r
      JOIN place p ON p.id = ANY(r.places)
      WHERE r.id = ${id};
    `
    const response = {
      id:result.map((row)=>row.id),
      places: result.map((row)=>row.name),
      images:result.map((row)=>row.photo_ref[0])
    }
    res.status(200).send(response)

  }catch(err){
    console.log(err)
    res.status(500).send({err:err})
  }  

}

export async function getAllRoutesSummary(req,res){
  const { id } = req.user;
  try {
    if(id == null){
      res.status(400).send();
      return;
    }
    const result = await sql`
      SELECT 
        r.id AS route_id,
        r.start_date AS start_date,
        JSON_AGG(p.name) AS places,
        JSON_AGG(p.photo_ref[1]) AS images
      FROM 
        routes r
      JOIN 
        place p ON p.id = ANY(r.places)
      WHERE 
        r.user_id = ${id}
      GROUP BY 
        r.id;`
    
    const response = {
      routes:result.map((route) => {
        return{
          id:route.route_id,
          places:route.places,
          images:route.images,
          start_date: (route.start_date 
          ? route.start_date.toISOString().split('T')[0] 
          : null)
        }
      })
    };
    res.status(200).send(response);

  } catch (error) {
    console.log(err)
    res.status(500).send({err:err})
  }
  
}