(function (setup) {
  if (!window.Alpine && !window.loadedAlpineJS) setup();
})(async () => {
  window.loadedAlpineJS = true;
  const version = document.currentScript.getAttribute('version') || '3.12.0';
  const plugins = document.currentScript.getAttribute('plugins'); // e.g. https://alpinejs.dev/plugins/mask
  if (plugins) {
    plugins.split(',').forEach((plugin) => {
      const script = document.createElement('script');
      script.defer = true;
      script.async = false; // Dynamic scripts behave as “async” by default.
      script.src = `https://unpkg.com/@alpinejs/${plugin}@${version}/dist/cdn.min.js`;
      document.head.appendChild(script);
    });
  }
  const script = document.createElement('script');
  script.defer = true;
  script.async = false;
  script.src = `https://unpkg.com/alpinejs@${version}/dist/cdn.min.js`;
  document.head.appendChild(script);

  const globalData = () => {};
  const globalBind = () => {
    Alpine.bind('SomeButton', () => ({
      type: 'button',

      '@click'() {
        this.doSomething();
      },

      ':disabled'() {
        return this.shouldDisable;
      },
    }));
  };

  const globalStore = () => {
    // ----------------------------------------------------------------
    // CacheGetter
    // ----------------------------------------------------------------
    Alpine.store('cacheGetter', function ({ name, getterFunc, consoleFunc, watchProps, nextTick }) {
      const privateName = `_${name}`;
      if (!this.cacheGetterWaitingMap) this.cacheGetterWaitingMap = new Map();
      if (!this.cacheGetterWaitingMap.has(name)) this.cacheGetterWaitingMap.set(name, false);

      if (!this.cacheGetterMap) this.cacheGetterMap = new Map();
      if (!this.cacheGetterMap.has(name)) {
        this.cacheGetterMap.set(name, (by, newVal, oldVal) => {
          if (JSON.stringify(newVal) === JSON.stringify(oldVal)) return;

          consoleFunc && consoleFunc(name, by);
          const newValue = getterFunc();
          this[privateName] = newValue;
          // if (JSON.stringify(newValue) !== JSON.stringify(this[privateName])) {
          // }
        });

        // init
        this.cacheGetterMap.get(name)('init', true, false);
        // watch
        if (watchProps) {
          watchProps.forEach((watchProp) => {
            this.$watch(watchProp, (value, old) => {
              if (nextTick) {
                this.cacheGetterWaitingMap.set(name, true);
                this.$nextTick(() => {
                  if (this.cacheGetterWaitingMap.get(name)) {
                    this.cacheGetterWaitingMap.set(name, false);
                    this.cacheGetterMap.get(name)(watchProp, value, old);
                  }
                });
              } else {
                this.cacheGetterMap.get(name)(watchProp, value, old);
              }
            });
          });
        }
      }
      return this[privateName];
    });
    // ----------------------------------------------------------------
    // Filter
    // ----------------------------------------------------------------
    Alpine.store('filter', {
      comma(value) {
        return parseInt(value).toLocaleString();
      },
      price(value) {
        return '$ ' + this.comma(value);
      },
      NT(value) {
        return 'NT$ ' + this.comma(value);
      },
    });

    // ----------------------------------------------------------------
    // Dev
    // ----------------------------------------------------------------
    Alpine.store('devPanel', function (devPanelUrl) {
      // window.alpineHost = Alpine.mergeProxies(document.getElementById('app')._x_dataStack);
      window.alpineHost = Alpine.evaluate(document.getElementById('app'), '$data');
      Alpine.store('alpineHost', window.alpineHost);

      window.devPanelUrl = devPanelUrl;
      window.ajaxUtil.getTemplate(document.body, window.devPanelUrl);
      // window.open(
      //   window.ajaxUtil.url.domain + '/src/@alpine/template/open.html',
      //   'alpineDev',
      //   'height=600,width=768,top=0,left=0,toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,status=no'
      // );
    });

    Alpine.store('darkMode', {
      init() {
        this.on = window.matchMedia('(prefers-color-scheme: dark)').matches;
      },
      on: false,
      toggle() {
        this.on = !this.on;
      },
    });
  };

  document.addEventListener('alpine:init', () => {
    globalData();
    globalBind();
    globalStore();
    if (window.AlpineInitQueue) {
      window.AlpineInitQueue.forEach((queueFunc) => queueFunc());
    }
  });
});
