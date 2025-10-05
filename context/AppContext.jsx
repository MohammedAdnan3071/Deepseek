'use client';

import { useUser } from "@clerk/nextjs";
import {  Component, createContext, useContext } from "react";

export const AppContext = createContext();

export const useAppContext = () =>{
    return useContext(AppContext);
}

export const AppContextProvider =({children}) =>{
        const {user} = useUser();
        const value = {
            user,
         };

    return  <AppContext.Provider value={value}>{children} </AppContext.Provider>;
}


// use client 
// this tells next js that this file is a client Component
// by default components in next js ca be either server or client components
// Client components are rendered in the browser , not just on the server
// They can :
// user react hooks ( like useState , useEffect, useContext)
// access browser apis 
// interact with things like auth



// import { useUser } from "@clerk/nextjs";
// this import a hook called useUser from clerkClient
// useUser() returns the currently signed in user's info from clerk
// when you call const{user}= useUser(), you get access to the user object
// {
//   id: "user_12345",
//   firstName: "John",
//   lastName: "Doe",
//   emailAddresses: [{ emailAddress: "john@example.com" }],
//   imageUrl: "https://clerk.dev/images/avatar.png"
// }


// import { createContext , useContext } from "react";

// these are react's built in context tools
// createContext() → Creates a new Context object (a kind of global data store).
// useContext() → Lets you access that context from anywhere inside your component tree.
// Context in React is used for sharing data across components without having to pass props down manually every time.


// export const AppContext = createContext();
// this creates a context object called Appcontext
// Think of it like a "box" or "container" that can hold shared data(like the user object)
// Later, we'll use a provider to fill this box with values and make it accessible to other components.
// Example mental model:
//      AppContext = {
//         value: whatever-you-share
//      }


// Export const useAppContext =() =>{
//     return useContext(AppContext);
// }

// this defines a custom react hook that makes using your context simpler.
// normally, to access a context , you would have to write :
//     const context = useContext(AppContext);

// But with this custom hook , you can just do :
//     const {user} = useAppContext();


// Export const AppcontextProvider = ({children}) => {...}
// this defines your context Provider Component
// A Provider is a special component that makes a context value available to all its descendants in the component tree.
// It wraps around other components and passes down data.
// The children prop represents everything that's nested inside this provider.
