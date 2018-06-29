'use strict';

var dixiv = function () {

    //address => id name address email lastActive created desc
    LocalContractStorage.defineMapProperty(this, "users");
    //name => address
    LocalContractStorage.defineMapProperty(this, "userName");
    //int
    LocalContractStorage.defineProperty(this, "userCount");

    //txHash => id content author(address) created media
    LocalContractStorage.defineMapProperty(this, "posts");
    LocalContractStorage.defineMapProperty(this, "postHash");
    //int
    LocalContractStorage.defineProperty(this, "postCount");

};

dixiv.prototype = {
    init: function () {
        this.userCount = 0;
        this.postCount = 0;
    },
    post: function (post) {
        var ts = Blockchain.transaction.timestamp,
            fromUser = Blockchain.transaction.from,
            txhash = Blockchain.transaction.hash;

        if (post.content.length < 8) {
            throw new Error("10008");
        }

        if (post.content.length > 1000) {
            throw new Error("10009");
        }

        post["author"] = fromUser;

        post.created = ts;

        this._checkForUser(fromUser);

        post.id = this.postCount;
        this.posts.set(txhash, post);
        this.postHash.set(this.postCount, txhash);
        this.postCount += 1;

        return {
            hash: txhash
        };
    },

    timeline: function (max_id, count) {
        max_id = parseInt(max_id);
        count = parseInt(count);
        if (!count) {
            count = 20
        }
        if (max_id === -1 || max_id === 0 || max_id > this.postCount) {
            max_id = this.postCount;
        }

        var result = {
            max_id: 0,
            result: []
        };

        var authorCache = {};

        var start = max_id,
            end = start - count,
            timelineHash = [];
        if (end < 0) {
            end = 0
        }
        for (var i = start; i >= end; i--) {
            var thash = this.postHash.get(i);
            if (!thash) {
                continue
            }
            timelineHash.push(thash)
        }

        timelineHash.forEach((value) => {
           var post = this.posts.get(value);
           var user = authorCache[post.author];
           if (!user) {
               authorCache[post.author] = this.users.get(post.author);
               user = authorCache[post.author];
           }
           post.author = user;
           result.result.push(post);
        });

        return result
    },

    setUser: function (info) {
        var fromUser = Blockchain.transaction.from,
            ts = Blockchain.transaction.timestamp;

        info.name = info.name.trim();
        info.email = info.email.trim();
        if (info.desc) {
            info.desc = info.desc.trim();
        }
        var nameaddr = this.userName.get(info.name);
        if (nameaddr && nameaddr !== fromUser) {
            throw new Error("10019")
        }
        if (info.name.length < 3) {
            throw new Error("10020")
        }

        var user = this.users.get(fromUser);

        if (user && user.name) {
            this.userName.del(user.name)
        }
        this.userName.set(info.name, fromUser);

        if (!user) {
            user = {
                id: this.userCount,
                address: fromUser,
                email: info.email,
                lastActive: ts,
                created: ts,
                desc: info.desc
            };
            this.userCount += 1;
        }
        user["name"] = info.name;

        this.users.set(fromUser, user);
        return user;
    },
    
    getUser: function (addr) {
        this._checkForUser(addr);
        return this.users.get(addr);
    },

    _paginate: function(array, page_size, page_number) {
        --page_number;
        return array.slice(page_number * page_size, (page_number + 1) * page_size);
    },

    _checkForUser: function (address) {
        if (!this.users.get(address)) {
            throw new Error("10005")
        }
    },
};

module.exports = dixiv;