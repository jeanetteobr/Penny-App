import { CATEGORY_TAGS } from '../types/transaction'
import type { Category } from '../types/transaction'

interface Props {
  category: Category
}

export default function CategoryTag({ category }: Props) {
  const style = CATEGORY_TAGS[category]
  return (
    <span
      style={{
        backgroundColor: style.bg,
        color: style.text,
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '12px',
        fontWeight: 500,
        padding: '2px 10px',
        borderRadius: '999px',
        whiteSpace: 'nowrap',
        display: 'inline-block',
      }}
    >
      {category}
    </span>
  )
}
