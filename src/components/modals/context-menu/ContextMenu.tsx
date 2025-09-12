import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';

interface ContextMenuOption {
  title: string;
  icon?: string;
  onPress: () => void;
  destructive?: boolean;
}

interface ContextMenuProps {
  visible: boolean;
  onClose: () => void;
  options: ContextMenuOption[];
  position?: { top?: number; right?: number; bottom?: number; left?: number };
}

const ContextMenu: React.FC<ContextMenuProps> = ({ 
  visible, 
  onClose, 
  options,
  position = { top: 50, right: 20 }
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.modalOverlay}
        onPress={onClose}
      >
        <View style={[styles.menuContainer, position]}>
          {options.map((option, index) => (
            <TouchableOpacity 
              key={index}
              style={[styles.menuItem, option.destructive && styles.destructiveItem]}
              onPress={() => {
                option.onPress();
                onClose();
              }}
            >
              <Text style={[styles.menuItemText, option.destructive && styles.destructiveText]}>
                {option.icon ? `${option.icon} ${option.title}` : option.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    position: 'absolute',
    backgroundColor: '#2d2d2d',
    borderRadius: 8,
    padding: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    minWidth: 180,
  },
  menuItem: {
    padding: 12,
    borderRadius: 4,
  },
  destructiveItem: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    borderRadius: 15,
    
  },
  menuItemText: {
    fontSize: 16,
    color: '#fff',
  },
  destructiveText: {
    color: '#ff6b6b',
  },
});

export default ContextMenu;