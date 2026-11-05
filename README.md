# Good Coconut — Wave 独立版本

最新首页与 Gallery 预览：双击 `Preview-Gallery.cmd` 打开本地 4192 端口的拼贴墙。首页优先展示产品，缩短手机首屏；十张用户提供的照片与一段可播放品牌视频已接入，原照片带和两排八张拼贴保留。更多照片可按需展开。修改说明与验证记录见 [Gallery 说明](docs/GALLERY.md)，视觉预览见 [本轮截图](docs/updates/real-media/README.md)。本轮更新尚未合并或部署至生产环境。

完整参考与调查见 [研究索引](docs/research/README.md)，包括 Pearly、MeloMelo、本站对照评审，以及用户指定的 Memoria Visuals / LiCoWa 美食剪贴簿参考。

视觉与内容布局参考见 [MeloMelo 三页面分析](docs/research/melomelo/README.md)，包含 Menu、Locations、Brand 独立报告及桌面/手机截图证据。

最新交付与上线状态见 [2026 年 11 月 5 日网站更新汇报](docs/PROJECT-NOTES-2026-11-05.md)。该汇报记录当前已发布版本；下文包含历次工作记录，最终状态以汇报为准。

## 菜单页面（2026-11-05）

新增 `/menu/`，沿用薄荷绿、椰肉白、Poppins、标题投影、波浪及原品牌图案。主导航 Menu 与首页产品入口均连接新页面。双击 `Preview-Menu.cmd` 可构建并直接打开菜单预览。

菜单内容来自 Flushing 的 Chowbus 店铺 15247：11 品类、88 商品、81 张本地原图；保留临时售罄商品，不显示售罄或库存状态。未配图商品使用品牌文字占位。英文与中文名称、说明、容量、价格与详情选项照录来源；未补写缺失说明。此为采集快照，不自动同步。Manhattan 保留独立菜单链接。

桌面侧边分类导航、手机横向分类栏、中英文搜索及无结果重置、原生商品详情弹窗（支持 Escape、焦点返回），无 JavaScript 时仍可浏览全部菜单并展开详情。点单继续跳转对应 Chowbus 页面，不在本站处理购物车或付款。

维护：`menu-content.json` 为结构化内容，`menu.mjs` 生成页面，`public/menu.css` 与 `public/menu.js` 管理样式和交互，图片在 `public/assets/menu/`。执行 `npm run build` 生成全部四页。已通过 `node qa-menu.mjs` 的 320/390/768/1024/1440 五种宽度、图片完整性及交互验证，结果与截图在 `qa/menu/`；现有 `npm test` 的 8 项测试通过。本次修改尚未发布。

Vercel 部署配置和联系表单云端入口已就绪，部署说明见 [DEPLOYMENT.md](DEPLOYMENT.md)。仓库为 `fynosolutions/good-coconut`（私有）。浏览器检查依赖现在由本项目 package.json 管理；旧文档中相邻目录依赖及仅本地预览描述为历史记录。

最新照片带交互：移除 Pause photos 按钮，自动连续循环；鼠标悬停单图放大至 1.14 倍并暂停，移开继续，键盘聚焦暂停。保留减少动态偏好和手机横向浏览。已检查循环衔接、放大及移开继续，截图见 `qa/updated/gallery-hover.png`。下方有关暂停按钮的描述为早期版本记录。

## 最新更新：地图与联系表单

Visit us 门店卡片下方新增 Flushing Google 互动地图及路线按钮，依据原站 https://www.goodcoconutusa.com/contact-us 的地址及位置资料（40.7571727, -73.8293161）重建；原 Wix 地图包装依赖原站运行环境，因此这里使用 Google Maps 嵌入。已实际确认地图显示 Good Coconut 好好椰及 41-28 Main St T6 地址。服务端 CSP 仅新增允许 https://www.google.com 的 iframe。

按用户要求，Contact 已恢复姓名、邮箱、主题、留言表单，邮箱和留言必填。保留同源接口、空留言校验、失败保留输入和邮件备用链接。邮件服务仍未配置，当前提交会明确提示未发送；真实送达仍需完成配置与收件验收。下方“撤下表单”描述为此前版本记录，已被本次恢复覆盖。

## 当前检查修订（2026-11-04）

首页产品文案及标题已精简，修正品牌名称，收紧产品间距；手机端太阳装饰进入正常文档流，避免遮挡正文。手机顶部保留常驻 Order online，首页主按钮统一为 Order online；门店页顶部直接提供两家 Chowbus 订餐入口。曼哈顿营业时间和社交账号文字维持原状。

联系页当前使用直接邮件入口，点击 Write an email 打开访客邮件应用，也显示可复制的邮箱。未配置的站内表单已撤下，不再让访客填写后失败。原服务端邮件适配器仍保留，新增非空留言校验；若未来恢复表单，需前端同步设为必填并完成真实送达验收。下方早期表单描述为历史实现记录。

