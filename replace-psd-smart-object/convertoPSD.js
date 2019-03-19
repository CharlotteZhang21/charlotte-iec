const fs = require('fs-extra');
const glob = require('glob');

const zipper = require('./zipper.js');

const chalk = require('chalk');

const PSD = require('psd');

const zipAll = require('./zipAll.js');


var outputDir = 'psdToPNG_Output';    
var outputBundleDir = 'outputBundles';

convert();

async function convert() {

    await fs.remove(outputDir);
    
    await fs.remove(outputBundleDir);

    await fs.ensureDir(outputDir);

    await fs.ensureDir(outputBundleDir);    
    
    

    var landscapeFolder = 'psd_template_landscape/output';
    var portraitFolder = 'psd_template_portrait/output';

    var landscapeFiles = glob.sync(landscapeFolder + '/*.psd');
    var portraitFiles = glob.sync(portraitFolder + '/*.psd');
    var files = landscapeFiles.concat(portraitFiles);

    var currentFile, psd, newFileName;

    var appName;

    for (var i = 0; i < files.length; i++) {
        
        currentFile = files[i];

        if(currentFile.indexOf('landscape')!== -1){
            appName = await currentFile.replace(landscapeFolder, '').replace('/GSTORE_landscape_', '').replace('landscape.psd', '');    
            newFileName = appName + '_landscape';
        }else if(currentFile.indexOf('GSTORE_portrait')!== -1) {
            appName = await currentFile.replace(portraitFolder, '').replace('/GSTORE_portrait_', '').replace('portrait.psd', '');    
            newFileName = appName + '_portrait';
        }

        var newPath = outputDir + '/' + newFileName + '.png';

        await PSD.open(currentFile).then(function(psd) {

            return psd.image.saveAsPng(newPath);

        }).then(function() {

            console.log(`${ i/files.length * 100}% finished`);

            console.log(chalk.blue(newPath));
        });

    }


    // await zipAll.zipAll(outputDir, outputBundleDir);

    // await fs.remove(outputDir);

}
