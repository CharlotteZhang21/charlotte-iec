const fs = require('fs-extra');
const archiver = require('archiver');
const glob = require('glob');
const admZip = require('adm-zip');

module.exports.zip = function(src, dest, regex, ignore) {

    return new Promise((resolve) => {

        var output = fs.createWriteStream(dest);
        var archive = archiver('zip', {
            zlib: { level: 9 } // Sets the compression level.
        });

        // listen for all archive data to be written
        // 'close' event is fired only when a file descriptor is involved
        output.on('close', function() {
            console.log('created ' + dest);
            resolve();
        });

        // good practice to catch this error explicitly
        archive.on('error', function(err) {
            throw err;
        });

        // pipe archive data to the file
        archive.pipe(output);

        var globSettings = {
            cwd: src
        };

        if(ignore) {
            globSettings.ignore = ignore;
        }

        // append files from a glob pattern
        archive.glob(regex || '*', globSettings);

        // finalize the archive (ie we are done appending files but streams have to finish yet)
        // 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
        archive.finalize();

    });
};

module.exports.unzip = function(src, dest, delZipAfter) {

    // reading archives
    var zip = new admZip(src);

    // extracts everything
    zip.extractAllTo(dest, true);

    if (delZipAfter === true) {
        fs.removeSync(src);
    }

    return dest;
};

// recursively unzip all zips inside a zip
module.exports.unzipAll = function(cwd) {

    var zipFiles = glob.sync('**/*.zip', { cwd: cwd });

    // console.log(zipFiles);

    if (zipFiles.length === 0) {
        //nothing left to unzip, exit
        return;
    }

    var src, dest;

    for (var i = 0; i < zipFiles.length; i++) {

        src = cwd + zipFiles[i];
        dest = cwd + zipFiles[i].substring(0, zipFiles[i].lastIndexOf('.'));

        this.unzip(src, dest, true);
    }

    this.unzipAll(cwd);
};