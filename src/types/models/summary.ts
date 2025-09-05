export interface Summary {
    id: string;
    title: string;
    content: string;
    folderId: string | null;
    owner: string;
    createdAt: number;
    updatedAt: number;
}