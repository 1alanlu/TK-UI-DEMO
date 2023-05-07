// ----------------------------------------------------------------
// # Configure
// ----------------------------------------------------------------
(function (getConfig) {
  window.masterCSSConfig = getConfig();
})(function () {
  // const breakpoints = { '3xs': 360, '2xs': 480, xs: 600, sm: 768, md: 1024, lg: 1280, xl: 1440, '2xl': 1600, '3xl': 1920, '4xl': 2560 };

  const mediaQueries = {
    hover: '(any-hover:hover)',
  };

  const selectors = {
    _headings: '_:where(h1,h2,h3,h4,h5,h6)', // class="font:bold_headings"
  };

  const values = {
    '.5x': 4,
    '1x': 8,
    '2x': 16,
    '3x': 24,
    '4x': 32,
    '5x': 40,
    '-.5x': -4,
    '-1x': -8,
    '-2x': -16,
    '-3x': -24,
    '-4x': -32,
    '-5x': -40,
  };

  const baseColors = {
    W: { 50: '#FFFFFF' },
    B: { 50: '#1D1D1D', 40: '#252525', 30: '#333333', 20: '#444444' },
    G: {
      50: '#999999',
      40: '#B2B2B2',
      30: '#CBCBCB',
      20: '#F2F2F2',
      10: '#F8F8F8',
    },
    Y: { 50: '#FBC700', 20: '#FFECA0' },
  };

  const colors = {
    ...baseColors,
    success: '#269244',
    waring: '#D9730D',
    danger: '#E03E3E',
    info: '#2F80ED',
    link: '#0F62FE',
    theme: { '': '#FFC552', fg: '#FFFFFF' },
    fg: { '': '#333333' },
    bg: { '': '#FEFEFE', box: '#FEFEFE', btn: '#FEFEFE' },
  };

  const themes = {
    light: {},
    dark: {
      colors: {
        success: '#74A16A',
        waring: '#FFA344',
        danger: '#FF7369',
        link: '#529CCA',
        theme: { '': '#333333' },
        fg: { '': '#EEEEEE' },
        bg: { '': '#CCCCCC', box: '#777777', btn: '#777777' },
      },
    },
  };

  const rules = {
    boxShadow: {
      values: {
        xs: '0|1|2|0|B-50/.05',
        sm: '0|1|3|0|B-50/.1,0|1|2|-1|B-50/.1',
        md: '0|4|6|-1|B-50/.1,0|2|4|-2|B-50/.1',
        lg: '0|10|15|-3|B-50/.1,0|4|6|-4|B-50/.1',
        xl: '0|20|25|-5|B-50/.1,0 8|10|-6|B-50/.1',
        inner: 'inset|0|2|4|0|B-50/.05',
        none: '0|0|#0000',
      },
    },
    zIndex: {
      values: {
        topbar: 100000,
        modal: 100050,
        message: 100051,
        devPanel: 999999,
      },
    },
    height: {
      values: {
        topbar: 45,
      },
    },
    backgroundColor: {
      values: {
        topbar: '#494949',
      },
    },
  };

  const semantics = {
    pointer: { cursor: 'pointer', 'user-select': 'none' },
    'abs-full': {
      position: 'absolute',
      top: '0',
      right: '0',
      bottom: '0',
      left: '0',
    },
    'abs-center': {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%,-50%)',
    },
    'abs-center-Y': {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
    },
    'abs-center-X': {
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)',
    },
  };

  const literal = window.masterCSSLiteral;
  const cls = {
    normal: {
      '': literal.$`
        m:0 p:0 f:16 lh:1.4 font-family:$(font)
        {m:0}_:where(p)
        /*
        outline:none_:where(:focus:not(:focus-visible))
        outline:none_:where(::before:focus:not(:focus-visible))
        outline:none_:where(::after:focus:not(:focus-visible))
        */
      `,
    },
    container: {
      '': literal.$`
        mx:auto mb:4x p:1x max-w:xl
      `,
    },
    scrollbar: {
      '': literal.$`
        {w:1x;h:1x}::scrollbar
        {rounded}::scrollbar,::scrollbar-thumb
        bg:theme/.2::scrollbar
        bg:theme/.6::scrollbar-thumb
        bg:theme/.8::scrollbar-thumb:hover
        bg:theme::scrollbar-thumb:active
        bg:transparent::scrollbar-corner
      `,
    },
    link: {
      '': literal.$`
      rel inline-flex ai:center gap:5
      lh:2 text-decoration:none
      ~color|.3s
      {fg:link}:hover
      {transition:none}_tk-icon
      {content:'';abs;bottom:0.2em;w:full;bb:1|solid}::before
      `,
    },
    topbar: {
      '': literal.$`
        z:topbar rel bg:topbar
        h:topbar w:full
        {fixed;top:0}@<=mobile
        {mt:topbar}+*@<=mobile
        opacity:1!:hover
        ~opacity|0.3s|ease-in
      `,
      '-fade': literal.$`
        opacity:.5
      `,
      '-sticky': literal.$`
        sticky! top:0
      `,
    },
    subject: {
      '': literal.$`
        flex center-content gap:2x
        {m:0}_p
        {flex:1;content:'';bt:1|solid;opacity:.2}::after,::before
      `,
      block: literal.$`
        rel mx:auto
        mb:80 mb:56@<=414
        py:18 py:12@<=768
        max-w:424 max-w:240@<=414
        fg:theme t:center white-space:nowrap
        {f:32;f:bold;lh:35px}>h2
        {f:20;lh:28px}>h2@<=414

        {pt:10;f:18;f:regular;lh:25px;color:#999999}>h3
        {pt:4;f:14;lh:20px}>h3@<=414

        {content:'';abs;top:0;left:0;w:116;h:1;bg:theme/.56}:before
        {content:'';abs;bottom:0;right:0;w:116;h:1;bg:theme/.56}:after
        {w:100}:before@<=768
        {w:100}:after@<=768
      `,
    },
    card: {
      '': literal.$`
        rel my:2x p:2x|3x r:1x
        bg:bg-box
        shadow:0|4|8|B-50/.08
        overflow:hidden
      `,
    },
    details: {
      '': literal.$`
        {rel;f:18;f:bold;pointer;~padding|.3s}>summary
        {pd:1x}[open]>summary
        {hide}>summary::-webkit-details-marker
        {content:'+';abs;right:1x}>summary:after
        {content:'-'}[open]>summary:after

        {~opacity|.3s}>summary+div
        {opacity:0;my:0;py:0;~opacity|.3s,margin|.3s|.1s,padding|.3s|.1s}:not([open])>summary+div
      `,
    },
    input: {
      '': literal.$`
        box:border overflow:hidden
        rel flex ai:center jc:space-between
        r:4 h:40
        fg:fg bg:bg-box b:1|solid|G-50
        ~all|200ms|linear

        {box:border;p:.5x|1x;full;fg:inherit;bg:none;b:none;outline:none}>input
        {fg:G-40;~all|200ms|linear}>input::placeholder
        {opacity:0}>input:focus::placeholder

        {border-color:danger}[invalid]
        {border-color:success}[valid]
        {fg:G-40}_.input-icon
        {fg:danger}[invalid]_.input-icon
        {fg:success}[valid]_.input-icon
      `,
      icon: literal.$`
        block abs-center-Y left:1x
        f:24
        .input_{pl:40}~input
      `,
      title: literal.$`
        mb:1x {content:'*';fg:danger}[required]::before
      `,
      msg: literal.$`
        overflow:hidden
        f:12 color:fg/.7
        ~all|200ms|linear
        max-h:0 opacity:0 invisible
        {mt:.5x;max-h:30;opacity:1;visible}[show]
      `,
    },
    field: {
      '': literal.$`{flex;ai:center}>p {flex:0|0|$(w,30%);f:bold}>p>span:nth(1)`,
    },
    list: {
      '': literal.$`
        lh:1.4;
        {m:0;p:0;counter-reset:item;list-style-type:none}_ol,_ul
        {m:0}_li
        {table;my:0.25em;counter-increment:item}_ol>li,_ul>li
        {table-cell;pr:0.5em;content:counters(item,'.')|'.';white-space:nowrap;word-break:initial}_ol>li::before
      `,
      '-nested': literal.$`
        {content:counters(item,'.')!}_li::before
      `,
      '-bracket': literal.$`
        {content:'('|counter(item)|')'!}_li::before
      `,
      '-none': literal.$`
        .list_{content:unset!}_li::before
      `,
    },
    table: {
      head: literal.$`
        grid-cols:$(cols,6)
        p:1x
        f:heavy t:center
        fg:theme
        bg:theme/.4
      `,
      body: literal.$`
        bg:theme/.1
        {max-h:47vh;overflow-y:auto}@sm
      `,
      tr: literal.$`
        rel ai:center
        {bg:theme/.15}:nth-child(odd)
        {bb:1|solid|theme/.3}:not(:last-of-type)
        {border-bottom-width:2}:not(:last-of-type)@<sm
        {grid-cols:$(cols,6);t:center}@sm
        {grid-rows:$(rows,3);t:left}@<sm
        {z:-1;content:'';abs-full;bg:theme;opacity:0;~opacity|.3s;untouchable}::before
        {opacity:.1;z:0}:hover::before
        {p:1x}>div@sm
        {p:.5x}>div@<sm
      `,
    },
    skeleton: {
      '': literal.$`
        rel overflow:hidden user-select:none
        bg:$(skeleton-bg,transparent)
        {content:'_';invisible}:is(.skeleton--text):before
        {content:'';abs-full;bg:gradient(90deg,rgba(112,112,112,0)|0%,rgba(62,62,62,0.2)|20%,rgba(62,62,62,0.5)|60%,rgba(12,12,12,0));translateX(-100%);@shimmer|2s|infinite}::after

      `,
      //{content:'';abs-full;bg:linear-gradient(90deg,G-20/0|0%,G-20/.5|20%,G-20/.5|60%,G-20/0);translateX(-100%);@shimmer|2s|infinite}::after
    },
    spin: '@rotate|1.4s|linear|infinite',
  };

  const keyframes = {
    shimmer: { to: { transform: 'translateX(100%)' } },
    skeletonWave: {
      from: { backgroundPosition: '200% 0' },
      to: { backgroundPosition: '-200% 0' },
    },
    rollIn: {
      from: { transform: 'translateY(-100%)' },
      to: { transform: 'translateY(0)' },
    },
  };

  return {
    mediaQueries,
    selectors,
    values,
    colors,
    themes,
    rules,
    semantics,
    classes: cls,
    keyframes,
  };
});
