import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Post } from "@/types";

export const postKeys = {
  all: ["posts"] as const,
  byUser: (userId: string) => ["posts", "user", userId] as const,
};

async function fetchPosts() {
  const { data } = await api.get<Post[]>("/getBlog");
  return Array.isArray(data) ? data : [];
}

const isPublic = (p: Post) => p.publication !== false;

/**
 * All published posts. The list endpoint is public and returns full posts
 * (body + comments), so single-post pages read from this cache too — which
 * means readers don't need an account to read an article.
 */
export function usePosts() {
  return useQuery({
    queryKey: postKeys.all,
    queryFn: fetchPosts,
    select: (posts) => posts.filter(isPublic),
    staleTime: 60_000,
  });
}

export function usePost(id: string | undefined) {
  return useQuery({
    queryKey: postKeys.all,
    queryFn: fetchPosts,
    select: (posts) => posts.find((p) => p._id === id) ?? null,
    staleTime: 60_000,
    enabled: !!id,
  });
}

export function useUserPosts(userId: string | undefined) {
  return useQuery({
    queryKey: postKeys.byUser(userId ?? ""),
    queryFn: async () => (await api.get<Post[]>(`/getUserBlog/${userId}`)).data,
    enabled: !!userId,
  });
}

export interface PostInput {
  title: string;
  excerpt: string;
  body: string;
  category: string;
  date: string;
  tags: string;
  author: string;
  authorId: string;
  image?: File | null;
}

function toFormData(input: PostInput) {
  const fd = new FormData();
  const { image, ...fields } = input;
  Object.entries(fields).forEach(([k, v]) => fd.append(k, v ?? ""));
  if (image) fd.append("image", image);
  return fd;
}

export function useSavePost(id?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: PostInput) => {
      const fd = toFormData(input);
      const { data } = id
        ? await api.patch<{ message: string; result: Post }>(`/update/${id}`, fd)
        : await api.post<{ message: string; blog: Post }>("/sendPost", fd);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: postKeys.all }),
  });
}

export function useDeletePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/deleteBlog/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: postKeys.all }),
  });
}

export function useAddComment(postId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { comment: string; author: string }) =>
      (await api.post<{ message: string }>(`/addComment/${postId}`, input)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: postKeys.all }),
  });
}
