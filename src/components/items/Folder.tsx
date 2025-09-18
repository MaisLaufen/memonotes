import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Folder } from "../../types/models/folder";
import React, { useState } from "react";
import FolderItemMenu from "../modals/context-menu/FolderItemMenu";

import tinycolor from "tinycolor2";
import LinearGradient from "react-native-linear-gradient";


// TODO: Вынести в отдельный компонент
export const getGradientColors = (baseColor: string) => {
  const color = tinycolor(baseColor);

  // Если цвет тёмный → делаем чуть светлее, иначе чуть темнее
  const gradientColor = color.isDark()
    ? color.lighten(25).toHexString()
    : color.darken(20).toHexString();

  return [baseColor, gradientColor];
};

interface FolderItemProps {
  folder: Folder;
  onEditPress: () => void;
  onDeletePress: () => void;
  onPress: () => void;
}

const FolderItem: React.FC<FolderItemProps> = ({ 
  folder, 
  onEditPress, 
  onDeletePress, 
  onPress 
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const gradientColors = getGradientColors(folder.color || "#ff0000");

  const handleMenuPress = (e: any) => {
    e.stopPropagation();
    setShowMenu(true);
  };

  const handleCloseMenu = () => {
    setShowMenu(false);
  };

  const onEdit = () => {
    setShowMenu(false);
    onEditPress();
  };

  const onDelete = () => {
    setShowMenu(false);
    onDeletePress();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.folderCard} onPress={onPress}>
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[StyleSheet.absoluteFill, {borderRadius: 12}]}
        />
        <Text style={styles.folderName}>{folder.name}</Text>
      </TouchableOpacity>
      
      {/* Кнопка меню */}
      <TouchableOpacity 
        style={styles.menuButton}
        onPress={handleMenuPress}
      >
        <Text style={styles.menuButtonText}>⋯</Text>
      </TouchableOpacity>

      {/* Модальное меню */}
      <FolderItemMenu
        visible={showMenu}
        onClose={handleCloseMenu}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  folderCard: {
    aspectRatio: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  folderName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffffff',
    textAlign: 'center',
    marginBottom: 4,
  },
  menuButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  menuButtonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  }
});

export default FolderItem;