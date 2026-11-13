import {mkdir,copyFile,cp,rm} from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});
await mkdir('dist');
for(const file of ['index.html','style.css','app.js','hoops-data.js','motion-data.js','motion-extra.js','planner.js','court-marks.js','creator-model.js','creator-ui.js','creator.css','motion-player.js','motion.css','training.js','team-drills.js','pull-refresh.js','participation.js','photo-drills.js','extra-drills.js','diagrams.js','guides.js','additional-drills.js','manifest.webmanifest'])await copyFile(file,`dist/${file}`);
await cp('assets','dist/assets',{recursive:true});
console.log('Static site built in dist/');

