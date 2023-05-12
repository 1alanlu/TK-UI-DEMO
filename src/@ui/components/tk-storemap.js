import { LitElement, html, map } from 'https://cdn.jsdelivr.net/gh/lit/dist@2.6.1/all/lit-all.min.js';

export class TkStoremap extends LitElement {
  // ----------------------------------------------------------------
  // # Alpine Data
  // ----------------------------------------------------------------
  static getAlpineData() {
    // ----------------------------------------------------------------
    // # Constants
    // ----------------------------------------------------------------
    const TIPS = { SEARCH: 'search', NOT_FOUND: 'notfound' };
    const OPTIONS = { ALL: 'all' };

    return {
      // ----------------------------------------------------------------
      // # Data
      // ----------------------------------------------------------------
      initialized: false,
      // 門市
      stories: [],
      // 選項資料
      options: { city: [], town: [], tags: [] },
      // 篩選條件
      filter: { city: '', town: '', tags: '', search: '' },
      // filter: { city: '', town: '', tags: [], search: '' },
      // 篩選門市
      fileterStories: [],
      // 暫存區域
      townMap: new Map(),
      // 當前提示
      tip: TIPS.SEARCH,
      // 提示模組
      tips: {
        '': {},
        [TIPS.SEARCH]: { class: 'fg:info', icon: 'material-symbols:search', text: '請輸入/選擇查詢條件' },
        [TIPS.NOT_FOUND]: { class: 'fg:waring', icon: 'material-symbols:warning-outline', text: '查無相關門市' },
      },
      // ----------------------------------------------------------------
      // # Initialize
      // ----------------------------------------------------------------
      init() {
        this.initStories();
        this.processOptions();
        this.watchFilters();

        // x-bind:card
        if (!this.card) this.card = {};
      },
      // 初始門市資料
      async initStories() {
        const [stories, printStore] = await this.fetchStore();
        this.stories = stories.map((store) => {
          store.tags = [];
          if (['1', '2', '4'].includes(store.APPLE_ID)) store.tags.push(store.APPLE_ID);
          if (printStore.includes(store.ID)) store.tags.push('6');
          return store;
        });
        this.initialized = true;
      },
      // 處理篩選選項
      async processOptions() {
        // binding
        this.$watch('options.city', (city) => (this.$refs.selectCity.dataSource = city));
        this.$watch('options.town', (town) => (this.$refs.selectTown.dataSource = town));
        this.$watch('options.tags', (tags) => (this.$refs.selectTag.dataSource = tags));
        // getData
        this.options.city = await this.getcity();
        this.$watch('filter.city', async (city_sort) => (this.options.town = await this.gettown(city_sort)));
        this.options.tags = this.getTags();
      },
      // 監聽篩選條件
      watchFilters() {
        this.$watch('filter', async (filter) => {
          const { city, town, tags, search } = filter;
          // 無條件，不顯示
          // if (!(city || town || tags.length || search)) {
          if (!(city || town || tags || search)) {
            this.tip = TIPS.SEARCH;
            this.fileterStories = [];
            return;
          }
          // 否則查詢符合門市
          this.fileterStories = this.stories.filter((store) => {
            if (city && city !== OPTIONS.ALL && store.CITY_SORT !== city) return false;
            if (town && town !== OPTIONS.ALL && store.ZOON !== town) return false;
            if (tags && !store.tags.includes(tags)) return false;
            // if (tags && tags.length) {
            //   for (const tag of tags) {
            //     if (!store.tags.includes(tag)) return false
            //   }
            // }
            if (search) {
              if (store.ABBRIVATE.includes(search)) return true;
              if (store.ADDR.includes(search)) return true;
              if (store.TEL && store.TEL.includes(search)) return true;
              if (store.UNIFY_NO.includes(search)) return true;
              return false;
            }
            return true;
          });
          this.tip = this.fileterStories.length ? '' : TIPS.NOT_FOUND;
        });
      },
      // ----------------------------------------------------------------
      // # API - Fetch Data
      // ----------------------------------------------------------------
      // 取得門市資訊
      async fetchStore() {
        const [error, res] = await window.ajaxUtil.get({ url: this.$store.common.ecDomain + '/ashx/OtherStore.ashx' });
        if (error || !res || !res.Store) return [];
        return [res.Store.Table, res.PrintStore];
      },
      // 取得縣市資訊
      async getcity() {
        const [error, res] = await window.ajaxUtil.get({ url: this.$store.common.ecDomain + '/ashx/AddressHandler.ashx' });
        if (error || !res) return [];
        return res.Table.sort((a, b) => a.CITY_SORT - b.CITY_SORT).map((city) => ({ value: city.CITY_SORT.toString(), text: city.CITY }));
      },
      // 取得區域資訊
      async gettown(city_sort) {
        const all = [{ value: OPTIONS.ALL, text: '全區' }];
        if (!city_sort) return [];
        if (['6', '13'].includes(city_sort)) return all;
        if (!this.townMap.has(city_sort)) {
          const [error, res] = await window.ajaxUtil.get({ url: this.$store.common.ecDomain + '/ashx/AddressHandler.ashx', data: { type: 'city_sort', city: city_sort } });
          if (error) return all;
          this.townMap.set(
            city_sort,
            res.Table.map((town) => ({ value: town.AREAID, text: town.TOWN }))
          );
        }
        return this.townMap.get(city_sort);
      },
      // 取得標籤資訊
      getTags() {
        return [
          { value: '1', text: 'AppleShop' },
          { value: '2', text: 'AAR授權經銷商' },
          { value: '4', text: 'iOS展售店' },
          { value: '6', text: '列印服務' },
        ];
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
      //     <p class="f:20 f:bold lh:1.1">門市地圖</p>
      //   </div>
      // `,
      options: html`
        <div class="rel my:2x flex flex:wrap ai:start gap:1x f:14 {flex:1}_:where(div) flex:column@<=3xs">
          <div class="hide@<=sm">
            <!-- <div class="input-box">
              <iconify-icon icon="carbon:search"></iconify-icon>
              <input type="search" name="search" placeholder="門市/地址/電話/統編" x-model.debounce="filter.search" />
            </div> -->
          </div>
          <div class="flex:2@<=sm text:center@>sm">
            <tk-select placeholder="選擇縣市" x-ref="selectCity" :value="filter.city" x-on:update="filter.city=$event.detail"></tk-select>
            <tk-select placeholder="選擇區域" x-ref="selectTown" x-show="filter.city" :value="filter.town" x-on:update="filter.town=$event.detail"></tk-select>
          </div>
          <div class="text:right">
            <tk-select placeholder="進階選項" x-ref="selectTag" :value="filter.tags" x-on:update="filter.tags=$event.detail"></tk-select>
          </div>
        </div>
      `,
      // 訊息
      tips: html`
        <div x-show="tip" class="my:4x flex center-content gap:1x" :class="tips[tip].class">
          <iconify-icon :icon="tips[tip].icon"></iconify-icon>
          <p x-text="tips[tip].text"></p>
        </div>
      `,
      // 卡片
      cards: html`
        <div class="grid-cols:3 gap:4x {grid-cols:2;gap:2x}@<=sm {grid-cols:1;gap:1x}@<=2xs">
          <template x-for="store in fileterStories" :key="store.ID">
            <div class="card flex flex:column jc:space-between" x-bind="card">
              <!-- Title -->
              <div class="flex flex:wrap ai:end gap:1x lh:1.1">
                <span class="f:bold" x-text="store.ABBRIVATE"></span>
                <span class="w:full fg:G-50" x-text="store.TITLE"></span>
              </div>
              <!-- Content -->
              <div class="mt:2x flex flex:column gap:1x f:14">
                <span x-text="'統一編號 '+store.UNIFY_NO"></span>
                <span x-text="store.ADDR"></span>
                <span x-text="store.OPEN_TIME"></span>
                <span x-text="store.TEL"></span>
              </div>
              <div class="mt:1x flex flex:wrap jc:end gap:1x user-select:none {inline-flex;center-content;gap:5;p:6;rounded;fg:W-50;bg:B-50}>*">
                <div x-show="store.tags.includes('6')">
                  <iconify-icon class="ml:-1" icon="mdi:printer"></iconify-icon>
                  <span class="f:12 f:bold">列印</span>
                </div>
                <div x-show="store.tags.includes('1')">
                  <iconify-icon class="ml:-1" icon="ion:logo-apple"></iconify-icon>
                  <span class="f:12 f:bold">APPLE</span>
                </div>
              </div>
              <div class="abs top:2x right:3x translateY(-1):hover translateY(1):active ~transform|100ms">
                <a :href="'http://maps.google.com.tw/maps?hl=zh-TW&q=' + store.ZOON + store.ADDR" target="_blank">
                  <iconify-icon class="fg:rgb(255,0,0,.8)" icon="bxs:map"></iconify-icon>
                </a>
              </div>
            </div>
          </template>
        </div>
      `,
    };
  }
  render() {
    this.console('render');
    return html`<div x-data="TkStoremap.getAlpineData" class="normal" x-cloak>${map(Object.keys(this.components), (name) => this.components[name])}</div>`;
  }

  // ----------------------------------------------------------------
  // # Life Cycle
  // ----------------------------------------------------------------
  connectedCallback() {
    this.console('connectedCallback');
    super.connectedCallback();
  }
  disconnectedCallback() {
    this.log('disconnectedCallback');
    super.disconnectedCallback();
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
window.TkStoremap = TkStoremap;
customElements.define('tk-storemap', TkStoremap);
