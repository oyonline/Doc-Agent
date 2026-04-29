// V0.2.0 阶段 mock 数据
// 数据来源:docs/06-V0.2-样例数据与事件文案.md
// 当前演示时刻:T0(14:15,启动执行后第一刻)
//
// 本文件只承载本步(全局外壳)所需的最小数据集:
// - 安全模式 4 字段(右侧状态栏顶部分组)
// - 8 智能体三阶段分组状态(右侧状态栏主体,T0 时刻快照)
// - 事件流条目(底部事件流,从 14:00 提交需求到 14:15 启动执行)
// 后续步骤(需求工作台、需求详情页等)再追加对应的 mock 数据。

// ============ 任务级状态枚举(供通用组件使用)============
// 来源:docs/03 §任务状态机
// 这些枚举在 V0.2 中沿用 V0.1.1 资产,组件 StatusBadge / AnomalyTagPill 依赖它们
export type TaskStatus = '待处理' | '执行中' | '验证中' | '待审查' | '已完成'

export type AnomalyTag =
  | '已停止'
  | '执行失败'
  | '验证未通过'
  | '已拒绝'
  | '卡住'
  | '需要人工处理'

// ============ 安全模式 ============
// 来源:沿用 V0.1.1 安全状态字段(docs/08 §右侧状态栏 - 安全模式区)
export type SafetyRow = { label: string; value: string }

export const mockSafetyRows: SafetyRow[] = [
  { label: '安全模式', value: '严格' },
  { label: '自动合并', value: '关闭' },
  { label: '外部网络', value: '受限' },
  { label: '密钥访问', value: '禁止' },
]

// ============ 8 智能体三阶段分组 ============
// 阶段分组定义:docs/02 §三阶段分组
// 状态文案:docs/02 §状态展示规范
// T0 时刻快照:docs/06 §11.6 T0(14:15)
export type AgentMainStatus = '空闲' | '工作中'

export type AgentRow = {
  name: string
  status: AgentMainStatus
  // 工作中的细分文案,或空闲的补充说明(均以小字附在状态行下方)
  detail?: string
}

export type AgentPhase = {
  title: '规划阶段' | '执行阶段' | '审查阶段'
  agents: AgentRow[]
}

export const mockAgentPhases: AgentPhase[] = [
  {
    title: '规划阶段',
    agents: [
      { name: '产品智能体', status: '空闲' },
      { name: '架构师智能体', status: '空闲', detail: '刚完成第二次评估' },
      { name: '任务拆解智能体', status: '空闲', detail: '刚完成拆解' },
    ],
  },
  {
    title: '执行阶段',
    agents: [
      {
        name: '项目管理智能体',
        status: '工作中',
        detail: '调度中 · 1/7 任务进行,已完成 0',
      },
      { name: '前端智能体', status: '空闲' },
      { name: '后端智能体', status: '工作中', detail: '执行任务-1' },
      { name: '测试智能体', status: '空闲' },
    ],
  },
  {
    title: '审查阶段',
    agents: [{ name: '审查智能体', status: '空闲' }],
  },
]

// ============ 事件流(底部事件流)============
// 来源:docs/06 §11.1 完整时序事件流
// V0.2.0 阶段差异:不包含任务-7 相关条目(docs/06 §11.2)
// 截止时刻:T0(14:15)启动执行后第一刻,与状态栏对齐
// 顺序:最新在上(底部事件流按数组顺序从上到下渲染)
export type RecentEvent = { time: string; text: string }

export const mockRecentEvents: RecentEvent[] = [
  { time: '14:15', text: '后端智能体已开始执行任务-1' },
  { time: '14:15', text: '项目管理智能体已分发任务-1 给后端智能体' },
  { time: '14:15', text: '需求-001 已启动执行(主状态:执行中)— 用户点击"启动执行"' },
  { time: '14:14', text: '任务拆解智能体已产出 7 任务依赖图' },
  { time: '14:13', text: '需求-001 进入拆解中(主状态:拆解中)' },
  { time: '14:13', text: '架构师智能体已完成二次评估,R-001 降级为中(主状态:PRD 已定)' },
  { time: '14:10', text: '需求-001 二次澄清已完成,XSS 缓解策略已记录到 PRD' },
  {
    time: '14:08',
    text: '需求-001 已驳回,产品智能体启动二次澄清(主状态:澄清中,异常标签:已驳回)',
  },
  { time: '14:08', text: '架构师智能体已完成首次可行性评估,识别 1 项高风险 R-001' },
  { time: '14:08', text: '架构师智能体已开始可行性评估' },
  { time: '14:08', text: '需求-001 PRD 已确认(主状态:PRD 已定)' },
  { time: '14:07', text: '需求-001 PRD 草稿已生成,等待用户确认' },
  { time: '14:06', text: '需求-001 第 3 轮澄清开始 + 用户确认' },
  { time: '14:04', text: '需求-001 第 2 轮澄清已完成' },
  { time: '14:03', text: '需求-001 第 2 轮澄清开始' },
  { time: '14:02', text: '需求-001 第 1 轮澄清已完成' },
  { time: '14:01', text: '需求-001 第 1 轮澄清开始' },
  { time: '14:01', text: '产品智能体已开始与用户澄清需求-001' },
  { time: '14:00', text: '需求-001 已创建(主状态:待澄清)' },
]

