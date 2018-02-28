// Initialize API key
SC.initialize({
  client_id: 'BLIKpIMvNL9As25CHX4l9xXLu7KuU5uF',
});

// Defining variables
let search_player;
let current_playlist_count = 1;
let results_list = document.querySelector(".search-results-content");
let playlist_collection = document.querySelector(".playlist-collection");
let add_playlist = document.querySelector(".add-playlist");
let add_playlist_message = document.querySelector(".add-playlist-message");
let max_playlists = document.querySelector(".max-playlists");
let new_playlist = document.querySelector(".new-playlist");
let current_playlist = new_playlist;
let pause = document.querySelector(".fa-pause");
let play = document.querySelector(".fa-play");
let siblings_array = [];
let margin;
let forward = document.querySelector(".forward");
let back = document.querySelector(".back");
let colors_count = 0;
let colors = [
	"linear-gradient(90deg, #69b7eb, #b3dbd3, #f4d6db)",
	"linear-gradient(90deg, #cfecd0, #ffc5ca)",
	"linear-gradient(90deg, #f598a8, #f6edb2)",
	"linear-gradient(90deg, #ee5c87, #f1a4b5, #d587b3)",
	"linear-gradient(90deg, #b9deed, #efefef)",
	"linear-gradient(90deg, #aea4e3, #d3ffe8)",
	"linear-gradient(90deg, #faf0cd, #fab397)",
	"linear-gradient(90deg, #cfecd0, #a0cea7, #9ec0db)"
];

function playMusic() {
	document.body.style.WebkitAnimationPlayState = "running";
}

function stopMusic() {
	document.body.style.WebkitAnimationPlayState = "paused";
}

// User search bar
function userSearch(searchTerm) {
	SC.get("/tracks",{ 
	q: searchTerm
}).then(function(response) {
// Things to do after the search results load

	console.log(response);

	$(".search-results h1").css("display", "block");

	let search_results = [];

	for (let i = 0; i < response.length; i++) {
		search_results.push([response[i].title, response[i].id, response[i].permalink_url, response[i].artwork_url]);
	}

	for (let i = 0; i < search_results.length; i++) {
		// Update search results on the page
		if (search_results[i][3] !== null) {
			results_list.innerHTML += "<p>" + 
			search_results[i][0] + // title
			"<span class='search-id'>" + search_results[i][1] +	"</span>" + // id number
			"<a class='search-link' target='_blank' href='" + search_results[i][2] + "'><i class='fa fa-external-link'></i></a>" + // link
			"<img class='search-img' src='" + search_results[i][3] + "' />" + // image
			"</p>";
		} else if (search_results[i][3] == null) {
			results_list.innerHTML += "<p>" + 
			search_results[i][0] + // title
			"<span class='search-id'>" + search_results[i][1] +	"</span>" + // id number
			"<a class='search-link' target='_blank' href='" + search_results[i][2] + "'><i class='fa fa-external-link'></i></a>" + // link
			"<img class='search-img' src='https://image.flaticon.com/icons/svg/201/201572.svg' />" + // image
			"</p>";
		}
	}

	// Streams the selected song from search results and adds it to the new playlist
	$("p").click(function(){

	    // Update current new playlist with each song added
	    current_playlist.innerHTML += "<h6>" + 
	    	"<img class='h6-img' src='" + $(this)[0].childNodes[3].src + "' />" + // image
	    	$(this)[0].childNodes[0].data + // title
	    	"<span class='search-id'>" + $(this)[0].childNodes[1].innerHTML + "</span>" + // id number
	    	"<a class='search-link' target='_blank' href='" + $(this)[0].childNodes[2].href + "'><i class='fa fa-external-link'></i></a>" + // link
	    	"</h6>";

	    	$("h6").click(function(){

	    		$("h6").removeClass('clicked-song');
	    		$(this).addClass('clicked-song');

	    		$("h2.song-title").html($(this)[0].childNodes[1].data);
	    		$("a.song-link").attr("href", $(this)[0].childNodes[3].href);
	    		$("a.song-link").html("<i class='fa fa-external-link'></i>");
	    		$("img.song-artwork").attr("src", $(this)[0].childNodes[0].src);

	    		playMusic();

			    SC.stream( '/tracks/' + $(this)[0].childNodes[2].innerHTML ).then(function(player){
					search_player = player;
					player.play();
					player.on('finish', function() {
						// if (document.getElementsByClassName("clicked-song")[0].nextSibling === null) {
							console.log("song ended");
					    	stopMusic();
						// } else {
						// 	// playNext();
						// 	console.log(document.getElementsByClassName("clicked-song")[0].nextSibling);
						// }
					 });
				});
			});
	});

}); /*end of .then*/
} /*end of userSearch*/

