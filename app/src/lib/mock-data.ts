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

// ============ 任务详情数据(任务-1/2 完整、3-6 精简、7 占位)============
// 来源:docs/06 §7.1~7.7
// 时刻基准:T5+ 完成时刻(主流程演进结束)
// 注意:与外壳/任务板 T0 时刻状态不一致,demo 已知;任务详情页提供"任务全生命周期"视角
// V0.2.0 阶段任务-7 占位,内容字段大都不展开

export type TaskDetailContext = {
  role: string
  task: string
  projectRules: string
  workspace: string
  validations: string
  lastFeedback: string
  safetyMode: '严格' | '宽松'
}

export type TaskRunRecord = {
  id: string
  startedAt: string
  endedAt: string | null
  result: string
  validation: string
  trigger?: string
}

export type FileChange = {
  file: string
  type: '新增' | '修改' | '删除'
  addedLines?: number
  removedLines?: number
  noteApprox?: boolean
}

export type FileDiff = { file: string; diff: string }

export type ValidationItem = {
  name: string
  result: '通过' | '未通过' | '跳过'
  detail: string
}

export type TaskReviewBundle = {
  summary: string
  agentSummary: string
  acceptanceResult: string
  risks: string
  suggestion: string
}

export type TaskDetailFull = {
  id: string
  shortName: string
  fullName: string
  agentType: '后端' | '前端' | '测试'
  status: TaskStatus | '占位'
  anomalies: AnomalyTag[]
  validation: string
  riskLevel?: RiskLevel
  isPlaceholder?: boolean

  overview: { goal: string; dependencies: string; workspace: string }
  context: TaskDetailContext
  acceptanceCriteria: string[]
  runs: TaskRunRecord[]

  timeline: { time: string; text: string }[]
  changes: FileChange[]
  diffs: FileDiff[]
  validations: ValidationItem[]
  review: TaskReviewBundle
}

