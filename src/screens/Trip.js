import React, {useRef, useState, useEffect} from "react";
import { View,Text,TouchableOpacity,ScrollView,StyleSheet,Appearance} from "react-native";
import ActionSheet from "react-native-actionsheet";
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Icon from 'react-native-vector-icons/Ionicons';
import AddinTrip from '../components/addInTrip';
import data from '../data/tripsdata';

export default function main (props) {
    const [visible, Visible] = useState(false);
    const [addtype, Addtype] = useState(null);
    const [color, Color] = useState('#000');
    const [bgcolor, BgColor] = useState('#fff');
    const [brcolor, BrColor] = useState('#d9d9d9');
    let refs = new Map()
    let addoptions = useRef()
    let itemdeloptions = useRef()
    let tripdeloptions = useRef()
    let addarray = ['Add Distance','Add Fuel','Toll Expence','Other','Cancel']
    let delarray = ['Delete','Cancel']

    useEffect(() => {
        DarkMode()
    }, []);

    const DarkMode=()=>{
        const mode = Appearance.getColorScheme()
        if (mode==='dark'){
            Color('#fff')
            BgColor('#0E0E0E')
            BrColor('#333')
        }
    };

    const Options= (op) =>{
        if (op=='add') {addoptions.current.show()}
        else if (op=='trip') {tripdeloptions.current.show()}
        else {itemdeloptions.current.show()}
    }

    const showAdd= (op) =>{
        if (op=='Add Distance') {
            Visible(true); Addtype('dist')
        }else if (op=='Add Fuel') {
            Visible(true); Addtype('fuel')
        }else if (op=='Toll Expence') {
            Visible(true); Addtype('toll')
        }else if (op=='Other') {
            Visible(true); Addtype('other')
        }else {}
    }

    const Add =(v)=>{
        Visible(false)
        alert(v)
    }

    const addClose =()=>{
        Visible(false)
    }

    const CloseSwipe=()=>{
        [...refs.entries()].forEach(([key, ref]) => {
            ref.close();
        });
    };

    const getCosts = (k,op) =>{
        var f = 0
        var t = 0
        var o = 0
        if (op=='f'){
            for (var i=0; i<data[k].log.length; i++) {
                if (data[k].log[i].kind=='fuel') {
                    f+=data[k].log[i].value
                }
            }
            return(f+ ' ₹        ')
        }else if (op=='t'){
            for (var i=0; i<data[k].log.length; i++) {
                if (data[k].log[i].kind=='toll') {
                    t+=data[k].log[i].value
                }
            }
            return(t+ ' ₹        ')
        }else {
            for (var i=0; i<data[k].log.length; i++) {
                if (data[k].log[i].kind=='other') {
                    o+=data[k].log[i].value
                }
            }
            return(o+ ' ₹        ') 
        }
    }

    const getName = (k,i)=>{
        if (data[k].log[i].kind=='fuel'){
            return('Fuel Cost')
        }else if(data[k].log[i].kind=='dist'){
            return('Distance')
        }else if (data[k].log[i].kind=='toll'){
            return('Toll Expence')
        }else {
            return('Other')
        }
    }
    
    const getValue = (k,i)=>{
        if(data[k].log[i].kind=='dist'){
            return(data[k].log[i].value + ' Km')
        }else{
            return(data[k].log[i].value + ' ₹')
        }
    }

    const getPic = (k,i,n)=>{
        if (n=='name'){
            if (data[k].log[i].kind=='fuel'){
                return('water-outline')
            }else if(data[k].log[i].kind=='dist'){
                return('code-working')
            }else if (data[k].log[i].kind=='toll'){
                return('remove-circle-outline')
            }else {
                return('card-outline')
            }
        }else{
            if (data[k].log[i].kind=='fuel'){
                return(26)
            }else if(data[k].log[i].kind=='dist'){
                return(24)
            }else if (data[k].log[i].kind=='toll'){
                return(24)
            }else {
                return(22)
            }
        }
    };

    const styles = StyleSheet.create({
        top :{
            height: '8%',
            backgroundColor: `${bgcolor}`,
            alignItems: 'center'
        },
        heading: {
            fontSize: 16,
            fontWeight: '400',
            paddingTop: 50,
            color: `${color}`
        },
        container:{
            height: '22.5%',
            alignItems: 'center',
            backgroundColor: `${bgcolor}`,
        },
        date: {
            fontSize: 14,
            fontWeight: '400',
            paddingTop: 10,
            color: '#0f815a',
        },
        name: {
            fontSize: 23,
            fontWeight: '600',
            paddingVertical: 4,
            color: `${color}`
        },
        dist: {
            fontSize: 16,
            fontWeight: '500',
            paddingVertical: 4,
            color: `${color}`
        },
        rate: {
            fontSize: 22,
            fontWeight: '600',
            color: '#f44',
            paddingVertical: 10,
        },
        maincontainer: {
            width: "100%",
            height: '59.5%',
            backgroundColor: `${bgcolor}`,
        },
        border: {
            marginHorizontal: "6%",
            borderBottomWidth: 1,
            borderBottomColor: `${brcolor}`
        },
        swipecontainer: {
            paddingLeft: '8%',
        },
        swipeable: {
            flexDirection: 'row',
        },
        details: {
            width: '85%',
            paddingVertical: 11,
            backgroundColor: `${bgcolor}`,
        },
        upperText: {
            paddingVertical: 6,
            fontSize: 16,
            color: `${color}`
        },
        lowerText: {
            color: "#555",
            paddingVertical: 6,
        },
        img: {
            width: '15%',
            backgroundColor: `${bgcolor}`,
            alignItems: 'flex-start',
            justifyContent: 'center'
        },
        bottom: {
            width: "100%",
            height: "10%",
            paddingBottom: 8,
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#0f815a",
            justifyContent: "space-between",
        },
        button: {
            width: '25%',
            alignItems: 'center'
        },
    
    });
    
    return (
        <View>
            <View style={styles.top}>
                <Text style={styles.heading}>Trip</Text>
            </View>
            <View style={styles.container}>
                <Text style={styles.date}>{props.route.params.date}</Text>
                <Text style={styles.name}>{props.route.params.name}</Text>
                <Text style={styles.dist}>{props.route.params.dist} Km</Text>
                <Text style={styles.rate}>₹ {props.route.params.rate}</Text>
                <Text style={styles.dist}><Icon name="water" size={22} color={'#0f815a'}/> {getCosts(props.route.params.k,'f')}<Icon name="remove-circle" size={20} color={'#0f815a'}/> {getCosts(props.route.params.k,'t')}<Icon name="card" size={20} color={'#0f815a'}/> {getCosts(props.route.params.k,'o')}</Text>
            </View>
            <View style={styles.maincontainer}>
                <View style={styles.border}></View>
                <ScrollView
                    onTouchStart={()=>{
                        [...refs.entries()].forEach(([key, ref]) => {
                            ref.close();
                        });
                    }}
                >
                {data[props.route.params.k].log.map(item=>(
                    <View key={item.key}>
                    <View style={styles.swipecontainer} >
                        <Swipeable
                            renderRightActions={()=>{
                                return (
                                <View style={style.view}>
                                    <TouchableOpacity style={style.editbutton} onPress={CloseSwipe}>
                                        <Icon name="pencil" size={27} color='#fff' />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={style.deletebutton} onPress={Options}>
                                        <Icon name="trash" size={28} color="#fff" />
                                    </TouchableOpacity>
                                    <ActionSheet
                                        ref={itemdeloptions}
                                        title={'This will Delete Item !!'}
                                        options={delarray}
                                        cancelButtonIndex={1}
                                        destructiveButtonIndex={0}
                                        onPress={(index) =>{
                                            CloseSwipe()
                                            // if (delarray[index]=='Delete') {
                                            //     CloseSwpie()
                                            //     alert('Item Removed')
                                            // }
                                        }}
                                    />
                                </View>
                                );
                            }}
                            overshootRight={false}
                            useNativeAnimations
                            ref={ref => {refs.set(item.key, ref)}}
                            onSwipeableWillOpen={()=>{
                                [...refs.entries()].forEach(([key, ref]) => {
                                    if (key !== item.key && ref) ref.close();
                                });
                            }}
                            >
                            <View style={styles.swipeable}>
                                <View style={styles.details}>
                                    <Text style={styles.upperText}>{getName(props.route.params.k, item.key)}</Text>
                                    <Text style={styles.lowerText}> <Icon name="time" size={15} color="#0f815a" /> {item.date}             {getValue(props.route.params.k,item.key)}</Text>
                                </View>
                                <View style={styles.img}>
                                    <Icon name={getPic(props.route.params.k, item.key, 'name')} size={getPic(props.route.params.k, item.key)} color={'#0f815a'}/>
                                </View>
                            </View>
                        </Swipeable>
                    </View>
                    <View style={styles.border}></View>
                    </View>
                ))}
                </ScrollView>
                <AddinTrip isVisible={visible} Add={Add} onClose={addClose} type={addtype}/>
            </View>
            <View style={styles.bottom}>
                <TouchableOpacity style={styles.button} onPress={()=>props.navigation.navigate('Trips')}>
                    <Icon name="arrow-back" size={32} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={()=>{Options('add')}}>
                    <Icon name="add" size={36} color="#fff" />
                </TouchableOpacity>
                <ActionSheet
                    ref={addoptions}
                    title={'Choose an Option'}
                    options={addarray}
                    cancelButtonIndex={4}
                    destructiveButtonIndex={'none'}
                    onPress={(index) =>{
                        showAdd(addarray[index])
                    }}
                />
                <TouchableOpacity style={styles.button} onPress={()=>{Options("trip")}}>
                    <Icon name="trash-outline" size={28} color="#fff" />
                </TouchableOpacity>
                <ActionSheet
                    ref={tripdeloptions}
                    title={'This will Delete Trip !!'}
                    options={delarray}
                    cancelButtonIndex={1}
                    destructiveButtonIndex={0}
                    onPress={(index) =>{
                        if (delarray[index]=='Delete') {
                            alert('Trip Deleted')
                        }
                    }}
                />
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    view: {
        width: 150,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    editbutton: {
        width: '50%',
        height: '100%',
        backgroundColor: '#55f',
        justifyContent: 'center',
        alignItems: 'center'
    },
    deletebutton: {
        width: '50%',
        height: '100%',
        backgroundColor: '#f55',
        justifyContent: 'center',
        alignItems: 'center'
    },
})
