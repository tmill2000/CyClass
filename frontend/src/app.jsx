/**
 * AUTHOR:	Adam Walters
 * CREATED:	10/24/2022
 * UPDATED:	10/24/2022
 */

import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";

import "./routes/Login/styles.css";

import Root from "./routes/Root";

// Create the router, defining all routes
const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path="/" element={<Root />}>
			{/* any additional Routes should go here */}
		</Route>
	)
);

// Create Root and render complete app
createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);