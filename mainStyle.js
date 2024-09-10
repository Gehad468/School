import { StyleSheet } from 'react-native';

const mainStyles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 25,
    },
    mainText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    header: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },

    mainTitle: {
        fontSize: 23,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 20,
    },
    logoContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingBottom: 30,
      paddingTop: 30,
  },
});

export default mainStyles;
