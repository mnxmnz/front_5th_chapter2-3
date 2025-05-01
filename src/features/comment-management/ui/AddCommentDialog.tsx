import { Dialog, DialogContent, DialogHeader, DialogTitle, Textarea, Button } from "../../../shared/ui"

interface AddCommentDialogProps { 
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  newComment: {
    body: string
    postId: number | null
    userId: number
  }
  onNewCommentChange: (field: string, value: string | number) => void
  onAddComment: () => void
}

const AddCommentDialog = ({
  isOpen,
  onOpenChange,
  newComment,
  onNewCommentChange,
  onAddComment,
}: AddCommentDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 댓글 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="댓글 내용"
            value={newComment.body}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onNewCommentChange("body", e.target.value)}
          />
          <Button onClick={onAddComment}>댓글 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AddCommentDialog
