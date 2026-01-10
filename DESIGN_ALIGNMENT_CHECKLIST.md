# 视觉对齐清单 (Visual Alignment Checklist)

基于现代学术主页最佳实践(参考 Vincent Sitzmann, Jon Barron 等顶级研究者网站风格)

## 1. Typography (字体系统)

### 目标参数
- **Font Family**:
  - Primary: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
  - Fallback: system fonts 优先,确保跨平台一致性

- **Font Sizes** (使用 rem 单位):
  - Hero Name: `2.5rem` (40px) → mobile: `2rem` (32px)
  - Section Headings: `1.5rem` (24px) → mobile: `1.25rem` (20px)
  - Subsection Headings: `1.25rem` (20px)
  - Body Text: `1rem` (16px)
  - Small Text: `0.875rem` (14px)
  - Publication Title: `1.0625rem` (17px) - 稍大,突出标题

- **Line Height**:
  - Headings: `1.2` - `1.3`
  - Body: `1.6` - `1.7` (舒适阅读)
  - Lists: `1.5`

- **Font Weight**:
  - Regular: `400`
  - Medium: `500`
  - Semibold: `600`
  - Bold: `700`

- **Letter Spacing**:
  - Headings: `-0.02em` (稍紧凑)
  - Body: `normal`

### 当前状态
❌ 混乱的字号系统 (14.4px, 15px, 12pt 混用)
❌ 字体栈过长且不现代
❌ 行高不统一

### 实施计划
✅ 建立 CSS 变量系统
✅ 统一使用 rem 单位
✅ 采用 system font stack

---

## 2. Layout (布局结构)

### 目标参数
- **Max Width**: `900px` (主内容区,比980px稍窄,更现代)
- **Container Padding**: `0 2rem` (32px) → mobile: `0 1.25rem` (20px)
- **Grid System**: CSS Grid / Flexbox (移除 table 布局)
- **Vertical Rhythm**:
  - Section spacing: `4rem` (64px) → mobile: `3rem` (48px)
  - Subsection spacing: `2.5rem` (40px)
  - Paragraph spacing: `1rem` (16px)

- **Hero Section**:
  - Layout: Flexbox (flex-direction: row → mobile: column)
  - Avatar size: `200px` circle → mobile: `150px`
  - Name-to-info gap: `1.5rem`

- **Publications Grid**:
  - Image: `160px` width, fixed aspect ratio
  - Image-to-text gap: `1.5rem`
  - Entry spacing: `2rem`

### 当前状态
❌ 使用 table 布局(老式)
❌ 固定 980px,不够灵活
❌ 间距不一致

### 实施计划
✅ 重构为 semantic HTML + CSS Grid/Flex
✅ 调整最大宽度为 900px
✅ 建立一致的间距系统

---

## 3. Color (配色方案)

### 目标参数
- **Background**: `#ffffff` (纯白)
- **Text**:
  - Primary: `#1a1a1a` (接近黑,但不是纯黑,更柔和)
  - Secondary: `#666666` (灰色,用于次要信息)
  - Muted: `#999999` (更淡,用于日期等)

