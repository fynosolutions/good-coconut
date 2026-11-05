---
target: melomelo-us-locations-分析
p1_count: 2
max_score: 40
p0_count: 0
total_score: 20
na_heuristics:
target_identity: "url:https://www.melomelo.us/locations"
timestamp: 2026-11-05T10-58-17Z
slug: www-melomelo-us-locations
---
Method: dual-agent (A: /root/locations_sections · B: /root/two_page_technical)

# melomelo-us-locations-分析

评估对象：https://www.melomelo.us/locations 。日期：2026-11-05。独立评估者：locations_sections；本稿完成前没有读取任何检测器结果。本报告随后合并了独立技术检查，见相应章节。

结论：这是一张有鲜明品牌风格的门店画册，但作为“现在找到一家店并出发”的工具，效率与可靠性明显落后于视觉完成度。珊瑚粉、深椰绿、手写地名、真实空间照片形成可识别的甜品品牌语言；然而搜索与定位在本次环境中始终禁用、十家门店展开约一万像素、不同地址共享同一个地图链接，使最重要的到店任务产生障碍。

## 检查范围与证据边界

使用独立 Edge 浏览器会话，以 1440×1000 桌面和 390×844 移动视口检查。页面实际呈现简体中文，但保留英文地名、Location、Google Maps 与英文页脚标题。初次 open 成功不等于 SPA 内容已加载；已等待真实门店内容，滚动触发动画，再逐区截图。首次移动截图捕获了菜单退出动画，已经全部重拍并逐张肉眼复核。浏览器已关闭。

所有可见主区块、十家门店和页脚均检查；“覆盖全页”不意味着完成支付、登录或所有外链端到端测试。测试了城市字符串 Irvine、邮编 92618 与 Enter、移动菜单开关、页脚“认识我们”“顾客服务”稳定展开及“网站条款”点击尝试。没有提交订阅、登录、购物、联系方式；没有授予真实位置；地图只核对十个链接目标，未验证外部 Google Maps 最终落点。没有观察到页内地图、地区筛选、距离排序、门店详情弹窗或营业状态徽章，不能据此推断后台不存在这些能力。

证据：`desktop-snapshot.txt`、`desktop-measurements.json`、`mobile-snapshot.txt`、`mobile-measurements.json`、`search-zip-state.txt`、`styles.json`。文件均在本稿同目录。

## 全区块覆盖清单

| 编号 | 区块与目的 | 桌面 / 移动证据 | 覆盖与交互 |
|---|---|---|---|
| L01 | 最低订单公告：线上购买条件 | desktop-top.png / mobile-top.png | 两端检查文字与关闭入口；未单独点击公告关闭 |
| L02 | 全局导航与品牌标识 | desktop-top.png / mobile-menu.png | 桌面链接与图标；移动菜单实际开关，未进入购物/登录 |
| L03 | 面包屑与标题：识别所在页面 | desktop-top.png / mobile-top.png | 两端完整检查 |
| L04 | 地址/邮编搜索与当前位置 | desktop-top.png / search-zip-state.txt | Irvine、92618、Enter 实测；搜索及定位仍 disabled |
| L05 | 十家门店连续图文区 | desktop-store01.png、desktop-block-2 至 10.png / mobile-block-1 至 10.png | 每家内容、图片、地址、时间、地图链接均核对，见下表 |
| L06 | 订阅、说明与社交入口 | desktop-block-11.png / mobile-block-10、11.png | 两端可见内容；未提交邮箱或访问社交外链 |
| L07 | 分组页脚、法律与版权 | desktop-block-11.png / mobile-footer-open.png、mobile-footer-services-terms.png | 认识我们、顾客服务展开已确认；网站条款仅点击尝试，桌面法律链接全列可见 |
| L08 | 固定无障碍入口 | 多张截图右下角 | 视觉位置检查；未对工具内功能或读屏器作完整测试 |

完整长图：[桌面](<evidence/locations/desktop-full.png>)、[移动](<evidence/locations/mobile-full.png>)。移动长图为“认识我们”展开状态，顾客服务展开另有证据，网站条款未取得稳定展开截图，避免把不同状态混称默认页。

