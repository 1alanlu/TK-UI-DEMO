import { LitElement, html, css, classMap, unsafeCSS, nothing, map, ref, createRef } from 'https://cdn.jsdelivr.net/gh/lit/dist@2.7.3/all/lit-all.min.js';

// 已開啟彈窗
const opened = [];

export class TkModal extends LitElement {
  static styles = css``;
  static properties = {
    cls: { type: String },
    /* 彈窗類別 (see: typeMap) */
    type: { type: String, reflect: true },
    /* 是否允許背景關閉 */
    backdrop: { type: Boolean, reflect: true },
    /* 是否允許ESC關閉  */
    keyboard: { type: Boolean, reflect: true },
    /* 彈窗開關 */
    open: { type: Boolean, reflect: true },
    _open: { type: Boolean },
    /* 是否等待 */
    loading: { type: Boolean, reflect: true },
    /* 圖示 */
    icon: { type: String },
    /* 圖示顏色 */
    color: { type: String },
    /* 彈窗標題 */
    title: { type: String },
    /* 確認按紐文字 */
    okText: { type: String, attribute: 'ok-text' },
    /* 取消按紐文字 */
    cancelText: { type: String, attribute: 'cancel-text' },
    /* 關閉即刪除 */
    once: { type: Boolean },
    /* 停止送出關閉 */
    stopSubmitClose: { type: Boolean, attribute: 'stop-submit' },
    /* 傳送門 */
    portal: { type: Object, converter: (value) => document.querySelector(value) || null },
    /* 是否顯示 */
    showInput: { type: Boolean, attribute: 'show-input' },
    showCancel: { type: Boolean, attribute: 'show-cancel' },
  };
  constructor(config) {
    super();
    this.okText = '確 定';
    this.cancelText = '取 消';
    if (config) Object.assign(this, config);

    this._handleOpened = this._watchOpenTransform.bind(this);
  }
  // ----------------------------------------------------------------
  // # Data
  // ----------------------------------------------------------------
  typeMap = {
    info: { title: '訊息', color: '#1890ff', icon: 'material-symbols:info-outline-rounded' },
    success: { title: '成功', color: '#52c41a', icon: 'material-symbols:check-circle-outline-rounded' },
    error: { title: '錯誤', color: '#f4615c', icon: 'material-symbols:cancel-outline-rounded' },
    warning: { title: '警告', color: '#faad14', icon: 'material-symbols:error-outline-rounded' },
    confirm: { title: '確認', color: '#faad14', icon: 'material-symbols:help-outline-rounded' },
    prompt: { title: '輸入', color: '', icon: '' },
  };
  // ----------------------------------------------------------------
  // # Dom
  // ----------------------------------------------------------------
  modalRef = createRef();
  inputRef = createRef();
  submitRef = createRef();

