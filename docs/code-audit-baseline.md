# app/src 代码质量基线报告

## 范围与标注

- 扫描范围：`app/src/` 下 22 个 `.ts` / `.tsx` 文件，约 7601 行。
- 扫描方式：静态通读 + 模式检索；未运行代码、未启动 dev server。
- 口径说明：`mock-data.ts` 中内嵌的 diff 字符串未按真实源码计入问题。
- 标注：扫描期间检测到 [app/src/lib/mock-data.ts](/Users/linshen/Cursor/Doc-Agent/app/src/lib/mock-data.ts:987) 时间戳变化，因此以下结论按“扫描时刻 = 协作模型重构前”记录，不追逐并行重构后的后续改动。

## 1. 类型安全

本轮未发现显式 `any`、明显的隐式 `any`，也未发现无上下文的函数参数缺失类型注解。类型安全问题主要集中在不安全断言和过宽索引签名。

1. 严重度：警告  
位置：[app/src/main.tsx](/Users/linshen/Cursor/Doc-Agent/app/src/main.tsx:40) 第 40 行  
问题描述：`document.getElementById('root')!` 直接使用非空断言，默认假设挂载节点一定存在。一旦容器 ID 变更或渲染入口被复用，这里会把初始化问题延后到运行时。  
修改建议：改成显式判空并在缺失时尽早失败，或者封装一个带守卫的挂载入口。

2. 严重度：警告  
位置：[app/src/routes/requirement-detail.tsx](/Users/linshen/Cursor/Doc-Agent/app/src/routes/requirement-detail.tsx:174) 第 174 行  
问题描述：`visible.target.id as AnchorId` 把任意 DOM id 直接断言成 `AnchorId`，没有校验来源是否合法。后续一旦页面上新增同类锚点或 observer 观察范围变化，状态就可能落到非法值。  
修改建议：先用白名单判断 `id` 是否属于 `ANCHORS`，再更新 `active`，把断言改成收窄判断。

3. 严重度：警告  
位置：[app/src/routes/review.tsx](/Users/linshen/Cursor/Doc-Agent/app/src/routes/review.tsx:612) 第 612 行  
问题描述：关闭下拉菜单时把 `e.target` 直接断言为 `Node`，默认事件目标永远满足 `contains` 的输入要求。这个写法在事件来源变化时可读性和健壮性都偏弱。  
修改建议：增加 `e.target instanceof Node` 守卫，或把 outside-click 逻辑收敛到更安全的工具函数里。

4. 严重度：警告  
位置：[app/src/routes/requirement-review.tsx](/Users/linshen/Cursor/Doc-Agent/app/src/routes/requirement-review.tsx:864) 第 864 行  
问题描述：这里与单任务审查包页相同，也使用了 `e.target as Node` 的直接断言。两个页面同时保留同类写法，会把同一个运行时风险复制两份。  
修改建议：抽出统一的点击外部关闭逻辑，并用类型守卫替代断言。

5. 严重度：提示  
位置：[app/src/routes/tasks.tsx](/Users/linshen/Cursor/Doc-Agent/app/src/routes/tasks.tsx:506) 第 506 行  
问题描述：`ANOMALY_BG` 使用 `Record<string, ...>`，让异常标签从联合类型退化成任意字符串键，拼写错误或未覆盖的新状态都不会在编译期暴露。  
修改建议：改为复用 `AnomalyTag` 联合类型，或直接复用共享异常标签组件，保留穷尽检查能力。

## 2. React 反模式

本轮未发现明确的 `useEffect` 依赖项遗漏，也未发现典型的错误 `useState` 闭包。风险更集中在组件身份不稳定、由 props 派生的本地状态，以及索引 key。

