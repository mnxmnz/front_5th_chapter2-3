import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../shared/ui"
import { Post } from "../types/post"

interface PostDetailDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  selectedPost: Post | null
  searchQuery: string
  renderComments: (postId: number) => React.ReactNode
  highlightText: (text: string, highlight: string) => React.ReactNode | null
}

const PostDetailDialog = ({
  isOpen,
  onOpenChange,
  selectedPost,
  searchQuery,
  renderComments,
  highlightText,
}: PostDetailDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{highlightText(selectedPost?.title || "", searchQuery)}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>{highlightText(selectedPost?.body || "", searchQuery)}</p>
          {selectedPost?.id && renderComments(selectedPost.id)}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PostDetailDialog
