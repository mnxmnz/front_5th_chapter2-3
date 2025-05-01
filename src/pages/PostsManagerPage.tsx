import { useEffect, useState, useCallback } from "react"
import { Plus } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Post, User } from "../entities/post"
import { Button, Card, CardContent, CardHeader, CardTitle } from "../shared/ui"
import { SearchBar } from "../widgets/search-bar"
import { TagFilter } from "../widgets/tag-filter"
import { SortFilter } from "../widgets/sort-filter"
import { SortOrderFilter } from "../widgets/sort-order-filter"
import { PostTable } from "../widgets/post-table"
import { Pagination } from "../widgets/pagination"
import { AddPostDialog, EditPostDialog, PostDetailDialog } from "../features/post-management/ui"
import { AddCommentDialog, EditCommentDialog } from "../features/comment-management/ui"
import { UserModal } from "../features/user-management/ui"
import { postApi, commentApi } from "../services/api"
import { usePostStore } from "../features/post-management/model/postStore"

interface Comment {
  id: number
  body: string
  postId: number
  userId: number
  user: User
  likes: number
}

interface PostsResponse {
  posts: Post[]
  total: number
  skip: number
  limit: number
}

const PostsManager = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const queryClient = useQueryClient()
  const { posts: storePosts, selectedPost, setPosts, setSelectedPost, addPost, updatePost, deletePost } = usePostStore()

  // 상태 관리
  const [skip, setSkip] = useState(parseInt(queryParams.get("skip") || "0"))
  const [limit, setLimit] = useState(parseInt(queryParams.get("limit") || "10"))
  const [searchQuery, setSearchQuery] = useState(queryParams.get("search") || "")
  const [sortBy, setSortBy] = useState(queryParams.get("sortBy") || "")
  const [sortOrder, setSortOrder] = useState(queryParams.get("sortOrder") || "asc")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [newPost, setNewPost] = useState({ title: "", body: "", userId: 1 })
  const [selectedTag, setSelectedTag] = useState(queryParams.get("tag") || "")
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

  const updateURL = useCallback(() => {
    const params = new URLSearchParams()
    if (skip) params.set("skip", skip.toString())
    if (limit) params.set("limit", limit.toString())
    if (searchQuery) params.set("search", searchQuery)
    if (sortBy) params.set("sortBy", sortBy)
    if (sortOrder) params.set("sortOrder", sortOrder)
    if (selectedTag) params.set("tag", selectedTag)
    navigate(`?${params.toString()}`)
  }, [skip, limit, searchQuery, sortBy, sortOrder, selectedTag, navigate])

  // 게시물 관련 쿼리
  const { data: postsData, isLoading: isPostsLoading } = useQuery<PostsResponse>({
    queryKey: ["posts", { skip, limit, tag: selectedTag }],
    queryFn: () => (selectedTag ? postApi.getPostsByTag(selectedTag) : postApi.getPosts({ skip, limit })),
  })

  const { data: searchData, isLoading: isSearchLoading } = useQuery({
    queryKey: ["search", searchQuery],
    queryFn: () => postApi.searchPosts(searchQuery),
    enabled: !!searchQuery,
  })

  // 게시물 관련 뮤테이션
  const addPostMutation = useMutation({
    mutationFn: postApi.addPost,
    onSuccess: (data: Post) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      addPost(data)
      setShowAddDialog(false)
      setNewPost({ title: "", body: "", userId: 1 })
    },
  })

  const updatePostMutation = useMutation({
    mutationFn: ({ id, post }: { id: number; post: Partial<Post> }) => postApi.updatePost(id, post),
    onSuccess: (data: Post) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      updatePost(data)
      setShowEditDialog(false)
    },
  })

  const deletePostMutation = useMutation({
    mutationFn: postApi.deletePost,
    onSuccess: (_, postId: number) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      deletePost(postId)
    },
  })

  // 댓글 관련 쿼리
  const { data: commentsData } = useQuery({
    queryKey: ["comments", selectedPost?.id],
    queryFn: () => commentApi.getComments(selectedPost?.id || 0),
    enabled: !!selectedPost?.id,
  })

  // 댓글 관련 뮤테이션
  const addCommentMutation = useMutation({
    mutationFn: commentApi.addComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] })
      setShowAddCommentDialog(false)
      setNewComment({ body: "", postId: null, userId: 1 })
    },
  })

  const updateCommentMutation = useMutation({
    mutationFn: ({ id, comment }: { id: number; comment: { body: string } }) => commentApi.updateComment(id, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] })
      setShowEditCommentDialog(false)
    },
  })

  const deleteCommentMutation = useMutation({
    mutationFn: commentApi.deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] })
    },
  })

  const likeCommentMutation = useMutation({
    mutationFn: ({ id, likes }: { id: number; likes: number }) => commentApi.likeComment(id, likes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] })
    },
  })

  // 이벤트 핸들러
  const handleNewPostChange = (field: string, value: string | number) => {
    setNewPost((prev) => ({ ...prev, [field]: value }))
  }

  const handlePostChange = (field: string, value: string) => {
    if (selectedPost) {
      const updatedPost = { ...selectedPost, [field]: value }
      updatePost(updatedPost)
    }
  }

  const handleNewCommentChange = (field: string, value: string | number) => {
    setNewComment((prev) => ({ ...prev, [field]: value }))
  }

  const handleCommentChange = (body: string) => {
    setSelectedComment((prev) => (prev ? { ...prev, body } : null))
  }

  useEffect(() => {
    updateURL()
  }, [updateURL])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setSkip(parseInt(params.get("skip") || "0"))
    setLimit(parseInt(params.get("limit") || "10"))
    setSearchQuery(params.get("search") || "")
    setSortBy(params.get("sortBy") || "")
    setSortOrder(params.get("sortOrder") || "asc")
    setSelectedTag(params.get("tag") || "")
  }, [location.search])

  useEffect(() => {
    if (postsData?.posts) {
      setPosts(postsData.posts)
    }
  }, [postsData, setPosts])

  const displayedPosts = searchQuery ? searchData?.posts : storePosts
  const total = searchQuery ? searchData?.total : postsData?.total
  const isLoading = isPostsLoading || isSearchLoading

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
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <TagFilter selectedTag={selectedTag} setSelectedTag={setSelectedTag} updateURL={updateURL} />
            <SortFilter sortBy={sortBy} setSortBy={setSortBy} />
            <SortOrderFilter sortOrder={sortOrder} setSortOrder={setSortOrder} />
          </div>

          {isLoading ? (
            <div className="flex justify-center p-4">로딩 중...</div>
          ) : (
            <PostTable
              posts={displayedPosts || []}
              selectedPost={selectedPost}
              setSelectedPost={setSelectedPost}
              setShowPostDetailDialog={setShowPostDetailDialog}
              setSelectedUser={setSelectedUser}
              setShowUserModal={setShowUserModal}
              highlightText={highlightText}
              selectedTag={selectedTag}
              setSelectedTag={setSelectedTag}
              updateURL={updateURL}
              setShowEditDialog={setShowEditDialog}
              searchQuery={searchQuery}
              onDeletePost={deletePostMutation.mutate}
            />
          )}

          <Pagination limit={limit} skip={skip} total={total || 0} onLimitChange={setLimit} onSkipChange={setSkip} />
        </div>
      </CardContent>

      <AddPostDialog
        isOpen={showAddDialog}
        onOpenChange={setShowAddDialog}
        newPost={newPost}
        onNewPostChange={handleNewPostChange}
        onAddPost={() => addPostMutation.mutate(newPost)}
      />

      <EditPostDialog
        isOpen={showEditDialog}
        onOpenChange={setShowEditDialog}
        post={selectedPost}
        onPostChange={handlePostChange}
        onUpdatePost={() => selectedPost && updatePostMutation.mutate({ id: selectedPost.id, post: selectedPost })}
      />

      <PostDetailDialog
        isOpen={showPostDetailDialog}
        onOpenChange={setShowPostDetailDialog}
        post={selectedPost}
        comments={commentsData?.comments || []}
        onAddComment={() => addCommentMutation.mutate(newComment)}
        onDeleteComment={deleteCommentMutation.mutate}
        onLikeComment={(id, likes) => likeCommentMutation.mutate({ id, likes })}
      />

      <AddCommentDialog
        isOpen={showAddCommentDialog}
        onOpenChange={setShowAddCommentDialog}
        newComment={newComment}
        onNewCommentChange={handleNewCommentChange}
        onAddComment={() => addCommentMutation.mutate(newComment)}
      />

      <EditCommentDialog
        isOpen={showEditCommentDialog}
        onOpenChange={setShowEditCommentDialog}
        comment={selectedComment}
        onCommentChange={handleCommentChange}
        onUpdateComment={() =>
          selectedComment &&
          updateCommentMutation.mutate({ id: selectedComment.id, comment: { body: selectedComment.body } })
        }
      />

      <UserModal isOpen={showUserModal} onOpenChange={setShowUserModal} user={selectedUser} />
    </Card>
  )
}

export default PostsManager
