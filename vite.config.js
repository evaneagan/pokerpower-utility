export default {
  build: {
    lib: {
      entry: 'src/index.js', // or wherever your main file is
      name: 'PokerPower',
      formats: ['iife'],
      fileName: () => 'pokerpower-utility.js', // <- Clean name!
    }
  }
}