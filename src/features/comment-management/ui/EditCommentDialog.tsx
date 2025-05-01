import { Dialog, DialogContent, DialogHeader, DialogTitle, Textarea, Button } from "../../../shared/ui"
import { Comment } from "../../../entities/post"

interface EditCommentDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  comment: Comment | null
  onCommentChange: (body: string) => void
  onUpdateComment: () => void
}

const EditCommentDialog = ({
  isOpen,
  onOpenChange,
  comment,
  onCommentChange,
  onUpdateComment,
}: EditCommentDialogProps) => {
  if (!comment) return null

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>댓글 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="body">내용</label>
            <Textarea id="body" value={comment.body} onChange={(e) => onCommentChange(e.target.value)} />
          </div>
          <Button onClick={onUpdateComment}>수정</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default EditCommentDialog
