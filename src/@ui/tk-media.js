import { LitElement, html, css, classMap, unsafeCSS, nothing, ref, createRef, literal, staticHtml } from 'https://cdn.jsdelivr.net/gh/lit/dist@2.7.3/all/lit-all.min.js';

const cssLiteral = window.masterCSSLiteral;
const cls = {
  media: {
    '': cssLiteral.$`
      rel block overflow:hidden
      m:0 w:full
      {content:'';block;pt:calc(var(--h)/var(--w)*100%);w:full}::before
    `,
  },
  img: {
    '': cssLiteral.$`
      abs-center
      {w:full;h:auto}
      .portrait_{w:auto;h:full}
      untouchable
      ~.2s transition-property:opacity,visibility
      .skeleton_{opacity:0;invisible}
      hide[hide]
    `,
  },
};

export default class TkMedia extends LitElement {
  static styles = css`
    :host {
      position: relative;
      display: block;
      width: 100%;
    }
  `;
  static properties = {
    cls: { type: String },
    imgSrc: { type: String, attribute: 'img' },
    videoSrc: { type: String, attribute: 'video' },
    title: { type: String },
    alt: { type: String },

    ratio: { type: String, reflect: true },
    auto: { type: Boolean },
    portrait: { type: Boolean },
    skeleton: { type: Boolean },

    htmlType: { type: String, attribute: 'html-type' },
    href: { type: String },
    rel: { type: String },
    target: { type: String },
    download: { type: String },

    disabled: { type: Boolean, reflect: true },
    readonly: { type: Boolean, reflect: true },

    preventedVideo: { type: Boolean, attribute: 'prevented-video' },
    preventedLazy: { type: Boolean, attribute: 'prevented-lazy' },
    preventedSkeleton: { type: Boolean, attribute: 'prevented-skeleton' },

    _coverSrc: { type: String, state: true },
    _portrait: { type: Boolean, state: true },
    _loaded: { type: Boolean, state: true },
  };
  constructor() {
    super();
    this.title = '';
    this.alt = '';
    this.rel = 'noreferrer noopener';
    this.target = '_blank';
  }

  mediaRef = createRef();
  imgRef = createRef();

  tagDiv = literal`div`;
  tagLink = literal`a`;

  render() {
    const tag = this.href || this.download ? this.tagLink : this.tagDiv;
    return staticHtml`
      <${tag}
        href="${!this.href || this.disabled || this.readonly ? nothing : this.href}"
        download="${!this.download || this.disabled || this.readonly ? nothing : this.download}"
        rel="${!this.href || !this.rel ? nothing : this.rel}"
        target="${!this.href || this.href[0] === '#' || !this.target ? nothing : this.target}"
        ?disabled=${this.disabled}
        ?readonly=${this.readonly}
        >
        ${this.renderContent()}
        <slot></slot>
      </${tag}>
    `;
  }
  renderContent() {
    const title = this.title || nothing;
    const alt = this.alt || title;

    const [w, h] = this.ratio ? this.ratio.split('/') : [1, 1];

    return html`
      <figure
        ${ref(this.mediaRef)}
        class=${Object.values({
          main: 'media',
          ratio: `$w:${w} $h:${h}`,
          skeleton: this.preventedSkeleton ? '' : this.skeleton || !this._loaded ? 'skeleton' : '',
          portrait: this._portrait ? 'portrait' : '',
          coverBg: this._ytID ? '$skeleton-bg:black' : '',
          keepCover: this._loadingVideo ? '{opacity:1!;visible!}_img' : '',
          cls: unsafeCSS(this.cls || ''),
        }).join(' ')}
      >
        <img ${ref(this.imgRef)} class="img" .title=${title} .alt=${alt} />
        ${this._ytID ? this.renderVideo() : null}
      </figure>
    `;
  }
  renderVideo() {
    return !this._loadingVideo
      ? html`
          <div class="abs-center w:30% max-w:4rem h:auto">
            <div
              class=${Object.values({
                main: 'rel full pb:100% round bg:B-30 pointer',
                opacity: '~opacity|.2s opacity:.5 opacity:.7:hover opacity:.9:active',
                before: "{content:'';abs-center;round;w:80%;h:80%;b:3|solid|W-50}::before",
                after: "{content:'';abs-full;full;bg:W-50;clip:polygon(67%|50%,38%|34%,38%|66%)}::after",
              }).join(' ')}
              @click=${() => {
                if (!this.preventedVideo) {
                  this._loaded = false;
                  this._loadingVideo = true;
                }
              }}
            ></div>
          </div>
        `
      : html`
          <iframe
            class="abs-full full"
            .src=${`https://www.youtube.com/embed/${this._ytID}?${this.ytParams}`}
            frameborder="0"
            allowfullscreen
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            @load=${() => {
              this._loaded = true;
            }}
          ></iframe>
        `;
  }
  /** https://developers.google.com/youtube/player_parameters?hl=zh-cn */
  get ytParams() {
    return Object.entries({ autoplay: 1, enablejsapi: 1 })
      .map(([k, v]) => `${k}=${v}`)
      .join('&');
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
  willUpdate(changedProperties) {
    let imgSrc = null;
    if (changedProperties.has('imgSrc') && this.imgSrc) {
      imgSrc = this.imgSrc;
    }
    if ((changedProperties.has('videoSrc') && this.videoSrc) || !this.imgSrc) {
      this._loadingVideo = false;
      this._ytID = this.getYtID(this.videoSrc);
      this._coverSrc = `https://i.ytimg.com/vi/${this._ytID}/hqdefault.jpg`;
      if (!imgSrc) imgSrc = this._coverSrc;
    }
    if (imgSrc && !changedProperties.has('_loaded')) {
      this._loaded = false;
      this.imgSrc = imgSrc;
    }

