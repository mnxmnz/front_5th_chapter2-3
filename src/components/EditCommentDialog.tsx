import { Dialog, DialogContent, DialogHeader, DialogTitle, Textarea, Button } from "../shared/ui"

interface EditCommentDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  selectedComment: {
    id: number
    body: string
    postId: number
  } | null
  onCommentChange: (body: string) => void
  onUpdateComment: () => void
}

const EditCommentDialog = ({
  isOpen,
  onOpenChange,
  selectedComment,
  onCommentChange,
  onUpdateComment,
}: EditCommentDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>댓글 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="댓글 내용"
            value={selectedComment?.body || ""}
            onChange={(e) => onCommentChange(e.target.value)}
          />
          <Button onClick={onUpdateComment}>댓글 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default EditCommentDialog
