import { LitElement, html, css, unsafeCSS, nothing, ref, createRef, staticHtml, literal } from 'https://cdn.jsdelivr.net/gh/lit/dist@2.7.3/all/lit-all.min.js';

const cssLiteral = window.masterCSSLiteral;
const cls = {
  btn: {
    '': cssLiteral.$`
      box:border rel overflow:hidden
      inline-flex center-content gap:1x
      p:.5x|1x r:inherit w:inherit h:inherit
      f:inherit fg:$(fg,inherit) bg:$(bg,inherit)
      t:center vertical-align:middle
      text-transform:inherit text:none white-space:nowrap
      b:1|solid|$(border,G-50)
      ~.2s transition-property:color,background,border-color,box-shadow
      pointer outline:none
      pointer-events:all
      untouchable>*

      {z:1;fg:$(theme,theme);border-color:$(theme,theme)}:is(:not([disabled]):hover,:focus-within)

      {opacity:.6;cursor:not-allowed;}:is([disabled],[readonly],[loading])
      {bg:B-50/.1}:not([class*="btn-type--"])[disabled]

      {content:'';untouchable;abs;full;middle;center;bg:$(fg,theme);opacity:0;~opacity|.2s}::before
      {opacity:.1}:not([disabled]):active::before

      :host(:empty)_{p:1x}
    `,
    '-ripple': cssLiteral.$`
      {content:'';untouchable;abs;full;top:$(y,50%);left:$(x,50%);bg:no-repeat;bg:center}::after
      {bg:theme;bg:radial-gradient(circle,bg|10%,transparent|10.01%)}::after
      {transform:translate(-50%,-50%)|scale(10);opacity:0;~transform|.2s,opacity|.8s}::after
      {transform:translate(-50%,-50%)|scale(0);opacity:.3;~none}:not([disabled]):active::after
    `,
    '-noborder': cssLiteral.$`
      b:0 p:calc(.5x+1)|calc(1x+1)!
      :host(:empty)_{p:1x!}
    `,
    type: {
      '-dashed': cssLiteral.$`border-style:dashed`,
      '-outline': cssLiteral.$`
        fg:$(theme,theme)! border-color:$(theme,theme)
        {bg:$(theme,theme)!}::before
      `,
      '-font': cssLiteral.$`
        btn--noborder
        {content:unset!}::before
      `,
      '-flat': cssLiteral.$`
        btn--noborder
        {opacity:.1}:is(:not([disabled]):hover,:focus-within)::before
        {opacity:.2!}:not([disabled]):active::before
      `,
      '-theme': cssLiteral.$`
        btn-type--flat
        fg:$(theme-fg,theme-fg)! bg:$(theme,theme)!
        {bg:$(theme-fg,theme-fg)!}::before
        {bg:theme;bg:radial-gradient(circle,bg|10%,transparent|10.01%)}.btn--ripple::after
      `,
    },
    shape: {
      '-circle': cssLiteral.$`round`,
    },
  },
};

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
      ...window.objUtil.merge(window.masterCSSConfig, { classes: cls }),
      themeDriver: 'host',
      observe: false,
    }).observe(this.shadowRoot);

    window.masterTheme.register(this);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.css) this.css.destroy();

    window.masterTheme.unregister(this);
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
    disabled: { type: Boolean },
  };
  constructor() {
    super();
  }
  get _slottedChildren() {
    const slot = this.shadowRoot.querySelector('slot');
    return slot.assignedElements({ flatten: true });
  }
  render() {
    return html`<slot @slotchange=${this.handleSlotchange}></slot>`;
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
  }
}
window.TkButtonGroup = TkButtonGroup;
customElements.define('tk-button-group', TkButtonGroup);
