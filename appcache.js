module.exports = {
  init: function(win) {
    win.addEventListener('load', function(e) {
      console.log("[cache:init]");
      this.cache(win, win.applicationCache);
    }.bind(this), false);
  },
  cache: function(win, cache) {
    cache.addEventListener('updateready', function(e) {
      console.log("[cache:update]");
      if (cache.status == cache.UPDATEREADY) {
        cache.swapCache();
        win.location.reload();
      }
    }, false);
  }
}
