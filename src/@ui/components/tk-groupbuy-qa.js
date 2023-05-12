import { LitElement, html, map } from 'https://cdn.jsdelivr.net/gh/lit/dist@2.6.1/all/lit-all.min.js';

export class TkGroupbuyQA extends LitElement {
  // ----------------------------------------------------------------
  // # Alpine Data
  // ----------------------------------------------------------------
  static getAlpineData() {
    return {
      // ----------------------------------------------------------------
      // # Data
      // ----------------------------------------------------------------
      initialized: false,
      data: [],
      // ----------------------------------------------------------------
      // # Initialize
      // ----------------------------------------------------------------
      init() {
        this.initData();
        this.initIcon();

        // x-bind:card
        if (!this.card || !Object.values(this.card).length) {
          this.card = {
            'x-effect': '$nextTick(()=>shown=true)',
          };
        } else {
          this.card = Object.assign({ ['@transitionrun.once']: 'shown=true' }, this.card);
        }
      },
      async initData() {
        this.data = await this.fetchData();
        this.initialized = true;
      },
      initIcon() {
        const icon = document.createElement('iconify-icon');
        icon.addCollection({
          prefix: 'tk3c',
          width: 20,
          height: 20,
          icons: {
            'customer-service': {
              body: '<path fill="currentColor" d="M2.54895 8.60026C2.41642 8.85327 2.33208 9.13641 2.28389 9.42556C2.11521 10.5159 2.57304 11.7268 3.72967 12.046C3.92847 12.0942 4.12726 12.1183 4.33208 12.1183C4.39232 12.1183 4.97666 12.046 4.97666 12.046C4.36822 10.8232 4.1875 9.54604 4.43449 8.2087C4.98871 5.1846 7.85618 3.09424 10.8381 3.52797C13.2116 3.87135 15.1514 5.73279 15.6393 8.11833C16.1333 10.5581 15.0851 13.0641 13.0309 14.3232C12.9345 14.3774 12.808 14.4015 12.6935 14.4015C12.1152 14.4015 11.6755 14.7991 11.6694 15.3533C11.6574 15.8894 12.0971 16.3352 12.6333 16.3352C13.1815 16.3352 13.5851 15.9075 13.6032 15.3231C13.6092 15.2147 13.6755 15.0701 13.7598 15.0099C14.7658 14.293 15.5309 13.3834 16.073 12.281C16.1212 12.1786 16.2357 12.0822 16.3441 12.046C17.0188 11.8111 17.5248 11.275 17.7417 10.6003C17.9646 9.90749 17.8803 9.13038 17.5068 8.50388C17.3622 8.25689 17.1574 8.034 16.9104 7.87135C16.8776 7.8477 16.8438 7.82624 16.81 7.80483L16.81 7.80481C16.7319 7.75533 16.6542 7.70606 16.5911 7.63038C16.5128 7.54002 16.4706 7.42556 16.4345 7.3111C16.3682 7.08821 16.2899 6.87135 16.1995 6.65448C16.0248 6.23279 15.808 5.82918 15.5489 5.44966C15.2959 5.08219 15.0068 4.73279 14.6875 4.41954C14.3742 4.10629 14.0248 3.82316 13.6514 3.58219C13.2779 3.34123 12.8863 3.13038 12.4706 2.96773C12.055 2.80508 11.6212 2.67858 11.1815 2.60026C10.6514 2.50388 10.1032 2.47978 9.56702 2.51593C9.09714 2.55207 8.63328 2.63641 8.18148 2.76894C7.75377 2.90147 7.3381 3.07014 6.94654 3.28099C6.54895 3.49183 6.18148 3.74484 5.8381 4.02797C5.49473 4.31111 5.17545 4.63038 4.89232 4.97978C4.60919 5.3352 4.35015 5.71472 4.13931 6.11833C3.92244 6.52797 3.74172 6.96171 3.60919 7.40749C3.56702 7.54605 3.44051 7.69062 3.31401 7.76894C2.98268 7.97376 2.72967 8.25086 2.54895 8.60026ZM13.6488 12.1327C14.318 11.3248 14.7202 10.2877 14.7202 9.15661C14.7202 6.57817 12.63 4.48794 10.0515 4.48794C7.4731 4.48794 5.38286 6.57817 5.38286 9.15661C5.38286 10.2875 5.78495 11.3245 6.45396 12.1324C4.70665 13.2863 3.54601 15.2567 3.51559 17.5001H16.5867C16.5678 16.1062 16.1125 14.8177 15.3514 13.7649C15.0154 14.166 14.6308 14.5381 14.1776 14.8796C14.072 14.9594 13.9448 15.0689 13.9444 15.2019C13.9613 15.9172 13.4652 16.4696 12.7512 16.51C12.0529 16.5495 11.4494 16.0372 11.428 15.3811C11.3975 14.7035 11.9428 14.1852 12.696 14.1426C12.8451 14.1342 13.0082 14.0954 13.1299 14.022C13.6697 13.6696 14.1124 13.2471 14.4677 12.7722C14.2125 12.5382 13.9388 12.3242 13.6488 12.1327Z" />',
            },
          },
        });
      },
      // ----------------------------------------------------------------
      // # API - Fetch Data
      // ----------------------------------------------------------------
      async fetchData() {
        const result = window.ajaxUtil.get({ url: this.$store.common.ecDomain + '/ashx/Groupbuy_QA.ashx' });
        const delay = new Promise((r) => setTimeout(r, 1000));
        const [[error, res]] = await Promise.all([result, delay]);
        if (error || !res) return [];
        return res.Table;
      },
    };
  }

