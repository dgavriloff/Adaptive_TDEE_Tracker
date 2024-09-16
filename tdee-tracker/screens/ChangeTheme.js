import { useState, useContext, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Segment from "../components/Segment";
import BubbleButton from "../components/BubbleButton";
import MultipleToggleButtons from "../components/MultipleToggleButtons";
import { ThemeContext } from "../components/ThemeProvider";
import { useNavigation } from "@react-navigation/native";




export default ChangeTheme = () => {
    const {currentTheme, darkMode: cDarkMode, setDarkMode: cSetDarkMode} = useContext(ThemeContext)
    const navigation = useNavigation();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: currentTheme.backgroundColor,
            flexDirection: 'column',
            alignItems: 'center'
        }
    });

    return(
        <View style={styles.container}>
            <Segment label={'Select Theme'}>
                <MultipleToggleButtons
                defaultValue={{short: cDarkMode}}
                values={[{value: {short: 'Light'}, key: false, pressable: true},{value: {short: 'Dark'}, key: true, pressable: true}]}
                action={cSetDarkMode}
                containerStyle={{flexDirection: 'row', justifyContent: 'space-between'}}
                />
            </Segment>
            <BubbleButton text={'Save and Go Back'} onPress={() => navigation.goBack()}/>
        </View>
    )
}