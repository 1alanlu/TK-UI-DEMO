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
    Alpine.store('dev', {
      panel(devPanelUrl) {
        // window.alpineHost = Alpine.mergeProxies(document.getElementById('app')._x_dataStack);
        window.alpineHost = Alpine.evaluate(document.getElementById('app'), '$data');
        Alpine.store('alpineHost', window.alpineHost);

        window.devPanelUrl = devPanelUrl;
        window.ajaxUtil.getTemplate(document.body, window.devPanelUrl);
      },
      open() {
        window.open(
          window.ajaxUtil.url.domain + '/src/@alpine/template/open.html',
          'alpineDev',
          'height=600,width=768,top=0,left=0,toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,status=no'
        );
      },
      grid() {
        window.ajaxUtil.getTemplate(document.body, window.ajaxUtil.url.domain + '/src/@alpine/template/grid.html');
      },
    });
  };
  const globalData = () => {
    Alpine.data('draggableData', () => ({
      isDragging: false,
      dragStartX: 0,
      dragStartY: 0,
      initialX: 0,
      initialY: 0,
      dragListeners: null,

      startDrag(e) {
        this.dragStartX = e.clientX;
        this.dragStartY = e.clientY;
        this.initialX = this.$el.offsetLeft;
        this.initialY = this.$el.offsetTop;
        this.dragListeners = window.objUtil.mapListener([
          [document, 'mousemove', this.dragging.bind(this)],
          [document, 'mouseup', this.stopDragging.bind(this)],
        ]);
      },
      dragging(e) {
        this.isDragging = true;
        const dx = e.clientX - this.dragStartX;
        const dy = e.clientY - this.dragStartY;
        this.$el.style.left = this.initialX + dx + 'px';
        this.$el.style.top = this.initialY + dy + 'px';
      },
      stopDragging() {
        this.isDragging = false;
        this.dragListeners.forEach((removeEventListener) => {
          removeEventListener();
        });
      },
    }));
  };
  const globalBind = () => {};
  const globalDirective = () => {};
  const globalMagic = () => {};

  document.addEventListener('alpine:init', () => {
    globalStore();
    globalData();
    globalBind();
    globalDirective();
    globalMagic();
    if (window.AlpineInitQueue) {
      window.AlpineInitQueue.forEach((queueFunc) => queueFunc());
    }
  });
});
