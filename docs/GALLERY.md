# Gallery 拼贴墙

2026-11-06。本地氛围预览，尚未发布。

## 2026-11-06 参考评审后的调整

按用户要求执行 Pearly / MeloMelo 对照评审建议，**不替换 Gallery 相邻重复素材**。照片与封面路径、两排八张新增照片、原照片带及拼贴构图均保留。

- 首屏品类说明移到主标题下并放大；品牌标语保留，副入口改为 Find your first favorite。
- 品牌介绍保留门店照，加入现有椰子商品图片及菜单已确认的椰水／椰肉选项说明，没有新增健康、产地或制作频次宣称。
- 产品介绍明确 Lime Boba Coconut、Whole Coconut Pudding、Himalaya Blossom；分别链接到 Flushing 菜单对应分类，并提供鸡蛋仔分类入口。首页不展示跨门店共用价格，菜单仍可切换门店。
- 三个视频位仍未提供视频文件；移除播放三角形，使用更清楚的 Video coming soon 状态（手机至少12px），移除重复的 Video placeholder／页尾待上线说明。真实视频分支的原生 controls 保留。
- Gallery 结尾加入找店及查看菜单入口；锚点增加固定导航避让；降低首页标题投影强度并适度收紧产品间距。

验证：构建、`npm run check`、原有 `qa-gallery.mjs` 六种宽度检查通过。新增 `qa-critique-update.mjs` 检查四种宽度、四条产品分类链接、Gallery 直接地址／导航锚点、状态字号及全部 Gallery 图片引用未变；结果和截图在 `qa/critique-update/`。检测器对浅色照片背景、未打开弹层图片等的提示与前次评审相同，不视作已确认故障。当前只更新本地版本，尚未部署。

用户已确认：保留首页原产品照片带，在照片带之后、门店之前新增 Gallery，并在全站主导航增加 `/#gallery` 入口。

视觉沿用薄荷绿、奶油白和深青色，以错落拍立得、胶带、手写便签、品牌贴纸与三个 9:16 视频位形成 Ins 剪贴簿。桌面自由拼贴，手机／窄平板采用错落双列；原照片带的连续滚动保留，新拼贴保持静态，照片仅在悬停时抬起。照片支持点击放大、Escape 关闭及焦点返回，无 JavaScript 时打开源图。

## 本地预览

双击项目目录中的 `Preview-Gallery.cmd`，构建后打开 http://127.0.0.1:4191/#gallery 。若已有本版本预览，会复用服务；使用 `Stop-Preview.cmd` 关闭启动器记录的服务。

## 素材状态

当前 11 张照片与三个视频封面都来自现有品牌素材。按用户最新要求，删除新增部分的最后一排，保留前两排，每排四张拍立得，共 8 张；保留斜角胶带、色彩不同的纸胶带与手写旁注，延续连续的拼贴墙。手机／窄平板将新增每排分为两行，保持错落双列。三个视频的 `src`、`creator` 为 `null`，前端明确显示“Creator video · coming soon”和“Video placeholder”，不触发播放、不填写虚构达人、点赞或观看量。

`gallery.mjs` 导出的 `galleryReels` 集中维护视频标题、手写说明、封面、视频路径与达人账号。真实素材到位后替换封面、填写 `src` 和真实 `creator`，模板会输出原生可控视频。上线真视频前，需确认视频来源与使用授权、服务器的视频 MIME 与 Range 支持、CSP、移动播放和加载失败体验；当前验收只包含占位状态。

原照片在 `photo()` 的调用中维护；新增两排照片集中在 `gallery.mjs` 导出的 `galleryPhotoRows`，每项为图片标识、路径、替代文字、手写说明。对应图片文件放在 `public/assets/`。修改源文件后运行 `node build.mjs`，不要只改生成的 `public/index.html`。

## 维护文件

- `gallery.mjs`：区块模板、照片与视频占位内容。
- `public/gallery.css`：拼贴构图、响应式、手写字体与照片弹层样式；小范围全站导航间距适配。
- `public/gallery.js`：照片弹层渐进增强。
- `build.mjs`：导航、首页插入点与样式／脚本哈希。
- `public/assets/caveat-variable.ttf`、`caveat-OFL.txt`：来自 Google Fonts 的开源手写字体与许可；服务器补充 `font/ttf` 类型。

## 验证

构建与语法检查通过；Impeccable 对改动 UI 文件的检测结果为空。`qa-gallery.mjs` 覆盖 320、390、768、820、1024、1440 px 六种宽度：页面与导航无横向溢出、图片完整、字体加载、原照片带保留，以及导航、照片弹层与焦点返回、减少动态、无 JavaScript 回退。结果为 `qa/gallery/results.json`，桌面／手机／平板截图在同目录（截图不纳入 Git）。

运行浏览器检查：正常安装本项目 devDependencies 后执行 `node qa-gallery.mjs`；`QA_BASE` 可指定预览地址，`QA_BROWSER` 可指定浏览器，`QA_PUPPETEER_PATH` 可指定现有 Puppeteer 模块。当前本地使用相邻主工作目录的已安装模块，未重复安装。
