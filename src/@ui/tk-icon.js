import { LitElement, html, css, classMap, unsafeCSS, nothing } from 'https://cdn.jsdelivr.net/gh/lit/dist@2.7.3/all/lit-all.min.js';

const mcssLiteral = window.mcssLiteral;

const flipMap = { v: 'vertical', h: 'horizontal' };

export class TkIcon extends LitElement {
  static styles = css`
    :host {
      position: relative;
      display: inline-block;
    }
  `;
  static properties = {
    cls: { type: String },
    icon: { type: String, reflect: true },
    rotate: { type: String, converter: (rotate) => (rotate ? rotate + 'deg' : '') },
    flip: { type: String, converter: (flip) => (flip ? [...flip].map((x) => flipMap[x] || '').join(',') : '') },
    spin: { type: Boolean },
    loading: { type: Boolean },
    type: { type: String },
    flag: { type: String },
  };
  constructor() {
    super();
  }
  typeMap = {
    arrow: { 0: 'material-symbols:keyboard-arrow-up-rounded', 1: 'material-symbols:keyboard-arrow-down-rounded' },
  };
  render() {
    return html`
      <div
        class=${mcssLiteral.toLine({
          '': 'flex center-content f:inherit min-w:2x min-h:2x',
          ':host(:not(:empty))_': 'gap:1x',
          cls: unsafeCSS(this.cls || ''),
        })}
      >
        <slot name="pre"></slot>
        ${this.renderIcon()}
        <slot></slot>
      </div>
    `;
  }
  renderIcon() {
    const icon = !this.loading ? this.icon : 'line-md:loading-twotone-loop';
    const classes = classMap({ hide: !icon, spin: this.spin });
    return html`<iconify-icon class=${classes} icon="${icon || nothing}" rotate="${this.rotate || nothing}" flip="${this.flip || nothing}"></iconify-icon>`;
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
  willUpdate(changedProperties) {
    if (changedProperties.has('type') || changedProperties.has('flag')) {
      const icons = this.typeMap[this.type] || {};
      this.icon = icons[this.flag] || null;
    }
  }
}
window.TkIcon = TkIcon;
customElements.define('tk-icon', TkIcon);
