import { useCallback, useEffect, useMemo, useState } from 'react'
import './App.css'

const publicAsset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`

const tones = {
  blue: '#4b7bff',
  cyan: '#00d6c9',
  green: '#23d18b',
  gold: '#f4b740',
  coral: '#ff6b57',
  purple: '#7c3aed',
  danger: '#ff4d6d',
}

const slides = [
  {
    section: '开场',
    kind: 'hero',
    kicker: '30 分钟内部分享',
    title: '多模型协作下的 AI 产品经理工作流',
    subtitle: '从页面截图到 PRD、设计初稿、本地运行与上下文治理，把不稳定的大模型能力组织成稳定的产品生产流程。',
    stats: [
      ['7', '核心流程节点'],
      ['5', 'AI 工具分工'],
      ['1', '事实源与上下文治理'],
    ],
  },
  {
    section: '问题定义',
    kind: 'compare',
    kicker: 'Problem',
    title: '为什么不能让一个模型从头做到尾？',
  },
  {
    section: '方法论',
    kind: 'principles',
    kicker: 'Method',
    title: '这套流程的本质：能力编排',
    quote: '把任务拆给更适合的模型，再用结构化产物、人工校验和上下文治理控制幻觉。',
  },
  {
    section: '模型分工',
    kind: 'modelBias',
    kicker: 'Why These Tools',
    title: '工具选择来自能力偏向，而不是工具崇拜',
  },
  {
    section: '流程总览',
    kind: 'pipeline',
    kicker: 'Pipeline',
    title: '从截图到可运行项目的完整链路',
  },
  {
    section: '需求预处理',
    kind: 'prep',
    kicker: 'Before AI',
    title: '需求进入 AI 前，PM 要先定义问题',
  },
  {
    section: '截图输入',
    kind: 'capture',
    kicker: 'Step 1',
    title: '输入越真实，后面越稳定',
  },
  {
    section: '豆包拆解',
    kind: 'doubao',
    kicker: 'Step 2',
    title: '豆包负责看图，但不负责做判断',
  },
  {
    section: '文档型素材案例',
    kind: 'pdfCase',
    kicker: 'Real Case',
    title: '规则文档也可以进入同一套工作流',
  },
  {
    section: 'DeepSeek 清洗',
    kind: 'deepseek',
    kicker: 'Step 3',
    title: 'DeepSeek 负责把原始拆解变成可用 PRD',
  },
  {
    section: 'Figma 初稿',
    kind: 'figma',
    kicker: 'Step 4',
    title: 'Figma 负责快速起稿，不负责最终定稿',
  },
  {
    section: '工程落地',
    kind: 'code',
    kicker: 'Step 5',
    title: '跑起来，才知道能不能继续改',
  },
  {
    section: '中间产物',
    kind: 'artifacts',
    kicker: 'Artifacts',
    title: '每一步都要留下可检查的产物',
  },
  {
    section: '产物验收',
    kind: 'acceptance',
    kicker: 'Acceptance',
    title: 'AI 输出后，用四个问题做验收',
  },
  {
    section: '上下文治理',
    kind: 'context',
    kicker: 'Context',
    title: '复杂任务里，管理上下文就是管理质量',
  },
  {
    section: '备忘录',
    kind: 'memo',
    kicker: 'Memo',
    title: '备忘录是项目的事实源',
  },
  {
    section: '局部分支',
    kind: 'branch',
    kicker: 'Branch',
    title: '不要把所有问题都塞进主上下文',
  },
  {
    section: '风险控制',
    kind: 'risk',
    kicker: 'Risk Control',
    title: '多模型协作不是自动正确',
  },
  {
    section: '能力边界',
    kind: 'boundary',
    kicker: 'Boundary',
    title: 'AI 适合提效，但不适合替代判断',
  },
  {
    section: '提示词',
    kind: 'prompts',
    kicker: 'Prompts',
    title: '提示词的重点是边界，不是客气',
  },
  {
    section: '总结',
    kind: 'summary',
    kicker: 'Conclusion',
    title: 'AI 产品经理的核心能力，不是会用工具',
  },
]

const pipelineItems = [
  ['截图采集', '主页面、弹窗、空态、异常态和已知业务背景', '截图集', 'blue'],
  ['豆包视觉拆解', '只基于截图拆解页面内容，不自我发挥', '原始 PRD', 'coral'],
  ['DeepSeek 清洗', '过滤不合理内容，补字段、用例和验收点', '清洗 PRD', 'green'],
  ['Figma 初稿', '基于 PRD 快速生成可讨论的视觉初版', '设计稿', 'gold'],
  ['本地运行', '下载项目代码，让 Codex 或 Claude 识别并跑起来', '本地项目', 'cyan'],
  ['后续修改', '在可运行基础上继续调整页面、交互和逻辑', '变更记录', 'purple'],
  ['上下文治理', '备忘录维护事实源，复杂任务提前 compact', '备忘录', 'blue'],
]

const principles = [
  ['按能力分工', '视觉识别、中文清洗、设计生成、代码修改分别交给更合适的工具。', 'cyan'],
  ['中间产物驱动', '每个阶段都留下可检查的材料，避免连续黑箱输出。', 'green'],
  ['人工判断兜底', '多模型互审不等于事实正确，最终仍要回到业务和原始材料。', 'gold'],
  ['上下文治理', '用备忘录和 compact 管理事实源，减少长任务中的偏航。', 'blue'],
]

const modelBiasItems = [
  ['豆包', '视觉输入拆解', '视觉理解相对更强，适合从截图和 PDF 截图中还原页面内容，但不承担业务判断。', 'coral'],
  ['DeepSeek', '中文清洗与长上下文', '中文语义和长材料处理更顺，适合过滤不合理内容、拆结构、补用例。', 'green'],
  ['Figma', '设计语境与约束', '模型里有更多设计相关约束和知识，适合把清洗后的 PRD 转成可讨论的视觉初稿。', 'gold'],
  ['GPT / Claude', '工程化落地', '代码理解、运行排错和局部修改更稳，适合在边界明确后处理本地项目。', 'cyan'],
  ['人工 + 备忘录', '事实源治理', '人负责最终判断和校验，备忘录负责保留项目事实、状态流转和已废弃方案。', 'blue'],
]

const artifactItems = [
  ['截图', '页面截图与状态截图', '作为页面还原与人工回查的原始证据。', 'blue'],
  ['豆包', '原始拆解 PRD', '记录页面结构、文案、控件、视觉层级和待确认项。', 'coral'],
  ['DeepSeek', '清洗版 PRD', '补充用例、字段、异常态和验收标准。', 'green'],
  ['Figma', '初版设计稿', '把文档变成可讨论、可修改的视觉对象。', 'gold'],
  ['工程', '可运行本地项目', '让页面从“看起来像”变成“跑得起来”。', 'cyan'],
  ['迭代', '备忘录与变更记录', '维护事实源，帮助长任务保持方向感。', 'purple'],
]

const noiseItems = [
  ['无效尝试', 8, 27, -12, 0.35, 0],
  ['重复报错', 42, 20, 9, 0.25, 1],
  ['过期字段', 22, 50, 17, 1.1, 2],
  ['废弃方案', 58, 43, -19, 0.55, 3],
  ['临时猜测', 12, 70, 6, 1.6, 4],
  ['偏题总结', 48, 67, -8, 0.9, 5],
  ['接口误判', 68, 23, 14, 1.2, 6],
  ['旧版需求', 35, 78, -22, 0.4, 7],
  ['未确认口径', 5, 45, 23, 2.1, 8],
  ['失败日志', 62, 75, -4, 1.4, 9],
]

const ruleEvidenceFlow = [
  {
    title: 'PDF 原文局部',
    label: '01 原始截图',
    desc: '先保留可回查的规则原文，所有后续结构化结果都要能回到这里校验。',
    src: publicAsset('rule-doc/rule-source-pdf.png'),
    tone: 'blue',
    type: 'image',
  },
  {
    title: '豆包结构稿',
    label: '02 结构文档',
    desc: '把截图 / PDF 转成可编辑文本，按标题、表格、段落拆出基础结构。',
    tone: 'coral',
    type: 'structure',
    lines: ['标题与提示', '交易流程', '询价 / 下单'],
  },
  {
    title: 'DeepSeek 清洗稿',
    label: '03 结构文档',
    desc: '只做层级和结构清洗，明确约束“原文一个字都不能动”。',
    tone: 'green',
    type: 'structure',
    lines: ['层级目录', '规则条目', '待校验点'],
  },
  {
    title: '人工审核',
    label: '04 人工校验',
    desc: '逐段对照原文，确认无漏项、无改写、结构关系正确。',
    tone: 'gold',
    type: 'audit',
    checks: ['无漏项', '无改写', '结构正确'],
  },
  {
    title: '成品页面截图',
    label: '05 最终缩略图',
    desc: '经过拆解、清洗和人工校验后，转成目录、流程、规则项和提示信息。',
    src: publicAsset('rule-doc/rule-structured-output.png'),
    tone: 'cyan',
    type: 'image',
  },
]

function pad(num) {
  return String(num).padStart(2, '0')
}

function getTone(name) {
  return tones[name] ?? name
}

function Kicker({ children }) {
  return <div className="kicker reveal" style={{ '--d': 0 }}>{children}</div>
}

function SlideTitle({ slide, children }) {
  return (
    <div className="slide-title">
      <Kicker>{slide.kicker}</Kicker>
      <h2 className="reveal" style={{ '--d': 1 }}>{slide.title}</h2>
      {children}
    </div>
  )
}

function WhyNote({ tone, children }) {
  return (
    <div className="why-note reveal" style={{ '--tone': tone, '--d': 2 }}>
      <b>为什么</b><span>{children}</span>
    </div>
  )
}

function WorkbenchVisual() {
  return (
    <div className="stage-card reveal reveal-right" style={{ '--d': 3 }}>
      <div className="workbench">
        <div className="fake-toolbar">
          <div className="traffic"><span /><span /><span /></div>
          <div className="toolbar-text">workflow://ai-pm/pipeline</div>
        </div>
        <div className="pipeline-mini">
          {['截图', '豆包', 'DeepSeek', 'Figma', 'Codex', '备忘录'].map((item, index) => (
            <div className="mini-node" key={item} style={{ animationDelay: `${index * 0.18}s` }}>
              <strong>{item}</strong>
              <small>{['原始证据', '视觉拆解', '文档清洗', '设计初稿', '本地运行', '事实源'][index]}</small>
            </div>
          ))}
        </div>
        <div className="artifact-row">
          {['截图集', 'PRD', '设计稿', '本地项目'].map((item) => <div className="artifact-chip" key={item}>{item}</div>)}
        </div>
      </div>
    </div>
  )
}

function PhoneMock() {
  return (
    <div className="phone-shell reveal reveal-left" style={{ '--d': 1 }}>
      <div className="phone-screen">
        <div className="phone-bar" />
        <div className="mock-card"><div className="mock-title" /><div className="mock-line" /><div className="mock-line short" /></div>
        <div className="mock-card"><div className="mock-title" /><div className="mock-line" /><div className="mock-line" /><div className="mock-line short" /></div>
        <div className="mock-action">提交 / 下一步</div>
      </div>
    </div>
  )
}

function RuleEvidenceVisual({ item }) {
  if (item.type === 'image') {
    return <img src={item.src} alt={item.title} />
  }

  if (item.type === 'audit') {
    return (
      <span className="audit-schematic">
        {item.checks.map((check) => <span key={check}><b>✓</b>{check}</span>)}
      </span>
    )
  }

  return (
    <span className="structure-schematic">
      <i />
      {item.lines.map((line, index) => <span key={line} style={{ '--w': `${88 - index * 16}%` }}>{line}</span>)}
    </span>
  )
}

function renderSlide(slide, { openImage } = {}) {
  switch (slide.kind) {
    case 'hero':
      return (
        <div className="slide-inner hero-grid">
          <div className="slide-title">
            <Kicker>{slide.kicker}</Kicker>
            <h1 className="reveal" style={{ '--d': 1 }}>多模型协作下的 <span className="gradient-text">AI 产品经理工作流</span></h1>
            <p className="hero-subtitle reveal" style={{ '--d': 2 }}>{slide.subtitle}</p>
            <div className="hero-stats">
              {slide.stats.map(([value, label], index) => (
                <div className="stat reveal reveal-scale" style={{ '--d': index + 3 }} key={label}>
                  <strong>{value}</strong><span>{label}</span>
                </div>
              ))}
            </div>
          </div>
          <WorkbenchVisual />
        </div>
      )
    case 'compare':
      return (
        <div className="slide-inner">
          <SlideTitle slide={slide} />
          <div className="split-grid">
            <div className="compare-panel reveal reveal-left" style={{ '--d': 2 }}>
              <span className="compare-label danger-label">单模型包办</span>
              <h3>输入越多，偏航概率越高</h3>
              <p>视觉、中文、设计、代码混在一个上下文里，容易积累过期信息、无效尝试和模型幻觉。</p>
              <div className="chaos-stack">
                {['截图外信息被补成事实', '设计建议混入业务规则', '报错与废弃方案污染上下文', '工程修改影响无关模块'].map((item) => (
                  <div className="chaos-item" key={item}>{item}</div>
                ))}
              </div>
            </div>
            <div className="compare-panel reveal reveal-right" style={{ '--d': 3 }}>
              <span className="compare-label good-label">多模型编排</span>
              <h3>把能力放到正确的位置</h3>
              <p>每一步都产出可检查、可传递、可修正的中间产物，让 AI 从聊天工具变成流程节点。</p>
              <div className="controlled-lane">
                {[
                  ['拆任务', '视觉、文档、设计、工程分开处理'],
                  ['留产物', '截图、PRD、设计稿、代码都能回查'],
                  ['控上下文', '备忘录和 compact 清理工作记忆'],
                ].map(([title, desc], index) => (
                  <div className="controlled-step" key={title}>
                    <span className="step-index">{index + 1}</span>
                    <div><strong>{title}</strong><span>{desc}</span></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    case 'principles':
      return (
        <div className="slide-inner">
          <SlideTitle slide={slide}>
            <div className="quote-line reveal" style={{ '--d': 2 }}>{slide.quote}</div>
          </SlideTitle>
          <div className="principle-grid">
            {principles.map(([title, desc, tone], index) => (
              <div className="principle-card reveal" style={{ '--d': index + 3, '--i': index, '--tone': getTone(tone) }} key={title}>
                <em>{pad(index + 1)}</em><strong>{title}</strong><p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      )
    case 'modelBias':
      return (
        <div className="slide-inner">
          <SlideTitle slide={slide}>
            <p className="reveal" style={{ '--d': 2 }}>这套流程不是在比较哪个模型最强，而是让每个模型只负责它风险最低、收益最高的那一段。</p>
          </SlideTitle>
          <div className="model-bias-grid">
            {modelBiasItems.map(([tool, role, desc, tone], index) => (
              <div className="model-bias-card reveal" style={{ '--d': index + 3, '--tone': getTone(tone) }} key={tool}>
                <span className="model-chip">{tool}</span>
                <strong>{role}</strong>
                <p>{desc}</p>
              </div>
            ))}
          </div>
          <div className="model-bias-rule reveal" style={{ '--d': 8 }}>
            <span>原则</span>
            <strong>只把任务交给模型擅长的能力，不把最终事实和业务判断交给模型。</strong>
          </div>
        </div>
      )
    case 'pipeline':
      return (
        <div className="slide-inner">
          <SlideTitle slide={slide} />
          <div className="flow-board">
            {pipelineItems.map(([title, desc, artifact, tone], index) => (
              <div className="flow-step reveal" style={{ '--d': index + 2, '--i': index, '--tone': getTone(tone) }} key={title}>
                <div className="flow-icon">{pad(index + 1)}</div>
                <h3>{title}</h3>
                <p>{desc}</p>
                <div className="artifact-label">{artifact}</div>
              </div>
            ))}
          </div>
        </div>
      )
    case 'prep':
      return (
        <div className="slide-inner prep-board">
          <div className="intent-core reveal reveal-left" style={{ '--d': 1 }}>
            <div className="intent-center">先定义<br />优化目标</div>
            {['信息层级', '转化效率', '交互路径', '视觉一致性'].map((item) => <div className="intent-chip" key={item}>{item}</div>)}
          </div>
          <div>
            <SlideTitle slide={slide}>
              <p className="reveal" style={{ '--d': 2 }}>不要一上来就把截图丢给模型。先说清楚这次到底要优化什么，否则 AI 很容易把任务理解成泛泛的“美化一下”。</p>
            </SlideTitle>
            <div className="prep-list">
              {[
                ['明确优化对象', '是信息层级、转化效率、交互路径、视觉一致性，还是字段补全。'],
                ['标记保留与可变内容', '哪些模块必须保留，哪些文案、样式、排序和交互可以调整。'],
                ['写清判断标准', '让 AI 知道什么叫“更好”，例如更少步骤、更清晰状态、更贴近业务规则。'],
              ].map(([title, desc], index) => <div className="prep-card reveal" style={{ '--d': index + 3 }} key={title}><strong>{title}</strong><p>{desc}</p></div>)}
            </div>
          </div>
        </div>
      )
    case 'capture':
      return (
        <div className="slide-inner case-layout">
          <PhoneMock />
          <div>
            <SlideTitle slide={slide}>
              <p className="reveal" style={{ '--d': 2 }}>截图不是普通素材，而是整个流程的原始证据。主态之外的弹窗、空态、加载态、异常态和权限态，都会影响后续 PRD 与设计还原。</p>
            </SlideTitle>
            <div className="capture-tags">
              {[
                ['主页面', '当前需要优化的核心页面截图'],
                ['关键状态', '弹窗、空态、异常态、权限态'],
                ['业务背景', '已知字段、限制、目标和问题'],
                ['优化方向', '哪些内容要保留，哪些内容要调整'],
              ].map(([title, desc], index) => <div className="capture-tag reveal" style={{ '--d': index + 3 }} key={title}><strong>{title}</strong><span>{desc}</span></div>)}
            </div>
          </div>
        </div>
      )
    case 'doubao':
      return (
        <div className="slide-inner tool-layout">
          <div className="tool-card tool-card-large reveal reveal-left" style={{ '--d': 1, '--tone': tones.coral }}>
            <div className="tool-logo">豆</div>
            <div className="tool-tag" style={{ '--tone': tones.coral }}>视觉输入拆解</div>
            <h2>豆包负责看图，但不负责做判断</h2>
            <p>它的价值是把截图拆成页面结构、文案、按钮、控件、视觉层级和交互线索。</p>
            <WhyNote tone={tones.coral}>视觉理解更好，但逻辑判断不稳定，所以只让它做素材事实还原。</WhyNote>
          </div>
          <div className="tool-points">
            {[
              '要求严格基于截图，不补充截图之外的信息。',
              '不确定内容统一标记为“待确认”。',
              '输出页面结构、元素清单和视觉层级。',
              '下一步交给 DeepSeek 清洗，而不是直接作为最终 PRD。',
            ].map((item, index) => <div className="tool-point reveal" style={{ '--d': index + 2, '--tone': tones.coral }} key={item}><span className="dot" /><span>{item}</span></div>)}
          </div>
        </div>
      )
    case 'pdfCase':
      return (
        <div className="slide-inner">
          <SlideTitle slide={slide}>
            <p className="reveal" style={{ '--d': 2 }}>除了页面截图，规则文档也可以走“豆包拆解 → DeepSeek 清洗 → 人工校验 → 结构化产品内容”的路径。</p>
          </SlideTitle>
          <div className="pdf-case-stage">
            <div className="doc-case-board doc-case-board--compact">
              {[
                ['PDF 原文', '期权交易规则 - AC.pdf', '保留原始材料，作为最终校验来源。', 'blue'],
                ['豆包拆文字', '从 PDF / 截图提取文本', '先把不可编辑内容转成可处理文本。', 'coral'],
                ['DeepSeek 清洗', '只做结构拆解', '明确要求：原文一个字都不能动。', 'green'],
                ['人工校验', '逐段对照原文', '确认结构正确、无漏项、无改写。', 'gold'],
                ['产品内容', '结构化规则页面', '输出目录、交易流程、规则条目和重要提示。', 'cyan'],
              ].map(([title, label, desc, tone], index) => (
                <div className="doc-case-step reveal" style={{ '--d': index + 3, '--tone': getTone(tone) }} key={title}>
                  <span>{pad(index + 1)}</span>
                  <strong>{title}</strong>
                  <em>{label}</em>
                  <p>{desc}</p>
                </div>
              ))}
            </div>

            <div className="rule-evidence-flow reveal" style={{ '--d': 8 }} onClick={(event) => event.stopPropagation()}>
              {ruleEvidenceFlow.map((item) => {
                const content = (
                  <>
                    <span className="evidence-visual"><RuleEvidenceVisual item={item} /></span>
                    <span className="evidence-copy">
                      <small>{item.label}</small>
                      <strong>{item.title}</strong>
                      <span>{item.desc}</span>
                    </span>
                  </>
                )

                if (item.src) {
                  return (
                    <button
                      className="evidence-card is-clickable"
                      key={item.title}
                      type="button"
                      style={{ '--tone': getTone(item.tone) }}
                      onClick={() => openImage?.(item)}
                    >
                      {content}
                    </button>
                  )
                }

                return (
                  <div className="evidence-card" key={item.title} style={{ '--tone': getTone(item.tone) }}>
                    {content}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )
    case 'deepseek':
      return (
        <div className="slide-inner">
          <SlideTitle slide={slide}>
            <WhyNote tone={tones.green}>中文语义和长上下文处理更顺，适合把原始拆解清洗成可交付文档。</WhyNote>
          </SlideTitle>
          <div className="filter-visual reveal" style={{ '--d': 2 }}>
            <div className="doc-stack">{[68, 92, 48, 78, 60].map((w) => <div className="doc-line" style={{ '--w': `${w}%` }} key={w} />)}</div>
            <div className="filter-core">清洗</div>
            <div className="doc-stack">
              {['删除无依据内容', '补充用例与异常态', '区分事实 / 推断 / 建议 / 待确认', '输出疑点清单与验收标准'].map((item) => <div className="tool-point" style={{ '--tone': tones.green }} key={item}><span className="dot" /><span>{item}</span></div>)}
            </div>
          </div>
        </div>
      )
    case 'figma':
      return (
        <div className="slide-inner">
          <SlideTitle slide={slide}>
            <p className="reveal" style={{ '--d': 2 }}>清洗 PRD 的价值，是让 Figma 在设计约束和组件语境里快速生成“可讨论的初版”。这里重点讲概念，不展开现场演示。</p>
            <WhyNote tone={tones.gold}>Figma 的模型带有设计语境和约束，适合把结构化需求快速转成视觉初稿。</WhyNote>
          </SlideTitle>
          <div className="design-board reveal" style={{ '--d': 3 }}>
            <div className="prd-panel">
              {[74, 88, 58, 82, 66].map((w) => <div className="doc-line" style={{ '--w': `${w}%` }} key={w} />)}
              <div className="figma-note">PRD 作为输入，Figma 负责生成可讨论的初稿视觉。</div>
            </div>
            <div className="figma-panel">
              <div className="figma-toolbar">{Array.from({ length: 4 }, (_, i) => <div className="figma-tool" key={i} />)}</div>
              <div className="canvas">
                <div className="screen-draft">
                  <div className="screen-block hero" />
                  <div className="screen-block line" />
                  <div className="screen-block long" />
                  <div className="screen-block line" />
                  <div className="screen-block long" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    case 'code':
      return (
        <div className="slide-inner code-stage">
          <div>
            <SlideTitle slide={slide}>
              <p className="reveal" style={{ '--d': 2 }}>从 Figma 下载项目代码后，使用 Codex 或 Claude 识别技术栈、安装依赖、本地运行，再在真实页面基础上继续修改。</p>
              <WhyNote tone={tones.cyan}>GPT 和 Claude 的工程化执行更稳，适合在边界明确后识别项目、跑本地和改代码。</WhyNote>
            </SlideTitle>
            <div className="terminal reveal" style={{ '--d': 3 }}>
              {['$ detect project stack', 'framework: vite / react', '$ install dependencies', '$ npm run dev', 'local: http://localhost:5173', 'status: running, ready for iteration'].map((line, index) => <div className="terminal-line" style={{ '--i': index }} key={line}>{line}</div>)}
            </div>
          </div>
          <div className="browser-preview reveal reveal-right" style={{ '--d': 4 }}>
            <div className="browser-bar"><div className="traffic"><span /><span /><span /></div><div className="url-pill">localhost:5173 / app-page</div></div>
            <div className="preview-body"><div className="preview-banner" /><div className="preview-row"><div className="preview-cell" /><div className="preview-cell" /><div className="preview-cell" /></div><div className="preview-cell tall" /><div className="preview-row"><div className="preview-cell" /><div className="preview-cell" /><div className="preview-cell" /></div></div>
          </div>
        </div>
      )
    case 'artifacts':
      return (
        <div className="slide-inner">
          <SlideTitle slide={slide} />
          <div className="artifact-grid">{artifactItems.map(([type, title, desc, tone], index) => <div className="artifact-card reveal" style={{ '--d': index + 2, '--tone': getTone(tone) }} key={title}><span className="artifact-type">{type}</span><strong>{title}</strong><p>{desc}</p></div>)}</div>
        </div>
      )
    case 'acceptance':
      return (
        <div className="slide-inner">
          <SlideTitle slide={slide}>
            <p className="reveal" style={{ '--d': 2 }}>这一步把“生成结果”变成“可交付产物”，也是产品经理不能缺位的地方。</p>
          </SlideTitle>
          <div className="qa-board">
            {[
              ['是否忠于原始材料？', '先看它有没有编造截图里不存在的内容。', ['截图可见事实是否保留', '不确定内容是否标待确认'], 'blue'],
              ['是否符合业务目标？', '不是看起来更漂亮就算对，要回到这次优化目标。', ['是否解决原始问题', '是否符合业务优先级'], 'green'],
              ['是否覆盖关键状态？', '主态之外，空态、异常态、权限态和弹窗同样重要。', ['状态是否完整', '异常路径是否可解释'], 'gold'],
              ['是否能被继续接手？', '设计和研发能不能基于产物继续做。', ['字段与交互是否清晰', '验收标准是否明确'], 'cyan'],
            ].map(([title, desc, items, tone], index) => <div className="qa-card reveal" style={{ '--d': index + 3, '--tone': getTone(tone) }} key={title}><span className="qa-no">{index + 1}</span><strong>{title}</strong><p>{desc}</p><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></div>)}
          </div>
        </div>
      )
    case 'context':
      return (
        <div className="slide-inner">
          <SlideTitle slide={slide} />
          <div className="context-visual">
            <div className="noise-panel reveal reveal-left" style={{ '--d': 2 }}>
              <h3>上下文污染</h3>
              <p>报错、废弃方案、重复尝试和临时判断混在一起。</p>
              <div className="noise-chaos" aria-hidden="true">
                {noiseItems.map(([item, x, y, rotate, blur, delay]) => (
                  <span
                    className="noise-chip"
                    key={item}
                    style={{
                      '--x': `${x}%`,
                      '--y': `${y}%`,
                      '--r': `${rotate}deg`,
                      '--blur': `${blur}px`,
                      '--delay': `${delay * -0.23}s`,
                    }}
                  >
                    {item}
                  </span>
                ))}
                <span className="noise-ghost noise-ghost--a">ERROR</span>
                <span className="noise-ghost noise-ghost--b">stale context</span>
              </div>
            </div>
            <div className="compact-gate reveal reveal-scale" style={{ '--d': 3 }}>compact</div>
            <div className="fact-panel reveal reveal-right" style={{ '--d': 4 }}>
              <h3>清晰事实源</h3>
              <div className="fact-stream">
                {[
                  ['技术栈', '项目框架、启动方式、依赖状态'],
                  ['页面', '已实现页面与关键数据字段'],
                  ['交互', '核心逻辑、组件联动、状态流转'],
                  ['待办', '下一步任务、风险点和验收标准'],
                ].map(([a, b], index) => (
                  <div className="fact-row" key={a} style={{ '--i': index }}>
                    <span className="fact-node">{pad(index + 1)}</span>
                    <strong>{a}</strong>
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    case 'memo':
      return (
        <div className="slide-inner">
          <SlideTitle slide={slide}><p className="reveal" style={{ '--d': 2 }}>当 AI 的说法冲突时，以备忘录、当前代码和原始材料为准。</p></SlideTitle>
          <div className="memo-grid">{[['项目技术栈', '框架、依赖、启动方式、构建命令。'], ['页面与字段', '已实现页面、关键数据字段、输入输出。'], ['状态流转', '全局状态、组件联动、权限与异常判断。'], ['已废弃方案', '明确标记废弃内容，避免模型误用。'], ['当前风险点', '未确认接口、未覆盖状态、设计偏差。'], ['下一步待办', '把复杂任务拆小，并绑定验收标准。']].map(([title, desc], index) => <div className="memo-panel reveal" style={{ '--d': index + 3 }} key={title}><strong>{title}</strong><span>{desc}</span></div>)}</div>
        </div>
      )
    case 'branch':
      return (
        <div className="slide-inner">
          <SlideTitle slide={slide} />
          <div className="branch-board">
            <div className="main-flow reveal reveal-left" style={{ '--d': 2 }}>{['主流程：PRD -> 设计 -> 本地项目', '遇到复杂素材或交互疑点', '暂停把信息继续堆进主任务'].map((item) => <div className="route-node" key={item}>{item}</div>)}</div>
            <div className="branch-core reveal reveal-scale" style={{ '--d': 3 }}><strong>单开页面处理</strong><p>局部拆解、局部清洗、整理稳定提示词，只把可靠结论回填主任务。</p></div>
            <div className="branch-flow reveal reveal-right" style={{ '--d': 4 }}>{['单独拆解', '单独清洗', '稳定结论回填备忘录'].map((item) => <div className="route-node" key={item}>{item}</div>)}</div>
          </div>
        </div>
      )
    case 'risk':
      return (
        <div className="slide-inner">
          <SlideTitle slide={slide} />
          <div className="risk-grid">{[
            ['截图不完整', '补多状态截图', '主态之外还要补弹窗、空态、异常态和权限态。', 'danger'],
            ['豆包自我发挥', '强约束提示词', '只基于截图，不确定内容标记待确认。', 'coral'],
            ['清洗误判', '区分信息属性', '事实、推断、建议、待确认必须分开。', 'green'],
            ['设计偏离', '回看 PRD 与原图', 'Figma 初稿可以优化视觉，但不能改变核心结构。', 'gold'],
            ['工程误改', '拆小任务并验证', '修改前确认影响范围，修改后运行检查。', 'cyan'],
            ['上下文污染', '维护备忘录', '阶段性 compact，剔除无效尝试和废弃方案。', 'blue'],
          ].map(([tag, title, desc, tone], index) => <div className="risk-card reveal" style={{ '--d': index + 2, '--tone': getTone(tone) }} key={tag}><span className="risk-tag">{tag}</span><strong>{title}</strong><p>{desc}</p></div>)}</div>
        </div>
      )
    case 'boundary':
      return (
        <div className="slide-inner">
          <SlideTitle slide={slide} />
          <div className="boundary-board">
            <div className="boundary-column reveal reveal-left" style={{ '--d': 2, '--tone': tones.green }}><h3><span className="boundary-mark">✓</span>适合交给 AI</h3><div className="boundary-list">{[['页面还原', '从截图拆页面结构、文案、模块和视觉层级。'], ['结构化整理', '把素材整理成 PRD、字段说明、用例和验收点。'], ['初稿生成', '快速生成设计初稿、文案备选和可运行页面基础。'], ['工程辅助', '识别项目、跑本地、按明确边界修改和验证。']].map(([title, desc]) => <div className="boundary-card" key={title}><strong>{title}</strong><p>{desc}</p></div>)}</div></div>
            <div className="boundary-column reveal reveal-right" style={{ '--d': 3, '--tone': tones.danger }}><h3><span className="boundary-mark">!</span>不适合直接交给 AI</h3><div className="boundary-list">{[['最终业务判断', '优先级、取舍、目标是否正确，需要人负责。'], ['合规与风险决策', '涉及法律、合规、隐私和安全，不能只听模型。'], ['复杂利益权衡', '跨团队、商业目标和用户体验冲突需要人决策。'], ['最终上线决策', '上线前必须经过真实验收、测试和业务确认。']].map(([title, desc]) => <div className="boundary-card" key={title}><strong>{title}</strong><p>{desc}</p></div>)}</div></div>
          </div>
        </div>
      )
    case 'prompts':
      return (
        <div className="slide-inner">
          <SlideTitle slide={slide} />
          <div className="prompt-grid">{[
            ['豆包', '只做截图事实还原', '请严格基于截图拆解页面，不要自我发挥；不确定内容标记为待确认。', 'coral'],
            ['DeepSeek', '清洗并补齐 PRD', '请删除无依据内容，区分事实、推断、建议和待确认，并补充用例与验收标准。', 'green'],
            ['Figma', '生成初稿但不新增业务', '请基于 PRD 生成移动端页面初稿，不新增未提及业务模块，不改变核心信息顺序。', 'gold'],
            ['Codex / Claude', '先识别再修改', '请先识别技术栈和影响范围，不做无关重构，修改后说明验证结果。', 'cyan'],
          ].map(([tool, title, prompt, tone], index) => <div className="prompt-card reveal" style={{ '--d': index + 2, '--tone': getTone(tone) }} key={tool}><span className="tool-tag">{tool}</span><strong>{title}</strong><code>{prompt}</code></div>)}</div>
        </div>
      )
    case 'summary':
      return (
        <div className="slide-inner summary-board">
          <div>
            <SlideTitle slide={slide}>
              <p className="reveal" style={{ '--d': 2 }}>而是会设计一个让 AI 稳定工作的环境：明确输入、拆分任务、约束边界、校验产物、治理上下文。</p>
            </SlideTitle>
          </div>
          <div className="summary-formula">
            {[
              ['1', '定义清楚问题', '先明确目标，再把素材交给 AI。', 'cyan'],
              ['2', '设计稳定流程', '不同模型负责不同阶段。', 'green'],
              ['3', '守住判断边界', 'AI 生成，人来验收和决策。', 'blue'],
            ].map(([num, title, desc, tone], index) => <div className="formula-item reveal" style={{ '--d': index + 3, '--tone': getTone(tone) }} key={num}><span className="formula-symbol">{num}</span><div><h3>{title}</h3><p>{desc}</p></div></div>)}
            <div className="closing-line reveal" style={{ '--d': 6 }}>AI 不负责替我们判断，但可以帮助我们更快地把判断对象做出来。</div>
          </div>
        </div>
      )
    default:
      return null
  }
}

export default function App() {
  const [current, setCurrent] = useState(0)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState(null)
  const currentSlide = slides[current]

  const progress = useMemo(() => {
    return slides.length <= 1 ? 100 : (current / (slides.length - 1)) * 100
  }, [current])

  const goTo = useCallback((index) => {
    setCurrent(Math.max(0, Math.min(index, slides.length - 1)))
  }, [])

  const next = useCallback(() => goTo(current + 1), [current, goTo])
  const prev = useCallback(() => goTo(current - 1), [current, goTo])

  useEffect(() => {
    document.title = `${pad(current + 1)} · AI 产品经理工作流演示`
  }, [current])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (previewImage) {
        if (event.key === 'Escape') {
          event.preventDefault()
          setPreviewImage(null)
        }
        return
      }

      if (event.key === 'ArrowRight' || event.key === ' ' || event.key === 'PageDown') {
        event.preventDefault()
        setDrawerOpen(false)
        goTo(current + 1)
      }
      if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        event.preventDefault()
        setDrawerOpen(false)
        goTo(current - 1)
      }
      if (event.key === 'Home') {
        event.preventDefault()
        setDrawerOpen(false)
        goTo(0)
      }
      if (event.key === 'End') {
        event.preventDefault()
        setDrawerOpen(false)
        goTo(slides.length - 1)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [current, goTo, previewImage])

  const handleDeckMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const localX = event.clientX - rect.left
    const drawerWidth = Math.min(360, rect.width * 0.42)

    if (localX <= 30) {
      setDrawerOpen(true)
    } else if (drawerOpen && localX > drawerWidth) {
      setDrawerOpen(false)
    }
  }

  return (
    <div className="deck" onMouseMove={handleDeckMouseMove}>
      <div className="signal signal--top" />
      <div className="signal signal--bottom" />

      <div className="deck-top">
        <div className="deck-brand"><span className="brand-mark" /><span>AI PM Workflow</span></div>
        <div className="deck-section">{currentSlide.section}</div>
      </div>

      <aside
        className={`slide-drawer ${drawerOpen ? 'is-open' : ''}`}
        aria-label="快速切换页面"
        onMouseEnter={() => setDrawerOpen(true)}
        onMouseLeave={() => setDrawerOpen(false)}
      >
        <div className="drawer-panel">
          <div className="drawer-head">
            <div><strong>页面导航</strong><span>Hover left edge · Click to jump</span></div>
            <div className="drawer-status">{pad(current + 1)} / {pad(slides.length)}</div>
          </div>
          <div className="slide-nav-list">
            {slides.map((slide, index) => (
              <button
                className={`slide-nav-item ${current === index ? 'is-active' : ''}`}
                key={`${slide.section}-${slide.title}`}
                type="button"
                style={{ '--tone': getTone(Object.keys(tones)[index % Object.keys(tones).length]) }}
                onClick={(event) => {
                  event.stopPropagation()
                  goTo(index)
                  setDrawerOpen(false)
                  event.currentTarget.blur()
                }}
              >
                <span className="slide-thumb" aria-hidden="true"><span className="thumb-no">{pad(index + 1)}</span><span className="thumb-lines"><span /><span /><span /></span></span>
                <span className="slide-nav-copy"><small>{slide.section}</small><strong>{slide.title}</strong></span>
              </button>
            ))}
          </div>
        </div>
        <div className="drawer-rail"><span>slides</span></div>
      </aside>

      <main className="slides" onClick={next}>
        <section className="slide is-active" key={current}>
          {renderSlide(currentSlide, { openImage: setPreviewImage })}
        </section>
      </main>

      <footer className="progress-shell">
        <div className="progress-track"><div className="progress-bar" style={{ width: `${progress}%` }} /></div>
        <div className="slide-count">{pad(current + 1)} / {pad(slides.length)}</div>
        <div className="nav-buttons">
          <button className="nav-btn" type="button" disabled={current === 0} onClick={(event) => { event.stopPropagation(); setDrawerOpen(false); prev() }}>‹</button>
          <button className="nav-btn" type="button" disabled={current === slides.length - 1} onClick={(event) => { event.stopPropagation(); setDrawerOpen(false); next() }}>›</button>
        </div>
      </footer>

      {previewImage && (
        <div className="image-lightbox" role="dialog" aria-modal="true" aria-label={previewImage.title} onClick={() => setPreviewImage(null)}>
          <button
            className="lightbox-close"
            type="button"
            aria-label="关闭预览"
            onClick={(event) => {
              event.stopPropagation()
              setPreviewImage(null)
            }}
          >
            ×
          </button>
          <div className="lightbox-panel" onClick={(event) => event.stopPropagation()}>
            <img src={previewImage.src} alt={previewImage.title} />
            <div className="lightbox-caption">
              <small>{previewImage.label}</small>
              <strong>{previewImage.title}</strong>
              <span>{previewImage.desc}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
