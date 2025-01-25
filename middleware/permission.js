import { authenticateToken, getUserFromJWT } from "../auth/auth.js";

export async function getRoutePermissions(req, res, next) {
  const token = req.cookies["tmu_token"]; // Retrieve the token from the cookie

  if (token == null) {
    req.permissions = "view";
    next();
    return;
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error(err);
      return res.status(403).send({ err: "Token verification failed." });
    }
    req.user = user;
  });

  try {
    const result = await sql`
          select user_id from routes where id = ${req.id} and user_id = ${req.user.id};
      `;

    if (result.length === 0) {
      req.permissions = "view";
      next();
      return;
    }
    req.permissions = "edit";
    next();
  } catch (err) {
    res.status(500).send({ err: err });
    return;
  }
}
