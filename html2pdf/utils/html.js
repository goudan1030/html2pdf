var t = {};
t.handleUrl = function(t) {var e = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;return !!(t = t.match(e)) && t[0];
}, module.exports = t;