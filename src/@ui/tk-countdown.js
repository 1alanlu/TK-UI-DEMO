import { LitElement, html, css, classMap, unsafeCSS, map } from 'https://cdn.jsdelivr.net/gh/lit/dist@2.7.3/all/lit-all.min.js';
const cssLiteral = window.masterCSSLiteral;
const cls = {
  unit: {
    '': cssLiteral.$`
      rel h:full r:0x fg:theme-fg bg:theme shadow:2|2|8|0|theme/.16 overflow:hidden
      {content:'';abs;top:0;w:full;h:50%;bg:W-50/.16}::before
      {content:'';abs-center;w:90%;h:40%;bx:2|solid|theme-fg}::after
      {flex;h:1em;overflow:hidden}>div
      {w:0.7em}>div>div
      {f:1.333em;fg:theme;hide:empty}+div
      {hide}+div:empty
    `,
    type: {
      '-theme': cssLiteral.$`
      `,
    },
  },
};
export class TkCountdown extends LitElement {
  static styles = css`
    :host {
      position: relative;
      display: inline-flex;
    }
  `;
  static properties = {
    cls: { type: String },
    type: { type: String, reflect: true },
    date: { converter: (value) => (!value ? null : isNaN(value) ? new Date(value) : new Date(parseInt(value, 10))) },
    unit: { converter: (value) => value.split(',') },
    unitText: { converter: (value) => value.split(','), attribute: 'unit-text' },

    _digits: { type: Object, state: true },
    _animeTimer: { type: Object, state: true },
    _updateTimer: { type: Object, state: true },
  };
  constructor() {
    super();
    this.unit = ['d', 'h', 'm', 's'];
    this.unitText = ['天', '時', '分', ''];
    this._digits = this.unit.reduce((acc, unit) => ({ ...acc, [unit]: { prev: ['-', '-'], next: ['-', '-'], anime: [false, false] } }), {});
    this._animeTimer = null;
    this._updateTimer = null;
  }
  render() {
    return html`
      <div
        class=${Object.values({
          main: 'flex center-content lh:1 f:inherit f:bolder t:center user-select:none',
          units: '{box:border;p:1x;flex:1;inline-flex;center-content}>div',
          cls: unsafeCSS(this.cls || ''),
        }).join(' ')}
      >
        ${map(this.unit, (unit, idx) => {
          const data = this._digits[unit];
          return html`
            <div class="unit">
              <div>
                ${map(
                  [0, 1],
                  (i) => html`
                    <div class=${classMap({ '@rollIn|0.5s|ease-in-out': data['anime'][i] })}>
                      <div class=${classMap({ '@fade|0.5s|ease-in-out': data['anime'][i] })}>${data['next'][i]}</div>
                      <div class=${classMap({ '@fade|0.5s|ease-in-out|reverse': data['anime'][i] })}>${data['prev'][i]}</div>
                    </div>
                  `
                )}
              </div>
            </div>
            <div>${this.unitText[idx]}</div>
          `;
        })}
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
  shouldUpdate(changedProperties) {
    if (changedProperties.size === 2 && (changedProperties.has('_animeTimer') || changedProperties.has('_updateTimer'))) return false;
    return true;
  }
  willUpdate(changedProperties) {
    if (changedProperties.has('date') && this.date) {
      this.countdown();
    }
  }
  // ----------------------------------------------------------------
  // # Methods
  // ----------------------------------------------------------------
  countdown(doAnimations = false) {
    const distance = this.date.getTime() - new Date().getTime();
    const display =
      distance > 0
        ? {
            d: Math.floor(distance / (1000 * 60 * 60 * 24)),
            h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            s: Math.floor((distance % (1000 * 60)) / 1000),
          }
        : { d: 0, h: 0, m: 0, s: 0 };

    this.unit.forEach((unit) => {
      const digits = `${display[unit]}`.split('');
      if (digits.length < 2) digits.unshift('0');
      [...digits].forEach((digit, i) => {
        if (digit === this._digits[unit]['next'][i]) return;
        this._digits[unit]['prev'][i] = this._digits[unit]['next'][i];
        this._digits[unit]['next'][i] = digit;
        this._digits[unit]['anime'][i] = doAnimations;
      });
    });
    this._digits = { ...this._digits };

    clearTimeout(this._animeTimer);
    clearTimeout(this._updateTimer);
    // loop
    if (distance > 0) {
      this._animeTimer = setTimeout(this.clearAnimations.bind(this), 500);
      this._updateTimer = setTimeout(this.countdown.bind(this, true), 1e3);
    } else {
      this.dispatchEvent(new CustomEvent('done'));
    }
  }
  clearAnimations() {
    this.unit.forEach((unit) => {
      this._digits[unit]['anime'] = [false, false];
    });
    this._digits = { ...this._digits };
  }
}
window.TkCountdown = TkCountdown;
customElements.define('tk-countdown', TkCountdown);
