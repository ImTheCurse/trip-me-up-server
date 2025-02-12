import { Router } from "express";
import { authenticateToken } from "../auth/auth.js";
import { getRoutePermissions } from "../middleware/permission.js";
import * as promptController from "../controller/promptController.js";
import * as conversationController from "../controller/conversation/conversationController.js";
import * as routeController from "../controller/route/routeController.js";
import * as placeController from "../controller/places/places.js";
import * as authController from "../auth/auth.js"

export const tripRouter = new Router();

tripRouter.post("/chat/prompt",authenticateToken, promptController.handlePrompt);
tripRouter.post("/route/add",authenticateToken, routeController.addRouteToDB);
tripRouter.put("/route/update",authenticateToken, routeController.updateRoute);
tripRouter.delete("/route/delete",authenticateToken,routeController.deleteRoute);
tripRouter.get("/route/all",authenticateToken,routeController.getAllRoutesSummary);
tripRouter.get("/route/:id",getRoutePermissions,routeController.getRoute);
tripRouter.get("/route/summary/:id",authenticateToken,routeController.getRouteSummary);
tripRouter.get("/places",authenticateToken,placeController.getValidatedPlace);
tripRouter.get("/user",authenticateToken,authController.getUserFromJWT);
tripRouter.post("/register",authController.registerUser);
tripRouter.post("/login",authController.login);
tripRouter.get("/logout",authController.logout);

export const mountWSRoute = () => {
  tripRouter.ws(
    "/chat/conversation",
    conversationController.handleConversation,
  );
};