// 折叠态显示最新一条:14:15 后端智能体已开始执行任务-1
// 与状态栏 T0 时刻一致(后端智能体处于"工作中 · 执行任务-1")
export const mockLatestEvent: RecentEvent = mockRecentEvents[0]

// ============ 需求级状态枚举 ============
// 来源:docs/03 §需求状态机
export type RequirementMainStatus =
  | '待澄清'
  | '澄清中'
  | 'PRD 已定'
  | '拆解中'
  | '执行中'
  | '待审查'
  | '已完成'

export type RequirementAnomaly = '已驳回' | '部分拒绝' | '全量拒绝并反馈'

// ============ 需求列表(需求工作台主区域)============
// 来源:docs/06 §端到端样例需求总览 - 需求清单(4 个需求样例)
//
// 排序:按"需要你关注的程度",非按提交时间。优先级值越小越靠前:
//   1. 执行中 + 任务级人工介入待处理(阻塞下游调度,最紧迫)
//   2. 待审查(需求级,等最终决策但不阻塞其他工作)
//   3. 执行中(系统在跑,无需你介入)
//   4. 拆解中 / PRD 已定
//   5. 澄清中
//   6. 待澄清
//   7. 已完成
// 同优先级内,按提交时间倒序。
//
// 排序规则的核心判断:阻塞下游调度的优先级 > 终端等待。
// 任务级人工介入不放行,后续任务全部停摆;
// 需求级待审查只是这一个需求等收尾,不影响其他工作推进。
//
// 注:docs/08 §需求工作台说"按近期更新排序",该描述未考虑工作台优先级语义,
// 是文档遗留 bug,V0.2.0 整体完成后做一次文档微调。
export type RequirementListItem = {
  id: string
  code: string
  name: string
  mainStatus: RequirementMainStatus
  anomalies: RequirementAnomaly[]
  submittedAt: string
  stageBrief: string
  // 是否有任务级单任务审查包待你接受(对应 docs/03 §任务级人工介入节点)
  // 仅当主状态为"执行中"时有意义,影响排序优先级
  hasPendingTaskReview?: boolean
}

const requirementsRaw: RequirementListItem[] = [
  {
    id: '001',
    code: '需求-001',
    name: '新增用户标签功能',
    mainStatus: '执行中',
    anomalies: [],
    submittedAt: '2026-04-29 14:00',
    stageBrief: '任务-1 执行中(1/7)',
    hasPendingTaskReview: true,
  },
  {
    id: '002',
    code: '需求-002',
    name: '修复登录页错误提示',
    mainStatus: '已完成',
    anomalies: [],
    submittedAt: '2026-04-28 11:32',
    stageBrief: '已交付',
  },
  {
    id: '003',
    code: '需求-003',
    name: '优化首页加载性能',
    mainStatus: '待澄清',
    anomalies: [],
    submittedAt: '2026-04-29 09:15',
    stageBrief: '等待产品智能体启动澄清',
  },
  {
    id: '004',
    code: '需求-004',
    name: '新增评论 emoji 反应',
    mainStatus: '待审查',
    anomalies: [],
    submittedAt: '2026-04-28 19:42',
    stageBrief: '7 任务已完成,等待最终审查',
  },
]

function attentionPriority(item: RequirementListItem): number {
  const s = item.mainStatus
  if (s === '执行中' && item.hasPendingTaskReview) return 1
  if (s === '待审查') return 2
  if (s === '执行中') return 3
  if (s === '拆解中' || s === 'PRD 已定') return 4
  if (s === '澄清中') return 5
  if (s === '待澄清') return 6
  if (s === '已完成') return 7
  return 8
}

export function sortRequirementsByAttention(
  items: RequirementListItem[],
): RequirementListItem[] {
  return [...items].sort((a, b) => {
    const pa = attentionPriority(a)
    const pb = attentionPriority(b)
    if (pa !== pb) return pa - pb
    return b.submittedAt.localeCompare(a.submittedAt)
  })
}

