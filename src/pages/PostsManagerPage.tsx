import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import { Post, User } from "../types/post"
import { Button, Card, CardContent, CardHeader, CardTitle } from "../shared/ui"
import SearchBar from "../components/SearchBar"
import TagFilter from "../components/TagFilter"
import SortFilter from "../components/SortFilter"
import SortOrderFilter from "../components/SortOrderFilter"
import PostTable from "../components/PostTable"
import Pagination from "../components/Pagination"
import AddPostDialog from "../components/AddPostDialog"
import AddCommentDialog from "../components/AddCommentDialog"
import EditCommentDialog from "../components/EditCommentDialog"
import UserModal from "../components/UserModal"
import PostDetailDialog from "../components/PostDetailDialog"
import EditPostDialog from "../components/EditPostDialog"
import CommentList from "../components/CommentList"

interface PostData {
  posts: Post[]
  total: number
}

interface Comment {
  id: number
  body: string
  postId: number
  userId: number
  user: {
    username: string
  }
  likes: number
}

const PostsManager = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  // 상태 관리
  const [posts, setPosts] = useState<Post[]>([])
  const [total, setTotal] = useState(0)
  const [skip, setSkip] = useState(parseInt(queryParams.get("skip") || "0"))
  const [limit, setLimit] = useState(parseInt(queryParams.get("limit") || "10"))
  const [searchQuery, setSearchQuery] = useState(queryParams.get("search") || "")
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [sortBy, setSortBy] = useState(queryParams.get("sortBy") || "")
  const [sortOrder, setSortOrder] = useState(queryParams.get("sortOrder") || "asc")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [newPost, setNewPost] = useState({ title: "", body: "", userId: 1 })
  const [loading, setLoading] = useState(false)
  const [selectedTag, setSelectedTag] = useState(queryParams.get("tag") || "")
  const [comments, setComments] = useState<Record<number, Comment[]>>({})
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [newComment, setNewComment] = useState<{ body: string; postId: number | null; userId: number }>({
    body: "",
    postId: null,
    userId: 1,
  })
  const [showAddCommentDialog, setShowAddCommentDialog] = useState(false)
  const [showEditCommentDialog, setShowEditCommentDialog] = useState(false)
  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  // URL 업데이트 함수
  const updateURL = () => {
    const params = new URLSearchParams()
    if (skip) params.set("skip", skip.toString())
    if (limit) params.set("limit", limit.toString())
    if (searchQuery) params.set("search", searchQuery)
    if (sortBy) params.set("sortBy", sortBy)
    if (sortOrder) params.set("sortOrder", sortOrder)
    if (selectedTag) params.set("tag", selectedTag)
    navigate(`?${params.toString()}`)
  }

  // 게시물 가져오기
  const fetchPosts = () => {
    setLoading(true)
    let postsData: PostData
    let usersData: User[]

    fetch(`/api/posts?limit=${limit}&skip=${skip}`)
      .then((response) => response.json())
      .then((data) => {
        postsData = data
        return fetch("/api/users?limit=0&select=username,image")
      })
      .then((response) => response.json())
      .then((users) => {
        usersData = users.users
        const postsWithUsers = postsData.posts.map((post: Post) => ({
          ...post,
          author: usersData.find((user) => user.id === post.userId),
        }))
        setPosts(postsWithUsers)
        setTotal(postsData.total)
      })
      .catch((error) => {
        console.error("게시물 가져오기 오류:", error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  // 태그별 게시물 가져오기
  const fetchPostsByTag = async (tag: string) => {
    if (!tag || tag === "all") {
      fetchPosts()
      return
    }
    setLoading(true)
    try {
      const [postsResponse, usersResponse] = await Promise.all([
        fetch(`/api/posts/tag/${tag}`),
        fetch("/api/users?limit=0&select=username,image"),
      ])
      const postsData = await postsResponse.json()
      const usersData = await usersResponse.json()

      const postsWithUsers = postsData.posts.map((post: Post) => ({
        ...post,
        author: usersData.users.find((user: User) => user.id === post.userId),
      }))

      setPosts(postsWithUsers)
      setTotal(postsData.total)
    } catch (error) {
      console.error("태그별 게시물 가져오기 오류:", error)
    }
    setLoading(false)
  }

  // 게시물 추가
  const addPost = async () => {
    try {
      const response = await fetch("/api/posts/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      })
      const data = await response.json()
      setPosts([data, ...posts])
      setShowAddDialog(false)
      setNewPost({ title: "", body: "", userId: 1 })
    } catch (error) {
      console.error("게시물 추가 오류:", error)
    }
  }

  const handleNewPostChange = (field: string, value: string | number) => {
    setNewPost((prev) => ({ ...prev, [field]: value }))
  }

  // 게시물 업데이트
  const updatePost = async () => {
    if (!selectedPost) return
    try {
      const response = await fetch(`/api/posts/${selectedPost.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedPost),
      })
      const data = await response.json()
      setPosts(posts.map((post) => (post.id === data.id ? data : post)))
      setShowEditDialog(false)
    } catch (error) {
      console.error("게시물 업데이트 오류:", error)
    }
  }

  const handlePostChange = (field: string, value: string) => {
    setSelectedPost((prev) => (prev ? { ...prev, [field]: value } : null))
  }

  // 댓글 가져오기
  const fetchComments = async (postId: number) => {
    if (comments[postId]) return // 이미 불러온 댓글이 있으면 다시 불러오지 않음
    try {
      const response = await fetch(`/api/comments/post/${postId}`)
      const data = await response.json()
      setComments((prev) => ({ ...prev, [postId]: data.comments }))
    } catch (error) {
      console.error("댓글 가져오기 오류:", error)
    }
  }

  // 댓글 추가
  const addComment = async () => {
    try {
      const response = await fetch("/api/comments/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newComment),
      })
      const data = await response.json()
      setComments((prev) => ({
        ...prev,
        [data.postId]: [...(prev[data.postId] || []), data],
      }))
      setShowAddCommentDialog(false)
      setNewComment({ body: "", postId: null, userId: 1 })
    } catch (error) {
      console.error("댓글 추가 오류:", error)
    }
  }

  const handleNewCommentChange = (field: string, value: string | number) => {
    setNewComment((prev) => ({ ...prev, [field]: value }))
  }

  // 댓글 업데이트
  const updateComment = async () => {
    if (!selectedComment) return
    try {
      const response = await fetch(`/api/comments/${selectedComment.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: selectedComment.body }),
      })
      const data = await response.json()
      setComments((prev) => ({
        ...prev,
        [data.postId]: prev[data.postId].map((comment) => (comment.id === data.id ? data : comment)),
      }))
      setShowEditCommentDialog(false)
    } catch (error) {
      console.error("댓글 업데이트 오류:", error)
    }
  }

  const handleCommentChange = (body: string) => {
    setSelectedComment((prev) => (prev ? { ...prev, body } : null))
  }

  // 댓글 삭제
  const deleteComment = async (id: number, postId: number) => {
    try {
      await fetch(`/api/comments/${id}`, {
        method: "DELETE",
      })
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].filter((comment) => comment.id !== id),
      }))
    } catch (error) {
      console.error("댓글 삭제 오류:", error)
    }
  }

  // 댓글 좋아요
  const likeComment = async (id: number, postId: number) => {
    try {
      const comment = comments[postId]?.find((c) => c.id === id)
      if (!comment) return

      const response = await fetch(`/api/comments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ likes: comment.likes + 1 }),
      })
      const data = await response.json()
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].map((comment) =>
          comment.id === data.id ? { ...data, likes: comment.likes + 1 } : comment,
        ),
      }))
    } catch (error) {
      console.error("댓글 좋아요 오류:", error)
    }
  }

  useEffect(() => {
    if (selectedTag) {
      fetchPostsByTag(selectedTag)
    } else {
      fetchPosts()
    }
    updateURL()
  }, [skip, limit, sortBy, sortOrder, selectedTag])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setSkip(parseInt(params.get("skip") || "0"))
    setLimit(parseInt(params.get("limit") || "10"))
    setSearchQuery(params.get("search") || "")
    setSortBy(params.get("sortBy") || "")
    setSortOrder(params.get("sortOrder") || "asc")
    setSelectedTag(params.get("tag") || "")
  }, [location.search])

  // 하이라이트 함수 추가
  const highlightText = (text: string, highlight: string) => {
    if (!text) return null
    if (!highlight.trim()) {
      return <span>{text}</span>
    }
    const regex = new RegExp(`(${highlight})`, "gi")
    const parts = text.split(regex)
    return (
      <span>
        {parts.map((part, i) => (regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>))}
      </span>
    )
  }

  // 댓글 렌더링
  const handleAddComment = (postId: number) => {
    setNewComment((prev) => ({ ...prev, postId }))
    setShowAddCommentDialog(true)
  }

  const handleEditComment = (comment: Comment) => {
    setSelectedComment(comment)
    setShowEditCommentDialog(true)
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            게시물 추가
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              fetchPosts={fetchPosts}
              setPosts={setPosts}
              setTotal={setTotal}
              setLoading={setLoading}
            />
            <TagFilter
              selectedTag={selectedTag}
              setSelectedTag={setSelectedTag}
              fetchPostsByTag={fetchPostsByTag}
              updateURL={updateURL}
            />
            <SortFilter sortBy={sortBy} setSortBy={setSortBy} />
            <SortOrderFilter sortOrder={sortOrder} setSortOrder={setSortOrder} />
          </div>

          {loading ? (
            <div className="flex justify-center p-4">로딩 중...</div>
          ) : (
            <PostTable
              posts={posts}
              setPosts={setPosts}
              selectedPost={selectedPost}
              setSelectedPost={setSelectedPost}
              fetchComments={fetchComments}
              setShowPostDetailDialog={setShowPostDetailDialog}
              setSelectedUser={setSelectedUser}
              setShowUserModal={setShowUserModal}
              highlightText={highlightText}
              selectedTag={selectedTag}
              setSelectedTag={setSelectedTag}
              updateURL={updateURL}
              setShowEditDialog={setShowEditDialog}
              searchQuery={searchQuery}
            />
          )}

          <Pagination limit={limit} skip={skip} total={total} onLimitChange={setLimit} onSkipChange={setSkip} />
        </div>
      </CardContent>

      <AddPostDialog
        isOpen={showAddDialog}
        onOpenChange={setShowAddDialog}
        newPost={newPost}
        onNewPostChange={handleNewPostChange}
        onAddPost={addPost}
      />

      <EditPostDialog
        isOpen={showEditDialog}
        onOpenChange={setShowEditDialog}
        selectedPost={selectedPost}
        onPostChange={handlePostChange}
        onUpdatePost={updatePost}
      />

      <AddCommentDialog
        isOpen={showAddCommentDialog}
        onOpenChange={setShowAddCommentDialog}
        newComment={newComment}
        onNewCommentChange={handleNewCommentChange}
        onAddComment={addComment}
      />

      <EditCommentDialog
        isOpen={showEditCommentDialog}
        onOpenChange={setShowEditCommentDialog}
        selectedComment={selectedComment}
        onCommentChange={handleCommentChange}
        onUpdateComment={updateComment}
      />

      <PostDetailDialog
        isOpen={showPostDetailDialog}
        onOpenChange={setShowPostDetailDialog}
        selectedPost={selectedPost}
        searchQuery={searchQuery}
        renderComments={(postId) => (
          <CommentList
            comments={comments}
            postId={postId}
            searchQuery={searchQuery}
            onAddComment={handleAddComment}
            onEditComment={handleEditComment}
            onDeleteComment={deleteComment}
            onLikeComment={likeComment}
            highlightText={highlightText}
          />
        )}
        highlightText={highlightText}
      />

      <UserModal isOpen={showUserModal} onOpenChange={setShowUserModal} selectedUser={selectedUser} />
    </Card>
  )
}

export default PostsManager
