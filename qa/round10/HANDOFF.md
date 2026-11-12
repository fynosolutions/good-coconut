# 025 Good Coconut 首页 round 10 — 交接给 box 上的 Claude Code（2026-11-12）

写给：Grok Bot 云电脑上的 Claude Code（`claude -p --model opus`，effort high 或以上，用毛的 Max）。
来源：Mac 上 Website 棚的 Claude Code。毛 11-12 出门前口述的需求（原话意思在第 2 节）。这份是唯一说明，做之前整份读完。

## 0. 仓和分支

- 仓 `fynosolutions/good-coconut`，从 `round8-home` 分支（含本文件的那一版）拉出 **`bot/2026-11-12-025-hero-lineup`**，改动只推这个分支。
- **不要推** `round8-home`、`preview-original`、`main`。**不要部署**（不碰 Vercel）。上线由 Mac 审过后做。
- 拿不到仓（403/404）→ 停手，报错原文写进报告。
- 报告写到 `fynosolutions/cc-max-automations`（box 上 `/workspace/cc-max-automations`）的新文件 `domains/grokbot/out/bot_2026-11-12-025-hero-lineup.md`，可直推 main（只新建这一个文件）。

## 1. 怎么重建、怎么看

- 重建：仓根 `node build.mjs`。新加的图如果单张 >120KB，先 `python3 opt-images.py` 再 `node build.mjs`（它做 480/960 宽 webp，build 自动换 srcset）。
- **绝对不要跑** `round5/scripts/patch_site.py`、`round7-hero/scripts/patch_home.py`（不在这个仓，也别去找）：它们会把毛撤回的旧首页加回去。
- 看页面：`python3 -m http.server <端口> --directory public`。
- 检查程序（仓里 `qa/round8/`，Playwright Python）：`clip_scan.py public` 必须 `NO CLIPPED TEXT`；`cmp_blocks.py public <输出目录>` 比对首页搬来的四段和 /specialties/。
- 页面 CSP 只许同源脚本和样式：**不能写内联 `<script>` 和 `style=""`**，JS 里设 `el.style` 可以。新脚本写成 `public/` 里的文件。
- `build.mjs` 末尾有一段 11-12 加的后处理（符号转 SVG、小图 srcset、首页视频延迟加载、`head.js` 注入）。新内容里的箭头字符会被自动换成 SVG，不用手画。

## 2. 毛要的三件事（11-12 原意）

1. **Hero 加一条「产品线」**：像 Melo Melo 那样，让人一眼看到我们一整排产品。可以是一条从左往右（或右往左）一直慢慢移动的带子，**不要很大**。参考图：`qa/round10/sources/melo_home_part0.jpg`（Melo Melo 页头下那一排去底的罐子+分类名）、`melo_banner4_sheet.jpg`、`melo_banner5_sheet.jpg`。
2. **Hero 里要有一个固定展示新品的位置**：现在 hero 只放一款新品（柿子布丁罐），以后会一直换。毛问：对甜品店有没有更好的展示方式，可以一个一个切换，或者一条 banner。
3. **「王牌三款」里的生椰拿铁图和现开椰子图不好看**，换成更高清、效果更好的图。毛说可以拿原图去生成。

## 3. Mac 这边的推荐做法（照这个做；你觉得有更好的，在报告里写清理由，别自己换方向）

### 3.1 新品位 = hero 主图变成「新品轮换」
- hero 版式不动（左字右图、圆形大图、指示线标签、橙色贴纸）。右边大图位改成新品轮换：数据放 `content.mjs` 一个列表（每项：英文名、中文名、一句说明、图、指示线两个标签的文字），**以后换新品只改这个列表**。
- 柿子季三款用真实棚拍图（`sources/new_xishi-bobo_*.jpg` 喜柿玻玻 Persimmon Puree Pudding、`new_xishi-duoduo_*.jpg` 喜柿多多 Persimmon Pudding、`new_persimmon-golden_*.jpg` 金顶款——金顶款名字「待确认」，**不确定的名字不上**，只做两款也行）。黑底棚拍 → 用 `sources/cut_dark.py` 的方法抠图、只提曝光，不重画（脚本里的路径是 Mac 的，按仓内路径改着用）。
- **首屏新品图不能和「王牌三款」第一张是同一张图**（审核 P1：同一张柿子罐首页出现两次）。王牌三款的柿子罐保持原图，hero 用另一个角度或另一款。
- 有 ≥2 项时每 5 秒淡入淡出切一次，左上加「NEW · 1/3」这类小标签和小圆点；鼠标悬停/手指按住暂停；`prefers-reduced-motion` 时不自动切、只显示第一张、圆点可点。只有 1 项时不出现圆点。
- 不要做整块 hero 的大轮播（字和按钮跟着换）：顾客常看不到后面几张，标题也会跳。只换图和新品名。

