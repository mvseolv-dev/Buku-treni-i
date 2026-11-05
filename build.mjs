import {mkdir,copyFile,cp,rm} from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});
await mkdir('dist');
for(const file of ['index.html','style.css','app.js','training.js','icon.svg'])await copyFile(file,`dist/${file}`);
await cp('assets','dist/assets',{recursive:true});
console.log('Static site built in dist/');