export const mockRequirementList = sortRequirementsByAttention(requirementsRaw)

// ============ 当前焦点需求(需求-001 精简卡片)============
// 来源:docs/06 §主流程需求基本字段(需求-001) + §6 任务图与依赖
// 状态轨迹:展示 7 主状态(已驳回作为异常标签,不在主轨迹中体现);当前在"执行中"
// 任务图缩略图:T0 时刻 7 任务状态(V0.2.0 阶段任务-7 占位)
export type FocusTrajectoryNode = {
  state: RequirementMainStatus
  isCurrent?: boolean
}

export type FocusTaskStatus = '待处理' | '执行中' | '已完成' | '占位'

export type FocusTaskNode = {
  id: string
  status: FocusTaskStatus
}

export type FocusRequirement = {
  code: string
  name: string
  mainStatus: RequirementMainStatus
  trajectory: FocusTrajectoryNode[]
  taskNodes: FocusTaskNode[]
  href: string
}

export const mockFocusRequirement: FocusRequirement = {
  code: '需求-001',
  name: '新增用户标签功能',
  mainStatus: '执行中',
  trajectory: [
    { state: '待澄清' },
    { state: '澄清中' },
    { state: 'PRD 已定' },
    { state: '拆解中' },
    { state: '执行中', isCurrent: true },
    { state: '待审查' },
    { state: '已完成' },
  ],
  // 节点顺序按依赖图阅读顺序:1 → 2/3 → 7 → 4/5 → 6
  taskNodes: [
    { id: '1', status: '执行中' },
    { id: '2', status: '待处理' },
    { id: '3', status: '待处理' },
    { id: '7', status: '占位' },
    { id: '4', status: '待处理' },
    { id: '5', status: '待处理' },
    { id: '6', status: '待处理' },
  ],
  href: '/requirements/001',
}

// ============ 待你决策事项 ============
// 来源:docs/06 §11.5 各时刻"待你决策事项"快照 + 注释(占位需求-004 常驻)
// T0 时刻主流程为空 → 用户裁定降级取 T1(任务-1 等待审查)+ 占位需求-004
// 主流程时刻与状态栏 T0 不严格一致(状态栏 14:15,决策事项含 14:23 任务-1 待审),按用户裁定保留
export type DecisionType = '任务待审查' | '需求待审查' | '澄清等待回复'

export type DecisionItem = {
  type: DecisionType
  title: string
  description: string
  href: string
}

export const mockDecisionItems: DecisionItem[] = [
  {
    type: '任务待审查',
    title: '任务-1 · 标签 schema 设计',
    description: '需求-001 数据层闸门',
    href: '/review/1',
  },
  {
    type: '需求待审查',
    title: '需求-004 · 新增评论 emoji 反应',
    description: '等待最终审查',
    href: '/requirements/004',
  },
]

// ============ 需求-001 详情页数据 ============
// 全部来源:docs/06 §多轮澄清记录、§PRD、§可行性评估、§任务图与依赖、§7 任务的样例数据
// 时刻基准:T0(14:15)启动执行后,任务-1 执行中、其他待处理、任务-7 占位

// 需求基本信息(详情页顶部)
export type RequirementDetail = {
  code: string
  name: string
  mainStatus: RequirementMainStatus
  anomalies: RequirementAnomaly[]
  submittedAt: string
  submittedBy: string
  rawDescription: string
}

export const mockRequirementDetail: RequirementDetail = {
  code: '需求-001',
  name: '新增用户标签功能',
  mainStatus: '执行中',
  anomalies: [],
  submittedAt: '2026-04-29 14:00',
  submittedBy: '产品负责人',
  rawDescription:
    '新增"用户标签"功能。用户可以给自己打多个标签,标签会出现在用户主页头像下方,管理员可以审核标签。',
}

// ============ 视图 A · 多轮澄清 ============
// 来源:docs/06 §多轮澄清记录(3 轮 + 二次澄清)
export type ClarifyTurn = {
  index: 1 | 2 | 3
  topic: string
  time: string
  question: string
  answer: string
  productResponse?: string
}

