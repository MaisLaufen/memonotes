import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from "react-native";

const MemoButton = ({ title, onPress, loading = false }: { title: string; onPress: () => void; loading?: boolean }) => (
  <TouchableOpacity style={styles.button} onPress={onPress} disabled={loading}>
    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{title}</Text>}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#ffa132',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  }
});

export default MemoButton;