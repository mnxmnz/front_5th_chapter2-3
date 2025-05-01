import { Edit2, MessageSquare, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react"
import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../shared/ui"
import { Post, User } from "../../entities/post"
import React from "react"
import { useQuery } from "@tanstack/react-query"
import { userApi } from "../../services/api"

interface PostTableProps {
  posts: Post[]
  selectedPost: Post | null
  setSelectedPost: (post: Post | null) => void
  setShowPostDetailDialog: (show: boolean) => void
  setSelectedUser: (user: User | null) => void
  setShowUserModal: (show: boolean) => void
  highlightText: (text: string, query: string) => React.ReactNode
  selectedTag: string
  setSelectedTag: (tag: string) => void
  updateURL: () => void
  setShowEditDialog: (show: boolean) => void
  searchQuery: string
  onDeletePost: (id: number) => void
}

const PostTable = ({
  posts,
  setSelectedPost,
  setShowPostDetailDialog,
  setSelectedUser,
  setShowUserModal,
  highlightText,
  selectedTag,
  setSelectedTag,
  updateURL,
  setShowEditDialog,
  searchQuery,
  onDeletePost,
}: PostTableProps) => {
  const [selectedUserId, setSelectedUserId] = React.useState<number | null>(null)

  const { data: userData } = useQuery({
    queryKey: ["user", selectedUserId],
    queryFn: () => (selectedUserId ? userApi.getUser(selectedUserId) : null),
    enabled: !!selectedUserId,
  })

  React.useEffect(() => {
    if (userData) {
      setSelectedUser(userData)
      setShowUserModal(true)
      setSelectedUserId(null)
    }
  }, [userData, setSelectedUser, setShowUserModal])

  const openPostDetail = (post: Post) => {
    setSelectedPost(post)
    setShowPostDetailDialog(true)
  }

  const openUserModal = (user: User) => {
    setSelectedUserId(user.id)
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">ID</TableHead>
          <TableHead>제목</TableHead>
          <TableHead className="w-[150px]">작성자</TableHead>
          <TableHead className="w-[150px]">반응</TableHead>
          <TableHead className="w-[150px]">작업</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <TableRow key={post.id}>
            <TableCell>{post.id}</TableCell>
            <TableCell>
              <div className="space-y-1">
                <div>{highlightText(post.title, searchQuery)}</div>

                <div className="flex flex-wrap gap-1">
                  {post.tags?.map((tag) => (
                    <span
                      key={tag}
                      className={`px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer ${
                        selectedTag === tag
                          ? "text-white bg-blue-500 hover:bg-blue-600"
                          : "text-blue-800 bg-blue-100 hover:bg-blue-200"
                      }`}
                      onClick={() => {
                        setSelectedTag(tag)
                        updateURL()
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => post.author && openUserModal(post.author)}
              >
                <img src={post.author?.image} alt={post.author?.username} className="w-8 h-8 rounded-full" />
                <span>{post.author?.username}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <ThumbsUp className="w-4 h-4" />
                <span>{post.reactions?.likes || 0}</span>
                <ThumbsDown className="w-4 h-4" />
                <span>{post.reactions?.dislikes || 0}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => openPostDetail(post)}>
                  <MessageSquare className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedPost(post)
                    setShowEditDialog(true)
                  }}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDeletePost(post.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default PostTable
