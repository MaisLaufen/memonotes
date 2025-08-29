import { useState } from "react";
import { Folder } from "../types/models/folder";
import { FOLDER_COLORS } from "../theme/folder_colors";

export const useFolderEdit = () => {
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');

  const startEdit = (folder: Folder) => {
    setEditingFolderId(folder.id);
    setEditName(folder.name);
    setEditColor(folder.color || FOLDER_COLORS[0]);
  };

  const cancelEdit = () => {
    setEditingFolderId(null);
    setEditName('');
    setEditColor('');
  };

  return {
    editingFolderId,
    editName,
    editColor,
    startEdit,
    cancelEdit,
    setEditName,
    setEditColor
  };
};