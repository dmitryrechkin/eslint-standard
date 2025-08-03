/**
 * Security good practices test file
 * This file demonstrates secure coding practices
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

/**
 * Safe file operations
 */
export function safeFileOperations(): void {
	// Use literal paths and validate inputs
	const safePath = path.join(__dirname, 'data.txt');
	const normalizedPath = path.normalize(safePath);
	
	fs.readFile(normalizedPath, 'utf8', (err, data) => {
		if (err) {
			console.error('File read error:', err);
			return;
		}
		console.log('File content:', data);
	});
}

/**
 * Safe regex usage
 */
export function safeRegexUsage(): boolean {
	// Use literal regex patterns
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	const testEmail = 'user@example.com';
	
	return emailRegex.test(testEmail);
}

/**
 * Safe crypto operations
 */
export function safeCryptoOperations(): Buffer {
	// Use crypto.randomBytes instead of pseudoRandomBytes
	return crypto.randomBytes(32);
}

/**
 * Safe configuration management
 */
export class SecureConfig {
	private config: any;

	constructor() {
		// Load config from environment variables
		this.config = {
			apiUrl: process.env.API_URL || 'https://api.example.com',
			port: parseInt(process.env.PORT || '3000', 10)
		};
	}

	/**
	 * Get configuration value safely
	 */
	public getConfig(key: string): any {
		// Validate key before access
		if (!key || typeof key !== 'string') {
			throw new Error('Invalid config key');
		}
		
		return this.config[key];
	}
}

/**
 * Safe token comparison using constant-time comparison
 */
export function safeTokenComparison(userToken: string, serverToken: string): boolean {
	// Use crypto.timingSafeEqual for constant-time comparison
	if (!userToken || !serverToken || userToken.length !== serverToken.length) {
		return false;
	}
	
	const userBuffer = Buffer.from(userToken, 'utf8');
	const serverBuffer = Buffer.from(serverToken, 'utf8');
	
	return crypto.timingSafeEqual(userBuffer, serverBuffer);
}

/**
 * Safe object property access
 */
export function safeObjectAccess(obj: Record<string, any>, key: string): any {
	// Validate key and use hasOwnProperty
	if (!key || typeof key !== 'string') {
		throw new Error('Invalid key');
	}
	
	if (Object.prototype.hasOwnProperty.call(obj, key)) {
		return obj[key];
	}
	
	return undefined;
}