    if (changedProperties.has('auto') || changedProperties.has('portrait')) {
      this._portrait = false;
    }
  }
  updated(changedProperties) {
    if (!this._loaded) {
      this.processImg();
    } else if (changedProperties.has('auto') || changedProperties.has('portrait')) {
      this.updateSize(this.imgRef.value);
    }
  }
  //----------------------------------------------------------------
  // Methods
  //----------------------------------------------------------------
  getYtID(url) {
    if (!url) return null;
    const youtubeRegExp = /(?:[?&]vi?=|\/embed\/|\/\d\d?\/|\/vi?\/|https?:\/\/(?:www\.)?youtu\.be\/)([^&\n?#]+)/;
    const match = url.match(youtubeRegExp);
    return match && match[1].length == 11 ? match[1] : null;
  }
  processImg() {
    const img = this.imgRef.value;

    if (this.preventedLazy) {
      this.updateImg(img);
    } else {
      if (this.observer) this.observer.unobserve(img);
      this.observer = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.updateImg(entry.target);
              observer.unobserve(entry.target);
              this.observer = null;
            }
          });
        },
        {
          rootMargin: '-100px 0px 100px 0px',
          threshold: 0,
        }
      );
      this.observer.observe(img);
    }
  }
  updateImg(img) {
    img.src = this.imgSrc;
    img.onload = (e) => this.updateSize(e.target);
    img.onerror = (e) => this.onError(e.target);
    if (img.complete) {
      this.updateSize(img);
    }
  }
  updateSize(img) {
    if (!img || !img.height || !img.width) return;

    if (this.auto) {
      this.ratio = img.width + '/' + img.height;
    } else if (this.portrait) {
      const wrap = this.mediaRef.value;
      const parentRadio = wrap.clientHeight / wrap.clientWidth; // 父節點比例
      const targetRadio = img.height / img.width; // 圖片比例
      // 比例小於父節點 套用高滿版 (預設寬滿版)
      if (targetRadio < parentRadio) {
        this._portrait = true;
      }
    }

    this._loaded = true;
  }
  onError(img) {
    if (this._loaded) return;
    if (!img) return;

    if (this._coverSrc) {
      img.src = this._coverSrc;
    } else {
      img.src = 'https://fakeimg.pl/200x200/?text=Not%20Found';
      this._loaded = true;
    }
  }
}
window.TkMedia = TkMedia;
customElements.define('tk-media', TkMedia);
