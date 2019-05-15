export function debug(): void {
  const CSS_URL_SET = [
    // 'https://cdn.huijiwiki.com/anno/load.php?debug=false&lang=zh-cn&modules=ext.echo.badgeicons%7Cext.echo.styles.badge%7Cext.visualEditor.desktopArticleTarget.noscript%7Cmediawiki.legacy.commonPrint%2Cshared%7Cmediawiki.sectionAnchor%7Cmediawiki.ui.button%7Cskins.bootstrapmediawiki.top&only=styles&skin=bootstrapmediawiki',
    `${process.env.BASE_URL}huijiwiki/outline-1.css`,
    // 'https://cdn.huijiwiki.com/anno/load.php?debug=false&lang=zh-cn&modules=ext.smw.style%7Cext.smw.tooltip.styles&only=styles&skin=bootstrapmediawiki',
    `${process.env.BASE_URL}huijiwiki/outline-2.css`,

    'https://cdn.staticfile.org/font-awesome/4.7.0/css/font-awesome.min.css',

    // inline
    `${process.env.BASE_URL}huijiwiki/inline-1.css`,
    `${process.env.BASE_URL}huijiwiki/inline-2.css`,
    `${process.env.BASE_URL}huijiwiki/inline-3.css`,

    'https://cdn.huijiwiki.com/www/skins/bootstrap-mediawiki/css/huiji.bdshare.css',
  ];

  const first = document.head.firstElementChild as Element;

  CSS_URL_SET.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    document.head.insertBefore(link, first);
  });
}