## L01：公告条

深酒红底、白字，强调“200美元的最低订单金额”，右上有关闭。桌面约 70px 高，与下方约95px的粉色导航形成强烈横向品牌带。移动换行，字级较小，公告仍占据最先被看见的位置。

优点是交易条件透明；问题是到店用户第一眼读到的是线上最低消费，可能把线上限制误会成门店限制。原文已写“官网”，因此不是完全未限定，但在查店任务里仍有认知摩擦。GOOD COCONUT 可以保留全站公告机制，门店页优先呈现营业变更、到店说明，或把线上限制写成更直接的“仅适用于官网配送订单”。

## L02：导航与移动菜单

桌面三条主导航（美味菜单、门市据点、品牌故事）位于左侧，大字标居中，搜索、账户、购物袋、语言在右侧。粉色背景把页头和品牌包装连在一起。滚动早段观察到导航继续可见，后段截图不一直保留，不能将它报告为全程固定导航。

移动页头压缩成汉堡、横向字标和购物袋；菜单展开为全屏珊瑚粉，居中字标、产品搜索、三条主链接、会员登入与底部语言。开合可用，但有明显分段淡入淡出，检查需等待动画结束；这也让频繁进出的用户多等一拍。菜单关闭按钮在无障碍快照中是无名 button，属于可访问命名风险，完整读屏结果仍未测试。

GOOD COCONUT 可借鉴三条任务级主导航与居中品牌字标；菜单关闭应有明确可访问名称，动画需足够短，且尊重减少动态偏好（此偏好未实测）。

## L03：标题与面包屑

面包屑在桌面左侧约 x76，移动 x26。中间先用粉色手写 “Location”，再用深绿中文主标题“来这边可以找到我们”。标题桌面 60px，移动30px；中文采用 Noto Serif SC，英文装饰文字采用 Rage，门店标题采用 Yeseva One。

白底和大留白让语气友好，不像冰冷目录。问题是内容比实际任务更像品牌开场：桌面第一家门店标题约 y928，移动约 y995，第一次到访用户在首屏读不到第一家的完整地址/营业时间。GOOD COCONUT 可保留一句温暖标题，但应让最近/选中的店名、当前营业状态与导航按钮尽量进入首屏。

## L04：搜索与定位

桌面搜索胶囊约400×60px，右侧深绿定位按钮；移动二者仍横排，搜索框实际文字输入区域约137px宽。视觉上是全页最明确的行动入口，定位按钮有图标和中文文字。

本次进入页面后，搜索按钮与“使用目前位置”在 DOM 中都为 disabled；输入 Irvine 后未启用，再输入 92618 并按 Enter，十家列表未减少、未出现距离/提示，两个按钮继续禁用。这里报告的是本次环境真实观察，不推断一定由站点代码、Google 服务或网络哪一项造成。关键设计缺口是禁用看起来仍像正常深绿主按钮，而且没有“正在准备定位”“服务暂不可用”或替代方案。

目前唯一可靠的替代路径是继续向下滚动逐店找地址。搜索失败没有恢复建议，整页也没有可见地区索引。GOOD COCONUT 应优先保证基本城市/门店名本地筛选即便第三方地图不可用仍能运行；定位等待、失败、拒绝授权各给明确反馈，并保留“查看全部门店”。

## L05：十家门店图文区

共用构图：桌面左右交错，两侧各保留约48px外边距；照片约560×700px，信息栏约480px宽，每家纵向节奏约855–891px。偶数门店后方有浅奶油色宽背景，部分角落穿插粉色/薄荷色有机图形。粉色超大手写店名压住照片上边界，深绿色32px店名在信息栏再出现一次；细分隔线下面是地址、电话、营业时间，最后是深酒红 Google Maps 按钮。它没有传统圆角卡片外壳，编辑式图文节奏比模板式卡片阵列更有品牌辨识度。

