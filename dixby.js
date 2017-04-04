// Created by Joel Roberts on 3/30/17.


// GLOBAL SETTINGS /////////////////////////////////////////////////////////////////////////////////////////////////////

// Access Modules
const keys = require('./keys.js'),
    fs = require('fs'),
    twitter = require('twitter'),
    inquirer = require('inquirer'),
    spotify = require('spotify'),
    request = require('request'),
    colors = require('colors'),
    moment = require('moment'),
    linewrap = require('linewrap'),
    toTitleCase = require('titlecase');


// Global Variables
let artistsName,
    resultQty,
    RTRating,
    tweetWho;


// INITIAL USER INTERFACE //////////////////////////////////////////////////////////////////////////////////////////////

// Prompt user for function to run
inquirer.prompt([
    {
        type: 'list',
        message: 'Select Command',
        choices: ['Tweet Tweet', 'Spotify Song Lookup', 'Movies Info', 'Do What It Says'],
        name: 'choice'
    }
]).then(function (data) {
    switch (data.choice) {

        // if user chooses 'My Tweets' then ...
        case 'Tweet Tweet':
            inquirer.prompt([
                {
                    message: 'Who\'s tweets would you like to catch up on?',
                    type: 'list',
                    choices: ['Donald Trump', 'Barack Obama', 'Tim Cook',
                        'Elon Musk', 'Sundar Pichai', 'Bill Gates', 'Joel Roberts'],
                    name: 'who'
                }
            ]).then(function (data) {
                switch (data.who) {
                    case 'Donald Trump':
                        tweetWho = 'realDonaldTrump';
                        break;
                    case 'Barack Obama':
                        tweetWho = 'BarackObama';
                        break;
                    case 'Tim Cook':
                        tweetWho = 'tim_cook';
                        break;
                    case 'Elon Musk':
                        tweetWho = 'elonmusk';
                        break;
                    case 'Sundar Pichai':
                        tweetWho = 'sundarpichai';
                        break;
                    case 'Bill Gates':
                        tweetWho = 'BillGates';
                        break;
                    case 'Joel Roberts':
                        tweetWho = 'newfoundfreedom';
                }
                myTweets(tweetWho);
            });
            break;

        // if user chooses 'Spotify Song Lookup' then ...
        case 'Spotify Song Lookup':
            // prompt user to supply a song title
            inquirer.prompt([
                {
                    message: 'What\'s the song title?',
                    type: 'input',
                    name: 'title',
                    // check to ensure that user didn't just hit enter
                    validate: function validTitle(title) {
                        if (title === '') {
                            // if no input given then display error message until they supply a valid response
                            console.log('\n  >> Please provide a valid song title'.red);
                        }
                        return title !== '';
                    }
                }
            // once a valid response has been give - pass that response into the spotifySongLookup function
            ]).then(function (song_data) {
                let songTitle = song_data.title;
                spotifySongLookup(songTitle);
            });
            break;

        // if user response is 'Movie Info'
        case 'Movies Info':
            // prompt user to supply a movie title
            inquirer.prompt([
                {
                    message: 'What movie would you like me to look up?',
                    type: 'input',
                    name: 'title',
                    // check to ensure that user didn't just hit enter
                    validate: function validTitle(title) {
                        if (title === '') {
                            // if no input given then display error message until they supply a valid response
                            console.log('\n  >> Please provide a valid movie title'.red);
                        }
                        return title !== '';
                    }
                }
                // once a valid response has been give - pass that response into the movieInfo function
            ]).then(function (movie_data) {
                let movieTitle = movie_data.title;
                movieInfo(movieTitle);
            });
            break;

        case 'Do What It Says':
            doWhatSays();
    } // end switch
}); // end then


// FUNCTION OPTIONS ////////////////////////////////////////////////////////////////////////////////////////////////////

// TWITTER FUNCTION //
function myTweets(who) {
    // setup keys for Twitter
    let client = new twitter({
        consumer_key: keys.twitterKeys.consumer_key,
        consumer_secret: keys.twitterKeys.consumer_secret,
        access_token_key: keys.twitterKeys.access_token_key,
        access_token_secret: keys.twitterKeys.access_token_secret
    });
    // set parameters for twitter request
    let params = {
        screen_name: who,
        count: 20
    };
    // request 20 most recent tweets
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (error) {
            throw error;
        }
        else {
            // Wrap lines specified with the following parameters
            let wrap = linewrap(75);
            // Loop through all tweets formatting and displaying them
            for (let i = 0; i < tweets.length; i++) {
                let timeDate = moment(tweets[i].created_at, 'ddd MMM DD HH:mm:ss Y YYYY'),
                    tDay = timeDate.format('dddd'),
                    tDate = timeDate.format('L'),
                    tTime = timeDate.format('LT'),
                    tweetText = tweets[i].text;
                // display
                console.log('\n' + tDay.cyan + ', '.cyan + tDate.cyan +
                            ' at '.cyan + tTime.cyan);
                console.log((wrap(tweetText)))
                console.log('...........................................................................'.gray.bold);
            } // end for loop through tweets
        } // end else statement (no eroor)
    }); // end twitter .get request
} // myTweets function