1. 严重度：警告  
位置：[app/src/routes/tasks.tsx](/Users/linshen/Cursor/Doc-Agent/app/src/routes/tasks.tsx:361) 第 361-400 行  
问题描述：`TaskCard` 内部定义了 `Wrapper` 组件，再通过 `<Wrapper>` 渲染。这个模式会让 `Wrapper` 的组件身份在每次父组件渲染时都变化，子树更容易被重新挂载，后续一旦卡片内部加入本地状态会更难维护。  
修改建议：把包装逻辑提到组件外部，或改为在 JSX 内直接分支返回 `Link` / `div`。

2. 严重度：警告  
位置：[app/src/routes/review.tsx](/Users/linshen/Cursor/Doc-Agent/app/src/routes/review.tsx:28) 第 28-30 行  
问题描述：`activeFile` 只在初始化时从 `task` 推导一次。如果同一路由组件在不同任务之间复用，切换任务后仍可能保留上一个任务的选中文件，出现状态与内容不同步。  
修改建议：在 `task.id` 或 diff 列表变化时同步重置 `activeFile`，或直接把默认选中文件做成派生值。

3. 严重度：警告  
位置：[app/src/routes/run-detail.tsx](/Users/linshen/Cursor/Doc-Agent/app/src/routes/run-detail.tsx:366) 第 366-367 行  
问题描述：运行详情页的 `activeFile` 也只在首渲染时从 `diffs/changes` 初始化。后续如果在同一组件实例里切换运行记录，当前选中的文件可能失真。  
修改建议：监听运行标识或 diff 源数据变化后重置选择状态，避免“旧状态挂在新数据上”。

4. 严重度：提示  
位置：[app/src/routes/run-detail.tsx](/Users/linshen/Cursor/Doc-Agent/app/src/routes/run-detail.tsx:229) 第 229、352、483、535 行  
问题描述：时间线、日志、diff 行和验证列表都使用了 `key={i}`。原型阶段看起来能工作，但一旦列表支持插入、删除或排序，React 可能错误复用 DOM，导致选中态或动画错位。  
修改建议：优先使用稳定业务键，例如时间戳 + 文件名 + 校验名的组合键，而不是索引。

## 3. 可访问性

本轮未发现真实 `<img>` 场景，因此没有 `alt` 缺失问题。主要风险集中在可聚焦语义、状态宣告和键盘导航。

1. 严重度：警告  
位置：[app/src/shell/TopBar.tsx](/Users/linshen/Cursor/Doc-Agent/app/src/shell/TopBar.tsx:25) 第 25-38 行  
问题描述：搜索框只有 `placeholder`，没有可供辅助技术识别的名称。屏幕阅读器用户进入该输入框时，很难知道它的用途。  
修改建议：补充可见 `<label>` 或 `aria-label`，不要把占位文案当作唯一标签。

2. 严重度：警告  
位置：[app/src/routes/tasks.tsx](/Users/linshen/Cursor/Doc-Agent/app/src/routes/tasks.tsx:157) 第 157-176、254-267 行  
问题描述：需求过滤 chip 属于开关型按钮，但没有 `aria-pressed`；分组折叠按钮虽然有 `aria-label`，却没有 `aria-expanded`。当前界面状态无法被辅助技术稳定读出。  
修改建议：给切换型按钮补充状态属性，并在有内容容器时加上 `aria-controls`。

3. 严重度：严重  
位置：[app/src/routes/task-detail.tsx](/Users/linshen/Cursor/Doc-Agent/app/src/routes/task-detail.tsx:419) 第 419-459 行  
问题描述：历史运行表把整行 `<tr>` 做成可点击目标，但行本身不可聚焦，也没有键盘事件。键盘用户无法通过表格行进入运行详情。  
修改建议：把“查看”改成真实链接/按钮，或为可交互行补齐可聚焦语义与键盘操作。