// function playNext(id) {
// 	SC.stream( '/tracks/' + id ).then(function(player){
// 		search_player = player;
// 		player.play();
// 	});
// }

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
		console.log("pause");
		if (search_player) {
			stopMusic();
			search_player.pause();
		}
	})
})

// Play button
document.addEventListener("DOMContentLoaded", function() {
	play.addEventListener("click", function () {
		console.log("play");
		if (search_player) {
			playMusic();
			search_player.play();
		}
	})
})

// When User clicks "create another playlist"
document.addEventListener("DOMContentLoaded", function() {
	add_playlist.addEventListener("click", function() {

		// app will allow for 9 playlists max. So if user requests to make a new playlist, it will first check if the current playlist is empty, if it is
		// then that playlist will flash until you add at least one song to it. 12 (below) represents the amount of characters that will be in current_playlist.innerHTML
		// (1-9) if only the header exists, therefore declaring if theyre are any songs on the list
		if (current_playlist.innerText.length === 11) {
			add_playlist_message.style.opacity = "1";
			setTimeout(function(){ 
				add_playlist_message.style.opacity = "0";
			}, 5000);
		} else if (document.getElementsByClassName("playlist-collection")[0].childNodes.length >= 11) {
			max_playlists.style.opacity = "1";
			setTimeout(function(){ 
				max_playlists.style.opacity = "0";
			}, 5000);
		} else {
			// current_playlist_count gets 1 added to it
			current_playlist_count++;




			// $(".playlist-collection").find(".control").append("<span></span>");
			// document.querySelector(".control span").addEventListener("click", function() {
			// 	console.log($(this));
			// })







			// another new-playlist div(with current_playlist_count appended to its class name) is added to html under playlist-collection
			playlist_collection.innerHTML += 
				"<div class='new-playlist" + current_playlist_count + " playlist-only'>" +
					"<div class='current-song'>" +
						"<h1>Playlist" + current_playlist_count + "</h1>" +
						"<h2 class='song-title'></h2>" +
						"<img class='song-artwork' src='' />" +
						"<a class='song-link' href='' target='_blank'></a>" +
					"</div>" + 
				"</div>";

			// grab that new div and set it equal to current playlist so that we are adding our new songs to our current playlist
			current_playlist = document.querySelector(".new-playlist" + current_playlist_count);

			if (colors_count === 8) {
				colors_count = 0;
			}

			current_playlist.firstElementChild.style.backgroundImage = colors[colors_count];
			colors_count++;

			showCurrentPlaylist();
			// stylePlaylists();
		}
	})
})

// Get all sibling elements of current_playlist
var getSiblings = function (element) {
	var siblings = [];
	var sibling = element.parentNode.firstChild;
	for (; sibling; sibling = sibling.nextSibling) {
		if (sibling.nodeType !== 1 || sibling === element) continue;
		siblings.push(sibling);
	}
	siblings_array = siblings;
	return siblings;
};

// Show only current playlist, not its siblings
function showCurrentPlaylist () {
	getSiblings(current_playlist);
	current_playlist.style.opacity = "1";
	current_playlist.style.pointerEvents = "initial";
	for (i = 0; i < siblings_array.length; i++) {
		siblings_array[i].style.opacity = "0";
		siblings_array[i].style.pointerEvents = "none";
	}
}

// Sets margin of all new playlists so that they are all visible
// function stylePlaylists () {
// 	for (i = 0; i < $(".playlist-collection").children().length; i++) {
// 		margin = i * 20;
// 		$(".playlist-collection").children()[i].style.marginTop = margin+"px";
// 	}
// }

forward.addEventListener("click", function() {
	if (current_playlist.nextElementSibling !== null) {
		current_playlist = current_playlist.nextElementSibling;
		showCurrentPlaylist();
	}
})

back.addEventListener("click", function() {
	if (current_playlist.previousElementSibling !== null) {
		current_playlist = current_playlist.previousElementSibling;
		showCurrentPlaylist();
	}
})