  // static properties = {}
  constructor() {
    super();

    this.components = {
      // 標題
      // subject: html`
      //   <div class="subject">
      //     <p class="f:20 f:bold lh:1.1">歷史紀錄</p>
      //   </div>
      // `,
      // 訊息
      message: html`
        <div x-show="!data.length" class="my:80 flex center-content gap:1x">
          <iconify-icon x-show="!initialized" icon="eos-icons:loading"></iconify-icon>
          <p x-text="!initialized ? '資料載入中' : '目前無問答紀錄'"></p>
        </div>
      `,
      // 卡片
      cards: html`
        <template x-for="(item, idx) in data" :key="item.ID">
          <div class="card cursor:pointer:not([open])" x-bind="card" x-data="{shown: false, open: false, replied: item.RESULSTATUS !== 'N'}" :open="open" :replied="replied" @click="open=true">
            <!-- Title -->
            <div class="flex ai:flex-start jc:space-between gap:2x gap:1x@<=2xs">
              <div class="flex round fg:W-50 bg:#cbcbcb [replied]_{bg:success}">
                <iconify-icon class="invisible [replied]_{visible}" icon="material-symbols:check-small-rounded"></iconify-icon>
              </div>
              <p class="flex:1 f:bold lh:1.1" x-text="item.ACTIVITYTITLE"></p>
              <p class="f:14 fg:#b2b2b2" x-data="{ date: replied ? item.RESULTTIME : item.CREATETIME }" x-text="new Date(date).toLocaleDateString()"></p>
            </div>
            <!-- Content -->
            <div class="mt:2x {f:14}_p">
              <p
                x-show="open"
                x-collapse.duration.250ms.min.0px
                x-data="{closed:!open}"
                class="[open]_{block}"
                :class="{'lines:2': closed}"
                x-init="$watch('shown',()=>{$el.classList.add('min-h:'+(($el.scrollHeight>20?2:1)*20)+'px');$dispatch('refresh')})"
                @transitionend="closed=!open;$dispatch('refresh')"
                x-text="item.CONTENT"
              ></p>
            </div>
            <!-- Reply -->
            <div class="[open]_{mt:2x;mb:1x} ~margin|250ms|cubic-bezier(.4,0,.2,1)">
              <div x-show="open" x-collapse.duration.250ms class="flex gap:2x gap:1x@<=2xs f:14">
                <div>
                  <iconify-icon class="f:20" icon="tk3c:customer-service"></iconify-icon>
                </div>
                <p x-show="replied" x-text="item.RESULTCONTENT"></p>
                <div x-show="!replied" class="fg:#b2b2b2">
                  <p>小編忙碌中，我們將於服務時間內盡速回覆您的訊息，感謝您的耐心與體諒。</p>
                  <p>服務時間：週一至週五上午09:00~晚上06:00（不包含週末及國定假日）</p>
                </div>
              </div>
            </div>
            <!-- Btn -->
            <div class="abs left:0 right:0 bottom:0 h:2x flex flex:wrap center-content cursor:pointer" @click.stop="open=!open">
              <div class="abs left:0 bottom:0 h:4x w:full bg:linear-gradient(W-50/20%|0%,W-50|100%) user-select:none pointer-events:none ~opacity|250ms [open]_{opacity:0}"></div>
              <iconify-icon class="z:1" :icon="open? 'material-symbols:keyboard-arrow-up-rounded': 'material-symbols:keyboard-arrow-down-rounded'"></iconify-icon>
            </div>
          </div>
        </template>
      `,
    };
  }
  render() {
    this.console('render');
    return html`<div x-data="TkGroupbuyQA.getAlpineData" class="normal" x-cloak>${map(Object.keys(this.components), (name) => this.components[name])}</div>`;
    // return html`<div x-data="$root.parentNode.host.getAlpineData()" class="normal">${map(Object.keys(this.components), (name) => this.components[name])}</div>`
  }

  // ----------------------------------------------------------------
  // # Life Cycle
  // ----------------------------------------------------------------
  connectedCallback() {
    this.console('connectedCallback');
    super.connectedCallback();
    this.css = new MasterCSS({ config: window.mcssConfig, observe: false }).observe(this.shadowRoot);
    // window.AlpineInitQueue.push(() => window.Alpine.initTree(this.shadowRoot))
  }
  disconnectedCallback() {
    this.log('disconnectedCallback');
    super.disconnectedCallback();
    if (this.css) this.css.destroy();
  }
  createRenderRoot() {
    this.console('createRenderRoot');
    // const root = super.createRenderRoot()
    // return root
    return this;
  }
  // 是否更新
  shouldUpdate(changedProperties) {
    this.console('shouldUpdate', changedProperties);
    return true;
  }
  // 更新前處理
  willUpdate(changedProperties) {
    this.console('willUpdate', changedProperties);
  }
  // --- After Render ---
  // 首次更新
  firstUpdated() {
    this.console('firstUpdated');
  }
  // 每次更新
  updated() {
    this.console('updated');
  }

  // ----------------------------------------------------------------
  // # Helpers
  // ----------------------------------------------------------------
  console(name, ...args) {
    const logs = [`%c【${this.constructor.name}】%c${name}`, 'color:orange', 'color:black'];
    args.forEach((arg) => logs.push(arg));
    // console.log(...logs)
  }
}
window.TkGroupbuyQA = TkGroupbuyQA;
customElements.define('tk-groupbuy-qa', TkGroupbuyQA);