4. 严重度：严重  
位置：[app/src/routes/requirement-review.tsx](/Users/linshen/Cursor/Doc-Agent/app/src/routes/requirement-review.tsx:362) 第 362-446 行  
问题描述：任务汇总表同样依赖可点击 `<tr>` 导航到审查包。这个交互对鼠标可用，但对键盘和部分辅助技术并不成立。  
修改建议：将跳转入口放回单元格内的真实链接或按钮，并保留整行 hover 仅作视觉增强。

5. 严重度：警告  
位置：[app/src/components/RequirementTaskGraph.tsx](/Users/linshen/Cursor/Doc-Agent/app/src/components/RequirementTaskGraph.tsx:133) 第 133-137 行  
问题描述：任务图节点使用可点击的 SVG `<g>` 元素，但没有 `tabIndex`、键盘事件或可操作角色。它现在只对鼠标用户可达。  
修改建议：把节点改成可聚焦元素，或在 SVG 外同步提供等价的文本导航入口。

6. 严重度：警告  
位置：[app/src/routes/review.tsx](/Users/linshen/Cursor/Doc-Agent/app/src/routes/review.tsx:622) 第 622-640、657-683 行  
问题描述：更多操作下拉菜单没有 `aria-haspopup` / `aria-expanded`，打开后也没有焦点管理。辅助技术很难判断菜单是否展开，键盘流转也不够稳定。  
修改建议：按菜单按钮模式补齐 ARIA 状态，并在展开后管理焦点与关闭路径。

7. 严重度：警告  
位置：[app/src/routes/requirement-review.tsx](/Users/linshen/Cursor/Doc-Agent/app/src/routes/requirement-review.tsx:874) 第 874-892、909-935 行  
问题描述：需求级审查包页的更多操作菜单复用了同样的交互模式，因此继承了同样的可访问性缺口。  
修改建议：与单任务审查包共用一套可访问菜单实现，避免两边各自修一遍。

## 4. 性能可疑点

当前数据量不大，未看到必须立刻引入虚拟化的大列表场景。性能风险主要来自重复解析大字符串和在 render 期反复统计。

1. 严重度：警告  
位置：[app/src/routes/review.tsx](/Users/linshen/Cursor/Doc-Agent/app/src/routes/review.tsx:317) 第 317-339 行  
问题描述：diff 预览每次渲染都会重新 `split('\n')`，并逐行计算颜色。现在数据是 mock 量级，一旦 diff 变长或底部决策区频繁触发重渲染，这里会成为明显的热点。  
修改建议：把 diff 行拆分和着色预处理提到 memo 化层，或在数据进入页面前完成格式化。

2. 严重度：警告  
位置：[app/src/routes/run-detail.tsx](/Users/linshen/Cursor/Doc-Agent/app/src/routes/run-detail.tsx:466) 第 466-488 行  
问题描述：运行详情页的 diff 预览与单任务审查包页采用相同策略，也是在 render 中重复拆行和判色。两个页面同时存在，会把后续大 diff 的性能成本放大。  
修改建议：抽出共享的 diff viewer，并把解析结果缓存到组件外或 `useMemo` 中。

3. 严重度：提示  
位置：[app/src/routes/requirement-review.tsx](/Users/linshen/Cursor/Doc-Agent/app/src/routes/requirement-review.tsx:235) 第 235、317-318、477-480 行  
问题描述：页面内多处在 render 期间对同一数组重复执行 `filter()` 统计数量。当前数据规模很小，但一旦审查包变成真实长列表，这类重复扫描会持续累积。  
修改建议：把统计结果收敛到一次预处理或 memo 化计算，减少同页重复遍历。

## 5. CSS / 样式反模式

`app/src/` 中 inline style 非常普遍。这里不逐行穷举，只记录对后续 V0.2 视觉改造影响最大的高信号问题。

1. 严重度：警告  
位置：[app/src/components/Button.tsx](/Users/linshen/Cursor/Doc-Agent/app/src/components/Button.tsx:25) 第 25-43 行  
问题描述：共享按钮组件把 hover 态写成 JS 里的 DOM 样式突变，同时把主要视觉规则全部塞进内联 `style`。这会削弱主题统一、`focus-visible` 样式接入和后续批量换肤能力。  
修改建议：把交互态迁回类名或 CSS 变量层，保留组件只负责语义和变体选择。

