import { Router } from "express";
import  * as promptController  from "../controller/promptController.js"
import * as conversationController  from "../controller/conversation/conversationController.js"
import * as userController from "../controller/db/user.js"

export const tripRouter = new Router();

tripRouter.post('/chat/prompt',promptController.handlePrompt);
tripRouter.post('/login',userController.getUser);

export const mountWSRoute = () =>{
    tripRouter.ws('/chat/conversation',conversationController.handleConversation);
}

