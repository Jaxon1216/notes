import { pageSchema } from 'fumadocs-core/source/schema'
import { z } from 'zod'

const optionalText = z.string().trim().min(1).optional()

// Situation: 各文章可自由填写 frontmatter 时，字段拼写和数据类型会逐渐失去一致性。
// Task: 兼容旧文章无 frontmatter 的现状，同时为新增元数据建立统一契约。
// Action: 在 Fumadocs pageSchema 上扩展标签、状态、日期、精选和占位字段校验。
// Result: 非法元数据在构建期失败，渲染、SEO 和后续内容工具获得稳定类型。
export const frontmatterSchema = pageSchema.extend({
  title: optionalText,
  description: optionalText,
  tags: z.array(z.string().trim().min(1)).min(1).optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  updatedAt: z.iso.date().optional(),
  featured: z.boolean().optional(),
  placeholder: z.boolean().optional(),
})

export type Frontmatter = z.infer<typeof frontmatterSchema>
