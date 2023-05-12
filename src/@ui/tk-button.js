import { LitElement, html, css, unsafeCSS, nothing, ref, createRef, staticHtml, literal } from 'https://cdn.jsdelivr.net/gh/lit/dist@2.7.3/all/lit-all.min.js';

export class TkButton extends LitElement {
  static styles = css`
    :host {
      position: relative;
      display: inline-block;
      pointer-events: none;
      border-radius: 0.25rem;
    }
  `;
  static properties = {
    cls: { type: String },
    /* 按鈕風格 */
    type: { type: String, reflect: true },
    /* 形狀 */
    shape: { type: String, reflect: true },
    /* 水波紋 */
    ripple: { type: Boolean, reflect: true },
    /* 是否禁用 */
    disabled: { type: Boolean, reflect: true },
    /* 是否唯獨 */
    readonly: { type: Boolean, reflect: true },
    /* 是否載入中 */
    loading: { type: Boolean, reflect: true },
    /* 是否切換 */
    toggle: { type: Boolean, reflect: true },
    /* 是否點選 */
    checked: { type: Boolean, reflect: true },
    /* 圖示 */
    icon: { type: String },

    /* 按鈕類別 */
    htmlType: { type: String, attribute: 'html-type' },
    href: { type: String },
    rel: { type: String },
    target: { type: String },
    download: { type: String },
  };
  constructor() {
    super();
    this.rel = 'noreferrer noopener';
    this.target = '_blank';
  }
  btnRef = createRef();

  tagBtn = literal`button`;
  tagLink = literal`a`;

  render() {
    const cls = Object.values({
      main: 'btn',
      type: this.type ? 'btn-type--' + this.type : '',
      shape: this.shape ? 'btn-shape--' + this.shape : '',
      ripple: this.ripple ? 'btn--ripple' : '',
      cls: unsafeCSS(this.cls || ''),
    }).join(' ');

    const tag = this.href || this.download ? this.tagLink : this.tagBtn;
    return staticHtml`
      <${tag}
        ${ref(this.btnRef)}
        class=${cls}
        type="${this.htmlType || nothing}"
        href="${!this.href || this.disabled || this.readonly ? nothing : this.href}"
        download="${!this.download || this.disabled || this.readonly ? nothing : this.download}"
        rel="${!this.href || !this.rel ? nothing : this.rel}"
        target="${!this.href || this.href[0] === '#' || !this.target ? nothing : this.target}"
        ?disabled=${this.disabled}
        ?readonly=${this.readonly}
        ?loading=${this.loading}
        ?checked=${this.checked}
        @mousedown=${this.handleMouseDown}
        @keydown=${this.handleKeydown}
        @click=${this.handleClick}
      >
        <tk-icon class="hide:not([icon]):not([loading])" icon="${this.icon || nothing}" ?loading=${this.loading}></tk-icon>
        <slot></slot>
      </${tag}>
      <slot name="after"></slot>
    `;
  }
  // ----------------------------------------------------------------
  // # Life Cycle
  // ----------------------------------------------------------------
  connectedCallback() {
    super.connectedCallback();
    this.css = new MasterCSS({
      ...window.mcssConfig,
      // ...window.objUtil.merge(window.mcssConfig, { classes: cls }),
      themeDriver: 'host',
      observe: false,
    }).observe(this.shadowRoot);

    window.mcssTheme.register(this);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.css) this.css.destroy();

    window.mcssTheme.unregister(this);
  }
  // ----------------------------------------------------------------
  // # Methods
  // ----------------------------------------------------------------
  handleMouseDown(ev) {
    if (this.disabled || !this.ripple) return;
    const { left, top } = this.getBoundingClientRect();
    this.btnRef.value.style.cssText = Object.entries({
      '--x': ev.clientX - left + 'px',
      '--y': ev.clientY - top + 'px',
    })
      .map(([k, v]) => `${k}:${v}`)
      .join(';');
  }
  handleKeydown(ev) {
    switch (ev.keyCode) {
      case 13: //Enter
        ev.stopPropagation();
        break;
      default:
        break;
    }
  }
  handleClick() {
    if (this.toggle) {
      this.checked = !this.checked;
      this.dispatchEvent(new CustomEvent('checked', { detail: this.checked }));
    }
  }
  focus() {
    this.btnRef.value.focus();
  }
  // ----------------------------------------------------------------
  // # 屬性相關
  // ----------------------------------------------------------------
  openModal() {
    this.open = true;
  }
  closeModal() {
    this.open = false;
  }
  toggleModal() {
    if (this.open) {
      this.closeModal();
    } else {
      this.openModal();
    }
  }
}
window.TkButton = TkButton;
customElements.define('tk-button', TkButton);

export class TkButtonGroup extends LitElement {
  static styles = css`
    :host {
      display: inline-flex;
    }
  `;
  static properties = {
    ratio: { type: Boolean, reflect: true },
    value: { type: String, reflect: true },
    type: { type: String, reflect: true },
    disabled: { type: Boolean },
  };
  constructor() {
    super();

    this._handleClick = this.handleClick.bind(this);
  }
  get _slottedChildren() {
    const slot = this.shadowRoot.querySelector('slot');
    return slot.assignedElements({ flatten: true });
  }
  render() {
    return html`<slot @slotchange=${this.handleSlotchange}></slot>`;
  }
  connectedCallback() {
    super.connectedCallback();
    this.shadowRoot.addEventListener('click', this._handleClick);
  }
  disconnectedCallback() {
    this.shadowRoot.removeEventListener('click', this._handleClick);
    super.disconnectedCallback();
  }
  handleClick(e) {
    if (this.ratio && e.target) {
      const el = e.target;
      if (this.value !== el.getAttribute('value')) {
        this.value = el.getAttribute('value');
      }
      this.dispatchEvent(new CustomEvent('change', { detail: { value: this.value } }));
    }
  }
  handleSlotchange(e) {
    this._slottedChildren.forEach((el, idx) => {
      if (idx > 0) {
        el.className = [el.className, el.type && el.type !== 'dashed' ? 'ml:1!' : 'ml:-1!'].join(' ');
      } else {
        el.className = [el.className, 'm:0!'].join(' ');
      }
      if (idx === 0) {
        el.className = [el.className, 'rtr:0! rbr:0!'].join(' ');
      } else if (idx === this._slottedChildren.length - 1) {
        el.className = [el.className, 'rtl:0! rbl:0!'].join(' ');
      } else {
        el.className = [el.className, 'r:0!'].join(' ');
      }
    });
  }
  updated(changedProperties) {
    if (changedProperties.has('disabled') && changedProperties.get('disabled') !== this.disabled) {
      this._slottedChildren.forEach((el) => {
        if (this.disabled) {
          el.setAttribute('disabled', 'disabled');
        } else {
          el.removeAttribute('disabled');
        }
      });
    }
    if (changedProperties.has('value') && changedProperties.get('value') !== this.value) {
      this._slottedChildren.forEach((el) => {
        if (this.value === el.getAttribute('value')) {
          el.setAttribute('checked', 'checked');
        } else {
          el.removeAttribute('checked');
        }
      });
    }
  }
}
window.TkButtonGroup = TkButtonGroup;
customElements.define('tk-button-group', TkButtonGroup);
