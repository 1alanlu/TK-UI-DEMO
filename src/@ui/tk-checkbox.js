import { LitElement, html, css, classMap, unsafeCSS, nothing } from 'https://cdn.jsdelivr.net/gh/lit/dist@2.7.3/all/lit-all.min.js';

const cssLiteral = window.masterCSSLiteral;
const cls = {
  label: cssLiteral.$`
    box:border outline:0 pointer
    flex ai:center gap:1x
  `,
  checked: {
    '': cssLiteral.$`
      box:border rel
      flex center-content r:0x
      w:1em h:1em
      ~.2s
      :not([disabled]):hover_{z:1}

      {scale(0);fg:W-50;~.2s|cubic-bezier(.12,.4,.29,1.46)|.1s}>tk-icon

      {z:-1;box:border;content:'';abs;full;round;bg:$(theme)}::before
      {opacity:.2;scale(0);~.2s|cubic-bezier(.12,.4,.29,1.46)|.1s}::before
      #checkbox:focus-visible+label_{scale(2.5)}::before
    `,
    '-default': cssLiteral.$`
      b:1|solid|G-40
      [disabled]_{background:rgba(0,0,0,.1)}
      :not([disabled]):hover_{border-color:$(theme)}
      [checked]_{border-color:$(theme);bg:$(theme)}
      [checked]_{scale(1)}>tk-icon
    `,
  },
};
export class TkCheckbox extends LitElement {
  static styles = css`
    :host {
      --theme: ${unsafeCSS(window.masterCSSConfig.colors['G'][50])};
      display: inline-block;
      font-size: 14px;
      -webkit-tap-highlight-color: transparent;
    }
    #checkbox {
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
        <input type="checkbox" id="checkbox" ?checked=${this.checked} ?disabled=${this.disabled} @change=${this.handleChange} />
        <label id="label" for="checkbox" class="label" ?checked=${this.checked} ?disabled=${this.disabled}>
          <span id="checked" class=${classMap({ checked: true, ['checked--' + this.type]: this.type })}>
            <tk-icon icon="material-symbols:check-small"></tk-icon>
          </span>
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
    this.checked = !this.checked;
    this.dispatchEvent(new CustomEvent('change', { detail: { checked: this.checked } }));
  }
}
window.TkCheckbox = TkCheckbox;
customElements.define('tk-checkbox', TkCheckbox);

export class TkCheckboxGroup extends LitElement {
  static styles = css`
    :host {
      display: inline-flex;
    }
    :host([disabled]) {
      pointer-events: none;
    }
    :host([disabled]) ::slotted(tk-checkbox) {
      pointer-events: none;
      opacity: 0.6;
    }
    ::slotted(tk-checkbox) {
      transition: opacity 0.2s;
    }
    ::slotted(tk-checkbox:not(:first-child)) {
      margin-left: ${unsafeCSS(window.masterCSSConfig.values['1x']+'px')};
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
    return html`
      <div class="flex flex:wrap jc:start gap:1x ${unsafeCSS(this.cls || '')}">
        <slot @slotchange=${this.handleSlotchange}></slot>
      </div>
    `;
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

window.TkCheckboxGroup = TkCheckboxGroup;
customElements.define('tk-checkbox-group', TkCheckboxGroup);