// SPOTIFY FUNCTION //
//  function searches Spotify for user specified song.  If results are found, then the top 3 songs will be shown.

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
            // warn the user that their song was not found
            console.log('\n >> !! I can\'t seem to locate any song named "'.red + songTitle.red + '"\n'.red +
                ' >> Why don\'t you check out this 90\'s pop sensation instead.\n'.red);
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
            if (songTitle === 'The Sign - Ace of Base') {
                //  then set resultQty to just 1
                resultQty = 1;
            }
            // if 3 or more songs were found, then limit the results to the top 3 songs
            else if (tracksFoundQty >= 3) {
                console.log('\n  >> Here are the top 3 results for "'.yellow + (toTitleCase(songTitle)).yellow.bold + '"\n'.yellow);
                resultQty = 3;
            }
            // if 1 or 2 songs are found, then limit results to the number found
            else if (tracksFoundQty !== 0) {
                console.log('\n    Here are the top results for \''.yellow + songTitle.yellow.bold + '\'\n');
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
                    artistsName = artistsArray.join(', ');
                }
                // else if only one artist then set capture the artist's name
                else {
                    artistsName = songArtists[0].name;
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


// OMDB FUNCTION //
//  function searches OMDB for user specified movie.  If results are found, then movie data is shown.
function movieInfo(movieTitle) {

    // If movie title is more than one word, then place a '+' between each for URL call
    let movieArray = movieTitle.split(' ').join('+');

    // Obtain a JSON object utilizing the request module
    request('http://www.omdbapi.com/?t=' + movieTitle + '&y=&plot=short&tomatoes=true&r=json', function (error, response, body) {

        // If there were no errors and the response code was successful
        if (!error && response.statusCode === 200) {

            // if users movie is not found - suggest checkout 'Mr. Nobody'
            if (JSON.parse(body).Error === 'Movie not found!') {
                // warn the user that their song was not found
                console.log('\n >> !! I can\'t seem to locate the movie "'.red + movieTitle.red.bold + '"\n'.red +
                    ' >> But, you should stop whatever your doing to watch this movie instead.\n'.red);
                // pass in 'Mr. Nobody' to the movieInfo function instead
                movieInfo('Mr Nobody')
            }
            else {
                // set object to movie variable
                let movie = JSON.parse(body);

                // if movie is not Mr Nobody, then show message for user movie
                if (movieTitle !== 'Mr Nobody') {
                    console.log('\n >> Here is the information I found for "'.yellow + (toTitleCase(movieTitle)).yellow.bold + '"\n'.yellow)
                }

                // Wrap lines specified with the following parameters
                let wrap = linewrap(75, {
                    lineBreak: '\r\n',
                    wrapLineIndent: 24
                });

                // print movie data obtained from object on command line
                console.log('           Movie Title: '.cyan + movie.Title);
                console.log('                  Year: '.cyan + movie.Year);
                console.log('                  Plot: '.cyan + (wrap(movie.Plot)));
                console.log('                Actors: '.cyan + movie.Actors);
                console.log('               Country: '.cyan + movie.Country);
                console.log('              Language: '.cyan + movie.Language);
                console.log('           IMDB Rating: '.cyan + movie.imdbRating);

                // loop through the ratings array and check to see if the Rotten Tomatoes rating exists
                for (let i = 0; i < movie.Ratings.length; i++) {
                    // if it does, set variable RTRating equal to the Rotten Tomatoes rating value and report
                    if (movie.Ratings[i].Source === 'Rotten Tomatoes') {
                        RTRating = movie.Ratings[i].Value;
                        console.log('Rotten Tomatoes Rating: '.cyan + RTRating);
                    } // end if
                } // end loop

                // if no Rotten Tomatoes rating was found, then report that its Not Available
                if (typeof RTRating === 'undefined') {
                    console.log('Rotten Tomatoes Rating: '.cyan + 'N/A')
                } // end if

                console.log('  Rotten Tomatoes Link: '.cyan + movie.tomatoURL + '\n');

            } // end else - movie was found
        } // end if - response was successful
    }); // end OMDB request
} // end movieInfo function


// READ TXT FILE FOR INSTRUCTIONS FUNCTION \\
function doWhatSays() {
    fs.readFile('random.txt', 'utf8', function (err, data) {
        console.log(`\nThis is the contents of random.txt:  ${data} \n`);
    });
}




