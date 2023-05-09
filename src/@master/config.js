// ----------------------------------------------------------------
// # Configure
// ----------------------------------------------------------------
(function (getConfig) {
  window.masterCSSConfig = getConfig();
})(function () {
  // const breakpoints = {
  //   '3xs': 360,
  //   '2xs': 480,
  //   xs: 600,
  //   sm: 768,
  //   md: 1024,
  //   lg: 1280,
  //   xl: 1440,
  //   '2xl': 1600,
  //   '3xl': 1920,
  //   '4xl': 2560,
  // };

  const mediaQueries = {
    hover: '(any-hover:hover)',
  };

  const selectors = {
    _headings: '_:where(h1,h2,h3,h4,h5,h6)', // class="font:bold_headings"
  };

  const values = {
    '0x': 4,
    '1x': 8,
    '2x': 16,
    '3x': 24,
    '4x': 32,
    '5x': 40,
    header: 45,
  };

  const baseColors = {
    W: { 50: '#FFFFFF' },
    B: { 50: '#1D1D1D', 40: '#252525', 30: '#333333', 20: '#444444' },
    G: { 50: '#999999', 40: '#B2B2B2', 30: '#CBCBCB', 20: '#F2F2F2', 10: '#F8F8F8' },
    Y: { 50: '#FBC700', 20: '#FFECA0' },
  };

  const colors = {
    ...baseColors,
    success: '#269244',
    waring: '#D9730D',
    danger: '#E03E3E',
    info: '#2F80ED',
    link: '#0F62FE',

    theme: { '': 'brown-60', fg: '#FFFFFF' },
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
        header: 100000,
        modal: 100050,
        message: 100051,
        devPanel: 999999,
      },
    },
  };

  const semantics = {
    nowrap: { 'white-space': 'nowrap' },
    pointer: { cursor: 'pointer', 'user-select': 'none' },
    abs: {
      full: {
        position: 'absolute',
        top: '0',
        right: '0',
        bottom: '0',
        left: '0',
      },
      center: {
        '': {
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
        },
        y: {
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-50%)',
        },
        x: {
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
        },
      },
    },
  };

  const literal = window.masterCSSLiteral;
  const cls = {
    normal: {
      '': literal.$`
        m:0 p:0 f:16 lh:1.4 font-family:$(font)
        {m:0}_:where(p)
        {m:0}_headings
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
    header: {
      '': literal.$`
        z:header top:0
        w:full h:header bg:theme
        opacity:1!:hover
        ~.2s

        {fixed}@<sm
        {mt:header}+*@<sm
      `,
      '-fixed': literal.$`
        fixed! {mt:header}+*
      `,
    },
    container: {
      '': literal.$`
        mx:auto p:1x max-w:xl
      `,
    },
    link: {
      '': literal.$`
        rel inline-flex ai:center gap:5
        ~color|.2s fg:link/.7:hover fg:link:active
        text-decoration:none
        {content:'';abs;bottom:0.1em;w:full;bb:1|solid}::before
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
        mb:80 mb:56@<2xs
        py:18 py:12@<sm
        max-w:424 max-w:240@<2xs
        fg:theme t:center white-space:nowrap
        {f:32;f:bold;lh:35px}>h2
        {f:20;lh:28px}>h2@<2xs

        {pt:10;f:18;f:regular;lh:25px;color:#999999}>h3
        {pt:4;f:14;lh:20px}>h3@<2xs

        {content:'';abs;top:0;left:0;w:116;h:1;bg:theme/.56}:before
        {content:'';abs;bottom:0;right:0;w:116;h:1;bg:theme/.56}:after
        {w:100}:before@<sm
        {w:100}:after@<sm
      `,
    },
    card: {
      '': literal.$`
        my:2x p:2x|3x
        r:1x overflow:hidden
        bg:bg-box
        shadow:lg
      `,
    },
    accordion: {
      '': literal.$`
        flex flex:wrap
        {w:full}>*
        {z:-1;hide;abs;0x0;opacity:0}>input

        {~transform|.2s}>label_tk-icon
        {rotate(-180deg)}>input:checked~label_tk-icon
      `,
      title: literal.$`
        rel pointer
        {content:'+';abs;right:1x}:after
        :checked~{content:'-'}:after
      `,
      content: literal.$`
        grid grid-template-rows:0fr opacity:0

        :checked~{grid-template-rows:1fr;opacity:1;py:1x}
        ~.2s transition-property:padding,grid-template-rows,opacity
        overflow:hidden
      `,
    },
    input: {
      '': literal.$`
        box:border overflow:hidden
        rel flex ai:center jc:space-between
        r:0x h:4x
        fg:fg bg:bg-box b:1|solid|G-50
        ~.2s

        {box:border;p:0x|1x;full;f:inherit;fg:inherit;bg:none;b:none;outline:none;appearance:none}>input
        {fg:G-40;~.2s}>input::placeholder
        {opacity:0}>input:focus::placeholder
        {translateY(-100%)}>input:not(:empty)::placeholder

        {border-color:danger}[invalid]
        {border-color:success}[valid]
        {fg:G-40}_.input-icon
        {fg:danger}[invalid]_.input-icon
        {fg:success}[valid]_.input-icon
      `,
      label: literal.$`
        abs top:2x left:1x
        f:16 fg:fg/.5
        f:bold
        transform-origin:0|0
        transform:translate3d(0,0,0)
        ~.2s
        untouchable
      `,
      focusBg: literal.$`
        z:-1 abs-full bg:fg/.05
        transform-origin:left
        transform:scaleX(0)
      `,
      icon: literal.$`
        block abs-center-y left:1x
        f:24
        .input_{pl:4x}~input
      `,
      title: literal.$`
        mb:1x {content:'*';fg:danger}[required]::before
      `,
      msg: literal.$`
        overflow:hidden
        f:12 color:fg/.7
        ~.2s
        max-h:0 opacity:0 invisible
        {mt:0x;max-h:30;opacity:1;visible}[show]
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
        {max-h:50vh;overflow-y:auto}@sm
        {max-h:75vh;overflow-y:auto}@<sm
      `,
      tr: literal.$`
        rel ai:center
        {bg:theme/.15}:nth-child(odd)
        {bb:1|solid|theme/.3}:not(:last-of-type)
        {border-bottom-width:2}:not(:last-of-type)@<sm
        {grid-cols:$(cols,6);t:center}@sm
        {grid-rows:$(rows,3);t:left}@<sm
        {z:-1;content:'';abs-full;bg:theme;opacity:0;~opacity|.2s;untouchable}::before
        {opacity:.1;z:0}:hover::before
        {p:1x}>div@sm
        {p:0x}>div@<sm
      `,
    },
    skeleton: {
      '': literal.$`
        rel overflow:hidden user-select:none
        bg:$(skeleton-bg,transparent)
        {content:'_';invisible}:is(.skeleton--text):before
        {content:'';abs-full;bg:linear-gradient(90deg,G-20/0|0%,G-20/.5|20%,G-20/.5|60%,G-20/0);translateX(-100%);@shimmer|2s|infinite}::after
      `,
    },
    spin: '@rotate|1.4s|linear|infinite',
  };

  const keyframes = {
    shimmer: { to: { transform: 'translateX(100%)' } },
    skeletonWave: { from: { backgroundPosition: '200% 0' }, to: { backgroundPosition: '-200% 0' } },
    rollIn: { from: { transform: 'translateY(-100%)' }, to: { transform: 'translateY(0)' } },
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
