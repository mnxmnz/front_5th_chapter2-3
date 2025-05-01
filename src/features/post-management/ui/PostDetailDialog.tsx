import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../shared/ui"
import { Post } from "../../../entities/post"
import { Comment } from "../../../entities/post"

interface PostDetailDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  post: Post | null
  comments: Comment[]
  onAddComment: () => void
  onDeleteComment: (id: number) => void
  onLikeComment: (id: number, likes: number) => void
}

const PostDetailDialog = ({
  isOpen,
  onOpenChange,
  post,
  comments,
  onAddComment,
  onDeleteComment,
  onLikeComment,
}: PostDetailDialogProps) => {
  if (!post) return null

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{post.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>{post.body}</p>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">댓글</h3>
            {comments.map((comment) => (
              <div key={comment.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{comment.user?.username}</p>
                    <p>{comment.body}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => onLikeComment(comment.id, comment.likes + 1)}>
                      <span className="text-sm">👍 {comment.likes}</span>
                    </button>
                    <button onClick={() => onDeleteComment(comment.id)}>삭제</button>
                  </div>
                </div>
              </div>
            ))}
            <button onClick={onAddComment}>댓글 추가</button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PostDetailDialog
