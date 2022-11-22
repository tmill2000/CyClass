/**
 * AUTHOR:	Adam Walters
 * CREATED:	10/24/2022
 * UPDATED:	10/24/2022
 */

 import React from "react";
 import { createRoot } from "react-dom/client";
 import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
 
 import "./app.css";

 import Root from "./routes/Root";
 import Lecture from "./routes/Lecture";
 import Login from "./routes/Login";
 
 import TopBar from "./components/TopBar";
 
 // Create the router, defining all routes
//  const router = createBrowserRouter(
// 	 createRoutesFromElements(
// 		 <Route path="/" element={<Login />}>
// 		 	<Route path="lecture" element={<Lecture />} />
// 		 </Route>
// 	 )
//  );
const router = createBrowserRouter([
	{
		path: "/",
		element: <Login />
	},
	{
		path: "/lecture",
		element: <Lecture />
	},
]);
 
 // Create Root and render complete app
 createRoot(document.getElementById("root")).render(
	 <React.StrictMode>
		 <TopBar />
		 <RouterProvider router={router} />
	 </React.StrictMode>
 );