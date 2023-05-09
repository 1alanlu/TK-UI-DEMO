import { LitElement, html, css, repeat, ref, createRef } from 'https://cdn.jsdelivr.net/gh/lit/dist@2.7.3/all/lit-all.min.js';

const helpers = {
  // 陣列內容是否相同
  eqArray: (arr1, arr2) => {
    const set1 = new Set(arr1);
    const set2 = new Set(arr2);
    return set1.size === set2.size && [...set1].every((x) => set2.has(x));
  },
};

const styles = css`
  :host {
    --borderRadius: 0.2em;
    --gap: 0.2em;
    --bgColor: 255 255 255; /* #ffffff */
    --mainColor: 102 102 102; /* #666666 */
  }

  :host {
    position: relative;
    display: inline-block;
    text-align: left;
    min-width: 100px;
    line-height: 1.2;
    background-color: rgb(var(--bgColor));
    border-radius: var(--borderRadius);
  }
  :host,
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
  p {
    margin: 0;
  }

  /* 欄位 */
  #field {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    gap: var(--gap);
    align-items: center;
    border: 1px solid rgb(var(--mainColor));
    border-radius: inherit;
    overflow: hidden;
    cursor: pointer;
    user-select: none;
    transition: border-radius 0.3s;
  }
  :host([multiple]) #field:not([empty]) {
    padding: var(--gap);
  }
  :host([open]) #field {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  /* 佔位符 */
  .placeholder {
    padding: 0.25em 0.5em;
    color: rgb(var(--mainColor) / 0.8);
  }

  /* 已選擇標籤 */
  .tag {
    position: relative;
    display: inline-flex;
    align-items: center;
    padding: 0.25em 0.5em;
    padding-right: 1.5em;
    width: 100%;
    color: rgb(var(--mainColor));
  }
  .tag:hover {
    background: rgb(var(--mainColor) / 0.1);
  }
  /* 多選標籤 */
  :host([multiple]) .tag {
    width: auto;
    border: 1px solid rgb(var(--mainColor));
    border-radius: var(--borderRadius);
  }

  /* 收合箭頭 */
  #field::after {
    content: '';
    position: absolute;
    top: 45%;
    right: 0.375em;
    width: 0.625em;
    height: 0.625em;
    border-bottom: 2px solid rgb(var(--mainColor) / 0.9);
    border-right: 2px solid rgb(var(--mainColor) / 0.9);
    cursor: pointer;
    transform: translateY(-50%) rotate(45deg);
    opacity: 0.6;
    transition: opacity 0.3s;
  }
  #field:hover::after {
    opacity: 1;
  }
  :host([open]) #field::after {
    top: 55%;
    border: none;
    border-left: 2px solid rgb(var(--mainColor) / 0.9);
    border-top: 2px solid rgb(var(--mainColor) / 0.9);
  }
  /* 取消收合箭頭 (多選非空、單選非空懸停) */
  :host([multiple]) #field:not([empty])::after,
  :host(:not([multiple])) #field:not([empty]):hover::after {
    content: none;
  }

  /* 移除標籤按紐 */
  .tag-remove {
    position: absolute;
    top: 50%;
    right: 0.25em;
    width: 1em;
    height: 1em;
    opacity: 0.6;
    transform: translateY(-50%);
    transition: 0.3s;
  }
  .tag-remove:hover {
    opacity: 1;
  }
  /* 單選非空非懸停 */
  :host(:not([multiple])) #field:not([empty]):not(:hover) .tag-remove {
    opacity: 0;
  }
  .tag-remove:before,
  .tag-remove:after {
    content: '';
    position: absolute;
    left: 0.5em;
    width: 2px;
    height: 1em;
    background-color: rgb(var(--mainColor) / 0.9);
  }
  .tag-remove:before {
    transform: rotate(45deg);
  }
  .tag-remove:after {
    transform: rotate(-45deg);
  }

  /* 彈跳視窗 */
  #popup {
    position: absolute;
    z-index: 1000;
    width: 100%;
    background-color: inherit;
    border: 1px solid rgb(var(--mainColor));
    border-top: none;
    border-radius: inherit;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    transition: visibility 0.3s, opacity 0.3s;
    box-shadow: 0 0.4em 0.4em rgb(var(--mainColor) / 0.25);
  }
  :host(:not([open])) #popup {
    opacity: 0;
    visibility: hidden;
  }

  /* 搜尋框 */
  #search {
    position: relative;
    margin: var(--gap);
  }
  #search > iconify-icon {
    display: flex;
    align-items: center;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    padding-left: 0.5em;
    color: rgb(var(--mainColor) / 0.8);
    pointer-events: none;
  }
  #search > input {
    display: block;
    padding-left: 1.7em;
    width: 100%;
    height: 2em;
    font-size: inherit;
    color: rgb(var(--mainColor));
    border: 1px solid rgb(var(--mainColor) / 0.8);
    border-radius: var(--borderRadius);
    outline: none;
  }
  #search > input::placeholder {
    color: rgb(var(--mainColor) / 0.8);
  }

  /* 提示訊息 */
  .tips {
    display: flex;
    align-items: center;
    gap: 0.5em;
    padding: 0.5em 1em;
    color: rgb(var(--mainColor) / 0.8);
  }

  /* 清單 */
  #list {
    margin: 0;
    padding: 0;
    overflow-y: auto;
    max-height: 240px;
    transition: 0.3s;
  }
  :host(:not([open])) #list {
    max-height: 0;
  }

  /* 清單滾輪 */
  #list::-webkit-scrollbar {
    width: 0.25em;
    border-left: 1px solid rgb(var(--mainColor) / 0.1);
  }
  #list::-webkit-scrollbar-thumb {
    border-radius: var(--borderRadius);
    background: rgb(var(--mainColor) / 0.3);
  }
  #list::-webkit-scrollbar-thumb:hover {
    background: rgb(var(--mainColor) / 0.5);
  }
  #list::-webkit-scrollbar-thumb:active {
    background: rgb(var(--mainColor) / 0.7);
  }

  /* 清單項目 */
  li {
    position: relative;
    display: flex;
    align-items: center;
    padding: 0.5em 1em;
    list-style: none;
    color: rgb(var(--mainColor));
    cursor: pointer;
    border-top: 1px solid rgb(var(--mainColor) / 0.05);
    transition: 0.2s;
  }
  li:hover,
  li:focus {
    padding-left: 1.2em;
    background: rgb(var(--mainColor) / 0.1);
  }
  li:focus {
    outline: dotted 1px rgb(var(--mainColor));
  }
  li[selected] {
    background: rgb(var(--mainColor) / 0.2);
  }
  /* 單選已選，不可為目標 */
  :host(:not([multiple])) li[selected] {
    pointer-events: none;
  }

  :host([multiple]) li[selected]::before {
    content: '';
    position: absolute;
    top: var(--gap);
    left: calc(var(--gap) / 2);
    bottom: var(--gap);
    width: var(--gap);
    border-radius: var(--borderRadius);
    background: rgb(var(--mainColor) / 0.5);
    transition: 0.2s;
  }
  :host([multiple]) li:hover::before,
  :host([multiple]) li:focus::before {
    background: rgb(var(--mainColor) / 0.7);
  }
`;

