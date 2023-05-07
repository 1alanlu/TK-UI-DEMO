import { LitElement, html, css, classMap, unsafeCSS, nothing } from 'https://cdn.jsdelivr.net/gh/lit/dist@2.6.1/all/lit-all.min.js';

const cssLiteral = window.masterCSSLiteral;
const cls = {
  label: cssLiteral.$`
    box:border outline:0 pointer
    flex ai:center gap:1x
  `,
  checked: {
    '': cssLiteral.$`
      box:border rel
      flex center-content round
      w:1em h:1em
      ~.3s
      :not([disabled]):hover_{z:1}
      {z:-1;box:border;content:'';abs;full;round;bg:$(theme)}::before
      {opacity:.2;scale(0);~.2s|cubic-bezier(.12,.4,.29,1.46)|.1s}::before
      #radio:focus-visible+label_{scale(2.5)}::before

      {box:border;content:'';abs;center;middle;w:1x;h:1x;round;bg:$(theme)}::after
      {~.2s|cubic-bezier(.12,.4,.29,1.46)|.1s}::after
    `,
    '-default': cssLiteral.$`
      b:1|solid|G-40
      [disabled]_{background:rgba(0,0,0,.1)}
      :not([disabled]):hover_{border-color:$(theme)}
      {bg:$(theme);scale(0)}::after

      [checked]_{border-color:$(theme)}
      [checked]_{scale(1)}::after
    `,
    '-theme': cssLiteral.$`
      bg:$(theme)
      {border:2|solid|white;scale(0)}::after

      [checked]_{scale(1)}::after
    `,
  },
};
export class TkRadio extends LitElement {
  static styles = css`
    :host {
      --theme: ${unsafeCSS(window.masterCSSConfig.colors['G'][50])};
      display: inline-block;
      font-size: 14px;
      -webkit-tap-highlight-color: transparent;
    }
    #radio {
      position: absolute;
      clip: rect(0, 0, 0, 0);
    }
    :host([disabled]) {
      pointer-events: none;
      opacity: 0.6;
    }
    :host([disabled]) #label {
      pointer-events: all;
      cursor: not-allowed;
    }
    :host(:empty) #checked {
      margin-right: 0;
    }
  `;
  static properties = {
    cls: { type: String },
    name: { type: String, reflect: true },
    value: { type: String, reflect: true },
    type: { type: String, reflect: true },
    checked: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
  };
  constructor() {
    super();
    this.type = 'default';
  }
  render() {
    return html`
      <div id="root" class=${unsafeCSS(this.cls || '')}>
        <input type="checkbox" id="radio" ?checked=${this.checked} ?disabled=${this.disabled} @change=${this.handleChange} />
        <label id="label" for="radio" class="label" ?checked=${this.checked} ?disabled=${this.disabled}>
          <span id="checked" class=${classMap({ checked: true, ['checked--' + this.type]: this.type })}></span>
          <slot></slot>
        </label>
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
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.css) this.css.destroy();

    window.masterTheme.unregister(this);
  }
  // ----------------------------------------------------------------
  // # Methods
  // ----------------------------------------------------------------
  handleChange() {
    const group = this.closest('tk-radio-group');
    const parent = group || this.getRootNode();
    const selector = group ? 'tk-radio[checked]' : 'tk-radio[name="' + this.name + '"][checked]';
    const prev = parent.querySelector(selector);
    if (prev && prev !== this) {
      prev.checked = false;
      // !!!: 不會觸發前一個radio的監聽
    }
    this.checked = true;
    this.dispatchEvent(new CustomEvent('change', { detail: { checked: this.checked } }));
  }
}
window.TkRadio = TkRadio;
customElements.define('tk-radio', TkRadio);

export class TkRadioGroup extends LitElement {
  static styles = css`
    :host {
      display: inline-flex;
    }
    :host([disabled]) {
      pointer-events: none;
    }
    :host([disabled]) ::slotted(tk-radio) {
      pointer-events: none;
      opacity: 0.6;
    }
    ::slotted(tk-radio) {
      transition: opacity 0.3s;
    }
  `;
  static properties = {
    cls: { type: String },
    value: { type: String, reflect: true },
    type: { type: String, reflect: true },
    disabled: { type: Boolean, reflect: true },
  };
  constructor() {
    super();
  }
  get _slottedChildren() {
    const slot = this.shadowRoot.querySelector('slot');
    return slot.assignedElements({ flatten: true });
  }
  render() {
    return html`<slot class="${unsafeCSS(this.cls || '')}" @slotchange=${this.handleSlotchange}></slot>`;
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
    if (changedProperties.has('type') && changedProperties.get('type') !== this.type) {
      this._slottedChildren.forEach((el) => {
        if (this.type) {
          el.setAttribute('type', 'type');
        } else {
          el.removeAttribute('type');
        }
      });
    }
    if (changedProperties.has('value') && changedProperties.get('value') !== this.value) {
      this._slottedChildren.forEach((el) => {
        el.checked = this.value === el.value;
      });
    }
  }
  handleSlotchange(e) {
    this._slottedChildren.forEach((el, idx) => {
      el.addEventListener('change', () => {
        this.dispatchEvent(new CustomEvent('change', { detail: { value: el.value } }));
      });
    });
  }
}

window.TkRadioGroup = TkRadioGroup;
customElements.define('tk-radio-group', TkRadioGroup);
