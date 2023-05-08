import { LitElement, html, css, classMap, unsafeCSS, nothing, ref, createRef } from 'https://cdn.jsdelivr.net/gh/lit/dist@2.7.3/all/lit-all.min.js';

const cssLiteral = window.masterCSSLiteral;

let messageContent = document.getElementById('message-content');
if (!messageContent) {
  messageContent = document.createElement('div');
  messageContent.id = 'message-content';
  messageContent.className = cssLiteral.$`
    z:message untouchable
    fixed top:1x left:0 right:0 p:1x
    flex flex:column ai:center gap:1x
  `;
  document.body.appendChild(messageContent);
}

const cls = {
  message: {
    '': cssLiteral.$`
      inline-flex jc:center ai:center p:1x r:.5x
      max-w:xs@md
      f:14 fg:fg word-break:break-all
      bg:bg-box
      shadow:md
      ~.2s|cubic-bezier(.645,.045,.355,1) transition-property:opacity,transform
      opacity:0 translateY(-100%)
      {opacity:1;translateY(0)}[show],:hover
      pointer-events:all

      {f:20;mr:.5x}>tk-icon
    `,
  },
};
export class TkMessage extends LitElement {
  static styles = css`
    :host {
      position: relative;
      display: inline-block;
    }
  `;
  static properties = {
    cls: { type: String },
    type: { type: String },
    icon: { type: String },
    color: { type: String },
    show: { type: Boolean, reflect: true },
    loading: { type: Boolean, reflect: true },
    duration: { type: Number },
  };
  constructor(config) {
    super();
    if (config) Object.assign(this, config);
    if (this.duration === undefined) this.duration = this.loading ? 0 : 3000;

    this._handleOpened = this._watchOpenTransform.bind(this);
  }
  // ----------------------------------------------------------------
  // # Data
  // ----------------------------------------------------------------
  typeMap = {
    info: { title: '訊息', color: '#1890ff', icon: 'material-symbols:info-rounded' },
    success: { title: '成功', color: '#52c41a', icon: 'material-symbols:check-circle-rounded' },
    error: { title: '錯誤', color: '#f4615c', icon: 'material-symbols:cancel-rounded' },
    warning: { title: '警告', color: '#faad14', icon: 'material-symbols:error-rounded' },
    confirm: { title: '確認', color: '#faad14', icon: 'material-symbols:help-rounded' },
  };
  // ----------------------------------------------------------------
  // # Dom
  // ----------------------------------------------------------------
  msgRef = createRef();
  render() {
    let { color, icon } = this.typeMap[this.type] || {};
    if (this.color) color = this.color;
    if (this.icon) icon = this.icon;

    return html`
      <div ${ref(this.msgRef)} class="message ${unsafeCSS(this.cls || '')}">
        <tk-icon class=${classMap({ ['fg:' + color]: color })} .icon=${icon} .loading=${this.loading}></tk-icon>
        <slot></slot>
      </div>
    `;
  }
  // ----------------------------------------------------------------
  // # Life Cycle
  // ----------------------------------------------------------------
  connectedCallback() {
    super.connectedCallback();
    this.css = new MasterCSS({
      ...window.objUtil.merge(window.masterCSSConfig, { classes: cls }),
      themeDriver: 'host',
      observe: false,
    }).observe(this.shadowRoot);

    window.masterTheme.register(this);

    this.shadowRoot.addEventListener('transitionend', this._handleOpened);
  }
  disconnectedCallback() {
    this.shadowRoot.removeEventListener('transitionend', this._handleOpened);
    super.disconnectedCallback();
    if (this.css) this.css.destroy();

    window.masterTheme.unregister(this);
  }
  willUpdate(changedProperties) {
    if (changedProperties.has('duration')) {
      this.show = true;
      this._timer && clearTimeout(this._timer);
      if (this.duration) {
        this._timer = setTimeout(() => {
          this.show = false;
        }, this.duration);
      }
    }
    if (changedProperties.has('show')) {
      if (this.show) {
        setTimeout(() => {
          this.msgRef.value.setAttribute('show', '');
        }, 1);
      } else {
        this.msgRef.value.removeAttribute('show');
      }
    }
  }
  // ----------------------------------------------------------------
  // # Methods
  // ----------------------------------------------------------------
  // 監聽過度動畫 (開/關)
  _watchOpenTransform(event) {
    if (event.propertyName !== 'transform') return;
    if (!this.show) {
      this.dispatchEvent(new CustomEvent('close'));
      messageContent.removeChild(this);
    }
  }
  // ----------------------------------------------------------------
  static _createMsg() {
    let tempConfig = null;
    if (typeof arguments[0] === 'object') {
      tempConfig = arguments[0];
    } else if (typeof arguments[1] === 'object') {
      tempConfig = arguments[1];
      if (!tempConfig.mainType) tempConfig.mainType = arguments[0];
    } else {
      tempConfig = {
        type: arguments[0],
        text: arguments[1] || '',
        close: arguments[2] || null,
      };
    }

    let { mainType, type, text, close, ...config } = tempConfig;

    if (!mainType) mainType = type;
    config.type = type || mainType;
    switch (mainType) {
      case 'loading': {
        config.loading = true;
        break;
      }
    }
    const message = messageContent.appendChild(new TkMessage(config));
    message.textContent = text || '';
    close && message.addEventListener('close', close);

    return message;
  }
  static show() {
    return TkMessage._createMsg(...arguments);
  }
  static info() {
    return TkMessage._createMsg('info', ...arguments);
  }
  static success() {
    return TkMessage._createMsg('success', ...arguments);
  }
  static error() {
    return TkMessage._createMsg('error', ...arguments);
  }
  static warning() {
    return TkMessage._createMsg('warning', ...arguments);
  }
  static confirm() {
    return TkMessage._createMsg('confirm', ...arguments);
  }
  static loading() {
    return TkMessage._createMsg('loading', ...arguments);
  }
}
window.TkMessage = TkMessage;
customElements.define('tk-message', TkMessage);
