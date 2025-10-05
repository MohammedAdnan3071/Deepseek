import { Webhook } from "svix";
import connectDB from "@/config/db";
import User from "@/models/User";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { jsx } from "react/jsx-runtime";

 // Svix => used to verify that incoming webhooks are real and not fake
// connectDB => connects to your MongoDB database
// User -> your mongoose model for storing user data
// headers -> lets you read the HTTP headers from the incoming requests in next js



// This runs whenever the server receives a POST request - which is how webhooks ar usually sent.
export async function POST(){
    const wh = new Webhook(process.env.SIGNING_SECRET);
    const headerPayload = await headers()
    const svixHeaders  = {
        "svix-id" : headerPayload.get("svix-id"),
        "svix-signature" : headerPayload.get("svix-signature"),
    };
 // the above code :
    // creates a new webhook instance using the secert key 
    // reads special Svix headers from the incoming webhook request-these are used to make sure the message is really from svix and not tampered with

    // Get the payload and verify it 
    
    const payload = await req.json();
    const body = JSON.stringify(payload);
    const {data, type} = wh.verify(body, svixHeaders);
    // the above code :
    // reads the webhook playload 
    //  wh.verify() checks that :
        // the message signature matches your secret.
        // it hasn't been modified or replayed
    // if it's valid, it gives you the data (user info) and type (event type like user.created)

    // prepare the user datat to be saved in the db
     
    const UserData = {
        _id:data.id,
        email:data.email_addresses[0].email_address,
        name:`${data.first_name} ${data.last_name}`,
        image:data.image_url,
    };
    await connectDB();

     switch(type) {
        case 'user.created':
               await User.create(UserData)
            break;

        case 'user.updated':
               await User.findByIdAndUpdate(data.id ,UserData)
            break;

        case 'user.deleted':
               await User.findByIdAndDelete(data.id)
            break;
        default :
            break;
     }

     // the above code :
    // depending on the type of webhook event:
        // user.created -> add a new user
        // user.updated -> update existing user data.
        // user.deleted -> remove the user from the db
     return NextResponse.json({message:"Event Received "})
     // sends a simple JSON response confirming that your sever received the webhook successfully
}


// TL ;DR
// this code :
// 1. waits for a webhook to arrive.
// 2. checks that it's real using Svix
// 3. Reads the user data inside it .
// 4. Connects to the database.
// 5. Creates, updates, and deletes a user depending on what happened.
// 6. Responds with "event Received".