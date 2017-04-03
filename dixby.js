// Created by Joel Roberts on 3/30/17.


// Access Modules
const keys = require('./keys.js'),
    fs = require('fs'),
    twitter = require('twitter'),
    inquirer = require('inquirer'),
    spotify = require('spotify'),
    request = require('request'),
    colors = require('colors');

// Global Variables
let resultQty;


// Prompt user for function to run
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
            inquirer.prompt([
                {
                    type: "input",
                    name: "title",
                    message: "What's the song title?"
                },
            ]).then(function (song_data) {
                let songTitle = song_data.title;
                spotifySongLookup(songTitle);
            });
            break;
        case 'Movies Info':
            inquirer.prompt([
                {
                    type: "input",
                    name: "title",
                    message: "What movie would you like me to look up?"
                },
            ]).then(function (movie_data) {
                let movieTitle = movie_data.title;
                movieInfo(movieTitle);
            });
            break;
        case 'Do What It Says':
            doWhatSays();

    } // end switch
}); // end then


function myTweets() {
    console.log('This is where I will do my tweet lookup and reporting');
}


// function to search Spotify for user specified song.  If results are found,
//   then the top 3 songs will be shown.
function spotifySongLookup(songTitle) {

    // query spotify for song specified by user
    spotify.search({type: 'track', query: songTitle}, function (err, data) {
        // on error - display the error message
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        }

        // if no tracks are found based on user input, then ...
        if (data.tracks.items.length < 1) {
            // and suggest a cheezy 90's hit instead!
            spotifySongLookup('The Sign - Ace of Base');
        }

        // if tracks WERE found, then...
        else {
            // get items(tracks) array from JSON object stored as variable
            let items = data.tracks.items,
                // store number of tracks found
                tracksFoundQty = items.length;


            // if users input yielded no results and 'Ace of Base' was substituted
            //  then set resultQty to just 1
            if (songTitle === 'The Sign - Ace of Base') {
                // warn the user that their song was not found
                console.log('\n !! I can\'t seem to locate the song your looking for.\n'.red +
                    '      Why don\'t you check out this 90\'s pop sensation instead.\n'.red);
                // limit the result to just the 'Ace of Base' suggestion
                resultQty = 1;
            }
            // else if 3 or more songs were found, then limit the results to the top 3 songs
            else if (tracksFoundQty >= 3) {
                console.log('\n    Here are the top 3 results for \''.cyan + songTitle.cyan + '\'\n');
                resultQty = 3;
            }
            // else if 1 or 2 songs are found, then limit results to the number found
            else if (tracksFoundQty !== 0) {
                console.log('\n    Here are the top results for \''.cyan + songTitle.cyan + '\'\n');
                resultQty = tracksFoundQty;
            }

            // for each track found up to the results limit ...
            for (let i = 0; i < resultQty; i++) {

                // capture the track array, artists array, song title, and preview link
                let song = items[i],
                    songArtists = song.artists,
                    songName = song.name,
                    albumName = song.album.name,
                    previewLink = song.preview_url;

                // check to see if there is more than one artist in artist array
                if (songArtists.length > 1) {
                    let artistsArray = [];
                    // if there is more than one, then loop through all artists pushing them into an array
                    for (let j = 0; j < songArtists.length; j++) {
                        artistsArray.push(songArtists[j].name);
                    }
                    // once all artists names have been collected, then output that list as a string
                    var artistsName = artistsArray.join(', ');
                }
                // else if only one artist then set capture the artist's name
                else {
                    var artistsName = songArtists[0].name;
                }

                //output results to the command line
                console.log('    Song Title: '.cyan + songName);
                console.log('     Artist(s): '.cyan + artistsName);
                console.log('         Album: '.cyan + albumName);
                console.log('       Preview: '.cyan + previewLink);
                console.log('...............................................................................................\n'.gray.bold);

            } // end each track for-loop
        } // end else statement if good data is found
    }) // end Spotify search function
} // end spotifySongLookup function


function movieInfo(movieTitle) {

    // If movie title is more than one word, then place a '+' between each for
    //   URL call
    let movieArray = movieTitle.split(' ').join('+');

    // Obtain a JSON object utilizing the request module
    request('http://www.omdbapi.com/?t=' + movieTitle + '&y=&plot=short&tomatoes=true&r=json', function (error, response, body) {

        // If there were no errors and the response code was successful
        if (!error && response.statusCode === 200) {
            // set object to movie variab
            // le
            let movie = JSON.parse(body);

            // print movie data obtained from object on command line
            // console.log('\n\n\nMovie Info'.blue);
            // console.log('\n\nMOVIE INFO ============'.bold);
            console.log('\n           Movie Title: '.cyan + movie.Title);
            console.log('                  Year: '.cyan + movie.Year);
            console.log('                  Plot: '.cyan + movie.Plot);
            console.log('                Actors: '.cyan + movie.Actors);
            console.log('               Country: '.cyan + movie.Country);
            console.log('              Language: '.cyan + movie.Language);
            console.log('           IMDB Rating: '.cyan + movie.imdbRating);
            console.log('Rotten Tomatoes Rating: '.cyan + movie.Ratings[1].Value);
            console.log('  Rotten Tomatoes Link: '.cyan + movie.tomatoURL + '\n');
        }
    });

}


function doWhatSays() {
    fs.readFile('random.txt', 'utf8', function (err, data) {
        console.log(`\nThis is the contents of random.txt:  ${data} \n`);
    });
}