移动改为统一“照片→居中店名→分隔线→三类信息→地图按钮”，左右20px，照片宽350px。店名20px，地图按钮170×44px，长地址自然换行，检查没有横向溢出（documentElement.scrollWidth=390）。移动通常每店约837–889px，整页默认折叠页脚时约9959px。图像优先让营业时间和导航推到第二段，对“正在路上”的用户不友好。

| 序号 | 门店 / 视觉差异 | 页面营业时间（归一化抄录，非现实营业核验） | 地图及特别观察 |
|---|---|---|---|
| 1 | City of industry；右图是两罐甜品，非店铺入口 | 每日08:30–16:00 | 地图链接存在；产品照不能帮助认门 |
| 2 | San Gabriel；左图白色桌椅与柜台 | 日–四11:00–22:00；五–六11:00–23:00 | 独立地图链接；浅奶油底 |
| 3 | Rowland Heights；右图粉红墙、彩色椅子 | 一–四11:00–22:00；五–日11:00–23:00 | 独立地图链接；超长手写名在桌面接近右边界 |
| 4 | Ktown；左图展示柜、屏幕与彩绘墙 | 日–四11:00–22:00；五–六11:00–23:00 | 独立地图链接；地名缩写要求本地知识 |
| 5 | Sawtelle；右图玻璃门与门面细节 | 一–五12:00–22:00；六–日11:30–22:00 | 与 Irvine 共享完全相同 maps.app.goo.gl/89m9exs6LjnmXUqK8 |
| 6 | Irvine；左图黑白地砖与粉色柜台 | 每日11:00–22:00 | 地址14775 Jeffrey Rd，与Sawtelle不同但地图链接相同，至少一项需要核对 |
| 7 | UTC；右图灯具、柜台与浅粉椅子 | 一–六10:00–21:00；日11:00–21:00 | 独立链接；仅写UTC，未直接展开商场/地区名称 |
| 8 | Del Mar；左图绿天花、木墙与柜台 | 日–四11:00–21:00；五–六11:00–22:00 | 独立链接；图片alt误写“两罐甜品”，实际是店内空间 |
| 9 | Cupertino；右图蓝色屏幕与木天花 | 一–四12:30–21:30；五–日12:00–21:30 | 独立链接；中文页面此处混入PM，格式不同 |
| 10 | Milpitas；左图木墙、粉柜台和店内标识 | 一–四09:00–21:30；五09:00–22:00；六11:00–22:00；日11:00–21:30 | 独立链接；最长时间文案，移动3行以上但未截断 |

十家均显示地址、电话、营业时间与地图按钮。全页没有 tel: 链接，电话是文本，因此移动用户无法靠站内链接直接拨号。所有地图链接先经过 /hang-tight?url= 中转；本评估没有点击验证中转和外部地图落点。Sawtelle（2002 Sawtelle Blvd, Los Angeles）与 Irvine（14775 Jeffrey Rd, Irvine）的链接完全相同是已确认的数据异常，不能在未经外部验证的情况下指定哪家错误。

优点：实景照片建立真实经营信任，重复字段顺序可预测，地图行动位置一致，深色按钮足够突出。问题：十家全量展开没有城市索引，比较两家需往返大量滚动；每店双重店名加大图消耗高度；没有“当前营业中”、距离和门店类型说明。并非每项都必须上线，但“快速选店”应压过“看十张照片”。

GOOD COCONUT 可采用紧凑门店列表与选中门店详情并行；保留精选大图，先展示店名、地区、今日营业时间、导航和电话。地图地址应绑定唯一门店数据并人工抽验，图片alt与具体门店匹配。

## L06：订阅与社交

大粉色波浪从门店区域转入页脚，Let’s stay in touch. 为英文衬线标题（桌面40px、移动28px）。胶囊邮箱框与嵌入式订阅按钮构成一个完整动作，下面中文解释确认邮件、商业信息、隐私与退订，随后Instagram和Facebook图标。

它让长页有柔和的品牌收尾，许可与退出文案也可见。代价是核心任务尚未被高效完成就切换到营销订阅；附近无“还有疑问/选哪个门店”的情境帮助。此处只检查呈现，不评价订阅验证和成功状态。GOOD COCONUT 应将订阅保留为次要收尾，在它之前给找店相关的帮助或电话。

