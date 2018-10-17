import typescript from 'rollup-plugin-typescript';

export default {
  input: './src/vue-property-decorator.ts',
  output: {
    file: 'lib/vue-property-decorator.umd.js',
    format: 'umd',
    name: 'vue-property-decorator',
    exports: 'named',
    globals: {
      'vue': 'Vue',
      'vue-class-component': 'VueClassComponent'
    }
  },
  plugins: [
    typescript({ lib: ["es5", "es6", "dom"], target: "es5", experimentalDecorators: true, declaration: true, declarationDir: "lib" })
  ],
  external: [
    'vue', 'vue-class-component', 'reflect-metadata'
  ]
}