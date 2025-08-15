export interface PostModel {
  id: number;
  userId: number;
  title: string;
  body: string;
  tags?: string[];
  reactions?: {
    likes: number;
    dislikes: number;
  };
  views: number;
}
