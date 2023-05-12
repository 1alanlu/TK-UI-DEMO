(function (start) {
  window.domUtil = start();
})(function () {
  function createElem(tagName, attributes = {}, content = null) {
    const el = document.createElement(tagName);
    for (var attr in attributes) {
      if (attributes.hasOwnProperty(attr)) {
        el.setAttribute(attr, attributes[attr]);
      }
    }
    if (content) {
      if (content.nodeType === 1) insert(content, el);
      else el.innerHTML = content;
    }
    return el;
  }
  function cloneElem(el, deep = true) {
    const newEl = el.cloneNode(deep);
    newEl.removeAttribute('id');
    return newEl;
  }

  function insert(el, parentNode = document.body, referenceNode = null) {
    return parentNode.insertBefore(el, referenceNode);
  }
  function insertPrev(el, refEl) {
    return refEl.insertAdjacentElement('beforebegin', el);
    // return insert(el, refEl.parentNode, refEl);
  }
  function insertFirst(el, refEl) {
    return refEl.insertAdjacentElement('afterbegin', el);
    // return insert(el, refEl, refEl.firstChild);
  }
  function insertLast(el, refEl) {
    return refEl.insertAdjacentElement('beforeend', el);
    // return insert(el, refEl);
  }
  function insertNext(el, refEl) {
    return refEl.insertAdjacentElement('afterend', el);
    // return insert(el, refEl.parentNode, refEl.nextSibling);
  }

  function wrap(toWrap, wrapper) {
    wrapper = wrapper || createElem('div');
    insertPrev(wrapper, toWrap);
    insertLast(toWrap, wrapper);
    return wrapper;
  }
  function remove(el, parentNode) {
    parentNode = parentNode || el.parentNode;
    parentNode.removeChild(el);
  }
  function removeChild(parentNode) {
    while (parentNode.firstChild) {
      remove(parentNode.firstChild, parentNode);
    }
  }

  function loadStyleSheet(href, attrs, onLoadFunc) {
    const tag = createElem('link', { href: href, rel: 'stylesheet', type: 'text/css', ...attrs });
    if (onLoadFunc) tag.onload = onLoadFunc;
    insert(tag, document.head);
  }
  function loadScript(src, attrs, onLoadFunc) {
    const tag = createElem('script', { src: src, ...attrs });
    if (onLoadFunc) tag.onload = onLoadFunc;
    insert(tag, document.head);
  }

  function nodeScriptReplace(node) {
    if (node.tagName === 'SCRIPT') {
      node.parentNode.replaceChild(cloneElem(node), node);
    } else {
      [...node.childNodes].forEach((children) => {
        nodeScriptReplace(children);
      });
    }
    return node;
  }

  function setTemplate(wrap, template, js = false, style = true) {
    const html = new DOMParser().parseFromString(template, 'text/html');
    if (js) {
      const scripts = html.head.querySelectorAll('script');
      scripts.forEach((script) => wrap.append(script));
    }
    if (style) {
      const styles = html.head.querySelectorAll('style, link');
      styles.forEach((style) => wrap.append(style));
    }
    const components = html.body.childNodes;
    [...components].forEach((component) => {
      wrap.appendChild(component);
    });
  }

  return {
    createElem,
    cloneElem,
    insert,
    insertPrev,
    insertFirst,
    insertLast,
    insertNext,
    wrap,
    remove,
    removeChild,
    loadStyleSheet,
    loadScript,
    nodeScriptReplace,
    setTemplate,
  };
});
