import { Router } from "express";
import * as promptController from "../controller/promptController.js";
import * as conversationController from "../controller/conversation/conversationController.js";
import * as userController from "../controller/db/user.js";
import * as routeController from "../controller/route/routeController.js";
import * as placeController from "../controller/places/places.js";

export const tripRouter = new Router();

tripRouter.post("/chat/prompt", promptController.handlePrompt);
tripRouter.post("/login", userController.getUser);
tripRouter.post("/route/add", routeController.addRouteToDB);
tripRouter.put("/route/update", routeController.updateRoute);
tripRouter.delete("/route/delete", routeController.deleteRoute);
tripRouter.get("/route/:id", routeController.getRoute);
tripRouter.get("/places",placeController.getValidatedPlace);

export const mountWSRoute = () => {
  tripRouter.ws(
    "/chat/conversation",
    conversationController.handleConversation,
  );
};
