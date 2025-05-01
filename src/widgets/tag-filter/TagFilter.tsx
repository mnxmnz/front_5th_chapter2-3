import { useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../shared/ui"

interface TagFilterProps {
  selectedTag: string
  setSelectedTag: (tag: string) => void
  fetchPostsByTag: (tag: string) => void
  updateURL: () => void
}

interface Tag {
  url: string
  slug: string
}

const TagFilter = ({ selectedTag, setSelectedTag, fetchPostsByTag, updateURL }: TagFilterProps) => {
  const [tags, setTags] = useState<Tag[]>([])

  const fetchTags = async () => {
    try {
      const response = await fetch("/api/posts/tags")
      const data = await response.json()
      setTags(data)
    } catch (error) {
      console.error("태그 가져오기 오류:", error)
    }
  }

  useEffect(() => {
    fetchTags()
  }, [])

  return (
    <Select
      value={selectedTag}
      onValueChange={(value) => {
        setSelectedTag(value)
        fetchPostsByTag(value)
        updateURL()
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="태그 선택" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">모든 태그</SelectItem>
        {tags.map((tag) => (
          <SelectItem key={tag.url} value={tag.slug}>
            {tag.slug}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default TagFilter
