import zod from "zod"
import { createformattedPrompt, createUnformattedPrompt,replyToMessage,is_relavent } from "./conversationUtil.js"


export async function handleConversation(ws,req){
    //Initalize contex with response from openai
    // const init_message = "Ask user in natural language, in what country would he would like to start his trip."
    const init_message ='In what country would you like to start your trip?' 
    const ctx = [
        { role: "system", content: init_message },
    ] 

    // Create json formatted trip scheme
    const params = [
        zod.object({city: zod.string(),name:'city'}),
        zod.object({hobbies: zod.string(),name:'hobbies'}),
        zod.object({duration: zod.number(),name:'duration'}),    
        zod.object({purpose : zod.string(),name:'purpose'}) 
    ]

    const answered_params = []
    let idx = 0;
    // Create first question from openai.
    // const response = await createUnformattedPrompt(ctx)

    //Send assistant response on websocket 
    ws.send(init_message);
    // ctx.push({
    //     role:"system", 
    //     content:response
    // })
     

    

    //websocket event listners
    ws.on('message',async(msg)=>{
        if(idx >= params.length){
            ws.send("Genrating route...")
            answered_params.map((x)=>{
                return JSON.parse(x)
            })
            console.log(answered_params)
            // TODO: add route genration
            return;
        }
        replyToMessage(msg,params[idx],answered_params,ctx,ws)
        idx++;
    });
    ws.on('error', (err) => {
        console.error("WebSocket error:", err);
    });
    ws.on('close',(x)=> console.log(x))
}

