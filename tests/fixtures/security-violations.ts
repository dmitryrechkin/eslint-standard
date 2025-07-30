/**
 * Security violations test file
 * This file contains intentional security vulnerabilities to test ESLint security rules
 */

import * as fs from 'fs';
import { exec } from 'child_process';
import * as crypto from 'crypto';

/**
 * Test eval usage violations
 */
export function testEvalViolations(): void {
	// security/detect-eval-with-expression
	const userInput = 'alert("xss")';
	eval(userInput); // Should trigger security/detect-eval-with-expression
}

/**
 * Test filesystem violations
 */
export function testFilesystemViolations(userPath: string): void {
	// security/detect-non-literal-fs-filename
	fs.readFile(userPath, 'utf8', (err, data) => {
		console.log(data);
	});
}

/**
 * Test regex violations
 */
export function testRegexViolations(userInput: string): boolean {	
	// security/detect-non-literal-regexp and security/detect-unsafe-regex
	const regex = new RegExp(userInput); // ReDoS vulnerability
	return regex.test('aaaaaaaaaaaaaaaaaaaaaaaaa!');
}

/**
 * Test buffer violations
 */
export function testBufferViolations(): void {
	const buffer = Buffer.alloc(10);
	
	// security/detect-buffer-noassert
	buffer.write('test', 0, 4, 'utf8', true); // noAssert parameter
}

/**
 * Test child process violations
 */
export function testChildProcessViolations(userCommand: string): void {
	// security/detect-child-process
	exec(userCommand, (error, stdout, stderr) => {
		console.log(stdout);
	});
}

/**
 * Test crypto violations
 */
export function testCryptoViolations(): void {
	// security/detect-pseudoRandomBytes
	const randomBytes = crypto.pseudoRandomBytes(16);
	console.log(randomBytes);
}

/**
 * Test secrets violations
 */
export class SecretsViolations {
	// no-secrets/no-secrets
	private readonly apiKey = 'AKIA1234567890123456'; // AWS-like key
	private readonly githubToken = 'ghp_1234567890abcdef1234567890abcdef123456'; // GitHub token
	private readonly jwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'; // JWT

	public authenticateUser(): void {
		// More secrets
		const password = 'super_secret_password_123!@#';
		const connectionString = 'mongodb://admin:password123@localhost:27017/mydb';
		
		console.log('Authenticating with:', this.apiKey);
	}
}

/**
 * Test timing attack violations
 */
export function testTimingAttacks(): void {
	const userToken = 'user_provided_token';
	const serverToken = 'server_secret_token';
	
	// security/detect-possible-timing-attacks
	if (userToken === serverToken) {
		return true;
	}
	return false;
}

/**
 * Test object injection violations
 */
export function testObjectInjection(userInput: string): any {
	const obj = {};
	
	// security/detect-object-injection
	return obj[userInput]; // Potential prototype pollution
}