当前验证：`npm test` 覆盖 7 项接口测试；`node qa-review.mjs` 验证三个页面 × 五种宽度、手机装饰避让、常驻下单入口、两家订餐链接、菜单焦点循环及无 JS 邮件入口。最新截图与结果位于 `qa/updated/`。

本版本按本次 grilling 确认的需求制作。现有 `good-coconut-homepage` 工程、版本包和 Sites 绑定未修改。本次仅本地预览，没有部署或切换正式域名。

## 预览

Windows 双击 `Preview.cmd`，会在后台启动 Node 服务并打开浏览器。使用 `Stop-Preview.cmd` 关闭由启动器建立的服务。

或在此目录终端执行：

```powershell
npm start
```

打开 http://127.0.0.1:4185/ 。终端方式按 Ctrl+C 停止。需要 Node.js 22+；网站运行没有第三方 npm 依赖。不要直接双击 HTML，站点路由和表单需本地服务。

- `/` 首页：真实产品海滩图、品牌介绍、三组产品、八图连续照片带、两店订餐入口。
- `/online/` 门店／订餐：地址、官网电话、Flushing 营业时间、地图方向、两家独立 Chowbus 链接。
- `/contact-us/` 联系：原站姓名、邮箱、主题、留言字段；邮箱必填，其他保持可选。

## 内容与视觉

沿用原站 Logo 和真实照片；新版本不使用此前 AI 提取的产品组合图。Poppins 字体与许可文件本地保留。首页主图及照片带提供 WebP，原始素材仍保留。

薄荷绿、椰肉白、深青色，配浅紫与淡黄；波浪分区、大字号、拱形照片、少量滚动入场。照片带可暂停，鼠标悬停／键盘焦点时暂停；触屏操作转为手动浏览，减少动态模式默认暂停。标题、正文与按钮组依次向上跳入并轻微回弹；椰子、太阳、品牌贴纸和门店箭头带缩放旋转弹入。滚动到对应元素时只播放一次，组内错峰 90ms，图标稍后进入。减少动态模式禁用跳入并取消正在运行的效果，键盘聚焦时立即完成相关动效。移动导航支持 Escape、焦点返回、焦点循环及切换桌面时解除滚动锁。无 JavaScript 仍能浏览内容、访问导航并提交标准表单。

## 邮件发送配置（尚未配置）

目前已实现服务端校验、长度限制、同源检查、蜜罐、每 IP 十分钟五次限制、发送中状态、重复提交抑制、失败保留输入与重试。原站 Wix 表单后台不是可直接复用的公开接口，本版本使用独立发送适配器。

当前适配器使用 Resend HTTP API，可在 `deliverMail()` 中替换服务商。将 `.env.example` 复制成 `.env`，在本机填入 `RESEND_API_KEY` 和已验证域名的 `MAIL_FROM`，重启服务。收件人默认 `goodcoconut01@gmail.com`；访客邮箱设为 Reply-To。密钥不进入前端，也不应提交版本库。

没有配置时，接口明确返回 503，页面提示通过公开邮箱联系；不会显示已发送。测试使用模拟发送函数，没有发出真实邮件。当前尚未验证真实邮箱送达。发送服务返回接收成功不等于收件箱到达，配置后仍需一次受控的实际收件验收。

邮件配置、真实收件测试和发布由后续步骤完成。内存限流与去重适用于单进程本地预览；多实例部署应改用共享存储或托管限流。生产反向代理需配置 `PUBLIC_ORIGIN`；若使用 Sites/Cloudflare，需把接口迁入 Worker，不能只部署 public 文件后宣称邮件可用。

## 修改与构建

`content.mjs` 是门店和联系方式的单一数据源；`build.mjs` 生成三个静态页面。编辑后执行 `npm run build`。布局与交互分别位于 `public/styles.css`、`public/app.js`；服务端位于 `server.mjs`。

## 验证

`npm test`：6 项接口测试（配置缺失、重复提交、输入校验／跨源／超长、服务失败与限流、无 JS 提交及页面路由、邮件 API 请求内容）。

`qa-browser.mjs`：本机 Edge 浏览器的 3 页面 × 5 视口检查，外加菜单、照片带、减少动态、门店链接、未配置表单与无 JS 回退。完整结果在 `qa/browser-results.json`，桌面及手机截图在 `qa/`。

浏览器 QA 使用 puppeteer-core，当前复用相邻旧工程已有的测试依赖（仅测试，不是网站运行依赖）。若单独移动本目录，先安装 `puppeteer-core` 并修改 QA import。没有报告 Lighthouse 分数或真实用户性能指标。

## 来源与资料差异

核实日期：2026-11-04。

