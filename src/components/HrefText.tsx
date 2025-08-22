import { StyleSheet, Text } from "react-native";

const HrefText = ({ text, onPress }: { text: string; onPress: () => void }) => (
  <Text style={styles.link} onPress={onPress}>
    {text}
  </Text>
);

const styles = StyleSheet.create({
  link: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
    textDecorationLine: 'underline',
  },
});

export default HrefText;