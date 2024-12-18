// const { Router } = require('express');
// const { promptController} = require('../controller/promptController.js');
// const { conversationController } = require('../controller/conversationController.js');
import { Router } from "express";
import  * as promptController  from "../controller/promptController.js"
import * as conversationController  from "../controller/conversation/conversationController.js"

export const tripRouter = new Router();

tripRouter.post('/chat/prompt',promptController.handlePrompt);

export const mountWSRoute = () =>{
    tripRouter.ws('/chat/conversation',conversationController.handleConversation);
}

