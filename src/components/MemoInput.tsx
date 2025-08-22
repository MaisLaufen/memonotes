import { StyleSheet, TextInput } from "react-native";

// Кастомное поле ввода
const MemoInput = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
}: {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
}) => (
  <TextInput
    style={styles.input}
    placeholder={placeholder}
    placeholderTextColor="#888"
    value={value}
    onChangeText={onChangeText}
    secureTextEntry={secureTextEntry}
  />
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c0b0b',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#1c1c1c',
    color: '#fff',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 15,
}});

export default MemoInput;