  render() {
    let { title, color, icon } = this.typeMap[this.type] || {};
    if (this.title) title = this.title;
    if (this.color) color = this.color;
    if (this.icon) icon = this.icon;

    return html`
      <div ${ref(this.modalRef)} class="modal normal ${unsafeCSS(this.cls || '')}" tabindex="-1" ?open=${this._open} aria-hidden="${!this.open}" @mousedown=${this._backdropClose}>
        <div class="modal-dialog">
          <tk-icon class=${classMap({ 'dialog-type': true, ['fg:' + color]: color })} .icon=${icon}></tk-icon>
          <div class="modal-dialog-content">
            <tk-button class="modal-close" type="font" @click=${this._close}>&times;</tk-button>
            <div class="modal-dialog-title">
              <slot name="title">${title || 'Dialog'}</slot>
            </div>
            <div class="modal-dialog-body">
              <slot></slot>
              ${this.showInput
                ? html`
                    <div class="input mt:1x flex">
                      <input ${ref(this.inputRef)} @keydown=${this._watchKeydown} />
                    </div>
                  `
                : null}
            </div>
            <div class="modal-dialog-footer">
              ${this.showCancel ? html`<tk-button class="btn-cancel" @click=${this._cancel}>${this.cancelText}</tk-button>` : null}
              <tk-button ${ref(this.submitRef)} class="btn-submit" type="theme" ?loading=${this.loading} @click=${this._submit}>${this.okText}</tk-button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  // ----------------------------------------------------------------
  // # Life Cycle
  // ----------------------------------------------------------------
  connectedCallback() {
    super.connectedCallback();
    if (this.portal && this.portal !== this.parentNode) this.portal.appendChild(this);

    this.css = new MasterCSS({
      ...window.mcssConfig,
      themeDriver: 'host',
      observe: false,
    }).observe(this.shadowRoot);

    window.mcssTheme.register(this);

    this.shadowRoot.addEventListener('transitionend', this._handleOpened);
  }
  disconnectedCallback() {
    this.shadowRoot.removeEventListener('transitionend', this._handleOpened);
    super.disconnectedCallback();
    if (this.css) this.css.destroy();

    window.mcssTheme.unregister(this);
  }
  shouldUpdate(changedProperties) {
    return true;
  }
  willUpdate(changedProperties) {
    if (changedProperties.has('open')) {
      if (this.open) {
        this._wasFocused = document.activeElement;
        this._openListeners = window.objUtil.mapListener([[document, 'keydown', this._keyboardClose.bind(this)]]);
        if (this.loading) this.loading = false;
        if (this.inputRef.value) this.inputRef.value.value = null;
        setTimeout(() => {
          this._open = true;
        }, 1);
      } else {
        this._open = false;
        if (this._openListeners) this._openListeners.forEach((rm) => rm());
      }
    }
  }
  // ----------------------------------------------------------------
  // # Methods
  // ----------------------------------------------------------------
  // 監聽過度動畫 (開/關)
  _watchOpenTransform(event) {
    if (event.propertyName !== 'transform') return;
    let focused = null;
    const index = opened.indexOf(this);
    if (this.open) {
      if (index === -1) opened.push(this);
      if (this._focusTarget) {
        this._focused = this._focusTarget;
      } else if (this.showInput) {
        this._focused = this.inputRef.value;
      } else {
        this._focused = this.submitRef.value;
      }
      focused = this._focused;
    } else {
      if (index > -1) opened.splice(index, 1);
      focused = opened.length ? opened[opened.length - 1]._focused : this._wasFocused;

      this.dispatchEvent(new CustomEvent('close'));
      if (this.once) document.body.removeChild(this);
    }
    focused && focused.focus && focused.focus();
  }

  _close() {
    if (this.open !== false) this.open = false;
  }
  _static() {
    this.modalRef.value.classList.toggle('modal--static', true);
    setTimeout(() => {
      this.modalRef.value.classList.toggle('modal--static', false);
    }, 300);
  }
  _cancel() {
    this.dispatchEvent(new CustomEvent('cancel'));
    this._close();
  }
  _submit() {
    const value = this.inputRef.value ? this.inputRef.value.value : null;
    this.dispatchEvent(new CustomEvent('submit', { detail: { value } }));
    if (this.loading || this.stopSubmitClose) return;
    this._close();
  }
  _backdropClose(e) {
    if (e.target !== this.modalRef.value) return;
    this.backdrop ? this._close() : this._static();
  }
  _keyboardClose(event) {
    if (event.key !== 'Escape') return;
    if (opened[opened.length - 1] !== this) return;

    this.keyboard ? this._close() : this._static();
  }
  _watchKeydown(event) {
    switch (event.key) {
      case 'Enter':
        this._submit();
        break;
    }
  }
  // ----------------------------------------------------------------
  static _createModal() {
    let tempConfig = null;
    if (typeof arguments[0] === 'object') {
      tempConfig = arguments[0];
    } else if (typeof arguments[1] === 'object') {
      tempConfig = arguments[1];
      if (!tempConfig.mainType) tempConfig.mainType = arguments[0];
    } else {
      tempConfig = {
        mainType: arguments[0],
        content: arguments[1] || '',
        ok: arguments[2] || null,
        cancel: arguments[3] || null,
      };
    }

    let modal = null;
    let { mainType, type, content, ok, cancel, close, ...config } = tempConfig;

    if (!mainType) mainType = type;
    config.type = type || mainType;
    switch (mainType) {
      case 'confirm': {
        config.showCancel = true;
        break;
      }
      case 'prompt': {
        config.showCancel = true;
        config.showInput = true;
        if (config.stopSubmitClose === undefined) config.stopSubmitClose = true;
        const oldOk = ok;
        ok = () => {
          const value = modal.inputRef.value.value;
          if (value) {
            oldOk && oldOk(value);
          } else if (modal.stopSubmitClose) {
            TkMessage.error('內容不能為空');
            modal.inputRef.value.focus();
          }
        };
        break;
      }
    }

    if (config.once === undefined) config.once = true;
    if (config.open === undefined) config.open = true;

    modal = document.body.appendChild(new TkModal(config));
    modal.innerHTML = content || '';

    if (ok) {
      if (typeof ok === 'string') ok = new Function(ok);
      modal.addEventListener('submit', ok);
    }
    if (cancel) {
      if (typeof cancel === 'string') cancel = new Function(cancel);
      modal.addEventListener('cancel', cancel);
    }
    if (close) {
      if (typeof close === 'string') close = new Function(close);
      modal.addEventListener('close', close);
    }

    return modal;
  }
  static alert() {
    return TkModal._createModal(...arguments);
  }
  static info() {
    return TkModal._createModal('info', ...arguments);
  }
  static success() {
    return TkModal._createModal('success', ...arguments);
  }
  static error() {
    return TkModal._createModal('error', ...arguments);
  }
  static warning() {
    return TkModal._createModal('warning', ...arguments);
  }
  static confirm() {
    return TkModal._createModal('confirm', ...arguments);
  }
  static prompt() {
    return TkModal._createModal('prompt', ...arguments);
  }
}
window.TkModal = TkModal;
customElements.define('tk-modal', TkModal);
