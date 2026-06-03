# 昤昽医疗官网项目

这是昤昽医疗“视觉功能检查与训练软件”多页面静态官网版本，基于用户提供的 Word 改版方案、产品 PDF 和补充文字重构。

## 页面结构

- `index.html`：首页，总览产品定位、核心入口和合作转化
- `product.html`：产品介绍，说明核心模块、院内/家庭双场景、医生端/用户端协同
- `advantages.html`：产品优势，拆分检查能力、训练能力、方案能力、管理能力和使用体验
- `solutions.html`：解决方案，面向医疗机构、健康管理机构、眼视光中心、视觉康复机构
- `workflow.html`：诊疗闭环，患者建档、检查、报告、方案、训练、记录、复查调整
- `scenarios.html`：应用场景，视功能筛查、轻中度弱视相关管理、斜视/术后、近视伴视功能异常等
- `qualification.html`：资质合规，集中展示注册信息与合规边界
- `science.html`：视觉健康科普栏目规划
- `cooperation.html`：招商合作与演示申请表单

## 资料吸收内容

- 首页定位：视觉健康数字化解决方案
- 产品闭环：筛查-评估-训练-管理
- 核心能力：视功能检查、个性化训练、患者管理、数据追踪
- 双场景：院内训练 + 家庭训练
- 双端协同：医生端 + 用户端
- 检查效率：快速筛查约 6 分钟，全项目检查约 20 分钟
- 训练内容：23 类训练品类，100+ 训练项目
- 机构对象：医疗机构、健康管理机构、眼视光中心、视觉康复机构

## 合规说明

资料中涉及“唯一”“首张”“医保收益”“回本周期”“患者案例疗效”等内容，当前官网前台未作为强宣传使用。相关内容集中放入资质合规边界说明，正式上线前应结合医疗器械注册证、产品说明书、广告审查要求和监管平台最新记录完成合规审校。

## 部署说明

当前项目是静态 HTML 官网，源码文件位于项目根目录。CloudBase 部署命令如果使用 `tcb hosting deploy ./dist /linglong -e lung-4g441e9m7f055d4e`，需要先生成 `dist` 目录。

推荐部署命令（仓库中已提交 `package.json` 和 `scripts/build-static.js` 时使用）：

```bash
npm run build && tcb hosting deploy ./dist /linglong -e lung-4g441e9m7f055d4e
```

如果还没有把 `dist`、`package.json`、`scripts/build-static.js` 推送到远程仓库，请先把 CloudBase 自定义部署命令改为下面这一条。它会在云端临时生成 `dist`，不依赖仓库里预先存在 `dist` 目录：

```bash
mkdir -p dist && cp -r *.html styles.css script.js assets dist/ && tcb hosting deploy ./dist /linglong -e lung-4g441e9m7f055d4e
```

如果部署平台只能执行当前已有命令，也可以直接提交仓库中的 `dist` 目录，确保 `./dist` 存在。
