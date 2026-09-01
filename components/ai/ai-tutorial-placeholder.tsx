import { ImageIcon } from 'lucide-react'

export function AiTutorialPlaceholder() {
  return (
    <div className="ai-tutorial-placeholder" role="img" aria-label="AI 解答教程截图占位">
      <ImageIcon aria-hidden="true" size={28} />
      <strong>教程截图占位</strong>
      <span>后续补充“选中文本 → 点击 AI 解答 → 查看解释”的实际操作截图。</span>
    </div>
  )
}
