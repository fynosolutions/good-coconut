# 025 Good Coconut 首页 round 8 — 交接给 box 上的 Claude Code（2026-11-09 14:xx ET）

写给：Grok Bot 云电脑上的 Claude Code（`claude -p --model opus`，用毛的 Max）。毛出门、Mac 合上了。
来源：Mac 上 Website 棚的 Claude Code 会话。这份是任务的唯一说明，做之前整份读完。

## 0. 你在哪个仓、哪个分支

- 仓：`fynosolutions/good-coconut`，分支 `round8-home`（基于 `preview-original`）。
- 你的改动推到 **`bot/2026-11-09-025-home-round8`**（从 `round8-home` 拉出来）。不要推 `round8-home`、`preview-original`、`main`。
- **不要部署**（不碰 Vercel）。上线由毛看过后在 Mac 上做。
- 拿不到这个仓（clone/fetch 报 403/404）→ 停手，把报错原文写进报告，不要想别的办法。

## 1. 怎么重建、怎么看

- 重建只跑 `node build.mjs`（在仓根目录）。**绝对不要跑** 外面 `round5/scripts/patch_site.py`、`round7-hero/scripts/patch_home.py`：它们会把毛 11-09 早上撤回的旧首页重做加回去。
- 看页面：`python3 -m http.server <端口> --directory public`。检查程序在 `qa/round8/`（Playwright，Python）：
  - `clip_scan.py public` — 14 种宽度扫被切掉的字，目标输出 `NO CLIPPED TEXT`。
  - `shoot_home.py public <输出目录>` — 1440 和 390 宽一屏一屏截，拼成 4 张。
  - `shoot_els.py public <输出目录> <宽度> <选择器...>` — 截指定区块。
  - `cmp_blocks.py public <输出目录>` — 搬过来的 4 段和 /specialties/ 逐像素比对（只差 1px 或右下浮动按钮 = 正常）。

## 2. 毛的规矩（原话或原意，必须守）

1. 「specialty 那个页面特效是对的，你不要修改。你只是做一个搬运。」→ `/specialties/` 页面不准有任何视觉变化；首页上搬来的 4 段（Top three 王牌三款、Eight ways 八款招牌、Fresh from the shell 椰子水、COCONUT 字标）必须和 /specialties/ 上一模一样，特效一样。首页专用的修正只能用 `.sp.sp-moved` 限定（现在只有一条：八款卡片高度跟文字走，防切中文名）。
2. 「柿子保留，不要南瓜了」→ 不删柿子、不加南瓜。
3. 已删的两段不要加回：「Every cup starts inside a fresh coconut」三步、「Start with a signature」。
4. 相册第一格是毛给的店内视频（`public/assets/r8/gallery-welcome.mp4`），保留。
5. 文字照现在的写，不改文案（下面明确要改的除外）。

## 3. 已经做完的（Mac 会话，本分支里）

- 首页顺序：首屏 → 王牌三款 → 八款招牌 → 椰子水 → COCONUT → 分类(cats5) → 柿子季(season5) → 相册 → 两家店。
- 王牌三款的特效之前被首页旧样式 `.sp.sp-home` 盖掉，已改用 `sp sp-moved`，和 /specialties/ 逐像素一致（`cmp_blocks.py` 验过）。
- 八款卡片在 900–1180 宽切中文名 → 已修（只限首页），`clip_scan.py` 首页 `NO CLIPPED TEXT`。
- 相册视频把大格子撑高、右边出现两块空白 → 刚加了 `.wall figure.wall-video video{position:absolute;inset:0}`，**还没截图验证**。

## 4. 要你修的（设计评审第 1 轮里，落在毛允许改的范围内的）

第 1 轮评审截图在 `qa/round8/critique-r1/`（那时 Start with a signature 还在、视频格子还没修）。逐条修，修完逐条截图对照：

1. **相册空白**（P1）：确认视频格子不再撑高，桌面 1440、1024 和手机 390 右边格子没有大块空白。没好就继续修，让大格子高度=右边两行。
2. **视频标签压字**（P2，手机）：「made to order」标签盖住了视频里的「GOOD」字样。只对 `.wall-video` 的标签换位置（例如右上角），别动其他格子。
3. **分类大卡眉标被盖**（P1，手机 390）：「Coconut drinks」卡顶部的小字「coconut water · coconut milk · slush」后半截被杯子图盖住。让字和图不重叠（字移到图下，或图往下让 48px）。
4. **「Two shops in New York.」孤词**（P2，手机）：「York.」单独一行 → `New&nbsp;York`。
5. **「See the persimmon pudding」按钮折两行**（P2，手机）：不改字，改成一行（white-space:nowrap，必要时收小左右内边距/字号到 15px）。
6. **FiDi 门店卡右上 ↗ 箭头贴着眉标**（P2，手机）：拉开 ≥12px，不要重叠。
7. **相册手写标签太小**（P2，手机）：标签字号 ≥12px。
8. **相册门店照店招被切**（P1）：「order here」「come say hi」「find us downstairs」三格的店招被切成「GOOD COCON」之类。能靠 `object-position` 调好就调；调不好就写进报告，别换图。
9. **手机上右下角浮动按钮压在页脚版权行上**（P2）：页脚出现时把浮动按钮藏起来或抬高，别压字。没把握就只写进报告。

每条修完都要：重建 → `clip_scan.py public` 仍是 `NO CLIPPED TEXT` → 横向溢出 0（360/390/430/768/1024/1440）→ 没有加载失败的图 → `cmp_blocks.py` 搬来的 4 段仍和 /specialties/ 一致 → `/specialties/` 截图和改之前比没有变化。

## 5. 不要碰、只写进报告等毛定的

评审还提了这些，**都不在本次范围**，在报告里列成「等毛决定」，一句话一条：
- 王牌三款改一大两小、八款卡字号、椰子水段左栏空白、八款标题居中（都属于搬来的 4 段）。
- 首屏主图是单款柿子、首屏背景椰子店招被切、相册「fresh coconuts, daily」和首屏背景是同一张照片、相册三张门店照角度重复、分类「Coconut drinks」配的是柿子图。
- 柿子出现次数多（毛已定保留）。
- 颜色超限、区块间距不统一、每段都有手写小标题、外卖图标不统一、页脚邮箱是 gmail、页脚标语「in」挂行尾、「喜柿玻玻」写法要核实。

## 6. 复查（必须做）

修完后派一个**全新的**设计评审子代理（有 `design-critic` 就用它，没有就用通用子代理并告诉它「只能看截图」）。只给它新截图（1440 + 390）和上面第 4 节的 9 条原问题，让它逐条判「已修 / 未修 / 新问题」。不要告诉它你修了什么。结论要「第 4 节 9 条没有未修的 P1/P2，且没有新增 P1/P2」才算过；不过就再修再审，最多 3 轮。

## 7. 交付

1. 改动 + 新截图（放 `qa/round8/critique-r2/`、`r3/`…）推到 `bot/2026-11-09-025-home-round8`。
2. 报告写到 cc-max-automations 仓 `domains/grokbot/out/bot_2026-11-09-025-home-round8.md`（新文件，可直推 main）：每条「修了/没修+原因」、每轮评审结论、第 5 节「等毛决定」清单、分支名和最后的 commit。
3. 不部署、不对外发任何东西。
