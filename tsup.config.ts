import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],    
  format: ["cjs","esm"],
  outDir: 'dist',
  outExtension: ({ format }) => ({ js: format ==='cjs' ? '.cjs' : '.mjs' }),
  dts: true,                
  sourcemap: true,         
  minify: true,                
  clean: true,               
  shims: true,            
  target: "node18",       
  external:["esbuild"],     
  noExternal: ["enquirer"],   
  esbuildOptions(options) {
    options.platform = "node";  
  },
});
