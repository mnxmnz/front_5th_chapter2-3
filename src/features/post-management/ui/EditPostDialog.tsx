import { Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea, Button } from "../../../shared/ui"
import { Post } from "../../../entities/post"

interface EditPostDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  post: Post | null
  onPostChange: (field: string, value: string) => void
  onUpdatePost: () => void
}

const EditPostDialog = ({ isOpen, onOpenChange, post, onPostChange, onUpdatePost }: EditPostDialogProps) => {
  if (!post) return null

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>게시물 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title">제목</label>
            <Input id="title" value={post.title} onChange={(e) => onPostChange("title", e.target.value)} />
          </div>
          <div className="space-y-2">
            <label htmlFor="body">내용</label>
            <Textarea id="body" value={post.body} onChange={(e) => onPostChange("body", e.target.value)} />
          </div>
          <Button onClick={onUpdatePost}>수정</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default EditPostDialog
