## yEnc
### Version 2.0 - Refactored for TypeScript and performance improvements

![CI](https://github.com/whoughton/yEnc/actions/workflows/ci.yml/badge.svg?branch=master)

A javascript implementation of yEnc, usable for node and browsers

### What is yEnc
yEnc is an encoding method which offers efficient and proper transmission for binaries on the Usenet (or by eMail and other applications).

Other encodings are BASE64, BinHex, UUencode, Quoted Printable, …

yEnc is NOT an audio format (as MP3) or a video format (as AVI, MOV, …) or a picture format (as GIF or JPEG).

### Documentation & Links
- [Overview](http://whoughton.github.io/yEnc/)
- [Detailed Documentation](http://whoughton.github.io/yEnc/docs/)
- [yEnc Wikipedia](https://en.wikipedia.org/wiki/YEnc)
- [yEnc website- out of order](http://www.yenc.org/)

## Performance Benchmarks

This library includes a benchmark suite (`npm run bench`) using [tinybench](https://github.com/tinylibs/tinybench) to measure encode/decode performance for ASCII, Unicode, and large strings.

### Methodology
- Benchmarks are run using Node.js v22+ on a modern Mac.
- Each test measures the average operations per second (ops/sec) for encoding and decoding various string types and sizes.
- The benchmark script is located at `bench.ts` and can be run with `npm run bench`.

### Results

| Operation         | Before Optimization | After Optimization | Change    |
|-------------------|--------------------|-------------------|-----------|
| encode (ascii)    | 939,753 ops/sec    | 949,856 ops/sec   | **+1%**   |
| decode (ascii)    | 3,131,047 ops/sec  | 3,193,687 ops/sec | **+2%**   |
| encode (unicode)  | 881,131 ops/sec    | 911,317 ops/sec   | **+3%**   |
| decode (unicode)  | 2,583,784 ops/sec  | 2,674,569 ops/sec | **+4%**   |
| encode (large)    | 2,276 ops/sec      | 2,382 ops/sec     | **+5%**   |
| decode (large)    | 6,857 ops/sec      | 6,972 ops/sec     | **+2%**   |

**Key optimizations:**
- Switched from array join to string concatenation for encode (faster for both small and large strings in JS engines)
- Used a Set for reserved character lookup (faster than Array.indexOf)
- Removed unnecessary function call overhead in tight loops

**How to run benchmarks:**
```sh
npm run bench
```

**Interpretation:**
- The library is highly performant for both ASCII and Unicode data.
- Encoding and decoding large strings is efficient and scales well.
- All optimizations are validated by a comprehensive test suite (`npm test`).


