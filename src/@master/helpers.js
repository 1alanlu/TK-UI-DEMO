// ----------------------------------------------------------------
// # Events
// ----------------------------------------------------------------
window.mcssLoaded = () => {
  document.querySelectorAll('[m-cloak]').forEach((dom) => dom.removeAttribute('m-cloak'));
};

// ----------------------------------------------------------------
// # Literal
// ----------------------------------------------------------------
(function (start) {
  const helpers = start();
  window.mcssLiteral = helpers.literal;
  window.MasterTheme = helpers.MasterTheme;
})(function () {
  const literal = (strings, ...tokens) => {
    return strings
      .reduce((result, value, index) => result + value + (tokens[index] || ''), '')
      .replace(/\/\*[^\/]*\*\//gm, '')
      .replace(/(?:\n(?:\s*))+/g, ' ')
      .trim();
  };
  const group = (config) => {
    const { parent, selector, cls, mq } = config;

    const unitArr = [];
    const otherGroup = [];

    cls.split(' ').forEach((target) => {
      if (!target.includes('{')) {
        unitArr.push(target);
      } else {
        const reg = new RegExp(/^(.+){0,1}{(.+)}(.+){0,1}$/);
        const r = target.match(reg);

        let _mq = mq;
        let _selector = r[3] || '';

        if (_selector[0] === '@') {
          _mq = _selector;
          _selector = selector;
        } else {
          _selector = _selector.includes('_$') ? _selector.replace('_$', selector) : selector + _selector;
        }

        try {
          otherGroup.push(
            group({
              parent: r[1],
              selector: _selector,
              cls: r[2].split(';').join(' '),
              mq: _mq,
            })
          );
        } catch (error) {
          console.log(target, error);
        }
      }
    });
    const classes = unitArr.join(';');
    return `${parent || ''}{${classes}}${selector}${mq || ''}` + (otherGroup.length ? ' ' + otherGroup.join(' ') : '');
  };
  const toLine = (obj, showLog) => {
    const classes = Object.entries(obj).reduce((cls, [selector, classes]) => {
      if (['_', '>', '~', '+'].includes(selector.charAt(selector.length - 1))) {
        classes = group({ parent: selector, selector: '', cls: classes });
      } else if (['_', '>', '~', '+', ':', '[', '@'].includes(selector[0])) {
        classes = group({ selector, cls: classes });
      }
      return cls.concat(classes);
    }, []);
    if (showLog) console.log(classes);
    return classes.join(' ');
  };

  class MasterTheme {
    constructor(ThemeAPI) {
      this.ThemeAPI = ThemeAPI;
      this._hosts = new Map();
      this.register();
    }
    register(host) {
      const themeAPI = new this.ThemeAPI({ store: 'theme', init: true }, host);
      this._hosts.set(host, themeAPI);
    }
    unregister(host) {
      const themeAPI = this._hosts.get(host);
      if (themeAPI) {
        themeAPI.destroy();
        this._hosts.delete(host);
      }
    }
    get current() {
      return this._hosts.get().current;
    }
    switchAll(mode) {
      for (const themeAPI of this._hosts.values()) {
        themeAPI.switch(mode);
      }
    }
  }

  return { literal: { $: literal, group, toLine }, MasterTheme };
});
