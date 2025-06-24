import { describe, it, expect } from 'vitest';
import yEnc from '../index';

describe('yEnc', () => {
	const sourceBytes = new Uint8Array([83,97,110,115,107,114,105,116,58,32,224,164,149,224,164,190,224,164,154,224,164,130,32,224,164,182,224,164,149,224,165,141,224,164,168,224,165,139,224,164,174,224,165,141,224,164,175,224,164,164,224,165,141,224,164,164,224,165,129,224,164,174,224,165,141,32,224,165,164,32,224,164,168,224,165,139,224,164,170,224,164,185,224,164,191,224,164,168,224,164,184,224,165,141,224,164,164,224,164,191,32,224,164,174,224,164,190,224,164,174,224,165,141,32,224,165,165]);
	const sourceString = "Sanskrit: काचं शक्नोम्यत्तुम् । नोपहिनस्ति माम् ॥";
	const encoded = "}dJ=JÎ¿=JÎè=JÎÄ=JÎ¬J=JÎà=JÎ¿=JÏ·=JÎÒ=JÏµ=JÎØ=JÏ·=JÎÙ=JÎÎ=JÏ·=JÎÎ=JÏ«=JÎØ=JÏ·J=JÏÎJ=JÎÒ=JÏµ=JÎÔ=JÎã=JÎé=JÎÒ=JÎâ=JÏ·=JÎÎ=JÎéJ=JÎØ=JÎè=JÎØ=JÏ·J=JÏÏ";
	
	describe('encode', () => {
		it('Encodes the provided string.', () => {
			const test = yEnc.encode(sourceString);
			expect(test).toBe(encoded);
		});

		it('Handles empty string', () => {
			const result = yEnc.encode('');
			expect(result).toBe('');
		});

		it('Handles ASCII-only string', () => {
			const asciiString = 'Hello, World!';
			const result = yEnc.encode(asciiString);
			expect(result).toBeTruthy();
			expect(typeof result).toBe('string');
		});

		it('Handles special characters that need escaping', () => {
			// Test characters that are in the reserved array [0, 10, 13, 61]
			const specialChars = String.fromCharCode(0) + String.fromCharCode(10) + String.fromCharCode(13) + '=';
			const result = yEnc.encode(specialChars);
			expect(result).toBeTruthy();
			expect(typeof result).toBe('string');
		});

		it('Round-trip test: encode then decode', () => {
			const testString = 'Test string with special chars: = \n \r \0';
			const encoded = yEnc.encode(testString);
			const decoded = yEnc.decode(encoded);
			expect(decoded).toBe(testString);
		});
	});
	
	describe('encodeBytes', () => {
		it('Encodes the provided array of bytes (as integers).', () => {
			const testBytes = yEnc.encodeBytes(sourceBytes);
			expect(testBytes).toBe(encoded);
		});

		it('Encoded bytes matches the encoded string.', () => {
			const testBytes = yEnc.encodeBytes(sourceBytes);
			const testString = yEnc.encode(sourceString);
			expect(testBytes).toBe(testString);
		});

		it('Handles empty byte array', () => {
			const result = yEnc.encodeBytes(new Uint8Array(0));
			expect(result).toBe('');
		});

		it('Handles bytes that need escaping (reserved characters)', () => {
			// Test bytes that will result in reserved characters after encoding
			const reservedBytes = new Uint8Array([214, 52, 47, 103]); // These will encode to reserved chars
			const result = yEnc.encodeBytes(reservedBytes);
			expect(result).toBeTruthy();
			expect(typeof result).toBe('string');
		});

		it('Handles boundary values (0-255)', () => {
			const boundaryBytes = new Uint8Array([0, 42, 127, 255]);
			const result = yEnc.encodeBytes(boundaryBytes);
			expect(result).toBeTruthy();
			expect(typeof result).toBe('string');
		});
	});
	
	describe('decode', () => {
		it('Decodes the encoded string to the expect source string.', () => {
			const test = yEnc.decode(encoded);
			expect(test).toBe(sourceString);
		});

		it('Handles empty string', () => {
			const result = yEnc.decode('');
			expect(result).toBe('');
		});

		it('Handles escaped characters', () => {
			// Test decoding of escaped characters (= followed by char)
			const escapedString = '=A=B=C'; // This should decode to specific bytes
			const result = yEnc.decode(escapedString);
			expect(result).toBeTruthy();
			expect(typeof result).toBe('string');
		});

		it('Ignores newlines in encoded string', () => {
			const encodedWithNewlines = encoded.replace(/./g, (char, index) => 
				index % 10 === 0 ? char + '\n' : char
			);
			const result = yEnc.decode(encodedWithNewlines);
			expect(result).toBe(sourceString);
		});

		it('Round-trip test: decode then encode', () => {
			const testEncoded = yEnc.encode('Test string');
			const decoded = yEnc.decode(testEncoded);
			const reEncoded = yEnc.encode(decoded);
			expect(reEncoded).toBe(testEncoded);
		});
	});
	
	describe('decodeBytes', () => {
		it('Decodes the provided string into the expect array of bytes (as integers).', () => {
			const test = yEnc.decodeBytes(encoded);
			expect(test).toEqual(sourceBytes);
		});

		it('Handles empty string', () => {
			const result = yEnc.decodeBytes('');
			expect(result).toEqual(new Uint8Array(0));
		});

		it('Handles escaped characters in decodeBytes', () => {
			const escapedString = '=A=B=C';
			const result = yEnc.decodeBytes(escapedString);
			expect(result instanceof Uint8Array).toBe(true);
			expect(Array.from(result).every(byte => typeof byte === 'number' && byte >= 0 && byte <= 255)).toBe(true);
		});

		it('Ignores newlines in decodeBytes', () => {
			const encodedWithNewlines = encoded.replace(/./g, (char, index) => 
				index % 10 === 0 ? char + '\n' : char
			);
			const result = yEnc.decodeBytes(encodedWithNewlines);
			expect(result).toEqual(sourceBytes);
		});
	});

	describe('Comprehensive round-trip tests', () => {
		it('ASCII round-trip', () => {
			const asciiString = 'Hello, World! 123 @#$%^&*()';
			const encoded = yEnc.encode(asciiString);
			const decoded = yEnc.decode(encoded);
			expect(decoded).toBe(asciiString);
		});

		it('Unicode round-trip', () => {
			const unicodeString = 'Hello 世界 🌍 emoji 🚀';
			const encoded = yEnc.encode(unicodeString);
			const decoded = yEnc.decode(encoded);
			expect(decoded).toBe(unicodeString);
		});

		it('Mixed content round-trip', () => {
			const mixedString = 'ASCII + Unicode: 世界 + Special: = \n \r \0';
			const encoded = yEnc.encode(mixedString);
			const decoded = yEnc.decode(encoded);
			expect(decoded).toBe(mixedString);
		});

		it('Large string round-trip', () => {
			const largeString = 'A'.repeat(1000) + '世界'.repeat(100);
			const encoded = yEnc.encode(largeString);
			const decoded = yEnc.decode(encoded);
			expect(decoded).toBe(largeString);
		});
	});

	describe('Edge cases and error handling', () => {
		it('Handles null input gracefully', () => {
			// @ts-ignore - Testing runtime behavior
			expect(() => yEnc.encode(null)).toThrow();
		});

		it('Handles undefined input gracefully', () => {
			// @ts-ignore - Testing runtime behavior
			expect(() => yEnc.encode(undefined)).toThrow();
		});

		it('Handles non-string input gracefully', () => {
			// @ts-ignore - Testing runtime behavior
			expect(() => yEnc.encode(123 as any)).toThrow();
		});

		it('Handles non-array input for encodeBytes gracefully', () => {
			// @ts-ignore - Testing runtime behavior
			expect(() => yEnc.encodeBytes('not an array' as any)).toThrow();
		});
	});
});
