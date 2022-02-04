import React, {useState, useEffect} from 'react';
import {View,Text,Image,TouchableOpacity,ScrollView,StyleSheet,Appearance} from 'react-native';
import { Provider } from "react-native-paper";
import Icon from 'react-native-vector-icons/Ionicons';
import Add from '../components/addTrip';
import SQLite from 'react-native-sqlite-storage';TODO:
import dData from '../data/tripsdata';

function Main({navigation}) {
    const [show, setShow] = useState(false);
    const [color, Color] = useState('#000');
    const [Data, setData] = useState([]);
    const [bgcolor, BgColor] = useState('#fff');
    const [brcolor, BrColor] = useState('#d9d9d9');

    useEffect(() => {
        DarkMode()
    }, []);

    const CloseAdd =(props)=> {
        setShow(false)
    };

    const DarkMode=()=>{
        const mode = Appearance.getColorScheme()
        if (mode==='dark'){
            Color('#fff')
            BgColor('#0E0E0E')
            BrColor('#333')
        }
    };

    const db= SQLite.openDatabase({
        name: 'CarLog',
        location: 'default'
    })
    
    function createTable (){
        db.transaction((tx)=>{
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS Trips "+
                "(Id INTEGER PRIMARY KEY AUTOINCREMENT, Date TEXT, Name TEXT, Key TEXT)",
                []
            )
        })
    };
    
    const addRow = (date,name,key) => {
        createTable()
        db.transaction((tx)=>{
            tx.executeSql(
                "INSERT INTO Trips (Date,Name,Key) VALUES (?,?,?)",
                [date, name, key]
                )
        });
        getData();
    };
    
    function getData() {
        const Dat=[]
        db.transaction((tx)=>{
            tx.executeSql(
                "SELECT Id,Name,Date,Key FROM Trips",
                [],
                (tx, res)=>{
                    for (var i=0; i<res.rows.length; i++){
                        Dat.push(res.rows.item(i))
                    }
                    setData(Dat);
                }
            )
        })
    };

    const dist =(k)=> {
        let ans=0
        var keys = Object.keys(dData[k].log);
        for (var i=0; i<keys.length; i++){
            if (dData[k].log[i].kind == 'dist'){
                ans+=dData[k].log[i].value
            }
        }
        return(ans)
    }

    const rate =(k)=> {
        let ans=0
        var keys = Object.keys(dData[k].log)
        for (var i=0; i<keys.length; i++){
            if (dData[k].log[i].kind != 'dist'){
                ans+=dData[k].log[i].value
            }
        }
        return(ans)
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
            fontSize: 20,
            fontWeight: '600',
            paddingTop: 50,
            color: `${color}`,
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
        outercontainer: {
            paddingHorizontal: "10%",
        },
        innerContainer: {
            paddingVertical: 19,
        },
        upperText: {
            paddingVertical: 5.5,
            paddingLeft: 1,
            fontSize: 16,
            color: `${color}`
        },
        subcontainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        lowerText: {
            color: "#555",
            paddingVertical: 5,
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
            <Text style={styles.heading}>Trips</Text>
        </View>
        <Image source={require('../img/scar.png')} style={styles.car}/>
        <View style={styles.maincontainer}>
            <View style={styles.border}></View>
            <ScrollView>
            {dData.map(item=>(
                <View key={item.key}>
                <TouchableOpacity style={styles.outercontainer} onPress={()=>navigation.navigate('Trip',{name:item.name, date:item.date, dist:dist(item.key), rate:rate(item.key), k:item.key})}>
                    <View style={styles.innerContainer}>
                    <Text style={styles.upperText}>{item.name.slice(0,35)}</Text>
                        <View style={styles.subcontainer}>
                        <Text style={styles.lowerText}><Icon name="time" size={15} color="#0f815a" /> {item.date}</Text>
                        <Text style={styles.lowerText}><Icon name="code" size={18} color="#0f815a" /> {dist(item.key)} Km</Text>
                        <Text style={styles.lowerText}><Icon name="pricetag" size={15} color="#0f815a" /> ₹ {rate(item.key)}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <View style={styles.border}></View>
                </View>
            ))}
            </ScrollView>
        </View>
        <View style={styles.bottom}>
            <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate('Garage')}>
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