export const mockClarifyTurns: ClarifyTurn[] = [
  {
    index: 1,
    topic: '数据模型',
    time: '14:01',
    question:
      '我已收到您的需求。在进入 PRD 之前,我有几个数据模型方面的问题需要澄清:\n1. 用户标签是从预定义集合中选,还是用户自由输入?\n2. 每个用户最多可以打多少个标签?\n3. 是否允许多个用户使用相同的标签名(后端是否需要去重)?',
    answer:
      '用户自由输入。每个用户最多 5 个标签(头像下方需要一行内放完)。允许重复名,后端去重(同一用户重复提交同一名称不报错,直接忽略)。',
  },
  {
    index: 2,
    topic: '审核机制',
    time: '14:03',
    question:
      '数据模型清楚了。接下来是审核机制:\n1. 管理员审核是先审后发布(标签提交后默认隐藏,审核通过后才显示),还是发布后审核(标签提交后立即显示,审核中如发现违规再撤下)?\n2. 违规标签如何处理?直接删除 / 隐藏并通知用户 / 加入黑名单?\n3. 标签数量大时,审核工作量如何控制?是否要全审,还是有规则化筛选?',
    answer:
      '发布后审核(乐观流程,UX 优先)。违规标签隐藏并通知用户(不删除原数据,保留申诉空间)。审核工作量目前不大,先全审,后续如压力大再加规则化筛选(留 V0.3 锚点)。',
  },
  {
    index: 3,
    topic: 'UX 边界 + 用户确认进入 PRD',
    time: '14:06',
    question:
      '最后确认几个 UX 边界问题:\n1. 标签长度上限多少字符?\n2. 是否支持 emoji?\n3. 是否参与搜索?\n您的回答会直接落到 PRD 验收标准里。',
    answer:
      '≤20 字符。支持 emoji(用 utf8mb4)。暂不参与搜索(留 V0.3 锚点)。\n没有其他问题了,请进入 PRD。',
    productResponse:
      '已记录。PRD 草稿已生成,3 轮澄清记录已归档。点击"确认进入 PRD"后将进入架构师评估阶段。',
  },
]

// 二次澄清(由架构师评估识别 R-001 高风险触发)
export type SecondClarify = {
  topic: string
  time: string
  question: string
  answer: string
  prdAddition: string
}

export const mockSecondClarify: SecondClarify = {
  topic: 'XSS 缓解策略',
  time: '14:10',
  question:
    '架构师评估发现一个高风险:用户标签输入未明确转义策略,可能产生 XSS。在确认进入拆解前,需要您补充策略。当前可选:\n1. 仅服务端 escape(简单,但前端组件需保证不用 dangerouslySetInnerHTML)\n2. 仅前端转义(依赖 React 自动转义,但服务端入库未净化)\n3. 双保险(服务端 escape + 前端 React 自动转义,且禁用 dangerouslySetInnerHTML)',
  answer:
    '选 3,双保险。同时在 PRD 验收标准里加一条:"标签内容存储与展示均不允许 HTML 标签透传"。',
  prdAddition:
    '标签内容存储与展示均不允许 HTML 标签透传:服务端入库前转义 + 前端禁用 dangerouslySetInnerHTML 渲染标签。',
}

// ============ 视图 B · PRD ============
// 来源:docs/06 §PRD
export type UserStory = { role: string; want: string; reason: string }
export type AcceptanceCriterion = { text: string; addedBySecondClarify?: boolean }

export type PRDDocument = {
  background: string
  goals: string[]
  scopeIncluded: string[]
  scopeExcluded: string[]
  userStories: UserStory[]
  acceptanceCriteria: AcceptanceCriterion[]
}

export const mockPRD: PRDDocument = {
  background:
    '当前用户主页缺少快速展示用户身份特征的轻量入口,用户在头像旁只能看到用户名。增加自由输入的标签机制可让用户低成本表达个性,同时为管理员提供 UGC 治理工具。',
  goals: [
    '用户可自由输入并管理自己的标签,标签展示在主页头像下方。',
    '管理员可对全平台标签做发布后审核,违规标签可被隐藏并通知用户。',
    '数据模型与 API 设计上对未来"标签搜索 / 标签社群"等扩展保持开放。',
  ],
  scopeIncluded: [
    '用户标签 CRUD(增 / 改 / 删 / 查)',
    '用户主页标签展示组件(头像下方一行)',
    '管理员审核界面(列表 + 单条审核)',
    '后端审核 API(批准 / 隐藏)',
    '数据库 schema(用户与标签的关联表)',
  ],
  scopeExcluded: [
    '标签搜索能力(留 V0.3)',
    '标签互动(关注同标签用户、标签社群等,留 V0.3)',
    '规则化自动审核(留 V0.3)',
  ],
  userStories: [
    {
      role: '普通用户',
      want: '能给自己打最多 5 个标签',
      reason: '让我的主页更具个性,以便他人快速理解我',
    },
    {
      role: '用户主页访问者',
      want: '能在头像下方一行内看到该用户的全部标签(不超过 5 个)',
      reason: '不需要展开多行或点击',
    },
    {
      role: '管理员',
      want: '能在审核界面快速过滤新提交的标签并做批准 / 隐藏决策',
      reason: '以便控制 UGC 风险',
    },
  ],
  acceptanceCriteria: [
    {
      text:
        '用户可在主页编辑组件中添加 / 删除自己的标签,标签数量上限 5 个;超过 5 个时无法新增,组件给出明确提示。',
    },
    { text: '标签长度 ≤ 20 字符,支持 emoji(数据库使用 utf8mb4)。' },
    {
      text:
        '管理员审核界面可分页查看全平台标签,可对单条标签执行"批准"或"隐藏"操作。',
    },
    {
      text: '隐藏后的标签不再在用户主页显示,但保留在数据库供后续申诉与统计。',
    },
    {
      text:
        '任务-2、3、4、5、6、7 全部任务内验证通过(单元测试 / 代码检查 / 类型检查 / 契约校验),且任务-7 集成测试覆盖前后端联调主路径。',
    },
    {
      text:
        '标签内容存储与展示均不允许 HTML 标签透传:服务端入库前转义 + 前端禁用 dangerouslySetInnerHTML 渲染标签。',
      addedBySecondClarify: true,
    },
  ],
}

