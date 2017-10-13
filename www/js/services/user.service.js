app.service("UserService", function () {

    this.get = function (key) {
        return window.localStorage.getItem(key);
    };
    this.set = function (key, id) {
        window.localStorage.setItem(key, id);
        return true;
    };
    this.remove = function (key) {
        window.localStorage.removeItem(key);
        return true;
    }
    return this;
});