export class TkSelect extends LitElement {
  static styles = styles;
  static properties = {
    // 已選值
    value: {},
    // 資料源
    dataSource: { type: Array },
    // 佔位符
    placeholder: { type: String },
    // 是否顯示選單
    open: { type: Boolean, reflect: true },
    // 是否可多選
    multiple: { type: Boolean },
    // 是否可搜尋
    searchable: { type: Boolean },

    // 選取項目
    _selectedItems: { type: Array, state: true },
    // 清單項目
    _listItems: { type: Array, state: true },
    // 搜尋文字
    _search: { type: String, state: true },
    // 當前提示
    _tip: { type: String, state: true },
    // 聚焦項目序號
    _focusedItemIndex: { type: Number, state: true },
  };
  constructor() {
    super();
    // default value
    this.dataSource = [];
    this.placeholder = '請選擇';
    this.open = false;

    this._selectedItems = [];
    this._listItems = [];

    // bind event
    this.handlePopup = this._handlePopup.bind(this);
    this.popupTransitionendHandler = this._popupTransitionendHandler.bind(this);
    this.selectKeyDownHandler = this._selectKeyDownHandler.bind(this);
  }

  // ----------------------------------------------------------------
  // # Data
  // ----------------------------------------------------------------
  tips = {
    notfind: { icon: 'material-symbols:warning-outline', text: '查無資料' },
  };

  // ----------------------------------------------------------------
  // # Dom
  // ----------------------------------------------------------------
  fieldRef = createRef();
  popupRef = createRef();
  listRef = createRef();
  get itemElements() {
    return this.listRef.value.querySelectorAll('li');
  }

