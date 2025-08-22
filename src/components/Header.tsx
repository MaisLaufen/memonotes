import { StyleSheet, Text } from "react-native";

const HeaderLogo = () => (
  <Text style={styles.link}>
    MemoNotes
  </Text>
);

const styles = StyleSheet.create({
  link: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 15,
  },
});

export default HeaderLogo;