### 3.2 产品线 = hero 下沿一条细的移动带
- 位置：hero 正下方（「王牌三款」蓝色块之前），满屏宽。桌面高约 140px、手机约 112px（含名字），**比 hero 小得多**。
- 内容：现有去底产品图，统一高度（桌面约 88px、手机约 68px），每个下面一行品名（英文，≥13px，深蓝）。至少 10 款：`public/assets/specialties/` 里的 `p-*.webp`（8 款招牌）+ `top-*.webp` + `jar-*.png` 等，挑去底干净的。每个链到菜单页对应分类（`/menu/#category-xxx`，分类 id 从 `public/menu/index.html` 里找）。
- 动：一直往左慢慢移动，约 40–60 秒走完一圈，无缝循环（内容复制一份，复制的那份 `aria-hidden="true"`、链接 `tabindex="-1"`）；鼠标悬停或键盘聚焦时暂停；`prefers-reduced-motion` 时不动，变成可横向滑动的一排。只用 CSS `transform` 动画，别用 JS 每帧算位置。
- 底色用站里的奶油色或很淡的薄荷，上下各一条细线即可；别用新颜色。
- 分支 `hero-lineup`（977badc，毛 11-09 说「以后可能用」）做过「一排 8 款产品」首屏，可以借它的图和排法，但**不要把那个分支的首页整个搬过来**。

### 3.3 王牌三款换两张图
- 生椰拿铁：原图 `sources/latte_source_prodA.jpg`（2560×1440 粉色大理石底，现在站上的 `top-latte.png` 只有 236×559 就是从这张抠的，所以糊）。全分辨率重抠，杯身 logo 和字要清楚。
- 现开椰子：原图 `sources/fresh-coconut_source_25A4527.jpg`、`_25A4530.jpg`（黑底、插吸管，8192 宽原片缩到 3000）；`_25A4532_leaf.jpg` 带叶子，备选。用 `cut_dark.py` 的方法抠。
- 可以用图像模型「修光、去杂物、统一背景」（`sources/fuse.py` = 原图像素 + 模型修过的光，round 4 就是这么做的），**但产品本身必须是原图的像素**：杯型、logo、配料不许被模型重画。不要用 `chatgpt-image-latest`。box 上没有图像模型的钥匙 → 只抠图提曝光，报告里写一句。
- 直接替换 `public/assets/specialties/top-latte.webp`、`top-fresh-coconut.webp`（同名、尺寸比例尽量接近原来的），这样 /specialties/ 页和首页一起换，特效代码一个字不动。
- 换完各出一张「原图 vs 新图」对比图放 `qa/round10/shots/`。

## 4. 毛的老规矩（必须守）

1. 王牌三款、八款招牌、椰子水、COCONUT 四段是「原样搬运」：**除了 3.3 那两张图，特效、排版、文字都不改**。
2. 柿子保留，不加南瓜。已删的「三步」「Start with a signature」不要加回。相册第一格的店内视频保留。
3. 文案照现在的写，新加的只有：新品名和一句说明、产品线的品名。不写没核实的营养或「低糖低卡」。
4. 不写 FiDi 营业时间（还没问到）。

## 5. 每改完一件都要验

- `node build.mjs` 不报错；`clip_scan.py public` = `NO CLIPPED TEXT`；`cmp_blocks.py` 四段里只有王牌三款那两张图的位置不同。
- 横向溢出 0（360/390/430/768/1024/1440 宽）；没有加载失败的图；浏览器控制台没有报错。
- 首屏在手机上：新品图、标题、Order online 按钮都在第一屏里，产品线不把标题挤出第一屏（390×844 看）。
- 打开「减少动效」：产品线不动、新品不自动切。
- 产品线的图全部用 `loading="lazy"` 以外的方式也没关系，但首屏新品图不能被拖慢：新品轮换的第 2、3 张 `loading="lazy"`。
- 截图放 `qa/round10/shots/`：1440 和 390 宽首屏各一张、产品线特写、王牌三款特写、两张对比图。
- 截图交给一个**只看图、不看代码**的独立审稿 agent（每轮新开）按 6 维打分，P1/P2 修完再审，直到没有 P1/P2；分数和问题写进报告。

## 6. 报告（写进 `domains/grokbot/out/bot_2026-11-12-025-hero-lineup.md`）

一页：做了哪三件、每件怎么做的、分支名和最后一个提交、验收结果（第 5 节每项）、审稿轮次和分数、没做或做不到的事和原因、要毛定的事。用中文，给不写代码的人看得懂。

## 7. 不要碰、只写进报告的

- 魏子辉的 good-coconut.vercel.app（他的 Vercel，我们没权限）。
- 菜单页（毛定过用魏子辉的排法）。
- 页脚、门店页、联系页。
