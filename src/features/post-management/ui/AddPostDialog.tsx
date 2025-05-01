import { Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea, Button } from "../../../shared/ui"

interface AddPostDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  newPost: {
    title: string
    body: string
    userId: number
  }
  onNewPostChange: (field: string, value: string | number) => void
  onAddPost: () => void
}

const AddPostDialog = ({ isOpen, onOpenChange, newPost, onNewPostChange, onAddPost }: AddPostDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 게시물 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input placeholder="제목" value={newPost.title} onChange={(e) => onNewPostChange("title", e.target.value)} />
          <Textarea
            rows={30}
            placeholder="내용"
            value={newPost.body}
            onChange={(e) => onNewPostChange("body", e.target.value)}
          />
          <Input
            type="number"
            placeholder="사용자 ID"
            value={newPost.userId}
            onChange={(e) => onNewPostChange("userId", Number(e.target.value))}
          />
          <Button onClick={onAddPost}>게시물 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AddPostDialog