- **Links**:
  - Default: `#0066cc` (标准蓝,比#0055AA更亮)
  - Hover: `#004080` (深蓝,而非橙色,保持一致性)
  - Visited: `#551a8b` (紫色,可选)

- **Accent Color** (保留你的品牌色):
  - Primary: `#A4424D` (仅用于特殊强调,如重要标签)
  - Hover: `#8a3640` (深一点)

- **Borders**:
  - Light: `#e5e7eb` (浅灰)
  - Medium: `#d1d5db`

- **Backgrounds**:
  - Section bg: `#fafafa` (极浅灰,可选用于分隔区块)

### 当前状态
⚠️ 链接 hover 使用橙色(#f09228),不够优雅
⚠️ 纯黑(#000)文字对比度过高,阅读疲劳

### 实施计划
✅ 调整链接配色为蓝色系
✅ 将正文改为 #1a1a1a
✅ 建立完整的 CSS 变量色板

---

## 4. Components (组件样式)

### Hero Section (头部)
- **Layout**: Horizontal flex (头像右侧)
- **Avatar**:
  - Size: `200px` 圆形
  - Border: `4px solid #e5e7eb` (可选)
  - Shadow: subtle `0 4px 12px rgba(0,0,0,0.08)`
- **Name**:
  - Font size: `2.5rem`
  - Weight: `700`
  - Margin bottom: `0.5rem`
- **Links**:
  - Separator: `/` 间距 `0.5rem`
  - Font size: `1rem`
  - Color: 标准链接色

### Section Headings
- **Style**:
  - Font size: `1.5rem`
  - Weight: `600`
  - Margin top: `4rem` (首个section为0)
  - Margin bottom: `1.5rem`
  - Border bottom: `2px solid #e5e7eb` (可选)
  - Padding bottom: `0.5rem`

### Publication Entries
- **Layout**: Grid/Flex
  - Image: 左侧,160px宽
  - Text: 右侧,flex-grow
  - Gap: `1.5rem`
- **Title**:
  - Font size: `1.0625rem` (17px)
  - Weight: `600`
  - Color: 链接色
  - Hover: 下划线
- **Authors**:
  - Font size: `0.9375rem` (15px)
  - Color: `#666`
  - 高亮自己: `font-weight: 600, color: #1a1a1a`
- **Venue**:
  - Font style: `italic`
  - Color: `#999`
  - Font size: `0.875rem` (14px)
- **Awards**:
  - Color: `#A4424D`
  - Font weight: `500`
  - Font size: `0.875rem`

### News List
- **Style**:
  - Font size: `0.9375rem` (15px)
  - Line height: `1.6`
  - Date: `font-weight: 600, color: #666`
  - Item spacing: `0.75rem`

### Experience Cards
- **Layout**: Grid (2 columns on desktop)
- **Logo**:
  - Size: `80px` square
  - Object fit: contain
- **Institution**:
  - Font size: `1rem`
  - Weight: `600`
- **Period**:
  - Color: `#999`
  - Font size: `0.875rem`

### 当前状态
❌ Publication 使用 table 布局
❌ 头像没有圆角和阴影
❌ 组件样式不统一

### 实施计划
✅ 重构为语义化 HTML
✅ 统一组件样式规范
✅ 添加精致的视觉细节

---

## 5. Interactions (交互效果)

### Hover States
- **Links**:
  - Transition: `color 0.2s ease`
  - Underline: 仅 hover 时显示(publication title除外)

- **Publication Entries**:
  - Hover: 轻微背景色变化 `background: #fafafa`
  - Transition: `background 0.2s ease`

- **Buttons** (如有):
  - Transform: `translateY(-2px)`
  - Shadow: 增加阴影
  - Transition: `all 0.2s ease`

### Focus States
- **Accessible focus ring**:
  - Outline: `2px solid #0066cc`
  - Offset: `2px`

### Scroll Behavior
- **Smooth scroll**: `scroll-behavior: smooth` (如果使用锚点)
- **Sticky nav** (可选): 如果添加导航栏

### Animations
- **Subtle fade-in**: 页面加载时(可选,不过度)
- **Reduced motion**:
  ```css
  @media (prefers-reduced-motion: reduce) {
    * { animation: none !important; transition: none !important; }
  }
  ```

### 当前状态
⚠️ 只有基础 hover 效果
❌ 没有 focus ring
❌ 没有 prefers-reduced-motion 支持

### 实施计划
✅ 添加平滑过渡效果
✅ 实现 accessible focus states
✅ 支持 prefers-reduced-motion

---

## 6. Responsive Design (响应式)

### Breakpoints
- **Desktop**: `> 768px`
- **Mobile**: `≤ 768px`
- **Large screens**: `> 1200px` (可选,限制最大宽度)

### Mobile Adjustments
- **Typography**:
  - 缩小标题字号(约80%)
  - 保持正文 16px (可读性)

- **Layout**:
  - Hero: 头像居中,纵向排列
  - Publications: 图片缩小或隐藏
  - Experience: 单列

- **Spacing**:
  - 减少 section 间距(64px → 48px)
  - 减少 padding (32px → 20px)

### 当前状态
⚠️ 有基础响应式,但不够精致

### 实施计划
✅ 优化移动端布局
✅ 测试各种屏幕尺寸

---

## Implementation Roadmap

### Phase 1: 80% 核心对齐 ✅ (当前)
1. 建立 CSS tokens (variables)
2. 重构 HTML 为语义化结构
3. 实现核心布局(hero, sections)
4. 统一字体系统
5. 基础配色方案

### Phase 2: 95% 细节对齐
1. Publication 组件精细化
2. Hover/focus 交互
3. 响应式优化
4. 微动效
5. 无障碍检查

### Phase 3: 100% 完善
1. 性能优化
2. 浏览器兼容性测试
3. 打磨细节
4. 文档更新
