/**
 * Example file showing correct JSDoc format with type hints
 * This configuration requires all type hints to be manually added
 */

/**
 * User data interface for processing.
 */
export interface UserData
{
	id: number;
	name: string;
	email: string;
}

/**
 * Result of user processing operation.
 */
export interface ProcessedResult
{
	success: boolean;
	message: string;
	data?: UserData;
}

/**
 * Processes user data and validates email format.
 * @param {UserData} userData - The user data to process
 * @returns {ProcessedResult} The result of processing
 */
export function processUser(userData: UserData): ProcessedResult
{
	if (!userData.email.includes('@'))
	{
		return {
			success: false,
			message: 'Invalid email format'
		};
	}

	return {
		success: true,
		message: 'User processed successfully',
		data: userData
	};
}

/**
 * Example class demonstrating JSDoc with type hints.
 */
export class UserService
{
	/**
	 * The list of cached users.
	 */
	private users: UserData[] = [];

	/**
	 * Creates a new UserService instance.
	 * @param {string} apiKey - The API key for authentication
	 */
	constructor(private apiKey: string)
	{
		// Constructor implementation
	}

	/**
	 * Adds a new user to the service.
	 * @param {UserData} user - The user to add
	 * @returns {Promise<ProcessedResult>} The result of the operation
	 */
	public async addUser(user: UserData): Promise<ProcessedResult>
	{
		this.users.push(user);
		return {
			success: true,
			message: 'User added successfully'
		};
	}

	/**
	 * Finds a user by their ID.
	 * @param {number} id - The user ID to search for
	 * @returns {UserData | undefined} The found user or undefined
	 */
	public findUserById(id: number): UserData | undefined
	{
		return this.users.find(user => user.id === id);
	}

	/**
	 * Gets all users from the service.
	 * @returns {UserData[]} Array of all users
	 */
	public getUsers(): UserData[]
	{
		return [...this.users];
	}
}

/**
 * Configuration options for the application.
 */
export type ConfigOptions =
{
	debug: boolean;
	timeout: number;
	retries: number;
};

/**
 * Status codes for API responses.
 */
export enum StatusCode
{
	SUCCESS = 200,
	NOT_FOUND = 404,
	ERROR = 500
}

/**
 * Formats a greeting message with optional formatting.
 * @param {string} name - The name to greet
 * @param {{uppercase?: boolean, prefix?: string}} options - Formatting options
 * @param {boolean} [options.uppercase] - Whether to uppercase the message
 * @param {string} [options.prefix] - Optional prefix for the greeting
 * @returns {string} The formatted greeting message
 */
export function greet(name: string, options?: { uppercase?: boolean; prefix?: string }): string
{
	let message = `Hello, ${name}!`;

	if (options?.prefix)
	{
		message = `${options.prefix} ${message}`;
	}

	if (options?.uppercase)
	{
		message = message.toUpperCase();
	}

	return message;
}

/**
 * Filters an array of items based on a predicate function.
 * @param {T[]} items - The array of items to filter
 * @param {(item: T) => boolean} predicate - The filter predicate
 * @returns {T[]} The filtered array
 * @template T - The type of items in the array
 */
export function filterItems<T>(items: T[], predicate: (item: T) => boolean): T[]
{
	return items.filter(predicate);
}

/**
 * Async function that fetches data from an API.
 * @param {string} url - The URL to fetch from
 * @param {object} [options] - Optional fetch options
 * @returns {Promise<any>} The parsed JSON response
 * @throws {Error} If the fetch fails or response is not ok
 */
export async function fetchData(url: string, options?: RequestInit): Promise<any>
{
	const response = await fetch(url, options);

	if (!response.ok)
	{
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	return response.json();
}
