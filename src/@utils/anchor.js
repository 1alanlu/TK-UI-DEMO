(function (start) {
  window.anchorUtil = start();
})(function () {
  let _rootEl = null;
  const getRootEl = () => (_rootEl ? _rootEl : document.documentElement || document.body);
  const setRootEl = (el) => (_rootEl = el || null);

  let _fixedHeader = null;
  const setFixedHeader = (el) => (_fixedHeader = el || null);

  let _wrapper = null;
  const setWrapper = (el) => (_wrapper = el || null);

  const getElementTop = (el) => {
    if (!el) return null;
    let scrollY = el.offsetTop;
    if (el.offsetParent) scrollY += el.offsetParent.offsetTop;
    if (_fixedHeader) scrollY -= _fixedHeader.offsetHeight;
    if (_wrapper) scrollY -= _wrapper.offsetTop;
    return scrollY;
  };

  const getScrollPosition = (el) => ({
    y: el ? el.scrollTop : document.documentElement.scrollTop || document.body.scrollTop || 0,
    x: el ? el.scrollLeft : document.documentElement.scrollLeft || document.body.scrollLeft || 0,
  });
  const setScrollPosition = (el, y, x) => {
    if (el) {
      if (y != null) el.scrollTop = y;
      if (x != null) el.scrollLeft = x;
    } else {
      if (y != null) document.documentElement.scrollTop = document.body.scrollTop = y;
      if (x != null) document.documentElement.scrollLeft = document.body.scrollLeft = y;
    }
  };

  const getAnchorEl = (selector) => {
    if (!selector || selector === '#') return null;
    if (selector.nodeType === 1) return selector;

    let hash = decodeURI(selector.substr(1));
    hash = hash.replace(/"/g, '\\"');
    const alias = `[data-anchor-alias="${hash}"]`;

    let el = null;
    try {
      el = document.querySelector(selector) || document.querySelector(alias);
    } catch (error) {
      el = document.querySelector(alias);
    }
    return el;
  };
  const getAnchorElHash = (el) => (el ? el.getAttribute('data-anchor-alias') || el.id : null);

  const updateHash = (hash) => {
    hash = hash ? '#' + encodeURI(hash) : window.location.pathname + window.location.search;
    window.history.replaceState(null, null, hash);
  };

  const updateHashControl = async (hash, force) => {
    const process = await window.processUtil.check('anchor-updateHashControl');
    if (!process.canStart()) return;
    const done = process.done.bind(null, () => updateHash(hash));
    force ? window.processUtil.leastWait(200)(done) : done();
  };

  const _easeInOutQuad = function (t, b, c, d) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t -= 1;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  };

  // 滾動至 (rootEl, 位置, 持續時間, 回呼函式)
  const _scrollTo = (to, duration = 500, cb) => {
    if (to == null) return;
    const rootEl = getRootEl();
    const done = () => {
      setScrollPosition(rootEl, to);
      if (cb && typeof cb === 'function') cb();
    };
    if (duration === 0) {
      done();
    } else {
      const startDate = +new Date();
      const start = getScrollPosition(rootEl).y;
      const change = to - start;
      const animateScroll = function () {
        const currentDate = +new Date();
        const currentTime = currentDate - startDate;
        setScrollPosition(rootEl, parseInt(_easeInOutQuad(currentTime, start, change, duration), 10));
        if (currentTime < duration) {
          requestAnimationFrame(animateScroll);
        } else {
          done();
        }
      };
      animateScroll();
    }
  };

  // 滾動至
  const scrollTo = (selector, duration, cb) => {
    const targetAnchor = getAnchorEl(selector);
    if (!targetAnchor || targetAnchor.offsetWidth === 0 || targetAnchor.offsetHeight === 0) return;

    _scrollTo(getElementTop(targetAnchor), duration, () => {
      if (cb && typeof cb === 'function') cb();
      updateHashControl(getAnchorElHash(targetAnchor), true);
    });
  };

  // 置頂
  const scrollTop = (duration, cb) => {
    _scrollTo(0, duration, () => {
      if (cb && typeof cb === 'function') cb();
      updateHashControl(null, true);
    });
  };

  function inWindow(el) {
    const rootEl = getRootEl();
    const rootTop = getScrollPosition(rootEl).y;
    const rootBottom = rootTop + rootEl.clientHeight;
    const elTop = getElementTop(el);
    const elBottom = elTop + el.offsetHeight;
    return elTop < rootBottom && elBottom > rootTop;
  }

  // 處理錨點連結
  const processLinks = (links, duration, cb) => {
    const anchorLinks = links || document.querySelectorAll('a[href^="#"]');
    [...anchorLinks].forEach((link) => {
      let anchorID = link.getAttribute('data-anchor') || link.getAttribute('href');
      link.addEventListener('click', (e) => {
        e.preventDefault();
        scrollTo(anchorID, duration, cb);
      });
    });
  };

  // 區塊錨點
  const _sections = [];
  function setSections(id) {
    if (!!id && _sections.indexOf(id) === -1) _sections.push(id);
  }
  function setSectionsData(el) {
    // TODO: 設定初始數據
    setSections(el.id);
  }
  // 處理錨點區塊
  let _sectionsScrollHandler = null;
  function processSections(sections, cb = () => {}) {
    sections = sections || document.querySelectorAll('section');
    if (!sections || !sections.length) return;
    [...sections].forEach((el) => setSectionsData(el));
    if (_sectionsScrollHandler) return;
    // 區塊錨點處理
    _sectionsScrollHandler = window.processUtil.throttle(() => {
      const rootTop = getScrollPosition(getRootEl()).y;
      let targetHash = null;
      // TODO: 可優化 記錄順序等...
      for (let i = 0, sectionID; (sectionID = _sections[i]); i++) {
        const el = document.getElementById(sectionID);
        if (el && inWindow(el)) {
          const elTop = getElementTop(el);
          targetHash = rootTop > elTop ? getAnchorElHash(el) : null;
          cb({ id: sectionID, hash: targetHash });
          break;
        }
      }
      updateHashControl(targetHash);
    });
    (_rootEl || document).addEventListener('scroll', _sectionsScrollHandler);
  }

  // 初始錨點定位
  let _defaultHash = window.location.hash;
  const untilDefault = async (duration) => {
    if (!_defaultHash) return false;
    const process = await window.processUtil.check('anchor-untilDefault', { limit: 20 });
    if (!process.canStart()) return false;

    // 錨點目標
    const anchorTarget = getAnchorEl(_defaultHash);
    let anchorTargetTop = getElementTop(anchorTarget);

    console.warn('錨點目標', decodeURI(_defaultHash.substr(1)), process.obj.count + '/' + process.obj.limit, anchorTargetTop);

    // 直到錨點函式 (每次最少執行秒數)
    const untilFunc = window.processUtil.leastWait(100).bind(null, () => {
      let next = null;
      const rootTop = getScrollPosition(getRootEl()).y;
      anchorTargetTop = getElementTop(anchorTarget);
      // 如果錨點還沒生成 或還沒定位 (定位則停止，容忍誤差)
      // console.log(rootTop, anchorTargetTop, window.processUtil.pipe(Math.abs, Math.floor)(anchorTargetTop - rootTop));
      if (anchorTargetTop == null || window.processUtil.pipe(Math.abs, Math.floor)(anchorTargetTop - rootTop) > 0) {
        // console.warn('再延遲執行一次');
        // 再延遲執行一次
        next = () => setTimeout(() => untilDefault(duration), 200);
      }
      process.done(next);
    });

    // console.warn('untilDefault', anchorTargetTop, getRootEl().scrollHeight, window.innerHeight);
    if (anchorTargetTop === null || anchorTarget.offsetWidth === 0 || anchorTarget.offsetHeight === 0 || anchorTargetTop > getRootEl().scrollHeight - window.innerHeight) {
      // console.warn('目標不存在 或 無法置頂');
      untilFunc();
    } else {
      // console.warn('滾動至目標');
      scrollTo(anchorTarget, duration, untilFunc);
    }
  };

  return {
    getRootEl,
    setRootEl,
    setFixedHeader,
    setWrapper,
    getElementTop,
    getScrollPosition,
    setScrollPosition,
    getAnchorEl,
    getAnchorElHash,
    updateHash,
    updateHashControl,
    scrollTo,
    scrollTop,
    inWindow,
    processLinks,
    setSections,
    setSectionsData,
    processSections,
    untilDefault,
  };
});
