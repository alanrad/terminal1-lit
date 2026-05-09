import { ApiService, type WidgetConfig } from "./api.service";

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

/** Example concrete service — swap with your real API. */
export class PostService extends ApiService {
  constructor(config?: WidgetConfig) {
    super({ baseUrl: "https://jsonplaceholder.typicode.com", ...config });
  }

  fetchPosts(): Promise<Post[]> {
    return this.fetch<Post[]>("/posts");
  }

  fetchPost(id: number): Promise<Post> {
    return this.fetch<Post>(`/posts/${id}`);
  }
}

// Singleton — widgets share one instance unless you construct their own
export const postService = new PostService();