2. 严重度：警告  
位置：[app/src/components/AnomalyTag.tsx](/Users/linshen/Cursor/Doc-Agent/app/src/components/AnomalyTag.tsx:3) 第 3-9 行  
问题描述：异常标签背景色直接硬编码为 `#f4f4f5`、`#fee2e2`、`#fefce8` 等值，没有统一挂到设计 token。后续只要状态色体系调整，就需要逐个组件回捞。  
修改建议：把状态背景色提升到 token / CSS 变量，并让组件只消费语义色名。

3. 严重度：警告  
位置：[app/src/routes/tasks.tsx](/Users/linshen/Cursor/Doc-Agent/app/src/routes/tasks.tsx:506) 第 506-512 行  
问题描述：任务板内部又维护了一套异常标签颜色表，而且和共享 `AnomalyTag` 组件职责重叠。视觉规则重复定义后，很容易在改版中出现“同一状态两种颜色”。  
修改建议：删除页面内重复色表，直接复用共享标签组件或统一的状态样式映射。

4. 严重度：警告  
位置：[app/src/routes/run-detail.tsx](/Users/linshen/Cursor/Doc-Agent/app/src/routes/run-detail.tsx:340) 第 340-355、458-490 行  
问题描述：日志区和 diff 区直接硬编码了深色底与多组语义色，如 `#0b1020`、`#cbd5e1`、`#86efac`、`#fca5a5`。这些颜色绕开 token 体系，会让主题统一和对比度治理变得分散。  
修改建议：把日志 / diff 调色板抽到专用 CSS 变量或主题 token，再由页面消费。

5. 严重度：警告  
位置：[app/src/routes/review.tsx](/Users/linshen/Cursor/Doc-Agent/app/src/routes/review.tsx:89) 第 89-110、309-341 行  
问题描述：单任务审查包页同时硬编码了提示 banner 和 diff 预览颜色，页面层自己掌握一套状态色。随着视觉改造推进，这种“页面自带调色板”会拉高回归成本。  
修改建议：把告警色、成功色、diff 色统一收口到 token，再让审查包组件共享使用。

6. 严重度：警告  
位置：[app/src/routes/requirement-review.tsx](/Users/linshen/Cursor/Doc-Agent/app/src/routes/requirement-review.tsx:28) 第 28-31、132-153、648-649 行  
问题描述：需求级审查包在严重度标签、演示提示、推荐方案区多次直接写入十六进制颜色。状态色没有集中管理，会直接阻碍 V0.2 视觉改造时的批量替换。  
修改建议：收敛这些语义色到统一变量层，并让页面只组合已有 token。

## 总览表

| 维度 | 问题数 | 严重 | 警告 | 提示 | 涉及文件数 |
| --- | ---: | ---: | ---: | ---: | ---: |
| 类型安全 | 5 | 0 | 4 | 1 | 5 |
| React 反模式 | 4 | 0 | 3 | 1 | 3 |
| 可访问性 | 7 | 2 | 5 | 0 | 6 |
| 性能可疑点 | 3 | 0 | 2 | 1 | 3 |
| CSS / 样式反模式 | 6 | 0 | 6 | 0 | 6 |
| 合计 | 25 | 2 | 20 | 3 | 11 |

## 结论摘要

- 这份基线里，最高优先级问题集中在可访问性：两个主表格都把 `<tr>` 当成主交互入口，键盘用户无法正常进入详情。
- 类型安全整体比预期好，没有发现 `any` 泛滥，但存在几处会把错误推迟到运行时的断言写法。
- 视觉改造阶段最容易拖慢效率的，不是单一颜色值，而是“页面层各自维护状态色 + 大量 inline style”的组合。