## L07–L08：页脚与无障碍入口

桌面页脚右侧三列为“认识我们”（六项）、“顾客服务”（三项）、“网站条款”（四项），左侧订阅形成四列布局。移动转为三条水平分隔的折叠行；认识我们和顾客服务已实际展开并确认，网站条款点击后未取得稳定展开状态，不能算作交互通过。顾客服务含联络、FAQ、追踪订单；桌面网站条款列含使用条款、隐私、Cookie、无障碍；移动版权置底居中。移动折叠把十三项链接先归为三组，是正确的信息压缩。

固定深绿无障碍圆按钮在右下。它可见且稳定，但不能据此宣布整个网站可访问；菜单关闭无名、部分图像alt错误等仍需要原生语义修复。手机右下按钮有时接近页脚订阅/内容区域，应避免覆盖关键文字和点击目标。GOOD COCONUT 借鉴分组折叠页脚，同时优先做好原生键盘、语义、对比与触控目标。

## 设计语言与可借鉴原则

实际 CSS 主要颜色：深绿 #004D44；珊瑚粉 #E37370；深酒红 #370101；浅粉 #FDD3DC；白色为大面积背景。英文手写 Rage、门店标题 Yeseva One、中文标题 Noto Serif SC，正文含 Kadwa 与中文后备字体。字体层次给品牌温暖、精致、略复古的甜点气质。不是任意 SaaS 页面替换Logo即可成立的风格；但10店交错陈列的结构仍是通用品牌画册方法，地点功能没有同等定制。

最值得学的三点：品牌色与店铺实景互相印证；字段顺序固定且行动按钮稳定；桌面有足够留白而移动能完整重排。最不应照搬的是把十家门店全部做成近一屏大图，以及让不可用的功能保持“可点击”的外观。

## 认知负担、旅程与人物

首页头部任务被分为3个主导航与工具组，分组合理。页面查店起点只有地址输入与定位两个选择，理论负担低；实际两者不可用之后，用户被迫在10家完整展开门店间搜寻。虽然并非同屏10选项，不应机械称作“同屏超载”，但缺少目录造成滚动与记忆负担。移动菜单有3个主链接，加会员、搜索、语言，分组后可理解；页脚“认识我们”展开有6项，高于4项舒适区，但属于次级信息，优先级低。

旅程：温暖品牌开场→搜索产生期待→无反馈出现低谷→实景与明确地址恢复部分信任→长距离滚动产生疲劳→Google Maps 提供离站行动→粉色订阅页脚形成柔和结束。最大的情绪低谷在搜索不可用，而最高任务价值应是“我知道哪家店现在适合去”。

- Jordan 首次访客：会把深绿定位按钮当成已可用入口；没有原因解释容易误判自己的操作。
- Casey 路上手机用户：每店先过350px宽照片；找营业时间和电话需要滚动，电话又不是拨号链接。
- Sam 依赖辅助技术：关菜单按钮无可访问名称、Del Mar 图片alt与实景不同是明确风险；完整Tab顺序、焦点圈、读屏播报、200%缩放未测试，不能当成已通过。

## Nielsen 十项评分（0–4）

| 项 | 分数 | 本次依据 |
|---|---:|---|
| 状态可见性 | 1 | 搜索/定位禁用没有面向用户的原因或状态解释 |
| 现实世界匹配 | 3 | 地址、电话、时间可读；UTC/Ktown缩写和混合时间格式降低直觉性 |
| 控制与自由 | 3 | 移动菜单可关闭、折叠组可切换；核心筛选无可用状态供更多验证 |
| 一致性与规范 | 3 | 10家共用清楚模式；时间格式、地图数据和图像alt有偏差 |
| 错误预防 | 1 | 两家不同地址对应同一地图目标，存在误导出行风险 |
| 识别胜于回忆 | 2 | 门店内字段可见，但无地区索引/距离，跨店比较需记忆 |
| 灵活性与效率 | 1 | 约一万像素列表，搜索不可用，电话无tel链接 |
| 审美与简洁 | 3 | 视觉统一、空间从容；图片优先与重复大标题稀释任务信息 |
| 错误恢复 | 1 | 搜索无结果变化也无原因、替代路径或恢复说明 |
| 帮助与文档 | 2 | 页脚有FAQ与联络入口，未验证其内容，也无查店情境帮助 |
| 总计 | **20/40，50%：可接受但需显著改进** | 功能型门店定位页，10项均适用；未测能力不计作通过 |

