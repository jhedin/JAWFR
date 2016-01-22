'use strict'

module.exports = {
	Comment: Comment,
	init: function(requestor, user, subreddit, comment, link) {
		Comment.prototype.req = requestor;
		Comment.prototype.User = user;
		Comment.prototype.Subreddit = subreddit;
		Comment.prototype.Link = link;
		return Comment;
	}
}

function Comment(info) {
	if (!(this instanceof Comment))
    	return new Comment();
    info = info || {};
    for(let i in info) {
    	this[i] = info[i];
    }
    this.subreddit = new this.Subreddit(this.subreddit);
	this.author = new this.User(this.author);
}

Comment.prototype.reply = function(msg) {

	var options = {
		method: 'POST',
	    uri: 'https://oauth.reddit.com/api/comment',
	    qs: {
	    	raw_json: 1
	    },
	    form: {
	    	parent: this.name,
	    	text: msg
	    },
		headers: {
			'Authorization': 'bearer ' + this.req.get().tk,
			'User-Agent': this.req.get().ua
		},
		transform: function(data) {
			return new Comment(data.jquery[18][3][0][0].data);	
		}.bind(this),
	    json: true
	};

	return this.req.request(options);
}

Comment.prototype.remove = function(opts) {
	opts = opts || {spam:false};

	var options = {
		method: 'POST',
	    uri: 'https://oauth.reddit.com/api/remove',
	    qs: {
	    	raw_json: 1
	    },
	    form: {
	    	id: this.name,
	    	spam: opts.spam
	    },
		headers: {
			'Authorization': 'bearer ' + this.req.get().tk,
			'User-Agent': this.req.get().ua
		},
	    json: true
	};

	return this.req.request(options);
}

Comment.prototype.distinguish = function(opts) {
	opts = opts || {how: "yes"};

	var options = {
		method: 'POST',
	    uri: 'https://oauth.reddit.com/api/distinguish',
	    qs: {
	    	raw_json: 1
	    },
	    form: {
	    	id: this.name,
	    	how: opts.how,
	    	api_type: "json"
	    },
		headers: {
			'Authorization': 'bearer ' + this.req.get().tk,
			'User-Agent': this.req.get().ua
		},
	    json: true
	};

	return this.req.request(options);
}

Comment.prototype.report = function(reason) {

	var options = {
		method: 'POST',
	    uri: 'https://oauth.reddit.com/api/report',
	    qs: {
	    	raw_json: 1
	    },
	    form: {
	    	thing_id: this.name,
	    	other_reason: reason
	    },
		headers: {
			'Authorization': 'bearer ' + this.req.get().tk,
			'User-Agent': this.req.get().ua
		},
	    json: true
	};

	return this.req.request(options);
}