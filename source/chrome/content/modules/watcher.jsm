"use strict";

this.EXPORTED_SYMBOLS = ["Watcher"];

this.Watcher = {
  
  add_watcher: function(object)
  {
   // Object.prototype.watch() shim, based on Eli Grey's polyfill object.watch
    if (!object.watch) {
      Object.defineProperty(object, "watch", {
        enumerable: false,
        configurable: true,
        writable: false,
        value: function (prop, handler) {
          let oldval = this[prop];
          let newval = oldval;
          const getter = function () {
            return newval;
          };
          const setter = function (val) {
            oldval = newval;
            newval = handler.call(this, prop, oldval, val);
            return newval;
          };

          try {
            if (delete this[prop]) { // can't watch constants
              Object.defineProperty(this, prop, {
                get: getter,
                set: setter,
                enumerable: true,
                configurable: true
              });
            }
          } catch(e) {
            // This fails fatally on non-configurable props, so just
            // ignore errors if it does.
          }
        }
      });
    }
    if (!object.unwatch) {
      Object.defineProperty(object, "unwatch", {
        enumerable: false,
        configurable: true,
        writable: false,
        value: function (prop) {
          const val = this[prop];
          delete this[prop];
          this[prop] = val;
        }
      });
    }
  },
  
};
