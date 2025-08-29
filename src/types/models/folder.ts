export interface Folder {
    id: string;
    name: string;
    owner: string; // логин пользователя
    createdAt: string;
    color: string;
    parentId: string | null;
    //important: number; // TODO: сделать через enum
}