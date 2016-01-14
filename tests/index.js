'use strict';

var expect = require('chai').expect;
var yEnc = require('../index');

describe('yEnc', function() {
	var sourceBytes =  [83,97,110,115,107,114,105,116,58,32,224,164,149,224,164,190,224,164,154,224,164,130,32,224,164,182,224,164,149,224,165,141,224,164,168,224,165,139,224,164,174,224,165,141,224,164,175,224,164,164,224,165,141,224,164,164,224,165,129,224,164,174,224,165,141,32,224,165,164,32,224,164,168,224,165,139,224,164,170,224,164,185,224,164,191,224,164,168,224,164,184,224,165,141,224,164,164,224,164,191,32,224,164,174,224,164,190,224,164,174,224,165,141,32,224,165,165];
	var sourceString = "Sanskrit: काचं शक्नोम्यत्तुम् । नोपहिनस्ति माम् ॥";
	var encoded = "}dJ=JÎ¿=JÎè=JÎÄ=JÎ¬J=JÎà=JÎ¿=JÏ·=JÎÒ=JÏµ=JÎØ=JÏ·=JÎÙ=JÎÎ=JÏ·=JÎÎ=JÏ«=JÎØ=JÏ·J=JÏÎJ=JÎÒ=JÏµ=JÎÔ=JÎã=JÎé=JÎÒ=JÎâ=JÏ·=JÎÎ=JÎéJ=JÎØ=JÎè=JÎØ=JÏ·J=JÏÏ";
	
	describe('encode', function() {
		it('Encodes the provided string.', function() {
			let test = yEnc.encode(sourceString);
			
			expect(test).to.equal(encoded);
		});
	});
	
	describe('encodeBytes', function() {
		it('Encodes the provided array of bytes (as integers).', function() {
			let testBytes = yEnc.encodeBytes(sourceBytes);
			
			expect(testBytes).to.equal(encoded);
		});

		it('Encoded bytes matches the encoded string.', function() {
			let testBytes = yEnc.encodeBytes(sourceBytes);
			let testString = yEnc.encode(sourceString);
			
			expect(testBytes).to.equal(testString);
		});
	});
	
	describe('decode', function() {
		it('Decodes the encoded string to the expect source string.', function() {
			let test = yEnc.decode(encoded);
			
			expect(test).to.equal(sourceString);
		});
	});
	
	describe('decodeBytes', function() {
		it('Decodes the provided string into the expect array of bytes (as integers).', function() {
			let test = yEnc.decodeBytes(encoded);
			
			expect(test).to.eql(sourceBytes);
		});
	});
});
