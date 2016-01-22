# JAWFR - JavaScript API Wrapper For Reddit


* Everything is done through promises
* Autorefreshes the token
* Keeps to the rate limits
* is for personal scripts only (so far)

````
var jawfr = require('JAWFR')();

jawfr.connect(user_agent, client_id, secret, username, password)
	.then(data) {
		// data is the inital token response

		// do stuff that needs connection

	}
	.catch(function(err) {
		console.log("connection error");
		console.log(err);
	});

````

Any kind of list is returned as an array of objects, with whatever other interesting properties tack on. Thus, they can be iterated nicely with for..of loops, and you can get eveything with a for..in.

# User

````
var u = r.getUser("spez");
u.moderates()
	.then(data) {
		console.log(spez moderates:);
		console.log(data);
	}
	.catch(err) {
		console.log(err);
	}
````

# Subreddits

````
var s = r.getSubreddit("pics");
s.getLinks({sort:hot})
	.then(data) {
		console.log(data);
	}
	.catch(err) {
		console.log(err);
	}
````






