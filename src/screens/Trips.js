import React, {useState, useEffect} from 'react';
import {View,Text,Image,TouchableOpacity,ScrollView,StyleSheet,Appearance} from 'react-native';
import { Provider } from "react-native-paper";
import Icon from 'react-native-vector-icons/Ionicons';
import Add from '../components/addTrip';
import SQLite from 'react-native-sqlite-storage';
import ContentLoader from "react-native-easy-content-loader";

function Main(props) {
    const [show, setShow] = useState(false);
    const [color, Color] = useState('#000');
    const [Data, setData] = useState([]);
    const [bgcolor, BgColor] = useState('#fff');
    const [brcolor, BrColor] = useState('#d9d9d9');
    const [loading, Loading] = useState(true);
    const [nodata, NoData] = useState(false);
    const [trate,tRate] = useState(0);
    const [tdist, tDist] = useState(0);

    useEffect(() => {
        DarkMode()
        getData()
    }, []);

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
                "(Id INTEGER PRIMARY KEY AUTOINCREMENT, Date TEXT, Name TEXT)",
                []
            )
        })
    };
    
    const addRow = (date,name) => {
        createTable()
        db.transaction((tx)=>{
            tx.executeSql(
                "INSERT INTO Trips (Date,Name) VALUES (?,?)",
                [date, name]
                )
        });
        getData();
    };
    
    const getData=()=> {
        tDist(0)
        tRate(0)
        const Dat=[]
        createTable()
        db.transaction((tx)=>{
            tx.executeSql(
                "SELECT Id,Name,Date FROM Trips",
                [],
                (tx, res)=>{
                    for (var i=0; i<res.rows.length; i++){
                        Dat.push(res.rows.item(i))
                    }
                    setData(Dat);
                    if (Dat.length==0){
                        sleep(300).then(()=>{
                            Loading(false)
                            NoData(true)
                        })
                    }else{
                        sleep(200).then(()=>{
                            Loading(false)
                            NoData(false)
                        })
                    }
                }
            )
        })
    };

    const sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    };

    const dist =(id)=> {
        db.transaction((tx)=>{
            tx.executeSql(
                `SELECT SUM(Value) FROM ${'Trip'+id} WHERE Kind='dist'`,
                [],
                (tx, res)=>{
                    if(res.rows.item(0)['SUM(Value)']!=null){
                        tDist(res.rows.item(0)['SUM(Value)'])
                    }else{tDist(0)}
                }
            )
        })
        return(tdist)
    };
    
    const rate =(id)=> {
        try{
            db.transaction((tx)=>{
                tx.executeSql(
                    `SELECT SUM(Value) FROM ${'Trip'+id} WHERE Kind IS NOT 'dist'`,
                    [],
                    (tx, res)=>{
                        if(res.rows.item(0)['SUM(Value)']!=null){
                            tRate(res.rows.item(0)['SUM(Value)'])
                        }else{tRate(0)}
                    }
                )
            })
            return(trate)
        }catch (error){
            tRate(0)
            return(0)
        }
    };

    const msg=()=>{
        return(
            <View style={styles.msg}>
                <Text style={styles.msgtext}>No Data</Text>
                <Text style={styles.msgtext}>Click  '+'  button to add new</Text>
            </View>
        )
    };

    const dataView=()=>{
        return(
            <ScrollView>
            {Data.map(item=>(
                <View key={item.Id}>
                <TouchableOpacity style={styles.outercontainer} onPress={()=>props.navigation.navigate('Trip',{name:item.Name, date:item.Date, id:item.Id, refresh:getData.bind()})}>
                    <View style={styles.innerContainer}>
                    <Text style={styles.upperText}>{item.Name.slice(0,35)}</Text>
                        <View style={styles.subcontainer}>
                        <Text style={styles.lowerText}><Icon name="time" size={15} color="#0f815a" /> {item.Date}</Text>
                        <Text style={styles.lowerText}><Icon name="code" size={18} color="#0f815a" /> {dist(item.Id)} Km</Text>
                        <Text style={styles.lowerText}><Icon name="pricetag" size={15} color="#0f815a" /> {rate(item.Id)} ₹</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <View style={styles.border}></View>
                </View>
            ))}
            </ScrollView>
        )
    };

    const CloseAdd =(props)=> {
        if (props.status==true){
            setShow(false)
            addRow(props.date,props.name)
        }else{setShow(false)}
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
        msg: {
            alignSelf: 'center',
            alignItems: 'center',
            paddingVertical: '50%'
        },
        msgtext:{
            color: `${color}`,
            fontSize: 15
        },
        outercontainer: {
            paddingHorizontal: "10%",
        },
        loading: {
            paddingTop: 15,
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