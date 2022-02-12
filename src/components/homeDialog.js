import React, {useState, useEffect} from "react";
import {Text,View,Modal,TouchableOpacity,StyleSheet,Appearance} from "react-native";

export default function AddinTrip(props){

    const [color, Color] = useState('#000');
    const [bgcolor, BgColor] = useState('#fff');

    useEffect(() => {
        DarkMode()
    }, []);

    const DarkMode=()=>{
        if (Appearance.getColorScheme()==='dark'){
            Color('#fff')
            BgColor('#242424')
        }
    };

    const Submit=()=>{
        props.edit()
    };

    const Cancel=()=>{
        props.Close()
    };

    const styles = StyleSheet.create({
        main: {
            height: '100%',
            backgroundColor: '#000000aa',
            alignItems: 'center'
        },
        content: {
            height: '20%',
            width: '80%',
            flexDirection: 'column',
            justifyContent: 'space-between',
            marginTop: '100%',
            borderRadius: 13,
            backgroundColor: `${bgcolor}`
        },
        head: {
            paddingTop: '5%'
        },
        headText: {
            color: `${color}`,
            textAlign: 'center',
            paddingTop: 10,
            fontSize: 17
        },
        border: {
            height: 40,
            borderBottomWidth: 1,
            borderBottomColor: '#0f815a'
        },
        buttonView: {
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        button: {
            height: '73.4%',
            width: '37.5%',
            backgroundColor: `${bgcolor}`,
            // backgroundColor: '#000',
            borderBottomLeftRadius: 13,
            borderBottomRightRadius: 13,
            alignItems: 'center',
            justifyContent: 'center',
        },
        cancel:{
            fontSize: 16,
            fontWeight: '600',
            color: '#f55'
        },
        submit:{
            fontSize: 16,
            fontWeight: '600',
            color: '#007ff9'
        }
    })

    return(
        <Modal
            transparent={true}
            visible={props.show}
            animationType='fade'
            onDismiss={Cancel}
        >
            <View style={styles.main}>
                <View style={styles.content}>
                    <View style={styles.head}>
                        <Text style={styles.headText}>Your garage is Empty</Text>
                        <Text style={styles.headText}>Add a car to your garage</Text>
                    </View>
                    <View style={styles.border}></View>
                    <View style={styles.buttonView}>
                        <TouchableOpacity style={styles.button} onPress={Cancel}>
                            <Text style={styles.cancel}>Later</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={Submit}>
                            <Text style={styles.submit}>Add</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
};