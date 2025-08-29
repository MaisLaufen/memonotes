export interface Note {
  id: string;
  title: string;
  description: string;
  folderId: string | null;
  status: 'new' | 'in-progress' | 'done'; // TODO: Вынести в enum
  owner: string; // login пользователя
  createdAt: number;
}