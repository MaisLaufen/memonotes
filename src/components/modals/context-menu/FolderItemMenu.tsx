import React from 'react';
import ContextMenu from './ContextMenu';

interface FolderItemMenuProps {
  visible: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const FolderItemMenu: React.FC<FolderItemMenuProps> = ({ 
  visible, 
  onClose, 
  onEdit, 
  onDelete 
}) => {
  const options = [
    {
      title: 'Редактировать папку',
      icon: '',
      onPress: onEdit
    },
    {
      title: 'Удалить папку',
      icon: '',
      onPress: onDelete,
      destructive: true
    }
  ];

  return (
    <ContextMenu
      visible={visible}
      onClose={onClose}
      options={options}
      position={{ top: 50, right: 20 }}
    />
  );
};

export default FolderItemMenu;