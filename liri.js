// FILE SYSTEM package call
const fs = require('fs');

//MOMENT js to format the time
var moment = require('moment');

//AXIOS to get api from an HTTP request
const axios = require('axios');

//Spotify ID and SECRET ID protected with the dotenv package
require("dotenv").config();

// calling the file keys.js to obtain the format for the API keys
var keys = require("./keys.js");

// SPOTIFY api package api call
var Spotify = require('node-spotify-api');

//Displays hidden keys
var spotify = new Spotify(keys.spotify);

// Variable for the user input in the command line
// var songName = "gods plan" make that if song is left blank look for 'The Sign'

// spotify search for a specific song
function spotifySearch(songName){
    spotify.search({ type: 'track', query: songName }, function(err, response) {
        if (err) {
        return console.log('Error occurred: ' + err);
        }
    
        //gettng responses from the JSON object
    //   console.log(response.tracks.items);  //Object one with full info
    console.log(" Artist(s): "+response.tracks.items[0].album.artists[0].name); // Artist name
    console.log("\n The song's name: "+response.tracks.items[0].name); // song name
    console.log("\n A preview link of the song from Spotify: "+response.tracks.items[0].album.external_urls.spotify); //url for the song
    console.log("\n The album that the song is from: "+response.tracks.items[0].album.name); //album that the song is from
    });
}
  
//Variable that store the artist name
// var artist="maluma"

  // Make a request for BANDS IN TOWN
function concertSearch (artist){
    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
    .then(function (response) {
    // handle success
    var concerts = response.data
    //   console.log(concerts[0]); This is to get the JSON for bands in town
    for (var i=0; i<concerts.length; i++)
    {
          console.log(i)
          console.log(concerts[i].venue.name);
          console.log(concerts[i].venue.city+", "+concerts[i].venue.region+" "+concerts[i].venue.country);
          var concertDate = concerts[i].datetime
          console.log(moment(concertDate).format("MM DD YYYY"));
    }

    //   console.log(response.data.offers);
    })
    .catch(function (error) {
    // handle error
    console.log(error);
    })
    .finally(function () {
    // always executed
    });
}

//Variable that store the movie name
// var movieTitle="The hangover"

// Make a request for a user MOVIES OMDB
function movieSearch(movieTitle){
    axios.get('http://www.omdbapi.com/?&t='+movieTitle+'&apikey=b9005bf4')
    .then(function (response) {
        // handle success
        // console.log(response.data); This is to get the JSON for bands in town
        console.log("Title of the movie: " + response.data.Title) // Title of the movie
        console.log("\nYear the movie came out: "+ response.data.Year); 
        console.log("\nIMDB Rating of the movie: "+response.data.imdbRating);
        console.log("\nRotten Tomatoes Rating of the movie: "+response.data.Ratings[0].Value);
        console.log("\nCountry where the movie was produced: "+response.data.Country);
        console.log("\nLanguage of the movie: "+response.data.Language);
        console.log("\nPlot of the movie: "+response.data.Plot);
        console.log("\nActors in the movie: "+response.data.Actors);
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    })
    .finally(function () {
        // always executed
    });
}

//Reads the file and calls a function
function noInput(){
    fs.readFile("random.txt","utf8", function (error,data)
    {
    if (error)
    {
        console.log("there has been an error reading the file", error);
    }
    else
    {
        // console.log(data)
        // console.log(JSON.stringify(data))
        // console.log(data.slice(" "))
        var randomText = data.split(".");
        var randomInput = Math.floor(Math.random()*3);
        var liriDo = randomText[randomInput].split(",");
        if (liriDo[0] === "movie-this")
        {
            movieSearch(liriDo[1]);
        }
        else if (liriDo[0] === "spotify-this-song")
        {
            spotifySearch(liriDo[1]);
        }
        else if (liriDo[0] === "concert-this")
        {
            concertSearch(liriDo[1]);
        }
        else
        {
            console.log("please try again")
        }
        console.log(randomText[randomInput])

    }
    });
}


  //variables to store users input
  var firstInput = process.argv[2]
  var secondInput= process.argv.slice(3).join(" ")

//if statement to make it work once the user passes a command
function userInput()
{
    if (firstInput === "concert-this")
    {
        if (secondInput === "")
        {
            console.log("Please use the following commands:"+
                    "\n concert-this maluma")
        }
        else
        {
            concertSearch(secondInput)
        }
    }
    else if (firstInput === "spotify-this-song")
    {
        if (secondInput === "")
        {
            spotify.request('https://api.spotify.com/v1/tracks/0hrBpAOgrt8RXigk83LLNE')
            .then(function(data) {
                console.log(" Artist(s): "+data.album.artists[0].name); // Artist name
                console.log("\n The song's name: "+data.name); // song name
                console.log("\n A preview link of the song from Spotify: "+data.album.external_urls.spotify); //url for the song
                console.log("\n The album that the song is from: "+data.album.name); //album that the song is from 
              })
              .catch(function(err) {
                console.error('Error occurred: ' + err); 
              });
        }
        else
        {
            spotifySearch(secondInput)
        }
    }
    else if (firstInput === "movie-this")
    {
        if (secondInput === "")
        {
            movieSearch("Mr. Nobody")
            console.log("If you haven't watched Mr. Nobody, then you should: <http://www.imdb.com/title/tt0485947/>\n\nIt's on Netflix!\n")
        }
        else
        {
            movieSearch(secondInput)
        }
    }
    else if (firstInput === "do-what-it-says")
    {
        console.log(noInput())
    }
    else
    {
        console.log("Please use the following commands:"+
                    "\n concert-this maluma"+
                    "\n spotify-this-song we will rock you"+
                    "\n movie-this we will rock you"+
                    "\n do-what-it-says")
    }
}
userInput()
