import React, {useState, useEffect} from "react";
import {Text,View,TextInput,Modal,TouchableOpacity,
    TouchableWithoutFeedback,StyleSheet,Appearance} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import DatePicker from "./datepicker";


export default function AddinTrip(props){

    const [value, Value] = useState(null);
    const [visible, Visible] = useState(false);
    const [dateText, DateText] = useState(new Date().toString().substring(4, 15));
    const [date, setDate] = useState(new Date());
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
        if (value!=null) {
            props.Add(dateText,value)
            Value(null)
            setDate(new Date())
            DateText(new Date().toString().substring(4, 15))
        }
    };

    const Cancel=()=>{
        props.onClose()
        Value(null)
        setDate(new Date())
        DateText(new Date().toString().substring(4, 15))
    };

    const handlePicker =(d)=> {
        DateText(d.toString().substring(4, 15))
        setDate(d)
        Visible(false)
    };
    const closePicker =()=> {
        Visible(false)
    };
    const showPicker =()=> {
        Visible(true)
    };

    const styles = StyleSheet.create({
        main: {
            backgroundColor: '#000000aa'
        },
        Topbackdrop: {
            height: '31%',
        },
        Bottombackdrop: {
            height: '40.2%',
        },
        content: {
            height: '28.8%',
            flexDirection: 'column',
            justifyContent: 'space-between',
            paddingHorizontal: '5%',
        },
        inputView: {
            height: 185,
            width: '100%',
            borderRadius: 13,
            backgroundColor: `${bgcolor}`,
            justifyContent: 'center',
            paddingHorizontal: 30
        },
        head:{
            fontSize: 18,
            alignSelf: 'center',
            fontWeight: '600',
            paddingBottom: 10,
            color: `${color}`,
        },
        inputhead:{
            fontSize: 16,
            fontWeight: '400',
            color: `${color}`,
        },
        input: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        inputfield: {
            height: 40,
            width:'75%',
            fontSize: 16,
            borderBottomWidth: 0.3,
            color: `${color}`,
            borderColor: `${color}`,
        },
        buttonView: {
            height: 52,
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        button: {
            height: 52,
            width: 173,
            borderRadius: 13,
            backgroundColor: `${bgcolor}`,
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
            visible={props.isVisible}
            animationType="slide"
            onDismiss={Cancel}
        >
            <View style={styles.main}>
                <TouchableWithoutFeedback onPress={Cancel}>
                    <View style={styles.Topbackdrop}></View>
                </TouchableWithoutFeedback>
                <View style={styles.content}>
                    <View style={styles.inputView}>
                        {(() => {
                            if (props.type=='dist') {
                            return (
                                <Text style={styles.head}>Add Distance</Text>
                            )
                            }else if (props.type=='fuel') {
                                return (
                                    <Text style={styles.head}>Add Fuel</Text>
                            )
                            }else if (props.type=='toll') {
                                return (
                                    <Text style={styles.head}>Add Toll</Text>
                            )
                            }else {
                                return (
                                    <Text style={styles.head}>Add Other</Text>
                            )
                            }
                        })()}
                        <Text style={styles.inputhead}>Date</Text>
                        <View style={styles.input}>
                            <TextInput
                                style={styles.inputfield}
                                value={dateText}
                                onChangeText={DateText}
                                onFocus={showPicker}
                                />
                            <TouchableOpacity onPress={showPicker}>
                                <Icon name="calendar-outline" size={30} color="#0f815a"/>
                            </TouchableOpacity>
                            <DatePicker
                                date={date}
                                isVisible={visible}
                                onConfirm={handlePicker}
                                onCancel={closePicker}
                                titleIOS='Pick a Date'
                                confirmTextIOS="Select"
                                />
                        </View>
                        <Text style={styles.inputhead}>Amount</Text>
                        <View style={styles.input}>
                            <TextInput
                                style={styles.inputfield}
                                value={value}
                                autoFocus={true}
                                onChangeText={Value}
                                keyboardType="numeric"
                                />
                            <Icon name="pencil-outline" size={28} color="#0f815a"/>
                        </View>
                    </View>
                    <View style={styles.buttonView}>
                        <TouchableOpacity style={styles.button} onPress={Cancel}>
                            <Text style={styles.cancel}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={Submit}>
                            <Text style={styles.submit}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableWithoutFeedback onPress={Cancel}>
                    <View style={styles.Bottombackdrop}></View>
                </TouchableWithoutFeedback>
            </View>
        </Modal>
    )
};