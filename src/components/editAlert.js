import React, { useEffect, useRef, useState } from "react";
import {Text,TextInput,Image,Animated,Dimensions,TouchableOpacity,Pressable,
    StyleSheet,View,TouchableWithoutFeedback,Keyboard,Appearance} from "react-native";
import { Portal } from "react-native-paper";
import Icon from 'react-native-vector-icons/Ionicons';
import { PanGestureHandler } from "react-native-gesture-handler";
import DatePicker from "./datepicker";

export default function BottomSheet (props){
    const [color, Color] = useState('#000');
    const [bgcolor, BgColor] = useState('#fff');
    const [visible, Visible] = useState(false);
    const [dateText, DateText] = useState(null);
    const [date, setDate] = useState(null);
    const [name, Name] = useState(null);
    const [interval, Interval] = useState(null);
    const [open, setOpen] = useState(props.show);
    const bottomSheetHeight = Dimensions.get("window").height * 0.91;
    const bottom = useRef(new Animated.Value(-bottomSheetHeight)).current;
    const m = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    
    useEffect(() => {
        if (props.show) {
            DarkMode()
            setOpen(props.show);
            setValues()
            Animated.timing(bottom, {
                toValue: 0,
                duration: 250,
                useNativeDriver: false,
            }).start();
        } else {
            Animated.timing(bottom, {
                toValue: -bottomSheetHeight,
                duration: 200,
                useNativeDriver: false,
            }).start(() => {
                setOpen(false);
            });
        }
    }, [props.show]);

    const DarkMode=()=>{
        if (Appearance.getColorScheme()==='dark'){
            Color('#fff')
            BgColor('#141414')
        }
    };

    const onGesture = (event) => {
        if (event.nativeEvent.translationY > 0) {
            bottom.setValue(-event.nativeEvent.translationY);
        }
    };
    const onGestureEnd = (event) => {
        if (event.nativeEvent.translationY > bottomSheetHeight / 2) {
            props.onDismiss({status:false});
        } else {
            bottom.setValue(0);
        }
    };
    
    const handlePicker =(d)=> {
        DateText(d.toString().substring(0, 15))
        setDate(d)
        Visible(false)
    };

    const setValues=()=>{
        Name(props.name)
        Interval(props.interval)
        DateText(new Date(props.date.slice(7,11),m.indexOf(props.date.slice(0,3)),props.date.slice(4,6)).toString().slice(0,15))
        setDate(new Date(props.date.slice(7,11),m.indexOf(props.date.slice(0,3)),props.date.slice(4,6)))
    };

    const Edit =()=> {
        if (name!=null && interval!=null && interval!=''){
            props.onDismiss({status:true,id:props.id,date:dateText.slice(4,15),name:name,interval:interval})
        }
    };

    const styles = StyleSheet.create({
        root: {
            position: "absolute",
            left: 0,
            right: 0,
            zIndex: 100,
            backgroundColor: `${bgcolor}`,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            overflow: "hidden",
        },
        header: {
            height: "6%",
            backgroundColor: `${bgcolor}`,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        },
        heading: {
            color: `${color}`,
            fontSize: 20,
            fontWeight: '600'
        },
        carview: {
            width: '100%',
            height: '12%',
            alignItems: 'center'
        },
        car: {
            width: "50%",
            height: "100%",
            resizeMode: "cover",
        },
        inputview: {
            paddingTop: 20,
            height: '70%',
            paddingHorizontal: '10%',
        },
        inputhead: {
            color: `${color}`,
            paddingTop: 30,
            fontSize: 16,
            fontWeight: '500'
        },
        input: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        inputfield: {
            height: 40,
            width: '85%',
            fontSize: 16,
            borderBottomWidth: 0.3,
            paddingVertical: 5,
            color: `${color}`,
            borderColor: `${color}`,
          },
        bottomview: {
            height: '13%',
            backgroundColor: '#0f815a',
            paddingBottom: 15,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        button: {
            width: '33%',
            alignItems: 'center'
        },
        backDrop: {
            ...StyleSheet.absoluteFillObject,
            zIndex: 10,
            backgroundColor: "#000",
            opacity: 0.6,
        },
    });

    if (!open) {return null;}
    return (
        <Portal>
        <Pressable onPress={props.enableBackdropDismiss ? props.onDismiss : undefined} style={styles.backDrop}/>
        <Animated.View style={[styles.root,{height:bottomSheetHeight,bottom:bottom,shadowOffset:{height:-3,}}]}>
        <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>
        <View>
            <PanGestureHandler onGestureEvent={onGesture} onEnded={onGestureEnd}>
                <View style={styles.header}>
                    <Text style={styles.heading}>New Alert</Text>
                </View>
            </PanGestureHandler>
            <View style={styles.carview}>
                <Image source={require('../img/scar.png')} style={styles.car}/>
            </View>
            <View style={styles.inputview}>
                <Text style={styles.inputhead}>Date</Text>
                <View style={styles.input}>
                    <TextInput
                        style={styles.inputfield}
                        value={dateText}
                        onChangeText={DateText}
                        onFocus={()=>{Visible(true)}}
                        />
                    <TouchableOpacity onPress={()=>{Visible(true)}}>
                        <Icon name="calendar-outline" size={30} color="#0f815a"/>
                    </TouchableOpacity>
                    <DatePicker
                        lable='Pick a Date'
                        date={date}
                        isVisible={visible}
                        onConfirm={handlePicker}
                        onCancel={()=>{Visible(false)}}
                        confirmTextIOS="Select"
                        />
                </View>
                <Text style={styles.inputhead}>Name</Text>
                <View style={styles.input}>
                    <TextInput
                        style={styles.inputfield}
                        placeholder="Alert Name"
                        value={name}
                        onChangeText={Name}
                        />
                    <Icon name="pencil-outline" size={30} color="#0f815a"/>
                </View>
                <Text style={styles.inputhead}>Interval</Text>
                <View style={styles.input}>
                    <TextInput
                        style={styles.inputfield}
                        placeholder="No.of months"
                        value={interval}
                        onChangeText={Interval}
                        keyboardType="numeric"
                        />
                    <Icon name="time-outline" size={30} color="#0f815a"/>
                </View>
            </View>
            <View style={styles.bottomview}>
                <TouchableOpacity style={styles.button} onPress={()=>{props.onDismiss({status:false})}}>
                    <Icon name="close-outline" size={34} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={Edit}>
                    <Icon name="checkmark" size={32} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
        </TouchableWithoutFeedback> 
        </Animated.View>
        </Portal>
    );
};