分数是本次界面观察的设计判断，不是生产可用性统计，也不以未执行的支付、订阅、权限流程为依据。

## 优先改进

1. **P1：恢复找店入口，并解释不可用状态。** 至少保证城市/邮编基本查找可用；定位出错时显示原因和继续浏览全部门店的路径。
2. **P1：纠正地图地址绑定。** 首先核对Sawtelle与Irvine的重复目标，再逐店验收地图入口；验收依据是地图店名/地址与卡片一致。
3. **P2：缩短移动查店路径。** 增加区域索引或紧凑列表，重要字段与导航优先，大图作为详情；不必取消品牌照片。
4. **P2：完成到店动作与信息规范。** 电话做tel链接，时间格式统一，补充当前营业状态/特殊营业说明时明确时区与数据维护方式。
5. **P2：修正语义和内容细节。** 为关闭按钮命名、逐店核对alt、补全UTC/Ktown的地区语境，避免无障碍浮钮侵入关键目标。

## 独立技术检查与综合结论

技术评估在设计评估冻结后才合并；设计评估者未读取检测器结果。

- **已确认，P1：查店入口不可用。** 完整加载后，输入 Irvine、有效邮编 92618 并按 Enter，十家列表未筛选，搜索和当前位置按钮仍 disabled，且没有原因说明。桌面和手机均复现；根因与其他地区网络的表现未确定。
- **已确认，P1：地图目标重复。** Sawtelle 和 Irvine 地址不同，却经中转链接指向同一个 `maps.app.goo.gl/89m9exs6LjnmXUqK8`。应逐店核对链接；没有解析最终地图落点，因此不指定哪一家链接错误。
- **已确认，P2：主内容语义与跳转缺失。** `Skip to Main Content` 指向不存在的 `#main-content`，页面也没有 `main` landmark。对十家长列表而言，失效的快捷跳转尤其影响键盘浏览。建立真实主内容区域并让跳转转移焦点。
- **已观察，需修正语言声明。** 本次内容为中文，但根元素 `lang=en`；应同步页面语言。没有穷尽检查所有嵌套语言覆盖。
- **确认的正面结果：** 两个视口均没有整页横向溢出；门店有真实标题，地图是原生链接，移动地图按钮约 170×44px。

| 检查 | 桌面 1440×1000 | 手机 390×844 |
|---|---|---|
| Impeccable URL 扫描 | 单次扫描返回空数组，退出码 0；不代表功能或无障碍全部通过 | 未重复单独运行 URL 扫描 |
| axe 已报告问题类别 | 3 类：缺主区域、内容未归入地标、跳转目标不存在 | 同样 3 类 |
| 对应受影响节点数 | 1 / 88 / 1 | 1 / 84 / 1 |
| axe 待人工复核类别 | 3 | 1 |
| axe 通过规则数 | 41 | 40 |

节点和规则存在重叠，不能把这些数量相加成 90 或 86 个独立缺陷。对比度以及桌面页脚 ARIA 的 incomplete 结果未提升为已确认失败。即时 Escape 快照不足以确认菜单无法关闭；本报告不作该断言。44px 操作区是舒适度建议，不等于所有情境下的强制标准。

**合并后的优先顺序：** 先修复查店入口与地图数据，再用地区索引或紧凑列表缩短找店路径；随后补电话链接、统一营业信息、修正主内容跳转与标签。品牌照片与交错构图可以保留。

## 关键截图

![桌面首屏](<evidence/locations/desktop-top.png>)

![门店图文布局](<evidence/locations/desktop-block-5.png>)

