const fs = require('fs-extra');

const glob = require('glob');

const zipper = require('./zipper.js');

const chalk = require('chalk');

const originalDir = 'psdToPNG_Output';

const zipAll = require('./zipAll.js');

const targetDir = 'organised_Output';

const outputBundleDir = 'outputBundles';

main();

async function main() {
	
	var files = glob.sync(originalDir + '/*.png');

	var currentFile;

	for (var i = 0; i < files.length; i++) {
		currentFile = files[i];

	    if(currentFile.indexOf('landscape')!== -1){
	 
	        appName = await currentFile.replace(originalDir + '/', '').replace('_landscape.png', '');    
	 
	        newFileName = 'landscape.png';
	 
	    }else if(currentFile.indexOf('portrait')!== -1) {
	 
	        appName = currentFile.replace(originalDir + '/', '').replace('_portrait.png', '');  
	 
	        newFileName = 'portrait.png';
	 
	    }

	    // console.log(appName);
	    console.log(targetDir + '/' + appName + '/' + newFileName);

	    await fs.copy(currentFile, targetDir + '/' + appName + '/' + newFileName);
	}


    await zipAll.zipAll(targetDir, outputBundleDir);

    await fs.remove(targetDir);

}