  // ----------------------------------------------------------------
  // # Life Cycle
  // ----------------------------------------------------------------
  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this.handlePopup);
  }
  disconnectedCallback() {
    document.removeEventListener('click', this.handlePopup);
    super.disconnectedCallback();
  }
  createRenderRoot() {
    const root = super.createRenderRoot();
    root.addEventListener('keydown', this.selectKeyDownHandler);
    return root;
  }
  // 首次更新
  firstUpdated() {
    this.popupRef.value.addEventListener('transitionend', this.popupTransitionendHandler);
  }
  // 是否需要更新
  shouldUpdate(changedProperties) {
    if (changedProperties.size === 1) {
      if (changedProperties.has('value')) {
        const value = changedProperties.get('value');
        return Array.isArray(value) ? !helpers.eqArray(value, this.value) : value !== this.value;
      }
      if (changedProperties.has('_focusedItemIndex')) return false;
    } else {
      if (changedProperties.has('_search')) {
        if (helpers.eqArray(changedProperties.get('_listItems'), this._listItems)) return false;
      }
    }
    return true;
  }
  // 更新前最後處理
  willUpdate(changedProperties) {
    // console.log(changedProperties)
    // 如果屬性改變(資料源、已選值)，更新數據。
    if (changedProperties.has('dataSource') || changedProperties.has('value')) {
      if (!this.multiple) {
        // 單選
        let target = null;
        this.dataSource.forEach((item) => {
          item.selected = item.value === this.value;
          if (!target && item.selected) target = item;
        });
        if (!target) {
          this.updateValue('');
        }
      } else {
        // 多選
        const target = [];
        this.dataSource.forEach((item) => {
          item.selected = Object.values(this.value).includes(item.value);
          if (item.selected) target.push(item);
        });

        const newValue = target.map((item) => item.value);
        if (!helpers.eqArray(newValue, this.value)) {
          console.warn('willUpdate', newValue);
          this.updateValue(newValue);
        } else {
          target.forEach((item) => {
            item.selected = true;
          });
        }
      }
    }

    // 更新 選取項目
    this._selectedItems = this.getSelectItems(this.value);

    if (changedProperties.has('dataSource')) {
      this._listItems = this.getSearchItems(this._search);
    }
    this._tip = this._listItems.length ? '' : 'notfind';
  }
  // updated() {
  //   const value = Array.isArray(this.value) ? Object.values(this.value) : this.value
  //   console.log('【update】', this.placeholder, value)
  // }

  // ----------------------------------------------------------------
  // # 屬性相關
  // ----------------------------------------------------------------
  openPopup() {
    this.open = true;
  }
  closePopup() {
    this.open = false;
  }
  togglePopup() {
    if (this.open) {
      this.closePopup();
    } else {
      this.openPopup();
    }
  }
  // 更新選擇值
  updateValue(value) {
    // console.log('【updateValue】', this.placeholder, value)
    if (!this.multiple) {
      // 單選
      this.value = this.value === value ? '' : value;
      if (!this.multiple) this.closePopup();
    } else {
      // 多選
      if (Array.isArray(value)) {
        this.value = value;
      } else {
        if (Object.values(this.value).includes(value)) {
          this.value = this.value.filter((i) => i !== value);
        } else {
          this.value = [...this.value, value];
        }
      }
    }
    this.dispatchEvent(new CustomEvent('update', { detail: this.value }));
  }
  // 取得聚焦項目序號
  getFocusedItemIndex(type) {
    let idx = this._focusedItemIndex;
    switch (type) {
      case '+':
        idx = idx < this._listItems.length - 1 ? idx + 1 : 0;
        break;
      case '-':
        idx = idx > 0 ? idx - 1 : this._listItems.length - 1;
        break;
      case '0':
        idx = 0;
        break;
      default: {
        const value = Array.isArray(this.value) ? this.value[this.value.length - 1] : this.value;
        idx = value ? this._listItems.findIndex((item) => item.value === value) : 0;
        break;
      }
    }
    return idx;
  }
  // 取得選取項目
  getSelectItems(value) {
    if (!value) return [];
    if (Array.isArray(value)) {
      return value.reduce((acc, val) => acc.concat(this.dataSource.find((data) => data.value === val)), []);
    }
    return [this.dataSource.find((data) => data.value == value)];
  }
  // 取得搜尋項目
  getSearchItems(search) {
    if (this.searchable && search) {
      const reg = new RegExp(search, 'gi');
      return Object.values(this.dataSource).filter((item) => item.text.match(reg));
    }
    return this.dataSource;
  }

  // ----------------------------------------------------------------
  // # 事件相關
  // ----------------------------------------------------------------
  _fieldClickHandler(e) {
    let item = e.target;
    if (item.className === 'tag-remove') {
      this.updateValue(item.dataset.value);
    } else {
      this.togglePopup();
    }
  }
  _listClickHandler(e) {
    let item = e.target;
    while (item && item.tagName !== 'LI') {
      item = item.parentNode;
    }
    if (item) this.updateValue(item.dataset.value);
  }
  _searchInputHandler(e) {
    this._search = e.target.value;
    this._listItems = this.getSearchItems(this._search);
  }

  _handlePopup(e) {
    // https://lamplightdev.com/blog/2021/04/10/how-to-detect-clicks-outside-of-a-web-component/
    if (!e.composedPath().includes(this)) {
      this.closePopup();
    }
  }
  _popupTransitionendHandler(e) {
    // 清單開合結束
    if (e.propertyName === 'max-height') {
      if (this.open) {
        this._focusedItemIndex = this.getFocusedItemIndex();
        this.refreshFocusedItem(this._focusedItemIndex);
      } else {
        this.fieldRef.value.focus();
      }
    }
  }
  _selectKeyDownHandler(e) {
    if (e.target.tagName === 'INPUT') {
      switch (e.which) {
        case 9:
          e.preventDefault();
          if (e.shiftKey) {
            this.fieldRef.value.focus();
          } else {
            this._focusedItemIndex = this.getFocusedItemIndex('0');
            this.refreshFocusedItem(this._focusedItemIndex);
          }
          return;
        case 27:
        case 38:
          break;
        default:
          return;
      }
    }
    switch (e.which) {
      case 8:
        this.handleBackspaceKey();
        break;
      case 13:
        this.handleEnterKey();
        break;
      case 27:
        this.handleEscapeKey();
        break;
      case 38:
        e.altKey ? this.handleAltArrowUpKey() : this.handleArrowUpKey();
        break;
      case 40:
        e.altKey ? this.handleAltArrowDownKey() : this.handleArrowDownKey();
        break;
      default:
        return;
    }
    e.preventDefault();
  }
  handleAltArrowDownKey() {
    this.openPopup();
  }
  handleAltArrowUpKey() {
    this.closePopup();
  }
  handleEscapeKey() {
    this.closePopup();
  }
  handleEnterKey() {
    if (this.open) {
      this.setSelectedItemValue(this._focusedItemIndex);
    } else {
      this.openPopup();
    }
  }
  handleBackspaceKey() {
    if (!this.multiple) {
      this.updateValue('');
    } else if (this.value.length) {
      this.updateValue(this.value[this.value.length - 1]);
    }
  }
  handleArrowDownKey() {
    this._focusedItemIndex = this.getFocusedItemIndex('+');
    if (!this.multiple && !this.open) {
      this.setSelectedItemValue(this._focusedItemIndex);
    } else {
      this.refreshFocusedItem(this._focusedItemIndex);
    }
  }
  handleArrowUpKey() {
    this._focusedItemIndex = this.getFocusedItemIndex('-');
    if (!this.multiple && !this.open) {
      this.setSelectedItemValue(this._focusedItemIndex);
    } else {
      this.refreshFocusedItem(this._focusedItemIndex);
    }
  }
  // 刷新焦點項目
  refreshFocusedItem(idx) {
    const item = this.itemElements[idx];
    if (item) item.focus();
  }
  // 選取目標項目項目
  setSelectedItemValue(idx) {
    const item = this.itemElements[idx];
    if (item) this.updateValue(item.dataset.value);
  }

  render() {
    return html`
      <div id="field" ${ref(this.fieldRef)} tabindex="0" ?empty=${!this._selectedItems.length} @click=${this._fieldClickHandler}>
        ${!this._selectedItems.length
          ? html`<div class="placeholder">${this.placeholder}</div>`
          : repeat(
              this._selectedItems,
              (item) => item.value,
              (item) => html`
                <div class="tag">
                  <span>${item.text}</span>
                  <div class="tag-remove" data-value=${item.value}></div>
                </div>
              `
            )}
      </div>
      <div id="popup" ${ref(this.popupRef)}>
        ${this.searchable && this.renderSearchable()}
        ${html`
          <ul id="list" ${ref(this.listRef)} @click=${this._listClickHandler}>
            ${repeat(
              this._listItems,
              (item) => item.value,
              (item, _idx) => html`
                <li data-value=${item.value} ?selected=${item.selected} tabindex="-1">
                  <span>${item.text}</span>
                </li>
              `
            )}
          </ul>
        `}
      </div>
    `;
  }

  renderSearchable() {
    return html`
      <div id="search">
        <iconify-icon icon="carbon:search"></iconify-icon>
        <input type="text" name="search" autocomplete="off" placeholder="Search" @input=${this._searchInputHandler} />
      </div>
      ${this._tip && this.tips[this._tip]
        ? html`
            <div class="tips">
              <iconify-icon icon=${this.tips[this._tip].icon}></iconify-icon>
              <p>${this.tips[this._tip].text}</p>
            </div>
          `
        : ''}
    `;
  }
}
customElements.define('tk-select', TkSelect);
