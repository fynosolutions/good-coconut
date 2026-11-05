# 网站设计调查与实现依据

本次综合提交包含 Gallery 实现、Pearly / MeloMelo 对照评审及用户指定的拼贴参考。截图仅用于评审取证；页面使用 GOOD COCONUT 已有素材。

| 资料 | 用途 |
|---|---|
| [Pearly 调查](pearly/README.md) | 配色与摄影统一、具体选品、制作视频和行动入口 |
| [MeloMelo 三页面调查](melomelo/README.md) | Menu、Locations、Brand 的逐板块分析与桌面/手机证据 |
| [当前 Gallery 版对照评审](comparison.md) | 两品牌优点与本站修改位置、优先级、评分 |
| [独立技术检查](gallery-technical-review.md) | 原状态的字体、视频占位、图片重复、锚点与检测器误报说明 |
| [Gallery 构图参考](gallery-references.md) | 用户指定 Memoria Visuals 与美食 Ins 剪贴簿 |
| [已实施调整及验证](../GALLERY.md) | 本轮最终实现及素材保留范围 |

评审与实施须区分：comparison.md 与技术检查保留修改前的诊断；本轮已修复视频播放暗示、状态字号、分类入口和手机锚点等问题。用户明确要求暂不替换相邻重复素材，因此相同照片和视频封面仍保留。

## 验证资料

- [Gallery 六视口与交互结果](../../qa/gallery/results.json)
- [本轮修改、四个分类入口与直接锚点结果](../../qa/critique-update/results.json)
- [修改前 Gallery 素材清单](../../qa/gallery/preserved-assets.json)

浏览器脚本使用 package.json 的 puppeteer-core。先安装依赖并启动本地预览，再运行 `npm run qa:gallery`、`npm run qa:critique`。支持 `QA_BASE`、`QA_BROWSER` 和 `QA_PUPPETEER_PATH` 环境变量；默认预览4191端口、Windows Edge。
