/*
Copyright Netfoundry, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { isNull } from 'lodash-es';
import localforage from 'localforage/src/localforage.js';


/**
 *    ZitiBrowzerLocalStorage
 */
 class ZitiBrowzerLocalStorage {

	/**
	 * 
	 */
	constructor(options) {
		localforage.config({
			driver      : localforage.INDEXEDDB,
			name        : 'ziti_browzer_runtime',
			version     : 1.0,
			storeName   : 'ziti_browzer_runtime_db', // Should be alphanumeric, with underscores.
			description : 'Ziti BrowZer Runtime database'
		});		
	}

	/**
	 *	Save specified value under specified key
	 *	as well as the time when it's supposed to lazily expire
	 *
	 * @param {Object} key
	 * @param {Object} value
	 * @param {Object} ttl
	 */  
	setWithExpiry = async (key, value, ttl) => {
		return new Promise( async (resolve, reject) => {
			if (isNull( ttl )) {
				ttl = new Date(8640000000000000);
			}
			if (Object.prototype.toString.call(ttl) === '[object Date]') {
				ttl = ttl.getTime();
			}
			const item = {
				value: value,
				expiry: ttl,
				expiryDate: new Date( ttl ),
			}
			await localforage.setItem(key, item);
			resolve();
		});
	}

	/**
	 *	Return value for specified key
	 *	or null if not found, or expired.
	 *
	 * @param {Object} key
	 * @return {Object} value
	 */  
	getWithExpiry = async (key) => {
		return new Promise( async (resolve, reject) => {

			const item = await localforage.getItem(key)
			// if the item doesn't exist, return null
			if (isNull(item)) {
				resolve( null );
			} else {
				const now = new Date()
				// compare the expiry time of the item with the current time
				if ( (!isNull(item.expiry)) && (now.getTime() > item.expiry) ) {
					// If the item is expired, delete the item from storage and return null
					await localforage.removeItem(key)
					resolve( null );
				} else {
					resolve( item.value );
				}
			}
		});
	}

	/**
	 *	Return expiry value for specified key
	 *	or null if not found, or expired.
	 *
	 * @param {Object} key
	 * @return {Object} expiry value
	 */  
	getExpiry = async (key) => {
		return new Promise( async (resolve, reject) => {

			const item = await localforage.getItem(key)
			// if the item doesn't exist, return null
			if (isNull(item)) {
				resolve( null );
			} else {
				const now = new Date()
				// compare the expiry time of the item with the current time
				if ( (!isNull(item.expiry)) && (now.getTime() > item.expiry) ) {
					// If the item is expired, delete the item from storage and return null
					await localforage.removeItem(key)
					resolve( null );
				} else {
					resolve( item.expiry );
				}
			}
		});
	}

	/**
	 *	Return value for specified key
	 *	or null if not found.
	 *
	 * @param {Object} key
	 * @return {Object} value
	 */  
	get = async (key) => {
		const item = await localforage.getItem(key)
		// if the item doesn't exist, return null
		if (isNull(item)) {
			// resolve( null );
			return( null );
		} else {
			// resolve(item.value);
			return(item.value);
		}
	}


	/**
	 *	Remove value for specified key
	 * 
	 * @param {*} key 
	 */
	removeItem = async (key) => {
		await localforage.removeItem( key );
	}

}

export {
	ZitiBrowzerLocalStorage
}
  