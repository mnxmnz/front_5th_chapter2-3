import { Post } from "../entities/post"

// 게시물 관련 API
export const postApi = {
  getPosts: async (params: { limit: number; skip: number }) => {
    const response = await fetch(`/api/posts?limit=${params.limit}&skip=${params.skip}`)
    return response.json()
  },

  searchPosts: async (query: string) => {
    const response = await fetch(`/api/posts/search?q=${query}`)
    return response.json()
  },

  addPost: async (post: { title: string; body: string; userId: number }) => {
    const response = await fetch("/api/posts/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    })
    return response.json()
  },

  updatePost: async (id: number, post: Partial<Post>) => {
    const response = await fetch(`/api/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    })
    return response.json()
  },

  deletePost: async (id: number) => {
    await fetch(`/api/posts/${id}`, {
      method: "DELETE",
    })
  },

  getPostsByTag: async (tag: string) => {
    const response = await fetch(`/api/posts/tag/${tag}`)
    return response.json()
  },

  getTags: async () => {
    const response = await fetch("/api/posts/tags")
    return response.json()
  },
}

// 사용자 관련 API
export const userApi = {
  getUsers: async () => {
    const response = await fetch("/api/users?limit=0&select=username,image")
    return response.json()
  },

  getUser: async (id: number) => {
    const response = await fetch(`/api/users/${id}`)
    return response.json()
  },
}

// 댓글 관련 API
export const commentApi = {
  getComments: async (postId: number) => {
    const response = await fetch(`/api/comments/post/${postId}`)
    return response.json()
  },

  addComment: async (comment: { body: string; postId: number | null; userId: number }) => {
    const response = await fetch("/api/comments/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(comment),
    })
    return response.json()
  },

  updateComment: async (id: number, comment: { body: string }) => {
    const response = await fetch(`/api/comments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(comment),
    })
    return response.json()
  },

  deleteComment: async (id: number) => {
    await fetch(`/api/comments/${id}`, {
      method: "DELETE",
    })
  },

  likeComment: async (id: number, likes: number) => {
    const response = await fetch(`/api/comments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ likes }),
    })
    return response.json()
  },
}
