import React, { useEffect, useRef, useState } from "react";
import {Text,View,TextInput,Image,ScrollView,KeyboardAvoidingView,TouchableOpacity,
    Pressable,TouchableWithoutFeedback,Animated,Dimensions,Keyboard,StyleSheet,Appearance,LogBox} from "react-native";
import { Portal } from "react-native-paper";
import { PanGestureHandler } from "react-native-gesture-handler";
import Icon from 'react-native-vector-icons/Ionicons';

LogBox.ignoreLogs(["Can't perform a React state update on an unmounted component"])

export default function BottomSheet (props){
    const [color, Color] = useState('#000');
    const [bgcolor, BgColor] = useState('#fff');
    const [brcolor, BrColor] = useState('#d9d9d9');
    const bottomSheetHeight = Dimensions.get("window").height * 0.91;
    const [open, setOpen] = useState(props.show);
    const bottom = useRef(new Animated.Value(-bottomSheetHeight)).current;
    const [name,Name] = useState(null);
    const [model,Model] = useState('');
    const [year,Year] = useState('');
    const [cc,Cc] = useState('');
    const [fuel,Fuel] = useState('');
    const [plate,Plate] = useState('');
    const [body,Body] = useState('');
    const [engine,Engine] = useState('');

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
            BrColor('#333')
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

    const setValues =()=>{
        Name(props.values[0])
        Model(props.values[1])
        Year(props.values[2])
        Cc(props.values[3])
        Fuel(props.values[4])
        Plate(props.values[5])
        Body(props.values[6])
        Engine(props.values[7])
    };

    const CloseAdd =()=> {
        props.onDismiss({status:false})
    };
    const Add =()=> {
        err=[undefined,'',' ']
        if (err.includes(name)==false){
            props.onDismiss({status:true, values:[name,model,year,cc,fuel,plate,body,engine]})
        }else{
            Name(null)
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
            height: '13.5%',
            alignItems: 'center',
        },
        car: {
            width: "60%",
            height: "100%",
            resizeMode: "cover",
        },
        border: {
            paddingTop: 10,
            marginHorizontal: "6%",
            borderBottomWidth: 1,
            borderBottomColor: `${brcolor}`
        },
        inputview: {
            height: '67.5%',
            paddingHorizontal: '10%',
            paddingBottom: 10,
        },
        inputhead: {
            paddingTop: 30,
            fontSize: 16,
            fontWeight: '500',
            color: `${color}`
        },
        inputfield: {
            color: `${color}`,
            height: 40,
            width: '100%',
            fontSize: 16,
            borderBottomWidth: 0.5,
            borderColor: `${color}`,
            paddingVertical: 5,
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
                    <Text style={styles.heading}>Car Details</Text>
                </View>
            </PanGestureHandler>
            <View style={styles.carview}>
                <Image source={require('../img/scar.png')} style={styles.car}/>
            </View>
            <View style={styles.border}></View>
            <ScrollView style={styles.inputview}>
            <KeyboardAvoidingView behavior={'padding'} keyboardVerticalOffset={150}>
                <Text style={styles.inputhead}>Car Name</Text>
                <TextInput
                    style={styles.inputfield}
                    placeholder="Ford Focus"
                    value={name}
                    onChangeText={Name}
                    />
                <Text style={styles.inputhead}>Car Model</Text>
                <TextInput
                    style={styles.inputfield}
                    placeholder="Model Name"
                    value={model}
                    onChangeText={Model}
                    />
                <Text style={styles.inputhead}>Mfg Year</Text>
                <TextInput
                    style={styles.inputfield}
                    placeholder="2019"
                    value={year}
                    onChangeText={Year}
                    keyboardType="numeric"
                    />
                <Text style={styles.inputhead}>Capacity</Text>
                <TextInput
                    style={styles.inputfield}
                    placeholder="1498"
                    value={cc}
                    onChangeText={Cc}
                    keyboardType="numeric"
                    />
                <Text style={styles.inputhead}>Fuel Type</Text>
                <TextInput
                    style={styles.inputfield}
                    placeholder="Petrol / Diesel"
                    value={fuel}
                    onChangeText={Fuel}
                    />
                <Text style={styles.inputhead}>Car Plate No</Text>
                <TextInput
                    style={styles.inputfield}
                    placeholder="AP05AB1234"
                    value={plate}
                    onChangeText={Plate}
                    />
                <Text style={styles.inputhead}>Chassis No</Text>
                <TextInput
                    style={styles.inputfield}
                    placeholder="ABCDEFGHIJK01234"
                    value={body}
                    onChangeText={Body}
                    />
                <Text style={styles.inputhead}>Engine No</Text>
                <TextInput
                    style={styles.inputfield}
                    placeholder="AB01234"
                    value={engine}
                    onChangeText={Engine}
                    />
            </KeyboardAvoidingView>
            </ScrollView>
            <View style={styles.bottomview}>
                <TouchableOpacity style={styles.button} onPress={CloseAdd}>
                    <Icon name="close-outline" size={34} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={Add}>
                    <Icon name="checkmark" size={32} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
        </TouchableWithoutFeedback>
        </Animated.View>
        </Portal>
    );
};
