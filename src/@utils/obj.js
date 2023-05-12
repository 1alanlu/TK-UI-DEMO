(function (start) {
  window.objUtil = start();
})(function () {
  const isObject = (obj) => {
    if (typeof obj !== 'object' || obj === null) return false;
    if (typeof Object.getPrototypeOf === 'function') {
      const prototype = Object.getPrototypeOf(obj);
      return prototype === Object.prototype || prototype === null;
    }
    return Object.prototype.toString.call(obj) === '[object Object]';
  };

  const typeOf = (obj) => ({}.toString.call(obj).split(' ')[1].slice(0, -1).toLowerCase());

  const eqArray = (arr1, arr2) => {
    const set1 = new Set(arr1);
    const set2 = new Set(arr2);
    return set1.size === set2.size && [...set1].every((x) => set2.has(x));
  };

  const deepCopy = (obj) => JSON.parse(JSON.stringify(obj));

  const merge = (...objects) =>
    objects.reduce((result, current) => {
      if (Array.isArray(current)) {
        throw new TypeError('Arguments provided to ts-deepmerge must be objects, not arrays.');
      }
      Object.keys(current).forEach((key) => {
        if (['__proto__', 'constructor', 'prototype'].includes(key)) return;
        if (Array.isArray(result[key]) && Array.isArray(current[key])) {
          result[key] = merge.options.mergeArrays ? Array.from(new Set(result[key].concat(current[key]))) : current[key];
        } else if (isObject(result[key]) && isObject(current[key])) {
          result[key] = merge(result[key], current[key]);
        } else {
          result[key] = current[key];
        }
      });

      return result;
    }, {});
  const defaultOptions = { mergeArrays: true };
  merge.options = defaultOptions;
  merge.withOptions = (options, ...objects) => {
    merge.options = { ...defaultOptions, ...options };
    const result = merge(...objects);
    merge.options = defaultOptions;
    return result;
  };

  const convertArrayToObject = (array, key) => array.reduce((obj, item) => ({ ...obj, [item[key]]: item }), {});

  const chooseRandom = (arr, num = 1) => {
    if (!arr || !arr.length) return [];
    if (num > arr.length) num = arr.length;

    const res = [];
    while (res.length !== num) {
      const random = Math.floor(Math.random() * arr.length);
      if (res.indexOf(arr[random]) !== -1) continue;
      res.push(arr[random]);
    }
    return res;
  };

  const bindBreakpoint = (data, breakpoints) => {
    if (!data) return null;
    const result = deepCopy(data);

    if (!breakpoints) breakpoints = result.breakpoints;
    if (!breakpoints) return [result];

    const bp = Object.keys(breakpoints)
      .sort((a, b) => b - a)
      .filter((bp) => window.innerWidth <= bp)[0];

    if (bp) Object.assign(result, breakpoints[bp]);

    return [result, bp];
  };

  const mapListener = (group) => {
    return group.map(([el, event, func]) => {
      el.addEventListener(event, func);
      return () => el && el.removeEventListener(event, func);
    });
  };

  Date.prototype.toISOString = function () {
    let pad = (n) => (n < 10 ? '0' + n : n);
    let hours_offset = this.getTimezoneOffset() / 60;
    let offset_date = this.setHours(this.getHours() - hours_offset);
    // let symbol = hours_offset >= 0 ? '-' : '+';
    // let time_zone = symbol + pad(Math.abs(hours_offset)) + ':00';

    return this.getUTCFullYear() + '-' + pad(this.getUTCMonth() + 1) + '-' + pad(this.getUTCDate()) + 'T' + pad(this.getUTCHours()) + ':' + pad(this.getUTCMinutes()) + ':' + pad(this.getUTCSeconds());
    //'.' + (this.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) + time_zone
  };
  const date = {
    evaluationStartTime(beginDateStr) {
      if (!beginDateStr) return true;
      const curDate = new Date();
      const beginDate = new Date(beginDateStr);
      return curDate >= beginDate;
    },
    evaluationEndTime(endDateStr) {
      if (!endDateStr) return true;
      const curDate = new Date();
      const endDate = new Date(endDateStr);
      return curDate <= endDate;
    },
    isDuringDate(beginDateStr, endDateStr) {
      return this.evaluationStartTime(beginDateStr) && this.evaluationEndTime(endDateStr);
    },
    isSameDay(date1, date2) {
      return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
    },
    dateDifference(date1, date2) {
      let milliseconds_Time = date1.getTime() - date2.getTime();
      return milliseconds_Time / (1000 * 3600 * 24);
    },
    getEvaluationTime(config, canNull = false) {
      if (!canNull && (!config || !config.openDate || !config.closeDate)) {
        return { start: null, end: null, during: null };
      }
      const start = this.evaluationStartTime(config.openDate);
      const end = this.evaluationEndTime(config.closeDate);
      return {
        start,
        end,
        during: start && end,
        openDate: config.openDate,
        closeDate: config.closeDate,
      };
    },
  };

  const clipboard = (target) => {
    if (typeof target === 'function') target = target();
    if (typeof target === 'object') target = JSON.stringify(target);
    return window.navigator.clipboard.writeText(target);
  };

  return {
    isObject,
    typeOf,
    eqArray,
    deepCopy,
    merge,
    convertArrayToObject,
    chooseRandom,
    bindBreakpoint,
    mapListener,
    date,
    clipboard,
  };
});
