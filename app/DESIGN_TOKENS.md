# DESIGN_TOKENS

本文件是智能体工作台所有 UI 实现的"设计宪法"。涉及颜色、字号、间距、圆角、阴影、布局尺寸的取值,均以本文件为准,代码层落地在 `src/tokens/tokens.css`。

## 设计原则

- 克制:每页最多一个主按钮,主操作用深色,不用彩色。
- 密度:面向工程师的工作台密度,正文 14px,行高紧凑。
- 状态外化:状态、进度、风险用专门的色和位置展示,不靠堆叠提示。

## 字体

不引入 Web Font,使用系统字体栈。

```
font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
font-family-mono: ui-monospace, "SF Mono", "Menlo", "Cascadia Code", Consolas, monospace;
```

## 色板

浅色主题为 V0.1.1 唯一主题,不做暗色。

### 基础色

| 变量 | 值 | 用途 |
|---|---|---|
| `--color-bg` | `#fafafa` | 整体背景 |
| `--color-surface` | `#ffffff` | 卡片、面板 |
| `--color-surface-2` | `#f4f4f5` | 次级面板、悬浮态 |
| `--color-border` | `#e4e4e7` | 标准边框 |
| `--color-border-strong` | `#d4d4d8` | 强边框、分隔线 |

### 文字色

| 变量 | 值 | 用途 |
|---|---|---|
| `--color-text` | `#18181b` | 主要文字 |
| `--color-text-2` | `#52525b` | 次要文字 |
| `--color-text-3` | `#a1a1aa` | 弱化文字、占位 |

### 主色

主色刻意使用深色而非彩色,符合"克制"。

| 变量 | 值 | 用途 |
|---|---|---|
| `--color-primary` | `#18181b` | 主按钮背景 |
| `--color-primary-text` | `#fafafa` | 主按钮文字 |
| `--color-primary-hover` | `#27272a` | 主按钮悬浮 |

### 状态色

对应 `docs/01-单一事实源-V0.1.1.md` 视觉规范。

| 变量 | 值 | 用途 |
|---|---|---|
| `--color-status-success` | `#16a34a` | 成功 / 已通过 / 已完成 |
| `--color-status-running` | `#2563eb` | 执行中 |
| `--color-status-verify` | `#7c3aed` | 验证中 |
| `--color-status-review` | `#ea580c` | 待审查 |
| `--color-status-warn` | `#ca8a04` | 警告 / 中风险 |
| `--color-status-danger` | `#dc2626` | 失败 / 高风险 / 需要人工处理 |
| `--color-status-idle` | `#71717a` | 待处理 / 空闲 / 已停止 |

## 字号

基础正文 14px(`--text-base`),不是 16px。这是面向工程师的工作台密度。

| 变量 | 字号 | 行高 |
|---|---|---|
| `--text-xs` | 12px | 16px |
| `--text-sm` | 13px | 18px |
| `--text-base` | 14px | 20px |
| `--text-md` | 15px | 22px |
| `--text-lg` | 17px | 24px |
| `--text-xl` | 20px | 28px |
| `--text-2xl` | 24px | 32px |

## 间距

| 变量 | 值 |
|---|---|
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 20px |
| `--space-6` | 24px |
| `--space-8` | 32px |
| `--space-10` | 40px |
| `--space-12` | 48px |

## 圆角

| 变量 | 值 |
|---|---|
| `--radius-sm` | 4px |
| `--radius` | 6px |
| `--radius-md` | 8px |
| `--radius-lg` | 12px |

## 阴影

阴影克制使用,不堆叠多层。

| 变量 | 值 |
|---|---|
| `--shadow-sm` | `0 1px 2px rgba(0, 0, 0, 0.04)` |
| `--shadow` | `0 2px 8px rgba(0, 0, 0, 0.06)` |

## 布局尺寸

| 变量 | 值 | 用途 |
|---|---|---|
| `--layout-topbar-h` | 48px | 顶栏高度 |
| `--layout-sidenav-w` | 200px | 左侧导航宽度 |
| `--layout-rightstatus-w` | 280px | 右侧状态栏宽度 |
| `--layout-bottomevents-collapsed-h` | 36px | 底部事件流折叠高度 |
| `--layout-bottomevents-expanded-h` | 240px | 底部事件流展开高度 |
| `--layout-main-padding` | 24px | 主工作区内边距 |

## 视觉密度参考

锚点:Linear、Vercel Dashboard、GitHub 项目页。

禁止参考:Notion、Slack、聊天类产品。

## 禁止事项

- 禁止引入 Web Font。第一版坚决使用系统字体栈,避免加载抖动。
- 禁止使用纯彩色按钮做主操作。主按钮使用深色,彩色仅用于状态指示。
- 禁止动效超过 200ms。过渡统一 `transition: all 150ms`,不做 spring、不做复杂 keyframes。
- 禁止使用 box-shadow 制造"漂浮卡片"。阴影只在已定义的两档里选,克制使用。
- 禁止使用渐变色。背景与文字均为纯色。
