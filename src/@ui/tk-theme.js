import { LitElement, html, css, classMap, unsafeCSS, nothing, ref, createRef } from 'https://cdn.jsdelivr.net/gh/lit/dist@2.7.3/all/lit-all.min.js';

export class TkTheme extends LitElement {
  static styles = css``;
  static properties = {
    cls: { type: String },
    _icon: { type: String, state: true },
  };
  constructor() {
    super();
    this.themeKeys = Object.keys(this.themes);
    this.currentTheme = null;
  }

  render() {
    return html`<tk-button type="theme" shape="circle" icon=${this._icon} class=${unsafeCSS(window.masterTheme.current)} @click=${this.toggleTheme}></tk-button>`;
  }

  // THEME_KEY = 'theme';
  get themes() {
    return {
      light: 'carbon:sun',
      dark: 'carbon:moon',
    };
  }

  // ----------------------------------------------------------------
  // # Life Cycle
  // ----------------------------------------------------------------
  connectedCallback() {
    super.connectedCallback();
    this.css = new MasterCSS({
      ...window.masterCSSConfig,
      themeDriver: 'host',
      observe: false,
    }).observe(this.shadowRoot);

    window.masterTheme.register(this);
    this.initTheme(window.masterTheme.current);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.css) this.css.destroy();

    window.masterTheme.unregister(this);
  }
  // ----------------------------------------------------------------
  // # Methods
  // ----------------------------------------------------------------
  initTheme(value) {
    this.currentTheme = value && this.themeKeys.includes(value) ? value : this.themeKeys[0];
    this._icon = this.themes[this.currentTheme];
    window.masterTheme.switchAll(this.currentTheme);

    // localStorage.setItem(this.THEME_KEY, this.currentTheme);
    // this.themeKeys.forEach((theme) => {
    //   document.documentElement.classList.toggle(theme, theme === this.currentTheme);
    // });
  }

  toggleTheme() {
    let nextIdx = this.themeKeys.indexOf(this.currentTheme) + 1;
    if (nextIdx > this.themeKeys.length - 1) nextIdx = 0;

    this.initTheme(this.themeKeys[nextIdx]);
  }
}
window.TkTheme = TkTheme;
customElements.define('tk-theme', TkTheme);
