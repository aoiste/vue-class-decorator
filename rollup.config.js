import typescript from "rollup-plugin-typescript2";
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  input: "./src/main.ts",
  plugins: [
    typescript(),
    resolve(),
    commonjs({
        // non-CommonJS modules will be ignored, but you can also
        // specifically include/exclude files
        include: 'node_modules/**',  // Default: undefined
        // these values can also be regular expressions
        // include: /node_modules/
  
        // search for files other than .js files (must already
        // be transpiled by a previous plugin!)
        extensions: [ '.js', '.coffee' ],  // Default: [ '.js' ]
  
        // if true then uses of `global` won't be dealt with by this plugin
        ignoreGlobal: false,  // Default: false
  
        // if false then skip sourceMap generation for CommonJS modules
        sourceMap: false,  // Default: true
  
        // explicitly specify unresolvable named exports
        // (see below for more details)
        namedExports: { './module.js': ['foo', 'bar' ] },  // Default: undefined
  
        // sometimes you have to leave require statements
        // unconverted. Pass an array containing the IDs
        // or a `id => boolean` function. Only use this
        // option if you know what you're doing!
        ignore: [ 'conditional-runtime-dependency' ]
      })
  ],
  output: {
    file: "./dist/vue-ts.js",
    name: "VueDecorator",
    format: "umd",
    globals: {
        vue: "Vue"
    }
  },
  external: [ 'vue' ]
}