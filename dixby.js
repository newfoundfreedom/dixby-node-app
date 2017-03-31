/**
 * Created by joel on 3/30/17.
 */

// Access Modules
var keys = require('./keys.js'),
    fs = require('fs'),
    twitter = require('twitter'),
    inquirer = require('inquirer'),
    spotify = require('spotify');
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
            inquirer.prompt(['What song would you like me to find information about?']).then(function (answers) {
                var song = answers;
                console.log(answer);
            });
            spotifySongLookup();
            break;
        case 'Movies Info':
            MovieInfo();
            break;
        case 'Do What It Says':
            doWhatSays();
    }
});


function spotifySongLookup() {
    console.log('You did it!!');
}


function doWhatSays() {
    fs.readFile('random.txt', 'utf8', function (err, data) {
        console.log(`\nThis is the contents of random.txt:  ${data} \n`);
    });
}






