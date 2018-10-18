import typescript from 'rollup-plugin-typescript2';

export default {
  input: './src/main.ts',
  output: {
    file: 'lib/vue-class-decorator.umd.js',
    format: 'umd',
    name: 'vue-cladd-decorator',
    exports: 'named',
    globals: {
      'vue': 'Vue',
      'vue-class-component': 'VueClassComponent'
    },
  },
  plugins: [
    typescript({ lib: ["es5", "es6", "dom"], target: "es5", declaration: true, declarationDir: "lib" })
  ],
  external: [
    'vue', 'vue-class-component', 'reflect-metadata'
  ]
}