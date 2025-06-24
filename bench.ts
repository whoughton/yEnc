import { Bench } from 'tinybench';
import yEnc from './index';

const ascii = 'Hello, World! 123 @#$%^&*()';
const unicode = 'Hello 世界 🌍 emoji 🚀';
const large = 'A'.repeat(10000) + '世界'.repeat(1000);

const asciiEncoded = yEnc.encode(ascii);
const unicodeEncoded = yEnc.encode(unicode);
const largeEncoded = yEnc.encode(large);

const bench = new Bench({ time: 100 });

bench
  .add('encode (ascii)', () => {
    yEnc.encode(ascii);
  })
  .add('decode (ascii)', () => {
    yEnc.decode(asciiEncoded);
  })
  .add('encode (unicode)', () => {
    yEnc.encode(unicode);
  })
  .add('decode (unicode)', () => {
    yEnc.decode(unicodeEncoded);
  })
  .add('encode (large)', () => {
    yEnc.encode(large);
  })
  .add('decode (large)', () => {
    yEnc.decode(largeEncoded);
  });

(async () => {
  await bench.run();
  console.table(bench.table());
})(); 