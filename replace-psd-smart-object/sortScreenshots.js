const fs = require('fs-extra'),
    glob = require('glob'),
    PSD = require('psd'),
    PNG = require('pngjs').PNG,
    zipper = require('./zipper.js');
// const date = new Date(mtime);


const appArray = [
    "Empires & Puzzles_Adv_And ",
    "Candy Crush Saga ",
    "Lords Mobile_Adv_Android_New ",
    "Candy Crush Friends Saga_Adv_And ",
    "Bubble Witch 3 Saga Android ",
    "Merge Plane_Adv_Android ",
    "KONAMI Slots_Adv_Anrd ",
    "Idle Heroes_Android_Adv ",
    "Merge Dragons! Android ",
    "TikTok_Adv_Android ",
    "Color by Number – New Coloring Book ",
    "Fastlane: Road to Revenge_Adv_And ",
    "Best Fiends_Adv_And ",
    "Woody Puzzle Android ",
    "Galaxy Attack Android ",
    "Homescapes_Adv_And ",
    "World War Rising_Adv_And ",
    "Word Cookies_Adv_Android ",
    "Matchington Mansion_Adv_Android ",
    "Bingo Party Crazy Bingo Tour_Adv_Android ",
    "Word Swipe ",
    "Angry Birds Dream Blast_Adv_And ",
    "Bid Wars_Adv_And ",
    "Tomb of the Mask ",
    "New YAHTZEE With Buddies_Adv_And ",
    "Candy Crush Soda Saga Android ",
    "Mobile Royale_Adv_Android_NEW ",
    "Slots Era_Adv_And ",
    "Township Android ",
    "Block! Hexa Puzzle_Adv_Android ",
    "Lucky Day - Win Real Money! Android ",
    "Blackjack 21 Android ",
    "King's Raid_Adv_Android ",
    "Looney Tunes World of Mayhem_Adv_And ",
    "Sniper Arena: PvP Army Shooter_Adv_Android ",
    "Gummy Drop! Android ",
    "Era of Celestials_Adv_Android ",
    "Scatter Slots: Fun FREE Casino ",
    "Idle Miner Tycoon_Adv_And ",
    "Paperio2_Adv_Android ",
    "Angry Birds Match Android ",
    "Star Trek: Fleet Command Android ",
    "War and Magic_ Adv_Android ",
    "Wizard of Oz Slots_Adv_Anrd ",
    "Spades Plus - ",
    "Game of Thrones: Conquest™_Adv_And ",
    "DoubleU Casino - FREE Slots ",
];

main();

async function main() {

    var bundles = glob.sync('Gstore screenshots/*.png');

    // var dir = 'Gstore screenshots/';

    // fs.readdir(dir, function(err, files){
    //   files = files.map(function (fileName) {
    //     return {
    //       name: fileName,
    //       time: fs.statSync(dir + '/' + fileName).mtime.getTime()
    //     };
    //   })
    //   .sort(function (a, b) {
    //     return a.time - b.time; })
    //   .map(function (v) {
    //     return v.name; });
    // });  
    
    var png, newName = appArray[0];

    const oldPath = 'Gstore screenshots';
    // const newPath = 'landscape';
    const newPath = 'landscape';

    var currentBundle;

    var index = 0;

    for (var i = 0; i < bundles.length; i++) {
        
        // png = await PNG.sync.read(bundles);

        currentBundle = bundles[i];

        
        if(i%2 == 0 ){
            newName ='renameOutput/portrait/' + appArray[index] + 'portrait.png';
        }else {
            newName = 'renameOutput/landscape/'+ appArray[index] + 'landscape.png';
            index++;
        }
        
        
        await console.log(i + currentBundle + " " +newName);
                
        await fs.rename(currentBundle, newName, (err) => {
              if (err) throw err;
              console.log('Rename complete!');
            });

        // await fs.rename(currentBundle, newName, async function (err) {

            // console.log(currentBundle);
            // console.log(newName);
            // if (err) {
            //     if (err.code === 'EXDEV') {
            //         await copy();
            //     } else {
            //         // callback(err);
            //     }
            //     return;
            // }
        //     // callback();
        // });


        
    }

}


function copy() {
    var readStream = fs.createReadStream(oldPath);
    var writeStream = fs.createWriteStream(newPath);

    readStream.on('error', callback);
    writeStream.on('error', callback);

    readStream.on('close', function () {
        fs.unlink(oldPath, callback);
    });

    readStream.pipe(writeStream);
}