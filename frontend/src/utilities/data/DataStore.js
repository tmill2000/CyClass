/**
 * AUTHOR:	Adam Walters
 * CREATED:	11/22/2022
 * UPDATED:	02/05/2023
 */

import React from "react";
import { configureStore, createReducer, createAction } from "@reduxjs/toolkit";
import { Provider, useSelector } from "react-redux";

const LOCAL_STORAGE_KEY = "dataStore";

/**
 * Class responsible for the management of locally persistent data. The result of the import should be used directly:
 * ```
 * import DataStore from "./utilities/data/DataStore";
 * ...
 * DataStore.set("someKey", "exampleData");
 * const someData = DataStore.get("someKey");
 * ```
 */
class DataStore {

	/**
	 * Creates a DataStore, including the internal Redux store.
	 */
	constructor() {

		// Create reducer actions
		this.setAction = createAction("set", (key, value) => {
			return {
				payload: {
					key: key,
					value: value
				}
			}
		});
		this.clearAction = createAction("clear", (key) => {
			return {
				payload: {
					key: key
				}
			}
		});

		// Create reducer, which loads from local storage and keeps local storage updated
		const reducer = createReducer(() => {
			let savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
			if (savedData != null) {
				return JSON.parse(savedData);
			}
			return {};
		}, (builder) => {
			builder.addCase(this.setAction, (state, action) => {
				state[action.payload.key] = action.payload.value;
				localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
			});
			builder.addCase(this.clearAction, (state, action) => {
				delete state[action.payload.key];
				localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
			});
		});

		// Create store
		this.store = configureStore({
			reducer: reducer
		});

	}
	
	/**
	 * Returns the value at the given key.
	 * @param {String} key 
	 * @returns value at key
	 */
	get(key) {
		key = key.toString();
		return this.store.getState()[key];
	}

	/**
	 * Sets the value at the specified key, overriding the previous. The key-value pair will be saved in browser
	 * storage.
	 * @param {String} key 
	 * @param {*} value 
	 */
	set(key, value) {
		key = key.toString();
		this.store.dispatch(this.setAction(key, value));
	}

	/**
	 * Clears the value at the specified key. The key-value pair will be removed from browser storage as well.
	 * @param {String} key 
	 */
	clear(key) {
		key = key.toString();
		this.store.dispatch(this.clearAction(key));
	}

}

// DataStore global
const ds = new DataStore();
export default ds;

/**
 * Component that allows children elements to use the {@link useDataStoreValue()} hook.
 */
export function DataStoreProvider(props) {

	// Component
	return (
		<Provider store={ds.store}>
			{props.children}
		</Provider>
	);

}

/**
 * React hook for getting the value of a DataStore key and automatically updating upon it changing.
 * @param {String} key key of DataStore value to return/hook to
 */
export function useDataStoreValue(key) {

	// Use redux hook, but abstract away the state part
	return useSelector((state) => state[key]);

}