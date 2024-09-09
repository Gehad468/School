import { StyleSheet } from 'react-native';

const mainStyles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#161622',
        padding: 25,
    },
    mainText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    header: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },

    mainTitle: {
        fontSize: 23,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
    },
    logoContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
  },
});

export default mainStyles;
