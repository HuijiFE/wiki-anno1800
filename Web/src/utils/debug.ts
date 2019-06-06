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

  document.body.className =
    'mediawiki ltr sitedir-ltr mw-hide-empty-elt ns-0 ns-subject page-Anno1800_test rootpage-Anno1800 skin-bootstrapmediawiki action-view';

  const appElem = document.querySelector('#app') as HTMLDivElement;
  appElem.outerHTML = /* html */ `
<div id="wrapper" class="">

        <header class="header navbar navbar-default navbar-fixed-top" role="navigation">
            <div class="navbar-container">
                <div class="navbar-header">
                    <a rel="nofollow" class="navbar-brand" href="#menu-toggle" id="menu-toggle">
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </a>
                    <a class="navbar-toggle">
                        <i class="fa fa-chevron-down"></i>
                    </a>
                    <a class="visible-xs-inline-block search-toggle">
                        <span class="fa fa-search navbar-search"></span>
                    </a>
                    <a title="灰机wiki" href="https://www.huijiwiki.com" class="navbar-brand"><img id="huiji-logo-main" alt="Logo" src="https://fs.huijiwiki.com/www/resources/assets/huijilogo-standard.svg"> </a>
                    <a class="visible-sm-block wiki-toggle">
                        <i class="fa fa-chevron-down"></i>
                    </a>
                    <form class="navbar-search navbar-form" action="/index.php" id="huiji-mobile-search-form" role="search">
                        <div>
                            <input class="form-control" type="search" name="search" placeholder="在纪元中文维基内搜索" title="搜索纪元中文维基 [Alt+Shift+f]" accesskey="f" id="searchInputPhone" autocomplete="off">
                            <input type="hidden" name="title" value="Special:Search">
                        </div>
                    </form>
                </div>

                <nav class="navbar-collapse">
                    <ul id="icon-section" class="nav navbar-nav">
                            <li class="dropdown">
                              <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">推荐wiki <span class="caret"></span></a>
                              <ul class="dropdown-menu hub-menu" role="menu">
<li>
    <ul class="hub-list">
        <li class="letter active" data-toggle="letter">天地</li>                                            
        <li class="strongest" data-toggle="strongest">宇宙</li>
        <li class="highest" data-toggle="highest">日月</li>
        <li class="fastest" data-toggle="fastest">辰宿</li>
        <li class="new" data-toggle="new">寒来</li>
        <li class="newnew" data-toggle="newnew">暑往</li>
    </ul>
</li>
<li class="a">
    <ul class="hub-selection letter-link active">
        <li><a href="https://asoiaf.huijiwiki.com">冰与火之歌</a></li>
        <li><a href="https://warframe.huijiwiki.com">Warframe</a></li>
        <li><a href="https://witcher.huijiwiki.com">猎魔人</a></li>
        <li><a href="https://lotr.huijiwiki.com">魔戒</a></li>
        <li><a href="https://gbf.huijiwiki.com">碧蓝幻想</a></li>
        <li><a href="https://ff14.huijiwiki.com">最终幻想XIV</a></li>
    </ul>    
    <ul class="hub-selection strongest-link">
        <li><a href="https://howtotrainyourdragon.huijiwiki.com">驯龙高手</a></li>
        <li><a href="https://taiwu.huijiwiki.com">太吾绘卷</a></li>
        <li><a href="https://xinglugu.huijiwiki.com">星露谷物语</a></li>
        <li><a href="https://hitman.huijiwiki.com">杀手</a></li>
        <li><a href="https://cod.huijiwiki.com">使命召唤</a></li>
        <li><a href="https://tagatame.huijiwiki.com">为了谁的炼金术师</a></li>
    </ul>    
    <ul class="hub-selection highest-link">
        <li><a href="https://warcraft.huijiwiki.com">魔兽世界</a></li>
        <li><a href="https://totalwar.huijiwiki.com">全面战争</a></li>
        <li><a href="https://isaac.huijiwiki.com">以撒的结合</a></li>
        <li><a href="https://mlp.huijiwiki.com">我的小马驹</a></li>
        <li><a href="https://warriors.huijiwiki.com">猫武士</a></li>
        <li><a href="https://dnfcn.huijiwiki.com">地下城与勇士</a></li>
    </ul>                                        
    <ul class="hub-selection fastest-link">
        <li><a href="https://danganronpa.huijiwiki.com">弹丸论破</a></li>
        <li><a href="https://xyy.huijiwiki.com">喜羊羊与灰太狼</a></li>
        <li><a href="https://eve.huijiwiki.com">EVE中文维基</a></li>
        <li><a href="https://santi.huijiwiki.com">三体wiki</a></li>
        <li><a href="https://jiuzhou.huijiwiki.com">九州</a></li>
        <li><a href="https://dota.huijiwiki.com">DotA</a></li>
    </ul>                                        
    <ul class="hub-selection new-link">
        <li><a href="https://hearthstone.huijiwiki.com">炉石传说</a></li>
        <li><a href="https://qunxing.huijiwiki.com">群星Stellaris</a></li>
        <li><a href="https://tarsylia.huijiwiki.com">塔希里亚</a></li>
        <li><a href="https://rimworld.huijiwiki.com">Rimworld</a></li>
        <li><a href="https://gw2.huijiwiki.com">激战2</a></li>
        <li><a href="https://coppermind.huijiwiki.com">红铜智库</a></li>
    </ul>
    <ul class="hub-selection newnew-link">
        <li><a href="https://jinguang.huijiwiki.com">金光布袋戏</a></li>
        <li><a href="https://xcom2.huijiwiki.com">XCOM2</a></li>
        <li><a href="https://overwatch.huijiwiki.com">守望先锋</a></li>
        <li><a href="https://godofwar.huijiwiki.com">战神</a></li>
        <li><a href="https://gcdm.huijiwiki.com">国产动漫</a></li>
        <a href="https://www.huijiwiki.com/wiki/%E7%89%B9%E6%AE%8A:%E7%AB%99%E7%82%B9%E6%8E%92%E8%A1%8C" class="wiki-random">站点排行榜</a>
    </ul>
</li>
</ul>
                            </li>
                            <li class="">
                                <a href="https://www.huijiwiki.com/wiki/灰机wiki:灰机停机坪">申请建站</a>
                            </li>
                            <li class="">
                                <a href="https://forum.huijiwiki.com">灰机论坛</a>
                            </li>
                            <li class="">
                                <a href="https://www.huijiwiki.com/wiki/CommunityCenter">帮助中心</a>
                            </li>
                    </ul><ul class="nav navbar-nav navbar-right navbar-user"><li id="pt-user-icon"><a href="https://anno.huijiwiki.com/wiki/%E7%94%A8%E6%88%B7:Duduluu"><span class="user-icon" style="border: 0px;"><img src="https://av.huijiwiki.com/my_wiki_8252_s.png?r=1559726617" alt="avatar" class="headimg" data-name="Duduluu"></span><span class="hidden-xs">Duduluu</span></a></li><li id="pt-notifications-alert"><a class="mw-echo-notifications-badge mw-echo-notification-badge-nojs mw-echo-unseen-notifications mw-echo-notifications-badge-long-label" href="/wiki/%E7%89%B9%E6%AE%8A:%E9%80%9A%E7%9F%A5" style="color: rgb(255, 255, 255); background: rgb(248, 172, 5) none repeat scroll 0% 0%;">100</a></li><li id="pt-notifications-notice"><a class="mw-echo-notifications-badge mw-echo-notification-badge-nojs mw-echo-unseen-notifications" href="/wiki/%E7%89%B9%E6%AE%8A:%E9%80%9A%E7%9F%A5" style="color: rgb(255, 255, 255); background: rgb(220, 0, 0) none repeat scroll 0% 0%;">2</a></li><li id="pt-following" class="mw-echo-ui-notificationBadgeButtonPopupWidget"><a title="我关注的站点" href="/index.php?title=Special:ShowFollowedSites&amp;user_id=8252&amp;target_user_id=8252"><i class="fa fa-heart-o"></i></a></li><li class="dropdown set"><a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="fa fa-cog"></i></a><ul class="dropdown-menu set-menu"><li id="pt-preferences"><a href="/wiki/%E7%89%B9%E6%AE%8A:%E5%8F%82%E6%95%B0%E8%AE%BE%E7%BD%AE" class="  "><i class="fa fa-user"></i> 参数设置</a></li><li id="pt-designation"><a href="/wiki/Special:designation" class="  "><i class="fa fa-graduation-cap"></i> 称号</a></li><li id="pt-linkaccount"><a href="/wiki/Special:linkAccounts" class="  "><i class="fa fa-link"></i> 绑定账号</a></li><li id="pt-unlinkaccount"><a href="/wiki/Special:unlinkAccounts" class="  "><i class="fa fa-unlink"></i> 解绑账号</a></li><li id="pt-watchlist"><a href="/wiki/%E7%89%B9%E6%AE%8A:%E7%9B%91%E8%A7%86%E5%88%97%E8%A1%A8" class="  "><i class="fa fa-eye"></i> 监视列表</a></li><li id="pt-mycontris"><a href="/wiki/%E7%89%B9%E6%AE%8A:%E7%94%A8%E6%88%B7%E8%B4%A1%E7%8C%AE/Duduluu" class="  "><i class="fa fa-list-alt"></i> 贡献</a></li><li id="pt-logout"><a href="/index.php?title=%E7%89%B9%E6%AE%8A:%E7%94%A8%E6%88%B7%E9%80%80%E5%87%BA&amp;returnto=Anno1800%2Ftest" class="  "><i class="fa fa-power-off"></i> 退出</a></li></ul></li></ul><form class="navbar-search navbar-form table-cell hidden-xs" action="/index.php" id="huiji-search-form" role="search">
                        <div>
                            <span class="fa fa-search navbar-search"></span>
                            <input class="form-control" type="search" name="search" placeholder="在纪元中文维基内搜索" title="搜索纪元中文维基 [Alt+Shift+f]" accesskey="f" id="searchInput" autocomplete="off">
                            <input type="hidden" name="title" value="Special:Search">
                        </div>
                    </form>
                </nav>
            </div>
        </header>   <!-- Sidebar -->
<aside id="sidebar-wrapper">

<ul class="sidebar-nav" id="sidebar-content">
    <li class="sidebar-header">
        <a href="https://anno.huijiwiki.com/wiki/Anno1800/test">Anno1800/test</a>
  <button class="mw-ui-button mw-ui-progressive" id="ca-talk">
                <a href="/index.php?title=%E8%AE%A8%E8%AE%BA:Anno1800/test&amp;action=edit&amp;redlink=1">讨论</a></button>		</li>
<li class="sidebar-behavior">
  <ul>
  <li class="primary-nav dropdown" id="ca-huiji-ve-edit"><a href="/index.php?title=Anno1800/test&amp;veaction=edit" rel=""><i class="fa fa-pencil"></i> 编辑</a></li><li class="primary-nav dropdown" id="ca-huiji-edit"><a href="/index.php?title=Anno1800/test&amp;action=edit" rel=""><i class="fa fa-code"></i> 编辑源代码</a></li><li class="primary-nav dropdown" id="ca-history"><a href="/index.php?title=Anno1800/test&amp;action=history" rel=""><i class="fa fa-clock-o"></i> 历史</a></li><li class="primary-nav dropdown" id="ca-delete"><a href="/index.php?title=Anno1800/test&amp;action=delete" rel=""><i class="fa fa-remove"></i> 删除</a></li><li class="primary-nav dropdown" id="ca-move"><a href="/wiki/%E7%89%B9%E6%AE%8A:%E7%A7%BB%E5%8A%A8%E9%A1%B5%E9%9D%A2/Anno1800/test" rel=""><i class="fa fa-arrows"></i> 移动</a></li><li class="primary-nav dropdown" id="ca-protect"><a href="/index.php?title=Anno1800/test&amp;action=protect" rel=""><i class="fa fa-lock"></i> 保护</a></li><li class="primary-nav dropdown" id="ca-unwatch"><a href="/index.php?title=Anno1800/test&amp;action=unwatch" rel=""><i class="fa fa-eye-slash"></i> 取消监视</a></li><li class="primary-nav dropdown" id="ca-purge"><a href="javascript:void(0)" rel=""><i class="fa fa-eraser"></i> 清除缓存</a></li><li class="primary-nav dropdown" id="ca-info"><a href="https://anno.huijiwiki.com/index.php?title=Anno1800/test&amp;action=info" rel=""><i class="fa fa-file"></i> 信息</a></li><li class="primary-nav dropdown" id="ca-debug"><a href="javascript:void(0)" rel=""><i class="fa fa-plug"></i> 调试</a></li>			</ul>
</li>
<li class="sidebar-brand left-tool">
  <a href="#">
    站点工具
  </a>
  <ul>
    <li><a href="/wiki/Special:RecentChanges" class="recent-changes" rel="nofollow"><i class="fa fa-edit"></i> 最近更改</a></li>
    <li><a href="/wiki/Special:NewFiles" class="new-files" rel="nofollow"><i class="fa fa-image"></i> 新的文件</a></li><a href="/wiki/Special:NewFiles" class="new-files" rel="nofollow">
    </a><li><a href="/wiki/Special:NewFiles" class="new-files" rel="nofollow"></a><a href="/wiki/Special:Randompage" class="random-page" rel="nofollow"><i class="fa fa-random "></i> 随机页面</a></li>
              <li><a href="/wiki/Special:文件上传" class="upload-a-file" rel="nofollow"><i class="fa fa-upload"></i> 上传文件</a></li>
            <!-- <li><a href="/wiki/Special:CreatePoll" class="poll-page" rel="nofollow"><i class="icon-pie-chart "></i> 创建投票</a></li> -->
            <!--<li><a target="_blank" href="https://www.huijiwiki.com/wiki/帮助讨论:用户手册" class="upload-a-file" rel="nofollow"><i class="fa fa-question-circle"></i> 求助提问</a></li> -->
            <li><a href="/wiki/Special:whatlinkshere/Anno1800/test" class="what-links-here" rel="nofollow"><i class="fa fa-link "></i> 链入页面</a></li>
    <li><a href="/wiki/Special:最近链出更改/Anno1800/test" class="related-changes" rel="nofollow"><i class="fa fa-paperclip "></i> 相关更改</a></li>
            <li><a href="/wiki/Special:SpecialPages" class="special-pages" rel="nofollow"><i class="fa fa-star-o"></i> 全部特殊页面</a></li>
            <li class="dropdown">
      <a class="dropdown-toggle" data-toggle="dropdown" href="#">
        <i class="fa fa-bar-chart"></i> 数据统计 <b class="caret"></b>
      </a>
      <ul class="dropdown-menu">
        <li><a href="/wiki/Special:EditRank" class="bootstrap-subnav" rel="nofollow"><i class="fa fa-list-ol"></i> 本站编辑排行</a></li>
        <li><a href="/wiki/Special:TopUsers" class="bootstrap-subnav" rel="nofollow"><i class="fa fa-th-list"></i> 等级积分排行</a></li>
        <li><a href="/wiki/Special:统计信息" class="bootstrap-subnav" rel="nofollow"><i class="fa fa-line-chart"></i> 本站统计信息</a></li>
      </ul>
    </li>
                    <li class="dropdown">
      <a class="dropdown-toggle" data-toggle="dropdown" href="#">
        <i class="fa fa-briefcase"></i> 管理员选项 <b class="caret"></b>
      </a>
      <ul class="dropdown-menu">
        <li><a href="/wiki/特殊:AdminDashboard" class="bootstrap-subnav" rel="nofollow"><i class="fa fa-tachometer"></i> 管理面板</a></li>
        <li><a href="/wiki/Bootstrap:Subnav" class="bootstrap-subnav" rel="nofollow"><i class="fa fa-bars"></i> 修改站点导航</a></li>
        <li><a href="/wiki/Bootstrap:Footer" class="bootstrap-subnav" rel="nofollow"><i class="fa fa-hand-o-down"></i> 修改站点页脚</a></li>
                                <li><a href="/wiki/特殊:创建模板" class="bootstrap-subnav" rel="nofollow"><i class="fa fa-microchip" aria-hidden="true"></i> 创建模板</a></li>
        <li><a href="/wiki/Bootstrap:预设主题" class="bootstrap-subnav" rel="nofollow"><i class="fa fa-bookmark" aria-hidden="true"></i> 预设主题</a></li>
        <li><a href="/wiki/Bootstrap:自定义主题" class="bootstrap-subnav" rel="nofollow"><i class="fa fa-paint-brush"></i> 自定义主题</a></li>
      </ul>
    </li>
            <li class="sidebar-create">
      <div class="mw-inputbox-centered" style="">
        <form name="createbox" class="createbox" action="/index.php" method="get">
          <input name="action" value="edit" type="hidden">
          <input name="prefix" value="" type="hidden">
    <div class="input-group create-group btn-group">
            <input name="title" class="createboxInput form-control" placeholder="新页面名称" value="" dir="ltr" type="text">
            <button name="create" id="createbtn" class="btn btn-primary disabled" type="submit">创建</button>
            <select name="preload" id="mw-input-preload" class="form-control btn btn-primary disabled"><option selected="selected" value="">空白页面</option>
<option title="{{模板:infobox_character/preload}}" value="模板:infobox_character/preload">人物</option>
<option title="{{模板:infobox_location/preload}}" value="模板:infobox_location/preload">地点</option>
<option title="{{模板:infobox_book/preload}}" value="模板:infobox_book/preload">书籍</option>
<option title="{{模板:infobox_battle/preload}}" value="模板:infobox_battle/preload">战争</option>
</select>							</div>
        </form>
      </div>
    </li>
  </ul>
</li>
<li class="sidebar-donate">
  <div class="sidebar-donate_text">
    纪元中文维基<br>
    累计获得加油 ¥ 0			</div>
  <a href="/wiki/Special:Donate" class="sidebar-donate_button button mw-ui-button mw-ui-progressive">
    支持
  </a>
</li>
<li class="sidebar-brand left-manager">
  <a>管理员 <b class="caret"></b></a>
  <div class="left-manager-container">
  </div>
</li>
    <li class="sidebar-brand left-author">
  <a href="#">
    主要编辑者 <b class="caret"></b>
  </a>
  <div class="left-author-container"></div>
</li>
      </ul>
<div class="sidebar-toggle"><i class="fa fa-angle-right"></i></div>
</aside>
<!-- /#sidebar-wrapper -->
            <div id="wiki-outer-body" class="huiji-css-hook">
    <nav id="content-actions" class="subnav subnav-fixed container-fluid">
      <ul class="nav nav-pills">
        <li>
          <a class="navbar-brand logo-wiki-user" href="/wiki/%E9%A6%96%E9%A1%B5" title="纪元中文维基"><img style="height : 1em; padding-bottom:0.2em;" src="https://av.huijiwiki.com/site_default_m.gif" alt="avatar" class="siteimg" data-name="纪元中文维基" border="0">&nbsp;纪元中文维基</a>
        </li>
        <li><span id="user-site-follow" class="mw-ui-button mw-ui-progressive "><span class="glyphicon glyphicon-plus"></span>关注</span> </li>
        <li class="primary-nav dropdown"><a href="/wiki/"></a></li>						<li class="site-count"><p><span class="article-count"><a href="/wiki/Special:AllPages">0</a>条目</span><span class="edit-count"><a href="/wiki/Special:RecentChanges">2.7K</a>编辑</span><span class="follower-count"><a id="site-follower-count">0</a>关注</span></p></li>
        <span id="subnav-toggle"><i class="fa fa-ellipsis-h"></i></span>
      </ul>
    </nav>
    <div id="wiki-body" class="container">
      <main id="content" class="row">
                        <article class="col-sm-12 wiki-body-section" role="main">
                            <header id="firstHeading" class="page-header">

              <div class="pull-right"><div class="mw-indicators mw-body-content">
</div>
</div>
              <h1>Anno1800/test</h1>
                                          <div id="huiji-h1-edit-button" class="huiji-h1-edit-button">

                        <a id="ca-edit" href="/index.php?title=Anno1800/test&amp;veaction=edit" class="icon-pencil collapsible" data-toggle="tooltip" data-placement="top" title="" data-original-title="使用可视化编辑器"></a>
                                                    <span class="mw-editsection-divider"></span>
                        <a id="ca-source-edit" href="/index.php?title=Anno1800/test&amp;action=edit" class="icon-edit-code " data-toggle="tooltip" data-placement="top" title="" data-original-title="使用源代码编辑器"></a>
                      </div>
                                         
                <div id="contentSub">
                <span class="subpages">&lt; <a href="/wiki/Anno1800" title="Anno1800">Anno1800</a>	|	</span><a class="mw-userlink" rel="nofollow" title="Duduluu" href="https://anno.huijiwiki.com/wiki/%E7%94%A8%E6%88%B7:Duduluu">Duduluu</a>&nbsp;于一个普朗克时间前<a href="/wiki/%E7%89%B9%E6%AE%8A:%E7%BC%96%E8%BE%91%E5%B7%AE%E5%BC%82/2735" class="mw-ui-anchor mw-ui-progressive mw-ui-quiet" title="特殊:编辑差异/2735" rel="nofollow">修改了</a>此页面。									</div>

                                </header>
            <!-- end header -->
            <!-- prebodyhtml -->
                            <!-- ConfirmEmail -->
              
            <!-- Not Logged in notice -->
              
            <!-- /Not Logged in notice -->
            <!-- /ConfirmEmail -->
                            <section id="bodyContent" class="body">    
              <div class="ads-center ads-header" style="text-align: center">
                                </div>                 
              <div id="mw-content-text" dir="ltr" class="mw-content-ltr" lang="zh-CN"><div id="mw-notification-area" class="mw-notification-area mw-notification-area-layout" style="display: none;"></div><div class="mw-parser-output"><div id="app"></div>
<!-- 
NewPP limit report
Cached time: 20190606003922
Cache expiry: 86400
Dynamic content: false
[SMW] In‐text annotation parser time: 0 seconds
CPU time usage: 0.003 seconds
Real time usage: 0.003 seconds
Preprocessor visited node count: 1/1000000
Preprocessor generated node count: 4/1000000
Post‐expand include size: 0/2097152 bytes
Template argument size: 0/2097152 bytes
Highest expansion depth: 1/40
Expensive parser function count: 0/100
-->
<!--
Transclusion expansion time report (%,ms,calls,template)
100.00%    0.000      1 -total
-->
</div>
<!-- Saved in parser cache with key anno:pcache:idhash:2735-0!canonical and timestamp 20190606003922 and revision id 2735
-->
</div><div class="printfooter">
取自“<a dir="ltr" href="https://anno.huijiwiki.com/index.php?title=Anno1800/test&amp;oldid=2735">https://anno.huijiwiki.com/index.php?title=Anno1800/test&amp;oldid=2735</a>”</div>
              <div class="ads-margin ads-center">
                                </div>
                                <section class="category-links">
              <!-- catlinks -->
              <div id="catlinks" class="catlinks catlinks-allhidden" data-mw="interface"></div>									<!-- /catlinks -->
              </section>               
                                <div id="siteSub" class="alert alert-info visible-print-block" role="alert">来自纪元中文维基</div>																			<div class="row post-reading dash-line">
                                    <div class="col-md-2 col-md-offset-6 bdsharebuttonbox pull-right bdshare-button-style0-16" data-tag="share_1" data-bd-bind="1559781562032"><a href="#" class="icon-weixin-share hidden-xs hidden-sm" data-tag="share_1" data-cmd="weixin" title="分享到微信"></a><a href="#" class="icon-weibo-share" data-tag="share_1" data-cmd="tsina" title="分享到新浪微博"></a><a href="#" class="icon-share-alt" data-tag="share_1" title="复制固定链接"></a></div>
                </div>
                                <div class="clearfix"></div><div id="recommend" class="recommend owl-carousel"></div><section class="comments-body"><a id="end" name="end" rel="nofollow"></a><section class="container-fluid"><form name="commentForm"><div id="replyto" class="c-form-reply-to"></div><div class="row comment-text-wrapper">
<div class="c-form-title"><div class="hj-media-avatar"><a href="/wiki/%E7%94%A8%E6%88%B7:Duduluu" class="mw-userlink" title="Duduluu" style="position: relative" rel="nofollow"><img src="https://av.huijiwiki.com/my_wiki_8252_ml.png?r=1559563035" alt="avatar" class="headimg" data-name="Duduluu"><span class="badge user-group-icon btn-info hidden-sm hidden-xs" data-toggle="tooltip" data-placement="top" title="" data-original-title="职员"><span class="icon-huiji"></span></span></a></div></div>
<div class=" lead emoji-picker-container hj-media-body"><textarea name="commentText" id="comment" placeholder="Duduluu写下的只是Anno1800/test，得到的是我的吐槽。" class=" mw-ui-input text-area mention-area" rows="5" cols="64" data-emojiable="converted" style="display: none;" data-id="a0a75c1b-25f7-4101-b7ca-717e6a7434a9" data-type="original-input"></textarea><div class="emoji-wysiwyg-editor mw-ui-input text-area mention-area" data-id="a0a75c1b-25f7-4101-b7ca-717e6a7434a9" data-type="input" placeholder="Duduluu写下的只是Anno1800/test，得到的是我的吐槽。" contenteditable="true"></div><i class="emoji-picker-icon emoji-picker fa fa-smile-o" data-id="a0a75c1b-25f7-4101-b7ca-717e6a7434a9" data-type="picker"></i></div></div>
<div class="comment-list clear"><div class=" mw-ui-button mw-ui-primary site-button pull-right" id="tc_comment">发表</div>
<input type="hidden" name="action" value="purge">
<input type="hidden" name="pageId" value="2735">
<input type="hidden" name="commentid">
<input type="hidden" name="lastCommentId" value="0">
<input type="hidden" name="commentParentId">
<input type="hidden" name="cpage" value="1">
<input type="hidden" value="60d3d34d9d258f7b263d168fce6f2b6a5cf860ba+\\" name="token"></div></form></section>
<section id="hotcomments"></section><section id="allcomments"></section></section>																	</section><!-- /#bodyContent -->
          </article>
        

      </main>
    </div><!-- container -->

    <div class="bottom footer">
      <div class="container">
                                  <div id="siteNotice" class="site-notice">
            <div id="localNotice" dir="ltr" lang="zh-CN"><div class="mw-parser-output"><div class="row secondary quiet" style="font-siz:14px;margin:12px;padding:12px 0">
<div class="col-lg-4 col-md-4 col-sm-6 col-xs-12" style="padding-right:12px;margin-top:20px;">
<div style="font-size:20px; border-bottom: 2px solid #ccc; padding:6px; margin-bottom: 12px; overflow: auto;"><i class="fas fa-gamepad-o"></i>&nbsp;<a class="mw-userlink" rel="nofollow" title="灰机GAME" href="https://www.huijiwiki.com/wiki/%E7%94%A8%E6%88%B7:%E7%81%B0%E6%9C%BAGAME">灰机GAME</a></div>
<ul><li> <a target="_blank" rel="nofollow noreferrer noopener" class="external text" href="https://weibo.com/huijigame">在微博</a> </li>
<li> <a target="_blank" rel="nofollow noreferrer noopener" class="external text" href="https://www.zhihu.com/org/hui-ji-game/activities">在知乎</a> </li>
<li> 在公众号&nbsp;huiji_game</li></ul></div>
<div class="col-lg-4 col-md-4 col-sm-6 col-xs-12" style="padding-right:12px;margin-top:20px;">
<div style="font-size:20px; border-bottom: 2px solid #ccc; padding:6px; margin-bottom: 12px; overflow: auto;"><span class="icon-grid"></span>&nbsp;每日新闻</div>
<ul><li><a href="https://www.huijiwiki.com/wiki/%E6%96%B0%E9%97%BB:2019/05/31/%E5%A4%96%E5%9B%BD%E4%B8%BB%E6%92%AD%E7%8E%A9%E3%80%8A%E5%9C%A3%E5%A5%B3%E6%88%98%E6%97%97%E3%80%8B%E9%99%B7%E5%8D%B1%E6%9C%BA%EF%BC%8C%E4%B8%8D%E6%87%82%E4%B8%AD%E6%96%87%E4%B8%80%E8%84%B8%E6%87%B5%E9%80%BC" title="新闻:2019/05/31/外国主播玩《圣女战旗》陷危机，不懂中文一脸懵逼">外国主播玩《圣女战旗》陷危机，不懂中文一脸懵逼</a></li>
<li><a href="https://www.huijiwiki.com/wiki/%E6%96%B0%E9%97%BB:2019/05/31/%E3%80%8A%E4%BD%BF%E5%91%BD%E5%8F%AC%E5%94%A4%EF%BC%9A%E7%8E%B0%E4%BB%A3%E6%88%98%E4%BA%89%E3%80%8B%E5%AE%98%E5%AE%A3%EF%BC%8C%E7%B3%BB%E5%88%97%E7%BB%8F%E5%85%B8%E5%9B%9E%E5%BD%92" title="新闻:2019/05/31/《使命召唤：现代战争》官宣，系列经典回归">《使命召唤：现代战争》官宣，系列经典回归</a></li>
<li><a href="https://www.huijiwiki.com/wiki/%E6%96%B0%E9%97%BB:2019/05/29/%E3%80%8A%E5%9C%A3%E5%A5%B3%E6%88%98%E6%97%97%E3%80%8B%E7%99%BB%E4%B8%8ASteam%E7%83%AD%E9%94%80%E6%A6%9C%E7%AC%AC%E4%BA%8C%EF%BC%8C%E6%B5%B7%E5%A4%96%E7%8E%A9%E5%AE%B6%E5%BC%80%E5%A7%8B%E8%AF%B7%E6%84%BF%E5%87%BA%E8%8B%B1%E6%96%87%E7%89%88%E4%BA%86" title="新闻:2019/05/29/《圣女战旗》登上Steam热销榜第二，海外玩家开始请愿出英文版了">《圣女战旗》登上Steam热销榜第二，海外玩家开始请愿出英文版了</a></li></ul>
</div>
<div class="col-lg-4 col-md-4 col-sm-6 col-xs-12" style="padding-right:12px;margin-top:20px;">
<div style="font-size:20px; border-bottom: 2px solid #ccc; padding:6px; margin-bottom: 12px; overflow: auto;"><span class="icon-huiji"></span>&nbsp;关于</div>
<ul><li><a href="http://mediawiki.org" target="_blank" rel=" noreferrer noopener"><img alt="Mediawiki-logo 18px.png" src="https://huiji-thumb.huijistatic.com/www/uploads/thumb/5/56/Mediawiki-logo_18px.png/46px-Mediawiki-logo_18px.png" srcset="https://huiji-public.huijistatic.com/www/uploads/5/56/Mediawiki-logo_18px.png 1.5x" data-file-width="51" data-file-height="18" width="46" height="16"></a>&nbsp;灰机是一个由MediaWiki驱动的维基农场</li>
<li><a href="http://semantic-mediawiki.org" target="_blank" rel="nofollow noreferrer noopener"><img alt="Smw button 18px.png" src="https://huiji-thumb.huijistatic.com/www/uploads/thumb/f/f1/Smw_button_18px.png/46px-Smw_button_18px.png" srcset="https://huiji-public.huijistatic.com/www/uploads/f/f1/Smw_button_18px.png 1.5x" data-file-width="51" data-file-height="18" width="46" height="16"></a>&nbsp;灰机是全球最大的语义维基平台之一</li>
<li><a href="https://www.huijiwiki.com/wiki/%E9%A6%96%E9%A1%B5" title="h:首页"><img alt="Dragon pit logo xs white 18px.png" src="https://huiji-public.huijistatic.com/www/uploads/6/6e/Dragon_pit_logo_xs_white_18px.png" data-file-width="107" data-file-height="18" width="107" height="18"></a>&nbsp;「龙穴」分布式架构</li></ul>
</div>
</div>
<p><!-- 
NewPP limit report
Cached time: 20190605084705
Cache expiry: 0
Dynamic content: true
[SMW] In‐text annotation parser time: 0 seconds
CPU time usage: 0.037 seconds
Real time usage: 0.055 seconds
Preprocessor visited node count: 68/1000000
Preprocessor generated node count: 351/1000000
Post‐expand include size: 1033/2097152 bytes
Template argument size: 460/2097152 bytes
Highest expansion depth: 3/40
Expensive parser function count: 0/100
ExtLoops count: 0/100
-->
<!--
Transclusion expansion time report (%,ms,calls,template)
100.00%    2.492      1 -total
</p>
<pre>89.77%    2.237      3 模板:Newsnoticeul
</pre>
<p>-->
</p>
</div>
</div>							</div>
                    <footer>
          <p class="text-center quiet">
            <a class="mw-ui-anchor mw-ui-progressive" href="https://www.huijiwiki.com/wiki/%E7%81%B0%E6%9C%BA%E5%81%9C%E6%9C%BA%E5%9D%AA">灰机停机坪</a> |
            <a class="mw-ui-anchor mw-ui-progressive" href="https://www.huijiwiki.com/wiki/%E7%BB%B4%E5%9F%BA%E5%AE%B6%E5%9B%AD%E8%AE%A1%E5%88%92">维基家园计划</a> |
            <a class="mw-ui-anchor mw-ui-progressive" rel="nofollow" href="https://www.huijiwiki.com/wiki/%E5%AE%87%E5%AE%99%E5%B0%BD%E5%A4%B4%E7%9A%84%E7%81%B0%E6%9C%BAwiki">关于灰机wiki</a> |
            <a class="mw-ui-anchor mw-ui-progressive" rel="nofollow" href="https://www.huijiwiki.com/wiki/%E7%81%B0%E6%9C%BAwiki:%E4%BD%BF%E7%94%A8%E6%9D%A1%E6%AC%BE%E5%92%8C%E5%86%85%E5%AE%B9%E5%A3%B0%E6%98%8E">使用条款和声明</a> |
            <a class="mw-ui-anchor mw-ui-progressive" rel="nofollow" href="https://www.huijiwiki.com/wiki/%E7%81%B0%E6%9C%BAwiki:%E7%94%A8%E6%88%B7%E7%BC%96%E8%BE%91%E6%9D%A1%E6%AC%BE">编辑条款</a> | 
            <a class="mw-ui-anchor mw-ui-progressive" href="https://www.huijiwiki.com/wiki/%E5%95%86%E5%8A%A1%E5%90%88%E4%BD%9C">商务合作</a><br>Powered by
            <a class="mw-ui-anchor mw-ui-progressive" rel="nofollow" href="https://mediawiki.org">MediaWiki</a> <a class="mw-ui-anchor mw-ui-progressive mw-ui-quiet" rel="nofollow" href="https://www.miitbeian.gov.cn/">京ICP备15015138号</a> <a class="mw-ui-anchor mw-ui-progressive mw-ui-quiet" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11010802025154&amp;token=651a3142-c427-419d-af96-0e3988c05b2f">京公网安备 11010802025154号</a></p>
        </footer>
      </div><!-- container -->
    </div><!-- bottom -->
  </div>

</div>
`;
}
