const fs = require('fs-extra');
const glob = require('glob');

const zipper = require('./zipper.js');

const chalk = require('chalk');


// var originaldir = 'psdToPNG_Output';    
// var outputBundleDir = 'outputBundles';

var tempDir = 'temp';

module.exports.zipAll = async function(originaldir, outputBundleDir){
	

	await fs.remove(outputBundleDir);
	await fs.ensureDir(outputBundleDir);  


	var folders = glob.sync(originaldir + '/*');

	var folder;
	for (var i = 0; i < folders.length; i++) {
		folder = folders[i];
		
		bundleName = folder.replace(originaldir+'/', '').replace('.zip', '');
			
		await fs.ensureDir(tempDir);

		await fs.copy(folder, tempDir);

		//create a new temporary directory for copy the things in, and then zip this to the target folder
		await zipper.zip(tempDir, outputBundleDir + '/' + bundleName + '.zip');

		console.log(chalk.red(`zip --- ${i/folders.length * 100}% done`));

	}

	await fs.remove(tempDir);
}