import React, {useState, useEffect} from 'react';
import {View,Text,Image,TouchableOpacity,ScrollView,StyleSheet,RefreshControl,Appearance} from 'react-native';
import { Provider } from "react-native-paper";
import Icon from 'react-native-vector-icons/Ionicons';
import SQLite from 'react-native-sqlite-storage';
import Add from '../components/addService';
import ContentLoader from "react-native-easy-content-loader";

function Main(props) {
    const [color, Color] = useState('#000');
    const [bgcolor, BgColor] = useState('#fff');
    const [brcolor, BrColor] = useState('#d9d9d9');
    
    const [Data, setData] = useState([]);
    const [show, setShow] = useState(false);
    const [refreshing, Refreshing] = useState(false);
    const [nodata, NoData] = useState(false);
    const [loading, Loading] = useState(true);
    
    useEffect(() => {
        DarkMode()
        getData()
    },[]);
    
    const DarkMode=()=>{
        const mode = Appearance.getColorScheme()
        if (mode==='dark'){
            Color('#fff')
            BgColor('#0E0E0E')
            BrColor('#333')
        }
    }

    const db= SQLite.openDatabase({
        name: 'CarLog',
        location: 'default'
    })
    
    function createTable (){
        db.transaction((tx)=>{
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS Services "+
                "(Id INTEGER PRIMARY KEY AUTOINCREMENT, Date TEXT, Name TEXT, Rate INTEGER, Img TEXT)",
                []
            )
        })
    };
    
    const addRow = (date,name,rate,img) => {
        createTable()
        db.transaction((tx)=>{
            tx.executeSql(
                "INSERT INTO Services (Date,Name,Rate,Img) VALUES (?,?,?,?)",
                [date, name, rate, img]
                )
        });
        getData();
    };
    
    const getData=()=> {
        const Dat=[]
        createTable()
        db.transaction((tx)=>{
            tx.executeSql(
                "SELECT Id,Name,Date,Rate,Img FROM Services",
                [],
                (tx, res)=>{
                    for (var i=0; i<res.rows.length; i++){
                        Dat.push(res.rows.item(i))
                    }
                    setData(Dat);
                    if (Dat.length==0){
                        sleep(800).then(()=>{
                            Loading(false)
                            NoData(true)
                        })
                    }else{
                        sleep(500).then(()=>{
                            Loading(false)
                            NoData(false)
                        })
                    }
                }
            )
        })
    };

    const Refresh=()=>{
        Refreshing(true)
        getData()
        Refreshing(false)
    };

    const CloseAdd =(props)=> {
        setShow(false)
        if (props.status==true){
            addRow(date=props.date, name=props.name, rate=props.rate, img=props.img);
        };
    };

    const msg=()=>{
        return(
            <View style={styles.nodata}>
                <Text style={styles.nodatatext}>No Data</Text>
                <Text style={styles.nodatatext}>Click  '+'  button to add new</Text>
            </View>
        )
    };

    const dataView=()=>{
        return(
            <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={Refresh}/>}>
                {Data.map(item=>(
                    <View key={item.Id}>
                    <TouchableOpacity style={styles.outercontainer} onPress={()=>props.navigation.navigate('Service',{id:item.Id, name:item.Name, date:item.Date, rate:item.Rate, img:item.Img, refresh:getData.bind(), add:addRow.bind()})}>
                        <View style={styles.innerContainer}>
                        <Text style={styles.upperText}>{item.Name.slice(0,35)}</Text>
                        <Text style={styles.lowerText}> <Icon name="time" size={15} color="#0f815a" /> {item.Date}                    <Icon name="pricetag" size={15} color="#0f815a" />  ₹{item.Rate}</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.border}></View>
                    </View>
                ))}
            </ScrollView>
        )
    };

    const sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    };

    const styles = StyleSheet.create({
        main: {
            height: "100%",
            alignItems: "center",
            backgroundColor: `${bgcolor}`,
            flexDirection: "column",
            justifyContent: "space-between",
        },
        top :{
            height: '9%',
        },
        heading: {
            color: `${color}`,
            fontSize: 20,
            fontWeight: '600',
            paddingTop: 50,
        },
        car: {
            width: "85%",
            height: "22%",
            resizeMode: "cover",
        },
        maincontainer: {
            width: "100%",
            height: "59%",
        },
        border: {
            marginHorizontal: "6%",
            borderBottomWidth: 1,
            borderBottomColor: `${brcolor}`
        },
        loading: {
            paddingTop: 15,
            paddingHorizontal: "10%",
        },
        nodata: {
            alignSelf: 'center',
            alignItems: 'center',
            paddingVertical: '50%'
        },
        nodatatext:{
            color: `${color}`,
            fontSize: 15
        },
        outercontainer: {
            paddingHorizontal: "10%",
        },
        innerContainer: {
            paddingVertical: 19,
        },
        upperText: {
            color: `${color}`,
            paddingVertical: 6,
            fontSize: 16
        },
        lowerText: {
            color: "#555",
            paddingVertical: 6,
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
            width: '33%',
            alignItems: 'center'
        },
    });

    return (
    <Provider>
    <View style={styles.main}>
        <View style={styles.top}>
            <Text style={styles.heading}>Services</Text>
        </View>
        <Image source={require('../img/scar.png')} style={styles.car}/>
        <View style={styles.maincontainer}>
            <View style={styles.border}></View>
            <ContentLoader
                active
                loading={loading}
                containerStyles={styles.loading}
                listSize={6}
                tWidth={'40%'}
                pRows={1}
                pHeight={[10]}
                pWidth={['100%']}/>
            {(()=>{
                if (nodata==true){
                    return(msg())
                }else{
                    return(dataView())
                }
            })()}
        </View>
        <View style={styles.bottom}>
            <TouchableOpacity style={styles.button} onPress={()=>props.navigation.navigate('Garage')}>
                <Icon name="arrow-back" size={30} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={()=>setShow('true')}>
                <Icon name="add" size={35} color="#fff" />
            </TouchableOpacity>
        </View>
        <Add show={show} onDismiss={CloseAdd} enableBackdropDismiss>
        </Add>
    </View>
    </Provider>
    );
};

export default Main;