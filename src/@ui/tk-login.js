import { LitElement, html, css, classMap, unsafeCSS, nothing } from 'https://cdn.jsdelivr.net/gh/lit/dist@2.7.3/all/lit-all.min.js';

export default class TkLogin extends LitElement {
  constructor() {
    super();
  }
  render() {
    return html`
      <div class="normal mx:auto" x-data="TkLogin.getAlpineData">
        <tk-form x-bind="_bind.form"></tk-form>
        <div class="mt:2x">
          <tk-button x-bind="_bind.submitBtn" type="theme"></tk-button>
          <div class="t:right mt:1x text--fade">
            <a :href="window.ajaxUtil.url.domain+'/member/member_login.aspx'" class="f:14 link fg:G-40">
              <span>尚未加入會員？點我註冊</span>
              <tk-icon icon="material-symbols:call-made"></tk-icon>
            </a>
          </div>
        </div>
        <div class="subject mt:4x mb:2x fg:G-40">
          <span>其他登入方式</span>
        </div>
        <div class="flex jc:center gap:1x f:24">
          <template x-for="(btn, key) in thirdPartyBtn" :key="key">
            <tk-button x-bind="_bind.thirdPartyBtn" type="theme"></tk-button>
          </template>
        </div>
      </div>
    `;
  }
  // ----------------------------------------------------------------
  // # Life Cycle
  // ----------------------------------------------------------------
  createRenderRoot() {
    return this;
  }
  // ----------------------------------------------------------------
  // # Alpine Data
  // ----------------------------------------------------------------
  static getAlpineData() {
    return {
      // -------------------------------------
      // BIND
      // -------------------------------------
      _bind: {
        form: {
          'x-ref': 'form',
          source: `${window.ajaxUtil.url.domain}/src/formData/login.json`,
          class: 'min-h:140 {hide}_.input-title',
          '@init'() {
            this.$root.parentNode.dispatchEvent(new CustomEvent('init'));
          },
          '@submit'(ev) {
            this.submit(ev.detail);
          },
        },
        submitBtn: {
          'x-ref': 'submitBtn',
          ':loading': 'loading.submit',
          class: 'mt:2x w:full f:bold',
          '@click.prevent'() {
            this.$refs.form.formRef.value.dispatchEvent(new Event('submit'));
          },
        },
        thirdPartyBtn: {
          ':id': 'key',
          // 'x-text': 'btn.text',
          ':title': 'btn.title',
          ':icon': 'btn.icon',
          ':cls': 'btn.cls',
          ':loading': 'loading.thirdParty === key',
          ':disabled': 'loading.submit || (loading.thirdParty && loading.thirdParty !== key)',
          '@click.prevent'() {
            this.loginThirdParty(this.$el.id);
          },
        },
      },
      // -------------------------------------
      // Data
      // -------------------------------------
      thirdPartyBtn: {
        FB: {
          text: 'Facebook',
          title: 'Login_Facebook',
          icon: 'bi:facebook',
          cls: 'bg:third-fb!.btn',
        },
        LINE: {
          text: 'Line',
          title: 'Login_Line',
          icon: 'bi:line',
          cls: 'bg:third-line!.btn',
        },
      },

      loading: {
        submit: false,
        thirdParty: null,
      },

      text: {
        submitBtn: '登入',
        submitBtn_loading: '登入中...',
      },

      init() {
        this.$nextTick(() => {
          this.$refs.submitBtn.textContent = this.text.submitBtn;
        });
      },

      submit({ data, callback }) {
        if (this.loading.submit) return;
        this.loading.submit = true;
        this.$refs.submitBtn.textContent = this.text.submitBtn_loading;

        window.ajaxUtil.post({
          url: `${window.ajaxUtil.url.domain}/ashx/member/Login.ashx`,
          data: { ...data, done: document.location.href },
          delay: 300,
          finallyFunc: ([error, res]) => {
            let cb = null;
            if (!error && res) {
              if (res.ErrorMsg) {
                cb = function () {
                  this.inputData['password'].value = '';
                  this.inputData['verify_code'].value = '';
                  this.$refs.verify.click();
                };
              }
              this.$root.parentNode.dispatchEvent(new CustomEvent('submit', { detail: res }));
            }

            this.loading.submit = false;
            this.$refs.submitBtn.textContent = this.text.submitBtn;
            callback(cb);
          },
        });
      },

      loginThirdParty(thirdPart) {
        if (this.loading.thirdParty) return;
        this.loading.thirdParty = thirdPart;

        window.ajaxUtil.post({
          url: `${window.ajaxUtil.url.domain}/ashx/member/Login.ashx`,
          data: {
            'third-party': thirdPart,
            done: document.location.href,
          },
          delay: 300,
          finallyFunc: ([error, res]) => {
            if (!error && res) {
              window.location.href = res.RedirectUri;
            }
            this.loading.thirdParty = null;
          },
        });
      },
    };
  }
  static async isLogin(config) {
    if (!config) config = {};
    const [error, res] = await window.ajaxUtil.post({ url: window.ajaxUtil.url.domain + '/ashx/Member/CheckLogin.ashx' });
    const isLogin = !error && res === 1;
    if (isLogin) {
      if (config.callback && typeof config.callback === 'function') config.callback();
    }
    return isLogin;
  }

  static async modal(config) {
    if (window.loginModal) return window.loginModal;
    if (!config) config = {};
    if (await TkLogin.isLogin(config)) return null;

    let cls = '{t:center}_.dialog-title {my:2x}_.dialog-body hide_.dialog-footer';
    if (config.force) cls += ' hide_.modal-close';
    window.loginModal = window.TkModal.alert({
      title: '會員登入',
      cls,
      open: false,
      close: () => (window.loginModal = null),
    });

    let tkLogin = window.loginModal.appendChild(new TkLogin());
    tkLogin.addEventListener('init', (e) => {
      window.loginModal.open = true;
      tkLogin = null;
    });
    tkLogin.addEventListener('submit', (e) => {
      const res = e.detail;
      setTimeout(() => {
        if (res.HasError) {
          window.TkModal.alert({
            type: 'error',
            title: 'Error',
            content: res.ErrorMsg,
            close: function () {
              if (res.ForceRedirect) window.location.href = res.RedirectUri;
            },
          });
        } else if (res.ErrorMsg) {
          window.TkModal.alert({
            type: res.ChooseRedirect ? 'confirm' : 'warning',
            title: 'Error',
            content: res.ErrorMsg,
            ok: function () {
              if (res.RedirectUri) window.location.href = res.RedirectUri;
            },
            cancel: function () {
              if (res.CancelRedirectUri) window.location.href = res.CancelRedirectUri;
            },
            close: function () {
              if (res.CancelRedirectUri) window.location.href = res.CancelRedirectUri;
            },
          });
        } else if (res.BindThirdPartyAccount) {
          window.location.href = res.RedirectUri;
        } else {
          window.TkMessage.success('登入成功');
          if (config.callback && typeof config.callback === 'function') config.callback();
          window.loginModal.open = false;
        }
      }, 1);
    });

    return window.loginModal;
  }
}
window.TkLogin = TkLogin;
customElements.define('tk-login', TkLogin);
