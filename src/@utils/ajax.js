(function (start) {
  window.ajaxUtil = start();
})(function () {
  const nativeExceptions = [EvalError, RangeError, ReferenceError, SyntaxError, TypeError, URIError].filter((except) => typeof except === 'function');
  function throwNative(error) {
    for (const Exception of nativeExceptions) {
      if (error instanceof Exception) throw error;
    }
  }
  function safeAwait(promise, finallyFunc) {
    return promise
      .then((data) => {
        if (data instanceof Error) {
          throwNative(data);
          return [data];
        }
        return [undefined, data];
      })
      .catch((error) => {
        throwNative(error);
        return [error];
      })
      .finally(() => {
        if (finallyFunc && typeof finallyFunc === 'function') {
          finallyFunc();
        }
      });
  }

  function obj2QueryString(params) {
    if (!params) return '';
    return Object.keys(params)
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key]).replace('/%20/g', '+')}`)
      .join('&');
  }
  function queryString2Obj(str) {
    if (!str) return {};
    return str.split('&').reduce(function (acc, params) {
      const p = params.split('=', 2);
      if (p.length > 1) acc[p[0]] = decodeURIComponent(p[1].replace(/\+/g, ' '));
      return acc;
    }, {});
  }

  async function _ajax(method, config) {
    const { data, finallyFunc, delay } = config;
    let url = config.url;
    const autoCatchMsg = config.autoCatchMsg === undefined ? true : !!config.autoCatchMsg;

    const opts = config.opts || {};
    opts.method = method;
    opts.headers = opts.headers || { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' };
    let params;
    if (data) {
      if (typeof data === 'object') params = obj2QueryString(data);
      switch (opts.method) {
        case 'GET':
          url += `?${params}&timestamp=${new Date().getTime()}`;
          break;
        default:
          opts.body = params;
          break;
      }
    }

    let result;

    try {
      const [error, res] = await safeAwait(fetch(url, opts));
      result = [error, await res.json()];
      return result;
    } catch (error) {
      autoCatchMsg && window.TkMessage && window.TkMessage.error(error.message);
      console.error(error);
      result = [error.message];
      return result;
    } finally {
      if (finallyFunc && typeof finallyFunc === 'function') {
        if (delay) {
          setTimeout(() => {
            finallyFunc(result);
          }, delay);
        } else {
          finallyFunc(result);
        }
      }
    }
  }

  function postToURL(url, params) {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = url;

    const hiddenField = (key, value) => {
      const field = document.createElement('input');
      field.type = 'hidden';
      field.name = key;
      field.value = value;
      return field;
    };

    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        var value = params[key];
        if (value instanceof Array) {
          for (var i = 0, l = value.length; i < l; i++) {
            form.appendChild(hiddenField(key, value[i]));
          }
        } else {
          form.appendChild(hiddenField(key, value));
        }
      }
    }
    document.body.appendChild(form);
    form.submit();
  }

  async function getTemplate(wrap, url, func) {
    const template = await getText(url);
    window.domUtil.setTemplate(wrap, template);
    func && typeof func === 'function' && func();
  }

  async function getText(url) {
    return await fetch(url).then((response) => response.text());
  }


  const url = {
    github: 'https://zhongyoulu.github.io/TK-UI-DEMO',
    codeSandbox: 'https://r0fu9s.csb.app',
    get isDev() {
      return ['localhost', '127.0.0.1'].includes(window.location.hostname);
    },
    get isTest() {
      return window.location.hostname.includes('test');
    },
    get isProd() {
      return !this.isDev && !this.isTest;
    },
    get isGithub() {
      return window.location.hostname.includes('github.io');
    },
    get domain() {
      if (this.isDev) return 'http://localhost:5501';
      if (this.isGithub) return this.github;
      return this.codeSandbox;
    },
  };

  return {
    safeAwait,
    post: _ajax.bind(this, 'POST'),
    get: _ajax.bind(this, 'GET'),
    obj2QueryString,
    queryString2Obj,
    postToURL,
    getTemplate,
    getText,
    url,
  };
});