![手机首屏](<evidence/locations/mobile-top.png>)

## 全部截图与原始证据索引

文件名与上面的覆盖表对应。每个截图均可单独打开。

- [desktop-block-10.png](<evidence/locations/desktop-block-10.png>)
- [desktop-block-11.png](<evidence/locations/desktop-block-11.png>)
- [desktop-block-2.png](<evidence/locations/desktop-block-2.png>)
- [desktop-block-3.png](<evidence/locations/desktop-block-3.png>)
- [desktop-block-4.png](<evidence/locations/desktop-block-4.png>)
- [desktop-block-5.png](<evidence/locations/desktop-block-5.png>)
- [desktop-block-6.png](<evidence/locations/desktop-block-6.png>)
- [desktop-block-7.png](<evidence/locations/desktop-block-7.png>)
- [desktop-block-8.png](<evidence/locations/desktop-block-8.png>)
- [desktop-block-9.png](<evidence/locations/desktop-block-9.png>)
- [desktop-full.png](<evidence/locations/desktop-full.png>)
- [desktop-measurements.json](<evidence/locations/desktop-measurements.json>)
- [desktop-snapshot.txt](<evidence/locations/desktop-snapshot.txt>)
- [desktop-store01.png](<evidence/locations/desktop-store01.png>)
- [desktop-top.png](<evidence/locations/desktop-top.png>)
- [mobile-block-1.png](<evidence/locations/mobile-block-1.png>)
- [mobile-block-10.png](<evidence/locations/mobile-block-10.png>)
- [mobile-block-11.png](<evidence/locations/mobile-block-11.png>)
- [mobile-block-2.png](<evidence/locations/mobile-block-2.png>)
- [mobile-block-3.png](<evidence/locations/mobile-block-3.png>)
- [mobile-block-4.png](<evidence/locations/mobile-block-4.png>)
- [mobile-block-5.png](<evidence/locations/mobile-block-5.png>)
- [mobile-block-6.png](<evidence/locations/mobile-block-6.png>)
- [mobile-block-7.png](<evidence/locations/mobile-block-7.png>)
- [mobile-block-8.png](<evidence/locations/mobile-block-8.png>)
- [mobile-block-9.png](<evidence/locations/mobile-block-9.png>)
- [mobile-footer-open.png](<evidence/locations/mobile-footer-open.png>)
- [mobile-footer-open.txt](<evidence/locations/mobile-footer-open.txt>)
- [mobile-footer-services-terms.png](<evidence/locations/mobile-footer-services-terms.png>)
- [mobile-footer-services-terms.txt](<evidence/locations/mobile-footer-services-terms.txt>)
- [mobile-full.png](<evidence/locations/mobile-full.png>)
- [mobile-measurements.json](<evidence/locations/mobile-measurements.json>)
- [mobile-menu.png](<evidence/locations/mobile-menu.png>)
- [mobile-snapshot.txt](<evidence/locations/mobile-snapshot.txt>)
- [mobile-top.png](<evidence/locations/mobile-top.png>)
- [search-zip-state.txt](<evidence/locations/search-zip-state.txt>)
- [styles.json](<evidence/locations/styles.json>)

[独立技术检查记录](<evidence/locations/technical/assessment-b.md>)

[原网页](https://www.melomelo.us/locations)

## 运行记录与适用范围

目标标识：`www-melomelo-us-locations`。未发现适用的忽略清单。设计与技术评估使用隔离上下文；技术结果在设计判断完成后才合并。没有安装用户可见检测覆盖层，使用渲染页面扫描、DOM、axe 和截图作证据；没有遗留临时服务，独立浏览器均已关闭。截图和原始记录有意保留，便于复核。

这是该页面的首次报告，尚无纵向趋势。没有购买、提交订阅/联系表单或请求真实定位；营业时间仅记录网页当时展示，不作为出行前的实时营业确认。完整覆盖指所有可见内容区块，不等于穷尽所有语言、设备、外部地图或异常状态。

本报告为分析成果，未进入网站改版流程；不需要追加采访即可阅读和使用。
