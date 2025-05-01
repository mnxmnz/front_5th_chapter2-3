import { Search } from "lucide-react"

import { Input } from "../shared/ui"

interface Post {
  id: number
  title: string
  body: string
  userId: number
  tags?: string[]
}

interface SearchBarProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  fetchPosts: () => void
  setPosts: (posts: Post[]) => void
  setTotal: (total: number) => void
  setLoading: (loading: boolean) => void
}

const SearchBar = ({ searchQuery, setSearchQuery, fetchPosts, setPosts, setTotal, setLoading }: SearchBarProps) => {
  const searchPosts = async () => {
    if (!searchQuery) {
      fetchPosts()
      return
    }
    setLoading(true)
    try {
      const response = await fetch(`/api/posts/search?q=${searchQuery}`)
      const data = await response.json()
      setPosts(data.posts)
      setTotal(data.total)
    } catch (error) {
      console.error("게시물 검색 오류:", error)
    }
    setLoading(false)
  }

  return (
    <div className="flex-1">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="게시물 검색..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && searchPosts()}
        />
      </div>
    </div>
  )
}

export default SearchBar
