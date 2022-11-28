/**
 * AUTHOR:	Adam Walters
 * CREATED:	11/22/2022
 * UPDATED:	11/22/2022
 */

import { configureStore, createReducer, createAction } from "@reduxjs/toolkit";

const LOCAL_STORAGE_KEY = "dataStore";

/**
 * Class responsible for the management of saved data. The result of the import should be used directly:
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

	/**
	 * Returns the interal Redux store.
	 * @return Redux store
	 */
	getReduxStore() {
		return this.store;
	}

}

export default new DataStore();