// ============ 视图 C · 可行性评估(含已驳回动线)============
// 来源:docs/06 §可行性评估 5.1~5.5
export type RiskLevel = '高' | '中' | '低'

export type RiskItem = {
  code: string
  level: RiskLevel
  description: string
  scope: string
  mitigation: string
  degradedFromHigh?: boolean
}

export type ImplementationDirection = { area: '后端' | '前端' | '测试'; content: string }
export type KeyDecision = { description: string; reason: string }

export type FeasibilityEvaluation = {
  firstEvalTime: string
  rejectedAtTime: string
  secondEvalTime: string
  firstRisks: RiskItem[]
  secondRisks: RiskItem[]
  firstConclusion: string
  secondConclusion: string
  implementationDirections: ImplementationDirection[]
  keyDecisions: KeyDecision[]
}

export const mockFeasibility: FeasibilityEvaluation = {
  firstEvalTime: '14:08',
  rejectedAtTime: '14:08',
  secondEvalTime: '14:13',
  firstRisks: [
    {
      code: 'R-001',
      level: '高',
      description:
        '标签注入风险:用户输入未严格校验可能 XSS。当前 PRD 仅约束长度与 emoji,未要求转义策略。',
      scope: '用户主页展示;管理员审核界面;移动端 webview 内嵌主页',
      mitigation: '(待用户补充)',
    },
    {
      code: 'R-002',
      level: '中',
      description:
        '标签搜索性能:大用户量下 LIKE 查询慢(虽然 PRD 约束"暂不参与搜索",但管理员审核界面已经隐含搜索)',
      scope: '审核接口;后续标签搜索扩展',
      mitigation: '加 (status, created_at) 复合索引;后续可扩展全文搜索',
    },
    {
      code: 'R-003',
      level: '中',
      description: '审核滞后导致违规暴露:发布后审核窗口期可能展示违规标签',
      scope: 'UGC 风险,平台合规',
      mitigation: '违规模式词典自动隐藏 + 高频提交用户白名单',
    },
    {
      code: 'R-004',
      level: '中',
      description:
        '数据库迁移影响:user 表加新关联表,在线迁移需保证用户读路径不卡顿',
      scope: '用户主页读路径(高 QPS)',
      mitigation: '索引提前创建 + 灰度发布 + 迁移可逆校验',
    },
    {
      code: 'R-005',
      level: '低',
      description: 'emoji 标签存储:必须 utf8mb4 字符集,否则 emoji 入库后变 ?',
      scope: 'DB 字段',
      mitigation: '在 schema 设计阶段确认 utf8mb4,任务-1 验收',
    },
  ],
  secondRisks: [
    {
      code: 'R-001',
      level: '中',
      description: '标签注入风险:已落实双保险缓解策略',
      scope: '用户主页展示;管理员审核界面;移动端 webview 内嵌主页',
      mitigation:
        '服务端 escape + 前端 React 自动转义 + 禁用 dangerouslySetInnerHTML 双保险;任务-4、5 验收标准追加"代码检查不允许 dangerouslySetInnerHTML"',
      degradedFromHigh: true,
    },
  ],
  firstConclusion: '有 1 项[高]风险(R-001)未明确缓解策略,触发驳回。',
  secondConclusion: '最终风险分布:0 高 + 4 中 + 1 低,满足进入拆解条件。',
  implementationDirections: [
    {
      area: '后端',
      content:
        'Node.js + TypeScript + Prisma ORM(沿用项目现有栈);标签存储 user_tags 关联表,字段 user_id、tag_name VARCHAR(20) utf8mb4、status ENUM(pending, approved, hidden)、created_at、updated_at;复合索引 (status, created_at)。',
    },
    {
      area: '前端',
      content:
        'React + TypeScript;主页标签编辑组件复用项目现有 ChipInput 组件,5 上限通过 props 控制;审核界面新建 AdminTagReview 路由组件,使用项目现有 Table 模块。',
    },
    {
      area: '测试',
      content:
        '单元测试 vitest 沿用;集成测试任务-7 用 supertest 跑前后端联调;端到端测试任务-6 用 playwright,主路径"普通用户登陆 → 编辑标签 → 管理员登陆 → 审核 → 主页验证显示"。',
    },
  ],
  keyDecisions: [
    {
      description: '状态枚举命名:pending / approved / hidden',
      reason: '不用 active / inactive,保留"被隐藏"语义,便于后续申诉与统计',
    },
    {
      description: '关联表 vs 用户字段:用关联表(user_tags),不在 user 表加 JSON 字段',
      reason: '审核与统计场景需独立索引',
    },
    {
      description: 'utf8mb4 范围:标签字段使用 utf8mb4,user 表保持现有 utf8',
      reason: '范围最小化变更',
    },
    {
      description:
        '驳回缓解策略:服务端 escape + 前端禁用 dangerouslySetInnerHTML 双保险',
      reason: '本次驳回的产物决策,前后端联合防御 XSS',
    },
  ],
}

