// ----------------------------------------------------------------
// # Configure
// ----------------------------------------------------------------
(function (getConfig) {
  window.mcssConfig = getConfig();
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
    primary: 'brown-60', //主色，品牌的主要色彩
    secondary: 'pink-70', //輔色，品牌的輔助色彩
    accent: '#333333', //強調色，強調目前作用中的連結及狀態，和背景形成強烈對比
    major: '#999999', //重要色，用於主標題、次標題、導航或微強調字段，和背景形成高對比
    body: '#EEEEEE', //主體色，用於整體網頁的背景色
    object: '#FEFEFE', //物件色，用於卡片及區塊化元素的背景色
    content: '#333333', //內容色，適合於內文閱讀的前景色，柔和於背景
    silence: 'gray-80', //禁用色
    shadow: 'B-50',

    // TODO: 改成上面的顏色
    theme: { '': 'brown-60', fg: '#FFFFFF' },
    fg: { '': '#333333' },
    bg: { '': '#FEFEFE', box: '#FEFEFE', btn: '#FEFEFE' },

    success: '#269244',
    waring: '#D9730D',
    danger: '#E03E3E',
    info: '#2F80ED',
    link: '#0F62FE',
  };

  const themes = {
    light: {},
    dark: {
      colors: {
        primary: '#333333',
        accent: '#333333',
        major: 'gray-80',
        content: '#0c0c0c',

        // TODO: 改成上面的顏色
        theme: { '': '#333333', fg: '#EEEEEE' },
        fg: { '': '#EEEEEE' },
        bg: { '': '#CCCCCC', box: '#777777', btn: '#777777' },

        success: '#74A16A',
        waring: '#FFA344',
        danger: '#FF7369',
        link: '#529CCA',
      },
    },
  };

  const rules = {
    boxShadow: {
      values: {
        xs: '0|1|2|0|shadow/.05',
        sm: '0|1|3|0|shadow/.1,0|1|2|-1|shadow/.1',
        md: '0|4|6|-1|shadow/.1,0|2|4|-2|shadow/.1',
        lg: '0|10|15|-3|shadow/.1,0|4|6|-4|shadow/.1',
        xl: '0|20|25|-5|shadow/.1,0 8|10|-6|shadow/.1',
        inner: 'inset|0|2|4|0|shadow/.05',
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

  const literal = window.mcssLiteral;
  const cls = {
    // 一般初始
    normal: {
      '': literal.toLine({
        '': 'box:border m:0 p:0 f:16 lh:1.4 font-family:$(font)',
        '_:where(*)': 'box:border text-rendering:geometricPrecision b:0|solid',
        '_::after,_::before': 'box:border',
        '_:where(blockquote,dl,dd,hr,figure,p,button,optgroup,select,textarea,pre),_headings': 'm:0',
        '_:where(td,legend,textarea,input,fieldset)': 'p:0',
        '_:where(img,svg,video,canvas,audio,iframe,embed,object)': 'block',
        '_:where(button,input,optgroup,select,textarea)': 'm:0 p:0 font-family:inherit f:100% fg:inherit bg:transparent',
        '_:where(button,select)': 'text-transform:none',
        '_:where(a)': 'fg:inherit text:none',
        "_:where(a,[type='button']:not([disabled]),[role='button'],button:not([disabled]))": 'cursor:pointer',
        '_:where(small)': 'f:80%',
        '_:where(b,strong)': 'f:bolder',
        '_:where(sub,sup)': 'rel f:75% lh:0 v:baseline',
        '_:where(sub)': 'bottom:-.25em',
        '_:where(sup)': 'top:-.5em',
        '_:where(hr)': 'h:0 fg:inherit',
        '_:where(ul,ol)': 'm:0 p:0',
        '_:where(ul)': 'list-style:none',
        '_:where(abbr[title])': 'text:underline|dotted',
        '_:where(table)': 'text-indent:0 border-color:inherit',
        '_:where(summary)': 'display:list-item',
        '_:where(progress)': 'v:baseline',
        '_:where(kbd)': 'mx:0x p:0x r:0x f:80% fg:B-30 bg:W-50 b:1|solid|B-30/.5 shadow:sm',
        // '::-moz-focus-inner': 'border-style:none p:0',
        // '::-moz-ui-invalid': 'box-shadow:none',
        // '::-webkit-inner-spin-button,::-webkit-outer-spin-button': 'h:auto',
        // '::-webkit-search-decoration': '-webkit-appearance:none',
        // '::-webkit-file-upload-button': '-webkit-appearance:none font:inherit',
      }),
    },
    // 滾動條
    scrollbar: {
      '': literal.$`
        {w:8;h:8}::scrollbar
        {rounded}::scrollbar,::scrollbar-thumb
        bg:primary/.2::scrollbar
        bg:primary/.6::scrollbar-thumb
        bg:primary/.8::scrollbar-thumb:hover
        bg:primary::scrollbar-thumb:active
        bg:transparent::scrollbar-corner
      `,
    },
    // 頁首
    header: {
      '': literal.toLine({
        '': 'z:header top:0 w:full h:header bg:primary header--fixed',
        transition: '~.2s opacity:1!:hover',
        '@<sm': 'fixed {mt:header}+*_$',
      },true),
      '-fixed': literal.toLine({
        '': 'fixed!',
        '+*': 'mt:header',
      }),
    },
    // 容器
    container: {
      '': literal.$`
        box:border mx:auto p:1x max-w:xl
      `,
    },
    // 連結
    link: {
      '': literal.toLine({
        '': 'rel inline-flex ai:center gap:5 fg:link text-decoration:none',
        transition: '~.2s fg:link/.8:hover fg:link/.6:active',
        '::before': "content:'' abs bottom:0.1em w:full bb:1|solid",
      }),
    },
    // 題目
    subject: {
      '': literal.toLine({
        '': 'flex center-content gap:2x {flex:1}::before,::after',
        '::before,::after': "content:'' bt:1|solid opacity:.2",
      }),
      block: literal.toLine({
        '': 'rel mx:auto mb:80 py:18 max-w:424 fg:theme t:center white-space:nowrap',
        '@<sm': 'py:12',
        '@<2xs': 'mb:56 max-w:240',
        '::before,::after': "content:'' abs w:116 h:1 bg:theme/.56",
        '::before': 'top:0 left:0 {w:100}@<sm',
        '::after': 'bottom:0 right:0 {w:100}@<sm',
        '>h2': literal.toLine({
          '': 'f:bold f:32 lh:35px',
          '@<2xs': 'f:20 lh:28px',
        }),
        '>h3': literal.toLine({
          '': 'pt:10 f:18 f:regular lh:25px fg:G-50',
          '@<2xs': 'pt:4 f:14 lh:20px',
        }),
      }),
    },
    // 卡片
    card: {
      '': literal.$`
        box:border
        my:2x p:2x|3x
        r:1x overflow:hidden
        bg:bg-box
        shadow:lg
      `,
    },
    // 按鈕
    btn: {
      '': literal.$`
        box:border rel overflow:hidden
        inline-flex center-content gap:1x
        p:0x|1x r:inherit w:inherit h:inherit
        f:inherit fg:$(fg,inherit) bg:$(bg,inherit)
        t:center vertical-align:middle
        text-transform:inherit text:none white-space:nowrap
        b:1|solid|$(border,${baseColors['G'][50]})
        ~.2s transition-property:color,background,border-color,box-shadow
        pointer outline:none
        pointer-events:all
        untouchable>*

        {z:1;fg:$(theme,theme);border-color:$(theme,theme)}:is(:not([disabled]):hover,:focus-within)

        {opacity:.6;cursor:not-allowed;}:is([disabled],[readonly],[loading])
        {bg:B-50/.1}:not([class*="btn-type--"])[disabled]

        {content:'';untouchable;abs;full;middle;center;bg:$(fg,theme);opacity:0;~opacity|.2s}::before
        {opacity:.1}:not([disabled]):active::before

        :host(:empty)_{p:1x}
      `,
      '-ripple': literal.$`
        {content:'';untouchable;abs;full;top:$(y,50%);left:$(x,50%);bg:no-repeat;bg:center}::after
        {bg:theme;bg:radial-gradient(circle,bg|10%,transparent|10.01%)}::after
        {transform:translate(-50%,-50%)|scale(10);opacity:0;~transform|.2s,opacity|.8s}::after
        {transform:translate(-50%,-50%)|scale(0);opacity:.3;~none}:not([disabled]):active::after
      `,
      '-noborder': literal.$`
        b:0 p:calc(0x+1)|calc(1x+1)!
        :host(:empty)_{p:1x!}
      `,
      type: {
        '-dashed': literal.$`border-style:dashed`,
        '-outline': literal.$`
          fg:$(theme,theme)! border-color:$(theme,theme)
          {bg:$(theme,theme)!}::before
        `,
        '-font': literal.$`
          btn--noborder
          {content:unset!}::before
        `,
        '-flat': literal.$`
          btn--noborder
          {opacity:.1}:is(:not([disabled]):hover,:focus-within)::before
          {opacity:.2!}:not([disabled]):active::before
        `,
        '-theme': literal.$`
          btn-type--flat
          fg:$(theme-fg,theme-fg)! bg:$(theme,theme)!
          {bg:$(theme-fg,theme-fg)!}::before
          {bg:theme;bg:radial-gradient(circle,bg|10%,transparent|10.01%)}.btn--ripple::after
        `,
      },
      shape: {
        '-circle': literal.$`round`,
      },
    },
    // 手風琴
    accordion: {
      '': literal.toLine({
        '': 'flex flex:wrap',
        '>*': 'w:full',
        // Toggle (hide)
        '>input': literal.toLine({
          '': 'z:-1 hide abs 0x0 opacity:0',
          ':checked~label_tk-icon[type=arrow]': 'rotate(-180deg)',
        }),
        // Arrow Icon
        '>label_tk-icon[type=arrow]': '~transform|.2s',
      }),
      // 標題
      title: literal.toLine({
        '': 'rel pointer',
        '::after': literal.toLine({
          '': "content:'+' abs right:1x",
          ':checked~': "content:'-'",
        }),
      }),
      // 內容
      content: {
        '': literal.toLine({
          '': 'grid grid-template-rows:0fr opacity:0 overflow:hidden',
          transition: '~.2s transition-property:grid-template-rows,opacity,padding',
          ':checked~': 'accordion-content--open',
        }),
        '-open': 'grid-template-rows:1fr opacity:1 py:1x',
      },
    },
    // 輸入框
    input: {
      '': literal.toLine({
        '': `
          box:border rel r:0x overflow:hidden
          flex ai:center jc:space-between h:4x
          fg:inherit bg:transparent b:1|solid|fg/.5
          ~.2s
        `,
        '[invalid]': 'border-color:danger {fg:danger}_.input-icon',
        '[valid]': 'border-color:success {fg:success}_.input-icon',
        '_.input-icon': 'fg:fg/.5',
        '>input': literal.toLine({
          '': 'box:border p:0x|1x full f:inherit fg:inherit bg:transparent b:none outline:none',
          '::placeholder': 'fg:fg/.5 ~.2s',
          ':focus::placeholder': 'opacity:0',
          ':not(:empty)::placeholder': 'translateY(-100%)',
        }),
      }),
      // 圖示
      icon: literal.$`
        block abs-center-y left:1x
        f:3x
        .input_{pl:4x}~input
      `,
      //
      title: literal.$`
        mb:1x {content:'*';fg:danger}[required]::before
      `,
      // 提示訊息
      msg: literal.$`
        f:12 fg:fg/.7 overflow:hidden
        ~.2s max-h:0 opacity:0 invisible
        {mt:0x;max-h:4x;opacity:1;visible}[show]
      `,
      // TODO: Placeholder
      label: literal.$`
        abs top:2x left:1x
        f:16 fg:fg/.5
        f:bold
        transform-origin:0|0
        transform:translate3d(0,0,0)
        ~.2s
        untouchable
      `,
      // TODO:
      focusBg: literal.$`
        z:-1 abs-full bg:fg/.05
        transform-origin:left
        transform:scaleX(0)
      `,
    },
    // 欄位
    field: {
      '': literal.$`{flex;ai:center}>p {flex:0|0|$(w,30%);f:bold}>p>span:nth(1)`,
    },
    // 清單
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
    // 表格
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
    // 骨架屏
    skeleton: {
      '': literal.$`
        bg:linear-gradient(270deg,bg-box/.4,bg-box/.2,bg-box/.2,bg-box/.4)
        background-size:400%|100%
        @skeletonWave|2.5s|linear|infinite
      `,
      pseudo: literal.toLine({
        '': 'rel bg:$(skeleton-bg,inherit)',
        '::after': "content:'' abs-full skeleton",
      }),
    },
    loader: {
      '': literal.toLine({
        '': `flex center-content`,
        '::before': literal.$`
          box:border
          w:0.875em h:0.875em
          content:'' inline-block round
          b:0.125em|solid bb:transparent!
          spin mr:0.5em
        `,
      }),
    },
    // 旋轉
    spin: '@rotate|1s|linear|infinite',
  };

  const keyframes = {
    skeletonWave: { from: { 'background-position': '200% 0' }, to: { 'background-position': '-200% 0' } },
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
