import zod from "zod"
import { createformattedPrompt, createUnformattedPrompt,replyToMessage,is_relavent } from "./conversationUtil.js"


export async function handleConversation(ws,req){
    //Initalize contex with response from openai
    const init_message ='In what country would you like to start your trip?' 
    const ctx = [] 

    // Create json formatted trip scheme
    const params = [
        zod.object({country: zod.string(),next:'city'}),
        zod.object({city: zod.string(),next:'hobbies'}),
        zod.object({hobbies: zod.string(),next:'duration'}),
        zod.object({duration: zod.number(),next:'purpose'}),    
        zod.object({purpose : zod.string(),next:'null'}) 
    ]

    const answered_params = []
    let idx = 0;
    // Create first question from openai.

    //Send assistant response on websocket 
    ws.send(init_message);
    
    //websocket event listners
    ws.on('message',async(msg)=>{
        await replyToMessage(msg,params[idx],answered_params,ctx,ws)
        idx++;

        if(idx >= params.length){
            ws.send("Genrating route...")
            answered_params.map((x)=>{
                return JSON.parse(x)
            })
            console.log(answered_params)
            // TODO: add route genration
            return;
        }
    });
    ws.on('error', (err) => {
        console.error("WebSocket error:", err);
    });
    ws.on('close',(x)=> console.log(x))
}

