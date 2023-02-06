/**
 * AUTHOR:	Adam Walters
 * CREATED:	10/24/2022
 * UPDATED:	02/05/2023
 */

import React from "react";
import axios from "axios";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

import "./app.css";

import DataStore, { DataStoreProvider } from "./utilities/data/DataStore";

import Home from "./routes/Home";
import Lecture from "./routes/Lecture";
import Login from "./routes/Login";

import TopBar from "./components/TopBar";

// Set up axios to insert session ID into all requests
axios.interceptors.request.use((config) => {
	const sessionID = DataStore.get("sessionID");
	if (sessionID != null) {
		config.headers = Object.assign(config.headers || {}, { ["x-session-id"]: sessionID });
	}
	return config;
});

// Create router and bind paths to elements
const router = createBrowserRouter([
	{
		path: "/",
		element: <div>
			<TopBar />
			<Outlet />
		</div>,
		children: [
			{
				path: "",
				element: <Home />
			},
			{
				path: "login",
				element: <Login />
			},
			{
				path: "lecture",
				element: <Lecture />
			}
		]
	}
]);
 
// Create Root and render complete app
createRoot(document.getElementById("root")).render(
	//<React.StrictMode>
		<DataStoreProvider>
			<RouterProvider router={router} />
		</DataStoreProvider>
	//</React.StrictMode>
);