import { Router } from "express";
import { authenticateToken } from "../auth/auth.js";
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
tripRouter.get("/route/:id",authenticateToken,routeController.getRoute);
tripRouter.get("/places",authenticateToken,placeController.getValidatedPlace);
tripRouter.post("/register",authController.registerUser);
tripRouter.post("/login",authController.login);

export const mountWSRoute = () => {
  tripRouter.ws(
    "/chat/conversation",
    conversationController.handleConversation,
  );
};