export const mockTaskDetails: Record<string, TaskDetailFull> = {
  '1': {
    id: '1',
    shortName: '标签 schema 设计',
    fullName: '标签数据库 schema 设计 + 迁移',
    agentType: '后端',
    status: '已完成',
    anomalies: [],
    validation: '4/4 通过',
    riskLevel: '中',
    overview: {
      goal: '为用户标签功能设计数据库 schema(user_tags 关联表),并产出迁移脚本。',
      dependencies: '无前置任务',
      workspace: 'feat/tags-schema',
    },
    context: {
      role: '后端智能体',
      task: '为用户标签功能设计 user_tags 关联表,产出 schema + 迁移脚本',
      projectRules: '使用 Prisma ORM;字段命名 snake_case;迁移脚本必须可逆',
      workspace: 'feat/tags-schema(独立分支)',
      validations: '迁移脚本应用 + 回滚双向测试 + 索引存在性校验 + utf8mb4 字符集校验',
      lastFeedback: '无',
      safetyMode: '严格',
    },
    acceptanceCriteria: [
      'user_tags 表创建成功,字段:id、user_id、tag_name VARCHAR(20)、status ENUM(pending, approved, hidden)、created_at、updated_at',
      '字段 tag_name 字符集为 utf8mb4,可存储 emoji',
      '复合索引 (status, created_at) 创建成功',
      '迁移脚本可逆(up + down 都能执行)',
    ],
    runs: [
      { id: '1', startedAt: '14:15', endedAt: '14:23', result: '已完成', validation: '4/4 通过', trigger: '首次提交' },
    ],
    timeline: [
      { time: '14:15', text: '任务-1 已分发给后端智能体' },
      { time: '14:15', text: '后端智能体已开始执行任务-1' },
      { time: '14:16', text: '后端智能体读取了 prisma/schema.prisma' },
      { time: '14:18', text: '后端智能体修改了 prisma/schema.prisma' },
      { time: '14:20', text: '后端智能体新增了 prisma/migrations/20260429_add_user_tags/migration.sql' },
      { time: '14:21', text: '跑迁移脚本(up)' },
      { time: '14:22', text: '跑迁移脚本(down)— 验证可逆' },
      { time: '14:22', text: '任务内验证全部通过(4/4)' },
      { time: '14:23', text: '任务-1 单任务审查包已生成' },
      { time: '14:23', text: '任务-1 等待人工接受(数据层闸门)' },
    ],
    changes: [
      { file: 'prisma/schema.prisma', type: '修改', addedLines: 14, removedLines: 0 },
      { file: 'prisma/migrations/20260429_add_user_tags/migration.sql', type: '新增', addedLines: 22, removedLines: 0 },
    ],
    diffs: [
      {
        file: 'prisma/schema.prisma',
        diff: `+ model UserTag {
+   id         Int       @id @default(autoincrement())
+   userId     Int       @map("user_id")
+   tagName    String    @map("tag_name") @db.VarChar(20)
+   status     TagStatus @default(pending)
+   createdAt  DateTime  @default(now()) @map("created_at")
+   updatedAt  DateTime  @updatedAt        @map("updated_at")
+
+   user       User      @relation(fields: [userId], references: [id])
+
+   @@map("user_tags")
+   @@index([status, createdAt], name: "idx_status_created_at")
+ }
+
+ enum TagStatus {
+   pending
+   approved
+   hidden
+ }`,
      },
    ],
    validations: [
      { name: '单元测试', result: '跳过', detail: '0/0(schema 任务无单元测试)' },
      { name: '代码检查', result: '通过', detail: '0 警告' },
      { name: '类型检查', result: '通过', detail: 'Prisma generate 无错误' },
      { name: '迁移可逆校验', result: '通过', detail: 'up + down 双向测试均通过' },
    ],
    review: {
      summary: '为用户标签功能设计数据库 schema 并产出迁移脚本。',
      agentSummary:
        'UserTag 模型已建立,关联 User,字段长度 20 字符,utf8mb4 兼容 emoji。(status, created_at) 复合索引支持后续审核分页。迁移脚本可逆,up + down 双向测试通过。',
      acceptanceResult: '4/4 通过',
      risks: '对 user 表加新关联表,在线灰度需注意大表迁移性能(对应 R-004)',
      suggestion: '迁移脚本结构合理,字段命名符合 snake_case 规范,可接受。',
    },
  },

  '2': {
    id: '2',
    shortName: '标签 CRUD API',
    fullName: '标签 CRUD API 实现',
    agentType: '后端',
    status: '已完成',
    anomalies: [],
    validation: '5/5 通过',
    riskLevel: '中',
    overview: {
      goal: '实现 GET/POST/PUT/DELETE 四个 RESTful 标签 API,基于任务-1 schema。',
      dependencies: '任务-1',
      workspace: 'feat/tags-api',
    },
    context: {
      role: '后端智能体',
      task: '实现标签 CRUD API,4 个 endpoint(GET 列表 / POST 新建 / PUT 更新 / DELETE 删除)',
      projectRules:
        'Express.js + Prisma;每个 endpoint 必须有单元测试;参数校验用 zod;新建标签默认 status = pending(对应 PRD 第 6 条与跨任务一致性 #1)',
      workspace: 'feat/tags-api',
      validations: '单元测试 / 代码检查 / 类型检查 / 契约校验 / 服务端 escape 检查',
      lastFeedback: '无',
      safetyMode: '严格',
    },
    acceptanceCriteria: [
      'GET /api/tags 返回当前用户的标签列表,支持游标分页',
      'POST /api/tags 创建新标签,默认 status = pending,长度校验 ≤20,允许重复名内部去重',
      'PUT /api/tags/:id 更新标签名(仅本人可改)',
      'DELETE /api/tags/:id 删除标签(硬删除默认;预留软删除走 PUT 改 status = hidden)',
      '全部 endpoint 单元测试通过,服务端 escape 已实现',
    ],
    runs: [
      { id: '1', startedAt: '14:24', endedAt: '14:51', result: '已完成', validation: '5/5 通过', trigger: '首次提交' },
    ],
    timeline: [
      { time: '14:24', text: '任务-2 已分发给后端智能体' },
      { time: '14:24', text: '后端智能体已开始执行任务-2' },
      { time: '14:30', text: '设计 GET /api/tags 接口结构' },
      { time: '14:33', text: '实现 GET /api/tags(游标分页)' },
      { time: '14:38', text: '实现 POST /api/tags(默认 pending,服务端 escape)' },
      { time: '14:42', text: '实现 PUT /api/tags/:id(本人鉴权)' },
      { time: '14:45', text: '实现 DELETE /api/tags/:id(硬删除)' },
      { time: '14:48', text: '修复 emoji 截断 bug(grapheme cluster 拆分)' },
      { time: '14:50', text: '任务内验证全部通过(5/5)' },
      { time: '14:51', text: '任务-2 单任务审查包已生成,自动放行' },
    ],
    changes: [
      { file: 'src/api/tags/index.ts', type: '新增', addedLines: 98, removedLines: 0 },
      { file: 'src/api/tags/tags.test.ts', type: '新增', addedLines: 156, removedLines: 0 },
      { file: 'src/api/schema/tags.ts', type: '新增', addedLines: 24, removedLines: 0 },
    ],
    diffs: [
      {
        file: 'src/api/tags/index.ts',
        diff: `+ import { Router } from 'express'
+ import { prisma } from '@/lib/prisma'
+ import { tagInputSchema } from './tags.schema'
+ import { escape } from '@/lib/sanitize'
+
+ export const tagsRouter = Router()
+
+ // GET /api/tags — 当前用户的标签列表(游标分页)
+ tagsRouter.get('/', async (req, res) => {
+   const cursor = req.query.cursor ? Number(req.query.cursor) : undefined
+   const tags = await prisma.userTag.findMany({
+     where: { userId: req.user.id, status: { not: 'hidden' } },
+     take: 20,
+     ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
+     orderBy: { createdAt: 'desc' },
+   })
+   res.json({ tags, nextCursor: tags.at(-1)?.id ?? null })
+ })
+
+ // POST /api/tags — 新建标签(默认 pending)
+ tagsRouter.post('/', async (req, res) => {
+   const parsed = tagInputSchema.parse(req.body)
+   const safeName = escape(parsed.tagName)
+   // 同用户重复名静默忽略
+   const existing = await prisma.userTag.findFirst({
+     where: { userId: req.user.id, tagName: safeName },
+   })
+   if (existing) return res.status(200).json({ tag: existing })
+   const created = await prisma.userTag.create({
+     data: { userId: req.user.id, tagName: safeName, status: 'pending' },
+   })
+   res.status(201).json({ tag: created })
+ })`,
      },
    ],
    validations: [
      { name: '单元测试', result: '通过', detail: '22 / 22' },
      { name: '代码检查', result: '通过', detail: '0 警告' },
      { name: '类型检查', result: '通过', detail: '0 错误' },
      { name: '契约校验', result: '通过', detail: 'OpenAPI 与实现匹配' },
      { name: '服务端 escape 检查', result: '通过', detail: '全部 endpoint 输入均经过 escape' },
    ],
    review: {
      summary: '实现标签 CRUD API,4 endpoint。',
      agentSummary:
        'GET 支持游标分页;POST 默认 status = pending,同用户重名静默去重;PUT 限本人;DELETE 默认硬删除,软删除留 PUT 改 status。服务端 escape 接入,单元测试覆盖正常 + 边界,共 22 项全通过。',
      acceptanceResult: '5/5 通过',
      risks:
        '重名静默去重对前端不友好(用户不知道为什么"看似新建却没出现"),需任务-4 配合显示 toast(对应跨任务一致性 #2)。',
      suggestion: '接受,但建议跨任务对齐(任务-4 提示用户)。',
    },
  },

  '3': {
    id: '3',
    shortName: '标签审核 API',
    fullName: '标签审核 API(管理员)',
    agentType: '后端',
    status: '已完成',
    anomalies: [],
    validation: '4/4 通过',
    riskLevel: '中',
    overview: {
      goal: '实现 3 个管理员鉴权的审核 API:列表 / 批准 / 隐藏(隐藏附带用户通知)。',
      dependencies: '任务-1',
      workspace: 'feat/tags-admin-api',
    },
    context: {
      role: '后端智能体',
      task: '实现标签审核 API,3 endpoint(列表 / 批准 / 隐藏)',
      projectRules: 'Express.js + Prisma;复用 requireAdmin middleware;通知接入项目现有 notification 模块',
      workspace: 'feat/tags-admin-api',
      validations: '单元测试 / 代码检查 / 类型检查 / 契约校验',
      lastFeedback: '无',
      safetyMode: '严格',
    },
    acceptanceCriteria: [
      'GET /api/admin/tags 返回全平台待审核标签列表,管理员鉴权',
      'POST /api/admin/tags/:id/approve 批准标签',
      'POST /api/admin/tags/:id/hide 隐藏标签 + 通知用户',
      '全部 endpoint 鉴权检查管理员角色,非管理员 403',
    ],
    runs: [
      { id: '1', startedAt: '14:24', endedAt: '14:54', result: '已完成', validation: '4/4 通过', trigger: '首次提交' },
    ],
    timeline: [
      { time: '14:24', text: '任务-3 已分发给后端智能体' },
      { time: '14:24', text: '后端智能体已开始执行任务-3' },
      { time: '14:35', text: '复用 requireAdmin middleware,实现 3 endpoint' },
      { time: '14:50', text: '接入 notification 模块,模板"您的标签已被隐藏"' },
      { time: '14:53', text: '任务内验证全部通过(4/4)' },
      { time: '14:54', text: '任务-3 单任务审查包已生成,自动放行' },
    ],
    changes: [
      { file: 'src/api/admin/tags/index.ts', type: '新增', addedLines: 110, removedLines: 0, noteApprox: true },
      { file: 'src/api/admin/tags/tags.test.ts', type: '新增', addedLines: 140, removedLines: 0, noteApprox: true },
      { file: 'src/lib/notification/tag-hidden.ts', type: '新增', addedLines: 30, removedLines: 0, noteApprox: true },
    ],
    diffs: [
      {
        file: 'src/api/admin/tags/index.ts',
        diff: `+ import { Router } from 'express'
+ import { requireAdmin } from '@/middleware/require-admin'
+ import { prisma } from '@/lib/prisma'
+ import { notifyTagHidden } from '@/lib/notification/tag-hidden'
+
+ export const adminTagsRouter = Router()
+ adminTagsRouter.use(requireAdmin)
+
+ // 列表(待审核)
+ adminTagsRouter.get('/', async (_req, res) => { /* ... */ })
+
+ // 批准
+ adminTagsRouter.post('/:id/approve', async (req, res) => { /* ... */ })
+
+ // 隐藏 + 通知用户
+ adminTagsRouter.post('/:id/hide', async (req, res) => {
+   const tag = await prisma.userTag.update({
+     where: { id: Number(req.params.id) },
+     data: { status: 'hidden' },
+   })
+   await notifyTagHidden(tag)
+   res.json({ tag })
+ })`,
      },
    ],
    validations: [
      { name: '单元测试', result: '通过', detail: '18 / 18' },
      { name: '代码检查', result: '通过', detail: '0 警告' },
      { name: '类型检查', result: '通过', detail: '0 错误' },
      { name: '契约校验', result: '通过', detail: 'OpenAPI 与实现匹配' },
    ],
    review: {
      summary: '实现 3 endpoint:列表 / 批准 / 隐藏(隐藏附带用户通知)。',
      agentSummary:
        '鉴权基于现有 requireAdmin middleware 复用;通知接入项目现有 notification 模块,模板"您的标签 \'{tagName}\' 因违规被隐藏"。',
      acceptanceResult: '4/4 通过',
      risks: '批准 / 隐藏后需要返回最新状态供任务-5 前端刷新,该约束已在跨任务一致性 #3 中识别',
      suggestion: '接受。注意:批准 / 隐藏后需要返回最新状态供任务-5 前端刷新。',
    },
  },

  '4': {
    id: '4',
    shortName: '主页编辑组件',
    fullName: '用户主页标签编辑组件',
    agentType: '前端',
    status: '已完成',
    anomalies: [],
    validation: '5/5 通过',
    riskLevel: '中',
    overview: {
      goal: '主页头像下方一行内展示用户标签,最多 5 个,可编辑(添加 / 删除)。',
      dependencies: '任务-7',
      workspace: 'feat/tags-profile',
    },
    context: {
      role: '前端智能体',
      task: '实现用户主页 TagEditor 与 TagDisplay 组件,嵌入主页 [id].tsx',
      projectRules:
        'React + TypeScript;复用项目现有 ChipInput;ESLint 强制禁用 dangerouslySetInnerHTML',
      workspace: 'feat/tags-profile',
      validations: '单元测试 / 代码检查(含 dangerouslySetInnerHTML 规则)/ 类型检查 / 契约校验 / 视觉回归',
      lastFeedback: '无',
      safetyMode: '严格',
    },
    acceptanceCriteria: [
      '主页头像下方一行内展示用户标签,最多 5 个',
      '编辑模式下可添加 / 删除标签,超过 5 个无法新增,组件给提示',
      '标签长度校验 ≤20 字符,前端硬约束输入框',
      '不允许 dangerouslySetInnerHTML(对应 D-1 双保险约束 + ESLint 规则强制)',
      '单元测试 + 视觉回归测试通过',
    ],
    runs: [
      { id: '1', startedAt: '15:01', endedAt: '15:18', result: '已完成', validation: '5/5 通过', trigger: '首次提交' },
    ],
    timeline: [
      { time: '15:01', text: '任务-4 已分发给前端智能体' },
      { time: '15:01', text: '前端智能体已开始执行任务-4' },
      { time: '15:09', text: '完成 TagEditor + 单元测试' },
      { time: '15:14', text: '完成 TagDisplay,嵌入主页 [id].tsx' },
      { time: '15:17', text: '视觉回归通过' },
      { time: '15:18', text: '任务-4 单任务审查包已生成,自动放行' },
    ],
    changes: [
      { file: 'src/components/profile/TagEditor.tsx', type: '新增', addedLines: 120, noteApprox: true },
      { file: 'src/components/profile/TagDisplay.tsx', type: '新增', addedLines: 60, noteApprox: true },
      { file: 'src/components/profile/TagEditor.test.tsx', type: '新增', addedLines: 95, noteApprox: true },
      { file: 'src/pages/profile/[id].tsx', type: '修改', addedLines: 12, removedLines: 3 },
    ],
    diffs: [
      {
        file: 'src/components/profile/TagEditor.tsx',
        diff: `+ import { ChipInput } from '@/components/common/ChipInput'
+
+ const MAX_TAGS = 5
+ const MAX_TAG_LEN = 20
+
+ export function TagEditor({ tags, onChange }: { tags: string[]; onChange: (next: string[]) => void }) {
+   const handleAdd = (next: string) => {
+     if (tags.length >= MAX_TAGS) return alert('已达上限 5 个')
+     if (next.length > MAX_TAG_LEN) return alert('标签长度需 ≤ 20 字符')
+     onChange([...tags, next])
+   }
+   const handleRemove = (i: number) => onChange(tags.filter((_, idx) => idx !== i))
+   return <ChipInput chips={tags} onAdd={handleAdd} onRemove={handleRemove} />
+ }`,
      },
    ],
    validations: [
      { name: '单元测试', result: '通过', detail: '14 / 14' },
      { name: '代码检查', result: '通过', detail: '0 警告(含 ESLint 规则禁用 dangerouslySetInnerHTML)' },
      { name: '类型检查', result: '通过', detail: '0 错误' },
      { name: '契约校验', result: '通过', detail: 'API 调用与任务-2 OpenAPI 匹配' },
      { name: '视觉回归', result: '通过', detail: '主页头像下方一行排版正常' },
    ],
    review: {
      summary: '主页 TagEditor + TagDisplay 组件,嵌入 [id].tsx。',
      agentSummary:
        'TagEditor 复用 ChipInput,5 上限通过 props(D-10);TagDisplay 静态渲染依赖 React 自动转义,无 dangerouslySetInnerHTML(D-11);主页 [id].tsx 嵌入 TagDisplay。',
      acceptanceResult: '5/5 通过',
      risks: '任务-2 重名静默去重未在前端提示用户(对应跨任务一致性 #2)',
      suggestion: '接受。建议跨任务一致性 #2 后续补 toast。',
    },
  },

  '5': {
    id: '5',
    shortName: '管理员审核界面',
    fullName: '管理员审核界面',
    agentType: '前端',
    status: '已完成',
    anomalies: [],
    validation: '4/4 通过',
    riskLevel: '低',
    overview: {
      goal: '/admin/tags 路由展示标签列表,可分页;单条标签可批准或隐藏。',
      dependencies: '任务-7',
      workspace: 'feat/tags-admin-ui',
    },
    context: {
      role: '前端智能体',
      task: '实现 /admin/tags 路由 + TagReviewTable 组件,接入任务-3 API',
      projectRules: 'React + TypeScript;复用 Table 组件;optimistic update + 失败回滚',
      workspace: 'feat/tags-admin-ui',
      validations: '单元测试 / 代码检查 / 类型检查 / 契约校验',
      lastFeedback: '无',
      safetyMode: '严格',
    },
    acceptanceCriteria: [
      '/admin/tags 路由展示标签列表,可分页',
      '单条标签可点击"批准"或"隐藏"按钮,操作后立即刷新该行状态',
      '鉴权:非管理员访问 /admin/tags 跳转登录页',
      '不允许 dangerouslySetInnerHTML',
    ],
    runs: [
      { id: '1', startedAt: '15:01', endedAt: '15:19', result: '已完成', validation: '4/4 通过', trigger: '首次提交' },
    ],
    timeline: [
      { time: '15:01', text: '任务-5 已分发给前端智能体' },
      { time: '15:01', text: '前端智能体已开始执行任务-5' },
      { time: '15:13', text: '完成 TagReviewTable + optimistic update' },
      { time: '15:18', text: '任务内验证全部通过(4/4)' },
      { time: '15:19', text: '任务-5 单任务审查包已生成,自动放行' },
    ],
    changes: [
      { file: 'src/pages/admin/tags/index.tsx', type: '新增', addedLines: 150, noteApprox: true },
      { file: 'src/components/admin/TagReviewTable.tsx', type: '新增', addedLines: 110, noteApprox: true },
      { file: 'src/pages/admin/tags/index.test.tsx', type: '新增', addedLines: 80, noteApprox: true },
    ],
    diffs: [
      {
        file: 'src/components/admin/TagReviewTable.tsx',
        diff: `+ import { Table } from '@/components/common/Table'
+ import { useApproveTag, useHideTag } from '@/api/admin-tags'
+
+ export function TagReviewTable({ rows }: { rows: AdminTag[] }) {
+   const approve = useApproveTag()
+   const hide = useHideTag()
+   return (
+     <Table
+       rows={rows}
+       columns={[
+         { key: 'id', title: 'ID' },
+         { key: 'tagName', title: '标签名' },
+         { key: 'status', title: '状态' },
+         {
+           key: 'actions',
+           title: '操作',
+           render: (row) => (
+             <>
+               <button onClick={() => approve.mutate(row.id)}>批准</button>
+               <button onClick={() => hide.mutate(row.id)}>隐藏</button>
+             </>
+           ),
+         },
+       ]}
+     />
+   )
+ }`,
      },
    ],
    validations: [
      { name: '单元测试', result: '通过', detail: '11 / 11' },
      { name: '代码检查', result: '通过', detail: '0 警告' },
      { name: '类型检查', result: '通过', detail: '0 错误' },
      { name: '契约校验', result: '通过', detail: 'API 调用与任务-3 OpenAPI 匹配' },
    ],
    review: {
      summary: '/admin/tags 路由 + TagReviewTable,接入任务-3 API。',
      agentSummary:
        '复用 Table 组件;操作后调用任务-3 API,本地 optimistic update,失败回滚(D-12);鉴权用现有 requireAdmin HOC。',
      acceptanceResult: '4/4 通过',
      risks: 'operation 完成后未主动调任务-2 列表 API 刷新主页(对应跨任务一致性 #3)',
      suggestion: '接受。建议跨任务一致性 #3 后续补一次主页刷新或 SWR 缓存失效。',
    },
  },

  '6': {
    id: '6',
    shortName: '端到端测试',
    fullName: '标签流程端到端测试',
    agentType: '测试',
    status: '已完成',
    anomalies: [],
    validation: '4/4 通过',
    riskLevel: '低',
    overview: {
      goal: '端到端测试覆盖主路径:用户登录 → 编辑标签 → 管理员登录 → 审核 → 主页验证。',
      dependencies: '任务-4 + 任务-5',
      workspace: 'feat/tags-e2e',
    },
    context: {
      role: '测试智能体',
      task: '用 playwright 实现 3 条端到端用例',
      projectRules: 'playwright;每个 case 后清理数据;CI 上稳定运行,无 flaky',
      workspace: 'feat/tags-e2e',
      validations: '端到端测试 / 代码检查 / 类型检查 / Flaky 检测',
      lastFeedback: '无',
      safetyMode: '严格',
    },
    acceptanceCriteria: [
      '端到端测试覆盖主路径:普通用户登录 → 编辑标签 → 管理员登录 → 审核 → 主页验证显示',
      '测试覆盖至少 1 条违规标签隐藏路径',
      '测试在 CI 上稳定运行,无 flaky',
      '测试通过率 100%',
    ],
    runs: [
      { id: '1', startedAt: '15:20', endedAt: '15:36', result: '已完成', validation: '4/4 通过', trigger: '首次提交' },
    ],
    timeline: [
      { time: '15:20', text: '任务-6 已分发给测试智能体' },
      { time: '15:20', text: '测试智能体已开始执行任务-6' },
      { time: '15:30', text: '完成 3 条 playwright 用例(正常路径 / 5 标签上限 / 违规隐藏)' },
      { time: '15:35', text: '连续 5 次执行均稳定,无 flaky' },
      { time: '15:36', text: '任务-6 单任务审查包已生成,等待人工接受(端到端闸门)' },
    ],
    changes: [
      { file: 'e2e/tags-flow.spec.ts', type: '新增', addedLines: 180, noteApprox: true },
      { file: 'e2e/fixtures/users.ts', type: '修改', addedLines: 20, removedLines: 0 },
    ],
    diffs: [
      {
        file: 'e2e/tags-flow.spec.ts',
        diff: `+ import { test, expect } from '@playwright/test'
+ import { loginAs } from './fixtures/users'
+
+ test('用户编辑标签后,管理员审核通过,主页显示', async ({ page }) => {
+   await loginAs(page, 'user')
+   await page.goto('/profile/me/edit')
+   await page.fill('[data-testid="tag-input"]', '前端工程师')
+   await page.click('[data-testid="add-tag"]')
+   await loginAs(page, 'admin')
+   await page.goto('/admin/tags')
+   await page.click('[data-testid="approve-1"]')
+   await page.goto('/profile/me')
+   await expect(page.locator('[data-testid="tag-display"]')).toContainText('前端工程师')
+ })`,
      },
    ],
    validations: [
      { name: '端到端测试', result: '通过', detail: '3 / 3' },
      { name: '代码检查', result: '通过', detail: '0 警告' },
      { name: '类型检查', result: '通过', detail: '0 错误' },
      { name: 'Flaky 检测', result: '通过', detail: '连续 5 次执行均稳定' },
    ],
    review: {
      summary: 'playwright 端到端测试 3 条用例,覆盖主路径 + 5 标签上限 + 违规隐藏。',
      agentSummary:
        '用 fixture user 模拟 + 数据库 seed,在每个 case 后清理。3 条用例全部通过,无 flaky。',
      acceptanceResult: '4/4 通过',
      risks: '未覆盖 emoji 标签(对应跨任务一致性 #6),emoji 用例放本地单元测试覆盖(D-13)',
      suggestion: '接受。emoji 端到端覆盖留 V0.3 锚点。',
    },
  },

  '7': {
    id: '7',
    shortName: '后端集成测试',
    fullName: '后端集成测试(V0.2.0 占位)',
    agentType: '测试',
    status: '占位',
    anomalies: [],
    validation: '占位 · 不参与本次审查',
    isPlaceholder: true,
    overview: {
      goal: '集成测试覆盖任务-2、3 全部 endpoint 联调(V0.2.1 阶段激活)',
      dependencies: '任务-2 + 任务-3',
      workspace: '(V0.2.1 激活后分配)',
    },
    context: {
      role: '测试智能体',
      task: '(V0.2.0 阶段占位,任务未启动)',
      projectRules: '—',
      workspace: '—',
      validations: '—',
      lastFeedback: '—',
      safetyMode: '严格',
    },
    acceptanceCriteria: [
      '集成测试覆盖任务-2、3 全部 endpoint 联调(待 V0.2.1)',
      '测试覆盖前后端数据契约一致性',
      '测试通过率 100%',
      'CI 集成测试时间 < 60 秒',
    ],
    runs: [],
    timeline: [],
    changes: [],
    diffs: [],
    validations: [],
    review: {
      summary: '(V0.2.0 阶段占位,任务未启动)',
      agentSummary: '—',
      acceptanceResult: '—',
      risks: '—',
      suggestion: '—',
    },
  },
}
