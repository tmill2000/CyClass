/**
 * AUTHOR:	Adam Walters
 * CREATED:	10/24/2022
 * UPDATED:	04/15/2023
 */

import React from "react";
import axios from "axios";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

import "./app.css";

import "./utilities/extensions";
import { DataStoreProvider } from "./utilities/data/DataStore";
import LocalUser from "./utilities/model/LocalUser";

import ErrorPage from "./routes/ErrorPage";
import Home from "./routes/Home";
import Course from "./routes/Course";
import Lecture from "./routes/Lecture";
import Login from "./routes/Login";
import SignUp from "./routes/SignUp";
import HomePage from "./routes/HomePage";

import TopBar from "./components/TopBar";
import ToastContainer from "./components/Toast";
import ParticipationForm from "./routes/Polls/PollParticipationForm";

// Set up axios to insert session ID into all requests
axios.interceptors.request.use((config) => {
	const sessionID = LocalUser.current?.sessionID;
	if (sessionID != null) {
		config.headers = Object.assign(config.headers || {}, { ["x-session-id"]: sessionID });
	}
	return config;
});

// Create router and bind paths to elements
const router = createBrowserRouter([
	{
		path: "/",
		element: <div id="main">
			<TopBar />
			<Outlet />
			<ToastContainer />
		</div>,
		errorElement: <div id="main">
			<TopBar />
			<ErrorPage />
			<ToastContainer />
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
				path: "course/:courseID",
				element: <Course />
			},
			{
				path: "course/:courseID/lecture/:lectureID",
				element: <Lecture />
			},
			{
				path: "course/:courseID/lecture/:lectureID/results",
				element: <ParticipationForm />
			},
			{
				path: "signup",
				element: <SignUp />
			},
			{
				path: "home",
				element: <HomePage />
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