// ============ 视图 D · 任务图(V0.2.0 实线 + 任务-7 占位)============
// 来源:docs/06 §6 任务图与依赖
// 布局:5 层垂直流动(沿用 docs/06 ASCII 布局)
// V0.2.0 阶段任务-7 占位,但图中节点 + 实线连接仍画出(仅视觉上半透明 + 虚线边框)
// 严禁:V0.2.0 阶段不画虚线契约依赖
export type TaskGraphNode = {
  id: string
  layer: number
  position: 'center' | 'left' | 'right'
  agentType: '后端' | '前端' | '测试'
  shortName: string
  status: TaskStatus | '占位'
  isPlaceholder?: boolean
}

export type TaskGraphEdge = { from: string; to: string }

export const mockTaskGraph: { nodes: TaskGraphNode[]; edges: TaskGraphEdge[] } = {
  nodes: [
    { id: '1', layer: 0, position: 'center', agentType: '后端', shortName: '标签 schema 设计', status: '执行中' },
    { id: '2', layer: 1, position: 'left', agentType: '后端', shortName: '标签 CRUD API', status: '待处理' },
    { id: '3', layer: 1, position: 'right', agentType: '后端', shortName: '标签审核 API', status: '待处理' },
    { id: '7', layer: 2, position: 'center', agentType: '测试', shortName: '后端集成测试', status: '占位', isPlaceholder: true },
    { id: '4', layer: 3, position: 'left', agentType: '前端', shortName: '主页编辑组件', status: '待处理' },
    { id: '5', layer: 3, position: 'right', agentType: '前端', shortName: '管理员审核界面', status: '待处理' },
    { id: '6', layer: 4, position: 'center', agentType: '测试', shortName: '端到端测试', status: '待处理' },
  ],
  edges: [
    { from: '1', to: '2' },
    { from: '1', to: '3' },
    { from: '2', to: '7' },
    { from: '3', to: '7' },
    { from: '7', to: '4' },
    { from: '7', to: '5' },
    { from: '4', to: '6' },
    { from: '5', to: '6' },
  ],
}

// ============ 视图 E · 执行进度(7 任务汇总)+ 任务板任务卡 ============
// 来源:docs/06 §7 任务的样例数据(各任务卡字段)
// T0 时刻状态:任务-1 执行中,其他待处理,任务-7 占位
// anomalies:T0 时刻 7 任务都没有异常标签;字段预留供后续切换时刻
export type TaskProgressItem = {
  id: string
  shortName: string
  agentType: '后端' | '前端' | '测试'
  status: TaskStatus | '占位'
  anomalies?: AnomalyTag[]
  validation?: string
  riskLevel?: RiskLevel
  isPlaceholder?: boolean
}

