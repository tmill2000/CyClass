/**
 * AUTHOR:	Adam Walters
 * CREATED:	10/24/2022
 * UPDATED:	11/22/2022
 */

import React from "react";
import axios from "axios";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";

import "./app.css";

import DataStore from "./utilities/data/DataStore";

import Home from "./routes/Home";
import Lecture from "./routes/Lecture";
import Login from "./routes/Login";

import TopBar from "./components/TopBar";

// Set up axios to insert session ID into all requests
axios.interceptors.request.use((config) => {
	const sessionID = DataStore.get("sessionID");
	if (sessionID != null) {
		config.params = Object.assign(config.params || {}, { session_id: sessionID });
	}
	return config;
});

// Create router and bind paths to elements
const router = createBrowserRouter([
	{
		path: "/",
		element: <Login /> // <Home />
	},
	{
		path: "/login",
		element: <Login />
	},
	{
		path: "/lecture",
		element: <Lecture />
	},
]);
 
// Create Root and render complete app
createRoot(document.getElementById("root")).render(
	//<React.StrictMode>
		<Provider store={DataStore.getReduxStore()}>
			<TopBar />
			<RouterProvider router={router} />
		</Provider>
	//</React.StrictMode>
);