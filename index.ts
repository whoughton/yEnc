/**
 * yEnc: A minimal yEnc [en|de]coder for Node.js and browsers.
 *
 * @packageDocumentation
 * @see https://www.yenc.org/
 */

// ##### Private Variables
const reserved = new Set([0, 10, 13, 61]);

// ##### Private Methods

// #### toBytes()
// toBytes takes a UTF8 string and returns an array of bytes (as integers)
const toBytes = function(source: string): Uint8Array {
	if (typeof source !== 'string') {
		throw new TypeError('yEnc.encode expects a string input');
	}
	if (typeof TextEncoder !== 'undefined') {
		return new TextEncoder().encode(source);
	} else {
		// Fallback for environments without TextEncoder
		const output: number[] = [];
		for (const char of source) {
			const code = char.charCodeAt(0);
			if (code <= 0x7F) {
				output.push(code);
			} else {
				const subchar = encodeURIComponent(char).substr(1).split('%');
				for (const hex of subchar) {
					if (hex.length > 0) {
						output.push(parseInt(hex, 16));
					}
				}
			}
		}
		return new Uint8Array(output);
	}
};

// #### fromBytes()
// fromBytes turns an array of bytes (as integers) into a UTF8 string
const fromBytes = function(source: Uint8Array): string {
	if (!(source instanceof Uint8Array)) {
		throw new TypeError('yEnc.decodeBytes expects a Uint8Array');
	}
	if (typeof TextDecoder !== 'undefined') {
		return new TextDecoder('utf-8').decode(source);
	} else {
		let output = '';
		for (const byte of source) {
			if (byte <= 127) {
				if (byte === 37) {
					output += '%25';
				} else {
					output += String.fromCharCode(byte);
				}
			} else {
				output += `%${byte.toString(16).toUpperCase()}`;
			}
		}
		try {
			return decodeURIComponent(output);
		} catch (e) {
			throw new URIError('Malformed percent-encoding in yEnc.fromBytes');
		}
	}
};

// ##### Public Methods

// #### yEnc.encode()
// This is our encoding method for taking a text string and encoding it into the yEnc
// format, the output string is a UTF-8 string
const encode = function(source: string): string {
	if (typeof source !== 'string') {
		throw new TypeError('yEnc.encode expects a string input');
	}
	return encodeBytes(toBytes(source));
};

// #### yEnc.encodeBytes()
// This is our encoding method for taking a text string and encoding it into the yEnc
// format, the output string is a UTF-8 string
const encodeBytes = function(bytes: Uint8Array): string {
	if (!(bytes instanceof Uint8Array)) {
		throw new TypeError('yEnc.encodeBytes expects a Uint8Array');
	}
	
	// Pre-allocate string buffer for better performance
	let output = '';
	
	for (const byte of bytes) {
		const converted = (byte + 42) % 256;
		if (!reserved.has(converted)) {
			output += String.fromCharCode(converted);
		} else {
			const escaped = (converted + 64) % 256;
			output += `=${String.fromCharCode(escaped)}`;
		}
	}
	return output;
};

// #### yEnc.decode()
// This is our encoding method for taking a UTF-8 text string and decoding it into
// the original text string
const decode = function(source: string): string {
	if (typeof source !== 'string') {
		throw new TypeError('yEnc.decode expects a string input');
	}
	return fromBytes(decodeBytes(source));
};

// #### yEnc.decodeBytes()
// This is our encoding method for taking a UTF-8 text string and decoding it into
// the original bytes array
const decodeBytes = function(source: string): Uint8Array {
	if (typeof source !== 'string') {
		throw new TypeError('yEnc.decodeBytes expects a string input');
	}
	const output: number[] = [];
	let ck = false;
	
	for (const char of source) {
		const c = char.charCodeAt(0);
		// ignore newlines
		if (c === 13 || c === 10) { continue; }
		// if we're an "=" and we haven't been flagged, set flag
		if (c === 61 && !ck) {
			ck = true;
			continue;
		}
		if (ck) {
			ck = false;
			const adjusted = c - 64;
			if (adjusted < 42 && adjusted >= 0) {
				output.push(adjusted + 214);
			} else {
				output.push(adjusted - 42);
			}
		} else {
			if (c < 42 && c >= 0) {
				output.push(c + 214);
			} else {
				output.push(c - 42);
			}
		}
	}
	return new Uint8Array(output);
};

/**
 * Interface for the yEnc encoder/decoder API.
 *
 * @public
 */
export interface YEnc {
	/**
	 * Encode a string to yEnc format.
	 * @param source - The source string to encode.
	 * @returns The yEnc-encoded string.
	 */
	encode: (source: string) => string;
	/**
	 * Encode an array of bytes to yEnc format.
	 * @param bytes - The source bytes to encode.
	 * @returns The yEnc-encoded string.
	 */
	encodeBytes: (bytes: Uint8Array) => string;
	/**
	 * Decode a yEnc-encoded string to the original string.
	 * @param source - The yEnc-encoded string.
	 * @returns The decoded string.
	 */
	decode: (source: string) => string;
	/**
	 * Decode a yEnc-encoded string to the original bytes.
	 * @param source - The yEnc-encoded string.
	 * @returns The decoded bytes as a Uint8Array.
	 */
	decodeBytes: (source: string) => Uint8Array;
}

/**
 * The main yEnc API object. Use this for all encoding/decoding operations.
 *
 * @example
 * import yEnc from 'yenc';
 * const encoded = yEnc.encode('Hello');
 * const decoded = yEnc.decode(encoded);
 *
 * @see YEnc
 * @public
 */
const yEnc: YEnc = {
	encode,
	encodeBytes,
	decode,
	decodeBytes
};

export default yEnc;

// TypeScript global guards for UMD/AMD
// @ts-ignore
declare let module: any;
// @ts-ignore
declare let define: any;
// @ts-ignore
declare let window: any;

// Support for CommonJS
if (typeof module !== 'undefined' && module.exports) {
	module.exports = yEnc;
}

// Support for AMD/RequireJS
if (typeof define !== 'undefined' && define.amd) {
	define([], function() { return yEnc; });
}

// Support for browser globals
if (typeof window !== 'undefined') {
	window.yEnc = yEnc;
}