export const mockTaskProgress: TaskProgressItem[] = [
  { id: '1', shortName: '标签 schema 设计', agentType: '后端', status: '执行中', anomalies: [], validation: '进行中', riskLevel: '中' },
  { id: '2', shortName: '标签 CRUD API', agentType: '后端', status: '待处理', anomalies: [], riskLevel: '中' },
  { id: '3', shortName: '标签审核 API', agentType: '后端', status: '待处理', anomalies: [], riskLevel: '中' },
  { id: '7', shortName: '后端集成测试', agentType: '测试', status: '占位', isPlaceholder: true },
  { id: '4', shortName: '主页编辑组件', agentType: '前端', status: '待处理', anomalies: [], riskLevel: '中' },
  { id: '5', shortName: '管理员审核界面', agentType: '前端', status: '待处理', anomalies: [], riskLevel: '低' },
  { id: '6', shortName: '端到端测试', agentType: '测试', status: '待处理', anomalies: [], riskLevel: '低' },
]

// ============ 任务板分组(按需求分组的任务池视图)============
// 来源:docs/08 §任务板 - 主区域 + V0.2.0 阶段差异
// V0.2.0 阶段:
// - 需求-001:7 任务(任务-7 占位)
// - 需求-002:已完成,占位文案
// - 需求-003:待澄清,无任务,提示"未进入拆解"
// - 需求-004:待审查,无任务样例,提示"已完成执行"
// 排序:沿用需求工作台"需要你关注的程度"(执行中+人工介入 → 待审查 → 待澄清 → 已完成)
export type RequirementGroup = {
  id: string
  code: string
  name: string
  mainStatus: RequirementMainStatus
  taskCountReal?: number
  doneCount?: number
  inProgressCount?: number
  tasks?: TaskProgressItem[]
  emptyHint?: string
  defaultCollapsed?: boolean
}

export const mockRequirementGroups: RequirementGroup[] = [
  {
    id: '001',
    code: '需求-001',
    name: '新增用户标签功能',
    mainStatus: '执行中',
    taskCountReal: 7,
    doneCount: 0,
    inProgressCount: 1,
    tasks: mockTaskProgress,
  },
  {
    id: '004',
    code: '需求-004',
    name: '新增评论 emoji 反应',
    mainStatus: '待审查',
    emptyHint: '7 任务已完成执行,等待最终审查',
  },
  {
    id: '003',
    code: '需求-003',
    name: '优化首页加载性能',
    mainStatus: '待澄清',
    emptyHint: '未进入拆解,等待产品智能体启动澄清',
  },
  {
    id: '002',
    code: '需求-002',
    name: '修复登录页错误提示',
    mainStatus: '已完成',
    emptyHint: '5 个任务,已结束',
    defaultCollapsed: true,
  },
]

// ============ 需求级审查包(T5+ 时刻演示快照)============
// 来源:docs/06 §需求级审查包(10.1~10.7)
// 时刻:T5+(15:42),所有任务跑完、需求级审查包已生成
// 注意:需求-001 实际主状态为执行中(T0=14:15),本审查包是"假设跑完后"的演示快照
// V0.2.0 阶段:任务-7 在任务汇总中标"占位 · 不参与本次审查"

export type RequirementReviewSummary = {
  code: string
  name: string
  submittedAt: string
  completedAt: string
  duration: string
}

export type DeliveryComparison = {
  acceptanceCriterion: string
  delivery: string
  level: '已满足' | '部分满足' | '未满足'
}

export type TaskSummaryRow = {
  id: string
  shortName: string
  agentType: '后端' | '前端' | '测试'
  status: TaskStatus | '占位'
  validation: string
  riskLevel?: RiskLevel
  isPlaceholder?: boolean
}

export type IssueSeverity = '严重' | '警告' | '提示'

export type CrossTaskIssue = {
  index: number
  severity: IssueSeverity
  description: string
  involvedTaskIds: string[]
}

export type ReviewRiskSummary = {
  high: number
  medium: number
  low: number
  criticalCrossTaskIssues: number
}

export type ReviewSuggestion = {
  recommendation: string
  alternatives: { text: string; recommended?: boolean; notRecommended?: boolean }[]
}

export type RequirementReviewPackage = {
  summary: RequirementReviewSummary
  delivery: DeliveryComparison[]
  taskSummary: TaskSummaryRow[]
  crossTaskIssues: CrossTaskIssue[]
  riskSummary: ReviewRiskSummary
  suggestion: ReviewSuggestion
  isHighRisk: boolean
}

