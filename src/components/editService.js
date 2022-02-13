import React, { useEffect, useRef, useState } from "react";
import {Text,View,TextInput,Image,Animated,Dimensions,TouchableOpacity,
    Pressable,TouchableWithoutFeedback,Keyboard,StyleSheet,Appearance} from "react-native";
import { Portal } from "react-native-paper";
import ActionSheet from "react-native-actionsheet";
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
import { PanGestureHandler } from "react-native-gesture-handler";
import DatePicker from './datepicker';

export default function BottomSheet (props){
    const [color, Color] = useState('#000');
    const [bgcolor, BgColor] = useState('#fff');
    let camoptions = useRef()
    let camarray = ['Gallery','Camera','Cancel']
    const bottomSheetHeight = Dimensions.get("window").height * 0.91;
    const [open, setOpen] = useState(props.show);
    const bottom = useRef(new Animated.Value(-bottomSheetHeight)).current;

    useEffect(() => {
        DarkMode()
    }, []);

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
            onDismiss();
        } else {
            bottom.setValue(0);
        }
    };
    useEffect(() => {
        if (props.show) {
            setOpen(props.show);
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
    
    var m = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    const [visible, Visible] = useState(false);
    const [dateText, DateText] = useState(new Date(props.date.slice(7,11),m.indexOf(props.date.slice(0,3)),props.date.slice(4,6)).toString().slice(0,15));
    const [date, setDate] = useState(new Date(props.date.slice(7,11),m.indexOf(props.date.slice(0,3)),props.date.slice(4,6)));
    const [name, Name] = useState(props.name);
    const [amount, Amount] = useState(props.rate.toString());
    const [imageuri, ImageUri] = useState(props.img);

    const handlePicker =(d)=> {
        DateText(d.toString().substring(0, 15))
        setDate(d)
        Visible(false)
    }
    const closePicker =()=> {
        Visible(false)
    }
    const showPicker =()=> {
        Visible(true)
    }
    const CloseAdd =()=> {
        props.onDismiss({status:false})
        DateText(new Date(props.date.slice(7,11),m.indexOf(props.date.slice(0,3)),props.date.slice(4,6)).toString().slice(0,15))
        Name(props.name)
        Amount(props.rate.toString())
        setDate(new Date(props.date.slice(7,11),m.indexOf(props.date.slice(0,3)),props.date.slice(4,6)))
        ImageUri(props.img)
    }
    const Add =()=> {
        if ((name!=null)&&(amount!=null)){
            props.onDismiss({status:true,id:props.id,date:dateText.slice(4,15),name:name,rate:amount,img:imageuri})
        }
    };

    const Imgoptions=()=>{
        camoptions.current.show()
    };

    const getImage=(op)=>{
        if (op=='Camera'){
            Camera()
        }else{
            Gallery()
        }
    };

    const Camera=()=>{
        ImagePicker.openCamera({
            height: 3024,
            width: 3024,
            cropping: true,
            freeStyleCropEnabled:true,
            avoidEmptySpaceAroundImage: true,
            compressImageQuality: 0.9
        }).then(image=>{
            ImageUri(image.path);
        });
    }
    
    const Gallery=()=>{
        ImagePicker.openPicker({
            height: 3024,
            width: 3024,
            cropping: true,
            freeStyleCropEnabled:true,
            writeTempFile: false,
            avoidEmptySpaceAroundImage: true,
            compressImageQuality: 1
        }).then(image=>{
            ImageUri(image.path);
        });
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
            backgroundColor: `${bgcolor }`,
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
            alignItems: 'center'
        },
        car: {
            width: "60%",
            height: "100%",
            resizeMode: "cover",
        },
        inputview: {
            paddingTop: 20,
            height: '67.5%',
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
            alignItems: 'center'
        },
        inputfield: {
            height: 40,
            width: '85%',
            fontSize: 16,
            borderBottomWidth: 0.3,
            paddingVertical: 5,
            color: `${color}`,
            borderColor: `${color}`
        },
        image: {
            height: 60,
            width: 80,
            resizeMode: 'contain',
            paddingTop: 30
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
                            <Text style={styles.heading}>Edit Service</Text>
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
                                onFocus={showPicker}
                                />
                            <TouchableOpacity onPress={showPicker}>
                                <Icon name="calendar-outline" size={30} color="#0f815a"/>
                            </TouchableOpacity>
                            <DatePicker
                                lable='Pick a Date'
                                date={date}
                                isVisible={visible}
                                onConfirm={handlePicker}
                                onCancel={closePicker}
                                confirmTextIOS="Select"
                                />
                        </View>
                        <Text style={styles.inputhead}>Name</Text>
                        <View style={styles.input}>
                            <TextInput
                                style={styles.inputfield}
                                placeholder="Service Name"
                                value={name}
                                onChangeText={Name}
                                />
                            <Icon name="pencil-outline" size={30} color="#0f815a"/>
                        </View>
                        <Text style={styles.inputhead}>Amount</Text>
                        <View style={styles.input}>
                            <TextInput
                                style={styles.inputfield}
                                placeholder="Service Expense"
                                value={amount}
                                onChangeText={Amount}
                                keyboardType="numeric"
                                />
                            <Icon name="pricetag-outline" size={27} color="#0f815a" />
                        </View>
                        <Text style={styles.inputhead}>Image</Text>
                        <View style={styles.input}>
                            <Image source={{uri:imageuri}} style={styles.image}/>
                            <TouchableOpacity onPress={Imgoptions}>
                                <Icon name="image-outline" size={29} color="#0f815a" />
                            </TouchableOpacity>
                            <ActionSheet
                                ref={camoptions}
                                title={'Choose an Option'}
                                options={camarray}
                                cancelButtonIndex={2}
                                destructiveButtonIndex={'none'}
                                onPress={(index) =>{
                                    if (camarray[index]!='Cancel'){
                                        getImage(camarray[index])
                                    }
                                }}
                            />
                        </View>
                    </View>
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
