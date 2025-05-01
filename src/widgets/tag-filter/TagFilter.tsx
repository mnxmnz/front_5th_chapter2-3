import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../shared/ui"
import { useQuery } from "@tanstack/react-query"

interface TagFilterProps {
  selectedTag: string
  setSelectedTag: (tag: string) => void
  updateURL: () => void
}

const TagFilter = ({ selectedTag, setSelectedTag, updateURL }: TagFilterProps) => {
  const { data: tags = [] } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const response = await fetch("/api/posts/tags")
      return response.json()
    },
  })

  return (
    <Select
      value={selectedTag}
      onValueChange={(value) => {
        setSelectedTag(value)
        updateURL()
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="태그 선택" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">모든 태그</SelectItem>
        {tags.map((tag: { url: string; slug: string }) => (
          <SelectItem key={tag.url} value={tag.slug}>
            {tag.slug}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default TagFilter
