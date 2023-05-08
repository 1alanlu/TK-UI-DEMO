import { LitElement, html, css, classMap, unsafeCSS, map, ref, createRef } from 'https://cdn.jsdelivr.net/gh/lit/dist@2.7.3/all/lit-all.min.js';

export class TkForm extends LitElement {
  static styles = css``;
  static properties = {
    source: { type: String },
    data: { type: Object },
    disabled: { type: Boolean, reflect: true },
    readonly: { type: Boolean, reflect: true },
    showdata: { type: Boolean, reflect: true },
  };
  constructor() {
    super();
  }
  formRef = createRef();
  render() {
    return html`
      <form ${ref(this.formRef)} class="normal mt:1x_.field+.field" x-data="TkForm.getAlpineData" x-bind="_bind.form" x-cloak ?disabled=${this.disabled} ?readonly=${this.readonly}>
        <template x-for="(field, key) in formData" :key="key">
          <div class="field">
            <p class="input-title" x-text="field.name" :required="field.required"></p>
            <div class="input" :invalid="inputData[key].invalid" :valid="!inputData[key].invalid && inputData[key].value.length > 0">
              <template x-if="field.icon">
                <tk-icon class="input-icon" :icon="field.icon"></tk-icon>
              </template>
              <input x-bind="_bind.input" />
              <template x-if="field.html">
                <span :class="field.wrapCls" x-html="field.html"></span>
              </template>
            </div>
            <div class="input-msg" :show="inputData[key].invalid" x-text="inputData[key].showMsg"></div>
          </div>
        </template>
        ${this.showdata ? html`<code id="datacode" x-text="JSON.stringify(sendData)"></code>` : ''}
      </form>
    `;
  }
  // ----------------------------------------------------------------
  // # Life Cycle
  // ----------------------------------------------------------------
  createRenderRoot() {
    return this;
  }
  updated(changedProperties) {
    if ((changedProperties.has('source') && this.source) || (changedProperties.has('data') && this.data)) {
      this.formRef.value.dispatchEvent(
        new CustomEvent('data-load', {
          detail: {
            source: this.source,
            data: this.data,
          },
        })
      );
    }
  }
  // ----------------------------------------------------------------
  // # Methods
  // ----------------------------------------------------------------
  submit() {
    this.formRef.value.dispatchEvent(new Event('submit'));
  }
  // ----------------------------------------------------------------
  // # Alpine Data
  // ----------------------------------------------------------------
  static getAlpineData() {
    return {
      init() {
        this.updateFormData({ source: this.$root.parentNode.source });
      },
      // -------------------------------------
      // BIND
      // -------------------------------------
      _bind: {
        form: {
          'x-ref': 'form',
          '@data-load'(ev) {
            this.updateFormData(ev.detail);
          },
          '@submit.prevent'() {
            this.submit();
          },
        },
        input: {
          ':name': 'key',
          ':value': 'inputData[key].value',
          'x-bind': 'field.attrs',
          '@input.debounce.50': 'validate(key)',
          '@input'() {
            this.inputData[this.$el.name].value = this.$el.value;
          },
          '@keyup.enter'() {
            // this.$refs.form.requestSubmit();
            this.submit();
          },
        },
      },
      // -------------------------------------
      // Data
      // -------------------------------------
      currentApi: '',
      formData: {},
      inputData: {},
      loading: {
        submit: false,
      },

      async updateFormData(config) {
        const { source, data } = config;
        if (data) {
          this.formData = data;
        } else {
          if (!source || this.currentApi === source) return;
          this.currentApi = source;
          this.formData = await fetch(source).then((res) => res.json());
        }

        Object.entries(this.formData).forEach(([k, field]) => {
          this.inputData[k] = {
            value: field.defaultValue || '',
            invalid: false,
            showMsg: '',
          };
        });

        this.$nextTick(() => {
          this.$root.parentNode.dispatchEvent(new CustomEvent('init'));
        });
      },

      // -------------------------------------
      // Computed
      // -------------------------------------
      get sendData() {
        return Object.entries(this.formData).reduce((acc, [k, v]) => ({ ...acc, [k]: this.inputData[k].value }), {});
      },

      // -------------------------------------
      // Methods
      // -------------------------------------
      getField(name) {
        const $el = this.$refs.form[name];
        const field = this.formData[name];
        const data = this.inputData[name];
        return { $el, field, data };
      },

      reset(name) {
        const { data } = this.getField(name);
        data.value = field.attrs.defaultValue || '';

        this.setMsg(name, '');
      },

      setMsg(name, showMsg, report = false) {
        const { $el, field, data } = this.getField(name);
        if (data.timer) clearTimeout(data.timer);

        data.invalid = !!showMsg;

        if (showMsg) {
          showMsg = '[' + field.name + ']' + showMsg;
          data.showMsg = showMsg;
        } else {
          data.timer = setTimeout(() => {
            data.showMsg = '';
          }, 300);
        }

        $el.setCustomValidity(showMsg);
        if (report) $el.reportValidity();
      },

      validate(name) {
        const { $el, field } = this.getField(name);
        const validity = $el.validity;

        let showMsg = '';
        // required
        if (!showMsg && validity.valueMissing) {
          showMsg = field.msg && field.msg.required ? field.msg.required : `必填`;
        }
        // minlength
        if (!showMsg && validity.tooShort) {
          showMsg = field.msg && field.msg.minlength ? field.msg.minlength : '長度不足' + field.attrs.minlength + '碼';
        }
        // maxlength
        if (!showMsg && validity.tooLong) {
          showMsg = field.msg && field.msg.minlength ? field.msg.minlength : '長度超過' + field.attrs.maxlength + '碼';
        }
        // pattern
        if (!showMsg && validity.patternMismatch) {
          showMsg = field.msg && field.msg.pattern ? field.msg.pattern : `格式不符`;
        }
        // type
        if (!showMsg && validity.typeMismatch) {
          showMsg = field.msg && field.msg.type ? field.msg.type : `格式錯誤`;
        }

        this.setMsg(name, showMsg);

        return !showMsg;
      },

      dispatch(name) {
        this.$dispatch(name, {
          vm: this,
          el: this.$el,
          data: JSON.parse(JSON.stringify(this.sendData)),
        });
      },

      submit(ev) {
        if (this.loading.submit) return;

        const $formEl = this.$refs.form;
        const valid = $formEl.checkValidity();

        if (!valid) {
          let focusEl = null;
          const keys = Object.keys(this.formData);
          for (let i = 0; i < keys.length; i++) {
            const name = keys[i];
            const elValid = this.validate(name);
            if (!elValid && !focusEl) focusEl = $formEl[name];
          }
          if (focusEl) {
            focusEl.reportValidity();
            return;
          }
        }

        this.$root.parentNode.dispatchEvent(
          new CustomEvent('submit', {
            detail: {
              data: JSON.parse(JSON.stringify(this.sendData)),
              callback: (cb) => {
                this.loading.submit = false;
                if (cb) cb.call(this);
              },
            },
          })
        );
      },
    };
  }
}
window.TkForm = TkForm;
customElements.define('tk-form', TkForm);
