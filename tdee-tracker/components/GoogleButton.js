import { TouchableOpacity, StyleSheet, Image, Text } from "react-native";

export default ({ onPress, buttonStyle, textStyle }) => {
    return(
        <TouchableOpacity style={{...styles.buttonStyle, ...buttonStyle}} onPress={onPress}>
            <Image 
            source={require('../assets/g-logo.png')}
            style={styles.logoStyle}
            />
            <Text style={{...styles.textStyle, ...textStyle}}>Sign in with Google</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    buttonStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#747775',
        width: '100%',
        alignItems: 'center',
        borderRadius: 25,
        backgroundColor: '',
        height: 44


    },
    logoStyle: {
        position: 'absolute',
        left: 12,
        width: 20,
        height: 20,
        borderRadius: 100,
    },
    textStyle: {
        fontSize: 16,
        fontFamily: 'Roboto'
    }
});