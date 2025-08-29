export interface Note {
  id: string;
  title: string;
  description: string;
  status: 'new' | 'in-progress' | 'done'; // TODO: Вынести в enum
  owner: string; // login пользователя
  createdAt: number;
}