- 品牌内容与图片：https://www.goodcoconutusa.com/ 。图片逐项地址见 `asset-sources.json`。
- 门店与订餐：https://www.goodcoconutusa.com/online 。两店使用各自原始 Chowbus 地址，未下单。
- 表单字段及 Flushing 时间：https://www.goodcoconutusa.com/contact-us 。原站表单未提交。
- 视觉参考：https://coconutglens.jp/ 及用户提供的技术分析文档；没有复制其品牌素材或经营信息。
- 邮件 API：https://resend.com/docs/api-reference/emails/send-email 。

按用户决定，展示电话和营业时间以品牌官网为依据。Flushing 显示 11:00–21:30，而 Chowbus 的接单截止时间不同；两者不合并。Manhattan 官网电话为 (929) 488-8858，Chowbus 号码不同，本版本采用官网号码。原站联系页明确指向 Flushing，未将共享页脚时间推定为 Manhattan 独立营业时间，故 Manhattan 提供电话咨询。

原站社交账号以文字列出，未核实到可迁移的真实外链，保留原账号文字；不猜测微信／小红书的链接。正式发布地址尚未确定，因此没有把原站域名错误写成新版 canonical，也未生成指向未知地址的 sitemap。

动效专项检查：执行 node qa-motion.mjs，验证三页面文字／图标跳入、只播放一次、动态偏好切换及无 JavaScript 可见性；结果见 qa/motion-results.json。


预览缓存修复：build.mjs 为 CSS/JS 自动添加内容哈希版本号，Preview.cmd 每次启动前重新构建页面。新启动的本地服务对静态资源使用 no-store；已运行的旧进程也会通过新的资源 URL 获取最新脚本。


首页 Logo 更新：已移除旧黄色中文贴纸，使用用户上传的原始 Logo 截图，以 SVG 切片沿弧线排布，保留原字形。资源为 public/assets/hero-logo-original.png。入场复现参考站 fl-fancy-jack-box：1.5 秒，scale(.1) rotate(30deg) → rotate(-10deg) → rotate(3deg) → scale(1)，底部中心为旋转原点。参考站首页 HTML 的 data-animation-duration 及布局 CSS 已核实；减少动态时静态显示。检查脚本 qa-brand.mjs 已通过桌面、320/390/768px 布局及关键帧检查。


Logo 后续调整：移除椭圆底色，SVG 色彩遮罩去除截图纸色；各断点显示尺寸扩大为此前两倍，静态顺时针旋转 30 度。入场动画在该角度基础上执行，结束保持 30 度。


Logo 色彩与位置：现为透明背景纯白 Logo，上移并在首屏图片区预留顶部间距，使 Logo 与杯盖分离；保持两倍尺寸、顺时针 30 度及原入场动画。


文字动效更新：参考 https://coconutglens.jp/ 的公开 HTML 动画配置与首页布局 CSS（fl-fade-in、fl-zoom-in、fl-rotate-up-right、fl-bounce-up）。首页主标题缩放、介绍淡入；故事标题旋入；三个产品标题分别缩放／右下旋入／上弹，正文分别侧滑／轻缩放／上移淡入。段落错峰 150ms，持续约 0.9–1.2 秒。正文保持完整段落。旋转和上弹幅度按本站布局收敛，未使用原站 3000px 的大位移。图标和白色弧形 Logo 原动效保留。未改写用户恢复的原站文案。



## 两店菜单（2026-11-05）

- `/menu/`：Flushing，保留 `menu-content.json` 中的 11 类、88 项商品和用户补充图片。
- `/menu/wall-street/`：Wall Street，`menu-wall-street.json` 中的 12 类、83 项（77 常规商品＋6 积分兑换）。取自该店 Chowbus 实际展示菜单；9 项隐藏商品不导入。
- `menu.mjs` 共用模板生成两套菜单，门店切换在当前页面局部更新菜单并保留滚动位置，不重新加载整页；通过 History API 保留可分享的门店地址。无 JS 时回退为正常页面链接，刷新／返回保留当前门店。详情按钮使用各店的点单链接，规格和加料价格来自对应门店。
- 华尔街原图位于 `public/assets/menu/wall-street/`；同名商品沿用用户提供的南瓜鸡蛋仔、焦糖、炼乳及桂花冻图。图片继续以 1:1 裁切填满。
- 积分兑换独立分类，展示积分和原页面列出的参考金额；不作为现金套餐合并。
- 菜单为静态采集数据，不实时同步库存；价格以各店点单页为准。
- 检查：`npm run build`、`npm run check`、`node qa-menu-locations.mjs`；浏览器结果保存在 `qa/menu/locations-results.json`。

菜单切换检查：`node qa-menu-switch.mjs` 验证手机和桌面普通动态模式下，切换全程滚动位置不变、文档／顶部／切换按钮节点保持原样；并验证返回／前进、详情点单链接、失败重试与快速反向切换。结果见 `qa/menu/switch-results.json`。

本次菜单更新包含用户补充的椰果、荔枝椰果和两店共用冰水杯图片；两店均已补齐商品图片。品类列表下方的点单按钮已删除，详情和页面其他点单入口仍按所选门店跳转。
