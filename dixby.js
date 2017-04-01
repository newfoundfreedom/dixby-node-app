/**
 * Created by Joel Roberts on 3/30/17.
 */

// Access Modules
const keys = require('./keys.js'),
    fs = require('fs'),
    twitter = require('twitter'),
    inquirer = require('inquirer'),
    spotify = require('spotify'),
    request = require('request');


inquirer.prompt([
    {
        type: 'list',
        message: 'Select Command',
        choices: ['My Tweets', 'Spotify Song Lookup', 'Movies Info', 'Do What It Says'],
        name: "choice"
    }
]).then(function (data) {

    switch (data.choice) {
        case 'My Tweets':
            myTweets();
            break;
        case 'Spotify Song Lookup':
            let songTitle = 'descenso';
            // inquirer.prompt(['What song would you like me to find information about?']).then(function (answers) {
            //     var song = answers;
            //     console.log(answer);
            // });
            spotifySongLookup(songTitle);
            break;
        case 'Movies Info':
            movieInfo();
            break;
        case 'Do What It Says':
            doWhatSays();

    } // end switch

}); // end then


function myTweets() {
    console.log('This is where I will do my tweet lookup and reporting');
}


function spotifySongLookup(songTitle) {

    // lookup: function({ type: 'Shiny', id: 'Spotify ID Hash' }, hollaback)

    spotify.search({type: 'track', query: songTitle}, function (err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        }
        // get items array from JSON object
        let items = data.tracks.items;

        //for each track found, display the first artist name
        for (let i = 0; i < items.length; i++) {
            let song = items[i],
                artist = song.artists;
            if (artist.length > 1) {
                var artistsNames = [];
                for (let j = 0; j < artist.length; j++) {
                    artistsNames.push(artist[j].name);
                }
                console.log('   Artists: ' + artistsNames.toString());
            } else {
                console.log('   Artist: ' + song.artists[0].name);
            }
        }
    })
}


function movieInfo() {
    console.log('This is where I will do my movie lookup and reporting');
}


function doWhatSays() {
    fs.readFile('random.txt', 'utf8', function (err, data) {
        console.log(`\nThis is the contents of random.txt:  ${data} \n`);
    });
}







