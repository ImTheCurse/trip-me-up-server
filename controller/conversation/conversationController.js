import zod from "zod"
import { replyToMessage,createUnlimitedFormattedPrompt} from "./conversationUtil.js"


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

    const trip_structure = zod.object({
        name: zod.string(),
        desc: zod.string(),
        num_of_stars_out_of_five: zod.number(),
        opening_hours: zod.string()
    })

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
            const parsed_params = answered_params.map((x)=>{
                return JSON.parse(x)
            })
            // TODO: add route genration
            
            const trip = {
                country: parsed_params[0].country,
                city: parsed_params[1].city,
                hobbies: parsed_params[2].hobbies,
                duration: parsed_params[3].duration,
                purpose: parsed_params[4].purpose
            }

            const gen_ctx = [
                {
                    role: "user",
                    content: `Give me places to visit in ${trip.country} and in ${trip.city} 
                    for the following hobbies: ${trip.hobbies},
                    with the duration of ${trip.duration} with the purpose of ${trip.purpose}`
                }
            ]
            const sites_structure = zod.object({
                places: zod.array(trip_structure)
            })

            const gen_route = await createUnlimitedFormattedPrompt(gen_ctx,sites_structure)
            const parsed_route = JSON.parse(gen_route)
            console.log(parsed_route)
            ws.send(gen_route)
            ws.close()


            return;
        }
    });
    ws.on('error', (err) => {
        console.error("WebSocket error:", err);
    });
    ws.on('close',(x)=> console.log(x))
}

