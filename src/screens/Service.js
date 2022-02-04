import React, {useRef,useState,useEffect} from "react";
import { View,Image,Text,StyleSheet,TouchableOpacity,TouchableWithoutFeedback,LogBox,Appearance } from "react-native";
import { Provider } from "react-native-paper";
import ActionSheet from "react-native-actionsheet";
import ImageView from 'react-native-image-viewing';
import Share from 'react-native-share';
import Icon from 'react-native-vector-icons/Ionicons';
import SQLite from 'react-native-sqlite-storage';
import Edit from '../components/editService';


function main (props) {
    const [color, Color] = useState('#000');
    const [bgcolor, BgColor] = useState('#fff');

    useEffect(() => {
        DarkMode()
    }, []);

    const DarkMode=()=>{
        if (Appearance.getColorScheme()==='dark'){
            Color('#fff')
            BgColor('#0E0E0E')
        }
    }

    let deloptions = useRef()
    let picdeloptions = useRef()
    let delarray = ['Delete','Cancel']
    const [imageuri, ImageUri] = useState(props.route.params.img)
    const [nameText, NameText] = useState(props.route.params.name)
    const [rateText, RateText] = useState(props.route.params.rate)
    const [dateText, DateText] = useState(props.route.params.date)
    const [visible, Visible] = useState(false)
    const [show, Show] = useState(false)
    const imageSource = [{uri:imageuri}]


    LogBox.ignoreLogs([
        'Non-serializable values were found in the navigation state',
    ]);
    
    const DelOptions= () =>{
        deloptions.current.show()
    };

    const PicDelOptions= () =>{
        picdeloptions.current.show()
    };
    
    const db= SQLite.openDatabase({
        name: 'CarLog',
        location: 'default'
    });

    const addRow = (date,name,rate,img) => {
        db.transaction((tx)=>{
            tx.executeSql(
                "INSERT INTO Services (Date,Name,Rate,Img) VALUES (?,?,?,?)",
                [date, name, rate, img]
                )
        });
    };

    const delRow=()=>{
        db.transaction((tx)=>{
            tx.executeSql(`DELETE FROM Services WHERE Id= ${props.route.params.id}`)
        });
    };

    const delImg=()=>{
        db.transaction((tx)=>{
            tx.executeSql(`UPDATE Services SET Img=NULL WHERE Id= ${props.route.params.id}`)
        });
        ImageUri(null)
        Visible(false)
        Refresh()
    };

    const Delete=()=>{
        delRow()
        props.navigation.navigate('Services');
        Refresh()
    };

    const Refresh=()=>{
        props.route.params.refresh()
    };

    const CloseEdit =(props)=> {
        Show(false)
        if (props.status==true){
            addRow(date=props.date,name=props.name,rate=props.rate,img=props.img)
            delRow()
            ImageUri(props.img)
            NameText(props.name)
            RateText(props.rate)
            DateText(props.date)
            Refresh()
        }
    };

    const options={
        activityItemSources:[
            {
                placeholderItem: { type: 'url', content: imageuri },
                item: {
                    default: { type: 'url', content: imageuri },
                },
                title: {default: 'Second'},
                subject: {default: 'second',},
                linkMetadata: { originalUrl: imageuri, imageuri },
            },
        ],
    }

    const share=()=>{
        Share.open(options)
        .then((res) => {
            console.log(res);
        })
        .catch((err) => {
            err && console.log(err);
        });
    };

    const styles = StyleSheet.create({
        top :{
            height: '8%',
            alignItems: 'center',
            backgroundColor: `${bgcolor}`
        },
        heading: {
            color: `${color}`,
            fontSize: 16,
            fontWeight: '400',
            paddingTop: 50,
        },
        container:{
            height: '35%',
            alignItems: 'center',
            backgroundColor: `${bgcolor}`
        },
        rate: {
            color: `${color}`,
            fontSize: 22,
            fontWeight: '600',
            paddingVertical: 15,
        },
        car: {
            width: "85%",
            height: "59%",
            resizeMode: "cover",
        },
        name: {
            color: `${color}`,
            fontSize: 16,
            fontWeight: '500',
            paddingVertical: 3,
        },
        date: {
            fontSize: 14,
            fontWeight: '400',
            color: '#555',
            paddingVertical: 3,
        },
        imageView: {
            height: '47%',
            width: '100%',
            backgroundColor: '#0f815a',
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
        },
        imagetouch: {
            height: '100%',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center'
        },
        image: {
            height: '98%',
            width: '98%',
            resizeMode: 'cover',
            borderWidth: 2,
            borderColor: 'white',
        },
        bottom: {
            width: "100%",
            height: "10%",
            paddingBottom: 8,
            paddingHorizontal: 10,
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: `${bgcolor}`,
            justifyContent: "space-between",
        },
        button: {
            width: '20%',
            alignItems: 'center'
        },
        FooterView: {
            width: '100%',
            height: 80,
            backgroundColor: '#0f815a',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: 20,
            paddingHorizontal: 10,
        },
    });

    const ImgFooter= ()=> {
        return(
            <View style={styles.FooterView}>
                <TouchableOpacity style={styles.button} onPress={()=>Visible(false)}>
                    <Icon name="arrow-back" size={32} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={()=>{share()}}>
                    <Icon name="share-outline" size={29} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={()=>{PicDelOptions()}}>
                    <Icon name="trash-outline" size={28} color="#fff" />
                </TouchableOpacity>
                <ActionSheet
                    ref={picdeloptions}
                    title={'Are you sure ??'}
                    options={delarray}
                    cancelButtonIndex={1}
                    destructiveButtonIndex={0}
                    onPress={(index) =>{
                        if (delarray[index]!='Cancel'){
                            delImg()
                        }
                    }}
                    />
            </View>
        )
    };

    return (
        <Provider>
        <View>
            <View style={styles.top}>
                <Text style={styles.heading}>Service</Text>
            </View>
            <View style={styles.container}>
                <Text style={styles.rate}>₹ {rateText}</Text>
                <Image source={require('../img/scar.png')} style={styles.car}/>
                <Text style={styles.name}>{nameText}</Text>
                <Text style={styles.date}>{dateText}</Text>
            </View>
            <View style={styles.imageView}>
                {(()=>{
                    if (imageuri==null){
                        return(
                            <Text style={{color:'white',fontSize:16}}>No document images added</Text>
                        )
                    }else{
                        return(
                            <TouchableWithoutFeedback style={styles.imagetouch} onPress={()=>Visible(true)}>
                                <Image source={{uri:imageuri}} style={styles.image}/>
                            </TouchableWithoutFeedback>
                        )
                    }
                })()}
                <ImageView
                    images={imageSource}
                    imageIndex={0}
                    animationType= 'slide'
                    swipeToCloseEnabled= {true}
                    doubleTapToZoomEnabled = {true}
                    visible={visible}
                    onRequestClose={()=>Visible(false)}
                    FooterComponent={ImgFooter}
                    />
            </View>
            <View style={styles.bottom}>
                <TouchableOpacity style={styles.button} onPress={()=>props.navigation.navigate('Services')}>
                    <Icon name="arrow-back" size={32} color="#0f815a" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={()=>Show('true')}>
                    <Icon name="create-outline" size={30} color="#0f815a" />
                </TouchableOpacity>
                <Edit 
                    show={show}
                    onDismiss={CloseEdit}
                    enableBackdropDismiss
                    id={props.route.params.id}
                    name={props.route.params.name}
                    date={props.route.params.date}
                    rate={props.route.params.rate}
                    img={props.route.params.img}
                    >
                </Edit>
                <TouchableOpacity style={styles.button} onPress={()=>{DelOptions()}}>
                    <Icon name="trash-outline" size={29} color="#0f815a" />
                </TouchableOpacity>
                <ActionSheet
                    ref={deloptions}
                    title={'Are you sure ??'}
                    options={delarray}
                    cancelButtonIndex={1}
                    destructiveButtonIndex={0}
                    onPress={(index) =>{
                        if (delarray[index]!='Cancel'){
                            Delete()
                        }
                    }}
                    />
            </View>
        </View>
        </Provider>
    )
}

export default main