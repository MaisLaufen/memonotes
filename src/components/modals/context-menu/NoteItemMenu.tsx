import React from 'react';
import ContextMenu from './ContextMenu';

interface NoteItemMenuProps {
  visible: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const NoteItemMenu: React.FC<NoteItemMenuProps> = ({ 
  visible, 
  onClose, 
  onEdit, 
  onDelete 
}) => {
  const options = [
    {
      title: 'Редактировать заметку',
      icon: '',
      onPress: onEdit
    },
    {
      title: 'Удалить заметку',
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

export default NoteItemMenu;