export const mockRequirementReview: RequirementReviewPackage = {
  summary: {
    code: '需求-001',
    name: '新增用户标签功能',
    submittedAt: '2026-04-29 14:00',
    completedAt: '2026-04-29 15:42',
    duration: '1 小时 42 分',
  },
  delivery: [
    {
      acceptanceCriterion:
        '用户可在主页编辑组件中添加 / 删除自己的标签,标签数量上限 5 个;超过 5 个时无法新增,组件给出明确提示。',
      delivery: '任务-4 实现,14 项单元测试覆盖',
      level: '已满足',
    },
    {
      acceptanceCriterion: '标签长度 ≤ 20 字符,支持 emoji(数据库使用 utf8mb4)。',
      delivery: '任务-1 schema + 任务-2 校验',
      level: '已满足',
    },
    {
      acceptanceCriterion:
        '管理员审核界面可分页查看全平台标签,可对单条标签执行"批准"或"隐藏"操作。',
      delivery: '任务-3 + 任务-5 实现',
      level: '已满足',
    },
    {
      acceptanceCriterion:
        '隐藏后的标签不再在用户主页显示,但保留在数据库供后续申诉与统计。',
      delivery: '任务-1 schema status = hidden 软隐藏',
      level: '已满足',
    },
    {
      acceptanceCriterion:
        '任务-2、3、4、5、6、7 全部任务内验证通过,且任务-7 集成测试覆盖前后端联调主路径。',
      delivery: 'V0.2.0 阶段任务-7 占位,其余 6 任务通过(6/6)',
      level: '部分满足',
    },
    {
      acceptanceCriterion:
        '标签内容存储与展示均不允许 HTML 标签透传:服务端入库前转义 + 前端禁用 dangerouslySetInnerHTML 渲染标签。',
      delivery: '服务端 escape(任务-2)+ 前端禁用 dangerouslySetInnerHTML(任务-4、5)',
      level: '已满足',
    },
  ],
  taskSummary: [
    { id: '1', shortName: '标签 schema 设计', agentType: '后端', status: '已完成', validation: '4/4 通过', riskLevel: '中' },
    { id: '2', shortName: '标签 CRUD API', agentType: '后端', status: '已完成', validation: '5/5 通过', riskLevel: '中' },
    { id: '3', shortName: '标签审核 API', agentType: '后端', status: '已完成', validation: '4/4 通过', riskLevel: '中' },
    { id: '7', shortName: '后端集成测试', agentType: '测试', status: '占位', validation: '占位 · 不参与本次审查', isPlaceholder: true },
    { id: '4', shortName: '主页编辑组件', agentType: '前端', status: '已完成', validation: '5/5 通过', riskLevel: '中' },
    { id: '5', shortName: '管理员审核界面', agentType: '前端', status: '已完成', validation: '4/4 通过', riskLevel: '低' },
    { id: '6', shortName: '端到端测试', agentType: '测试', status: '已完成', validation: '4/4 通过', riskLevel: '低' },
  ],
  crossTaskIssues: [
    {
      index: 1,
      severity: '严重',
      description:
        '任务-2 POST 接口直接返回新标签 visible 状态,但任务-3 审核流程 PRD 要求"发布后审核",新建标签应默认 pending。当前实现矛盾,需修复 POST 默认状态。',
      involvedTaskIds: ['2', '3'],
    },
    {
      index: 2,
      severity: '警告',
      description:
        '任务-4 前端组件假设标签创建后立即渲染,实际审核中可能不可见(契约不一致 · 与 #1 同源)。',
      involvedTaskIds: ['4'],
    },
    {
      index: 3,
      severity: '警告',
      description:
        '任务-5 审核界面"驳回"按钮提交后未主动刷新任务-2 列表 API,可能展示陈旧状态。',
      involvedTaskIds: ['5', '2'],
    },
    {
      index: 4,
      severity: '提示',
      description:
        '任务-1 schema 字段命名 tag_name 与任务-4 前端 props 命名 tagText 不一致,建议统一为 tagName。',
      involvedTaskIds: ['1', '4'],
    },
    {
      index: 5,
      severity: '提示',
      description:
        '任务-7 集成测试覆盖 GET/POST/PUT,未覆盖 DELETE 软删除场景(任务-1 schema 已支持软删除)。',
      involvedTaskIds: ['7'],
    },
    {
      index: 6,
      severity: '提示',
      description: 'PRD 提到"emoji 支持"但任务-2 单元测试未覆盖 emoji 用例。',
      involvedTaskIds: ['2'],
    },
  ],
  riskSummary: {
    high: 0,
    medium: 4,
    low: 1,
    criticalCrossTaskIssues: 1,
  },
  suggestion: {
    recommendation:
      '部分接受。任务-2 #1 严重问题需重做,任务-4 #2 联动修改,其他任务接受。',
    alternatives: [
      {
        text: '全量拒绝并反馈(把 #1 / #2 / #3 一并打回执行中)',
      },
      {
        text: '接受需求结果(忽略 #1,留作 hotfix)',
        notRecommended: true,
      },
    ],
  },
  // 当前需求虽无高风险,但有 1 项严重跨任务问题(#1),触发"接受需求结果"二次确认
  isHighRisk: true,
}
