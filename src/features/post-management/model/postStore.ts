import { create } from "zustand"
import { Post } from "../../../entities/post"

interface PostState {
  posts: Post[]
  selectedPost: Post | null
  setPosts: (posts: Post[]) => void
  setSelectedPost: (post: Post | null) => void
  addPost: (post: Post) => void
  updatePost: (post: Post) => void
  deletePost: (postId: number) => void
}

export const usePostStore = create<PostState>((set) => ({
  posts: [],
  selectedPost: null,
  setPosts: (posts) => set({ posts }),
  setSelectedPost: (post) => set({ selectedPost: post }),
  addPost: (post) => set((state) => ({ posts: [...state.posts, post] })),
  updatePost: (post) =>
    set((state) => ({
      posts: state.posts.map((p) => (p.id === post.id ? post : p)),
    })),
  deletePost: (postId) =>
    set((state) => ({
      posts: state.posts.filter((p) => p.id !== postId),
    })),
}))
