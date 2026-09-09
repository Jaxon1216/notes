import { pageSchema } from 'fumadocs-core/source/schema'
import { z } from 'zod'

const optionalText = z.string().trim().min(1).optional()

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
