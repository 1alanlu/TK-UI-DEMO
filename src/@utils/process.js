(function (start) {
  window.processUtil = start();
})(function () {
  const map = {};

  const init = (name, prop) =>
    new Promise(function (resolve) {
      if (!map[name]) map[name] = { count: 0, limit: 0, isProcessing: false, ...prop };
      resolve(map[name]);
    });

  const check = async (name, prop) => {
    const obj = await init(name, prop);
    return {
      obj,
      canStart: (cb) => {
        if (obj.isProcessing) return false;
        const pass = obj.limit ? obj.count < obj.limit : true;
        if (pass) {
          obj.count++;
          obj.isProcessing = true;
          if (cb) cb();
        }
        return pass;
      },
      done: (cb) => {
        obj.isProcessing = false;
        if (cb) cb();
      },
    };
  };

  function leastWait(ms) {
    let pass = false;
    setTimeout(() => (pass = true), ms || 500);
    return (cb) => {
      let timer = setInterval(() => {
        if (pass) {
          clearInterval(timer);
          if (cb) cb();
        }
      }, 100);
    };
  }

  function throttle(fn, mustRun = 150, delay = 100) {
    let timer = null;
    let lastTime = 0;
    return function () {
      const context = this;
      const args = arguments;
      clearTimeout(timer);
      const now = new Date();
      if (now - lastTime >= mustRun) {
        lastTime = now;
        fn.apply(context, args);
      } else if (delay > 0) {
        timer = setTimeout(() => {
          timer = null;
          fn.apply(context, args);
        }, delay);
      }
    };
  }

  function pipe(/* functions */) {
    const funcs = [].slice.apply(arguments);
    return function (/* arguments */) {
      return funcs.reduce(
        function (args, f) {
          return [f.apply(this, args)];
        }.bind(this),
        [].slice.apply(arguments)
      )[0];
    }.bind(this);
  }

  return {
    check,
    checkOnce: async (name, prop) => await check(name, { limit: 1, ...prop }),
    leastWait,
    throttle,
    pipe,
  };
});
