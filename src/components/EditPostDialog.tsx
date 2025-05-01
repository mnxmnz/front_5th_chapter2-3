import { Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea, Button } from "../shared/ui"
import { Post } from "../types/post"

interface EditPostDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  selectedPost: Post | null
  onPostChange: (field: string, value: string) => void
  onUpdatePost: () => void
}

const EditPostDialog = ({ isOpen, onOpenChange, selectedPost, onPostChange, onUpdatePost }: EditPostDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>게시물 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="제목"
            value={selectedPost?.title || ""}
            onChange={(e) => onPostChange("title", e.target.value)}
          />
          <Textarea
            rows={15}
            placeholder="내용"
            value={selectedPost?.body || ""}
            onChange={(e) => onPostChange("body", e.target.value)}
          />
          <Button onClick={onUpdatePost}>게시물 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default EditPostDialog
