// Initialize API key
SC.initialize({
  client_id: 'BLIKpIMvNL9As25CHX4l9xXLu7KuU5uF',
});

// Defining variables
let search_player;
let artwork;
let id;
let title;
let titleLink;
let description;
let genre;
let releaseDate;
let results_list = document.querySelector(".search-results-content");
let new_playlist = document.querySelector(".new-playlist");
let pause = document.querySelector(".fa-pause-circle");
let play = document.querySelector(".fa-play-circle-o");

// User search bar
function userSearch(searchTerm) {
	SC.get("/tracks",{ 
	q: searchTerm
}).then(function(response) {
// Things to do after the search results load

	console.log(response);

	let search_results = [];

	for (let i = 0; i < response.length; i++) {
		search_results.push([response[i].title, response[i].id, response[i].permalink_url, response[i].artwork_url]);
	}

	for (let i = 0; i < search_results.length; i++) {
		// Update search results on the page
		results_list.innerHTML += "<p>" + search_results[i][0] + "<span class='search-id'>" + search_results[i][1] + "</span>" + "<a target='_blank' href='" + search_results[i][2] + "'><i class='fa fa-external-link'></i></a></p>";
	}

	// Streams the selected song from search results and adds it to the new playlist
	$("p").click(function(){

	    SC.stream( '/tracks/' + $(this)[0].childNodes[1].innerHTML ).then(function(player){
		search_player = player;   
		player.play();
	});
	    console.log($(this));

	    // Update new playlist with each song added
	    new_playlist.innerHTML += "<h6>" + $(this)[0].childNodes[0].data + "<span class='search-id'>" + $(this)[0].childNodes[1].innerHTML + "</span>" + "<a target='_blank' href='" + $(this)[0].childNodes[2].href + "'><i class='fa fa-external-link'></i></a>" + "</h6>";

	    	$("h6").click(function(){

			    SC.stream( '/tracks/' + $(this)[0].childNodes[1].innerHTML ).then(function(player){
					search_player = player;   
					player.play();
				});

			});
	});

}); /*end of .then*/
} /*end of userSearch*/

// Clears the previous search results when the user performs a new search
document.addEventListener("DOMContentLoaded", function() {
	document.querySelector("form").addEventListener("submit", function(event) {
		event.preventDefault();
		userSearch(document.querySelector("#userSearch").value);

		if (results_list.innerHTML.length > 1) {
			results_list.innerHTML = "";
		}
	})
})


// Pause button
document.addEventListener("DOMContentLoaded", function() {
	pause.addEventListener("click", function () {
		search_player.pause();
	})
})

// Play button
document.addEventListener("DOMContentLoaded", function() {
	play.addEventListener("click", function () {
		search_player.play();
	})
})