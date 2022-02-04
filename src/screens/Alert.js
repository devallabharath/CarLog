import React, {useEffect, useRef, useState} from "react";
import { Text,View,Image,ScrollView,TouchableOpacity,StyleSheet,Appearance} from "react-native";
import Swipeable from 'react-native-gesture-handler/Swipeable';
import ActionSheet from "react-native-actionsheet";
import { Provider } from "react-native-paper";
import Icon from 'react-native-vector-icons/Ionicons';
import SQLite from 'react-native-sqlite-storage';
import Add from '../components/addAlert';
import Edit from '../components/editAlert';

export default function main ({navigation}) {
    const [color, Color] = useState('#000');
    const [dayscolor, DaysColor] = useState('#000');
    const [bgcolor, BgColor] = useState('#fff');
    const [brcolor, BrColor] = useState('#d9d9d9');
    const [addshow, AddShow] = useState(false);
    const [editshow, EditShow] = useState(false);
    const [currentid, CurrentId] = useState(null);
    const [name, Name] = useState(null);
    const [date, setDate] = useState(null);
    const [interval, Interval] = useState(null);
    const [Data, setData] = useState([]);
    var datarefs = new Map();
    var delrefs= new Map();
    const delarray=['Delete','Cancel'];
    
    useEffect(() => {
        getData()
        DarkMode()
    }, []);

    const DarkMode=()=>{
        const mode = Appearance.getColorScheme()
        if (mode==='dark'){
            Color('#fff')
            DaysColor('#fff')
            BgColor('#0E0E0E')
            BrColor('#333')
        }
    };

    const days=(date,months)=> {
        //TODO:
        const m = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
        var date1 = new Date(date.slice(7,11),m.indexOf(date.slice(0,3)),date.slice(4,6))
        var year = Math.floor(months / 12);
        var month = months - (year * 12);
        if (year) date1.setFullYear(date1.getFullYear() + year);
        if (month) date1.setMonth(date1.getMonth() + month);
        diff = (new Date(date1).getTime()-new Date().getTime());
        return Math.floor(diff/(1000 * 60 * 60 * 24))
    };

    const db= SQLite.openDatabase({
        name: 'CarLog',
        location: 'default'
    });

    function createTable (){
        db.transaction((tx)=>{
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS Alerts "+
                "(Id INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT, Date TEXT, Interval INTEGER)",
                []
            )
        })
    };
    
    const addRow = (name,date,interval) => {
        createTable()
        db.transaction((tx)=>{
            tx.executeSql(
                "INSERT INTO Alerts (Name,Date,Interval) VALUES (?,?,?)",
                [name, date, interval]
            )
        });
        getData();
    };
    
    const delRow=(id)=>{
        db.transaction((tx)=>{
            tx.executeSql(`DELETE FROM Alerts WHERE Id= ${id}`)
        });
        getData()
    };
        
    function getData() {
        const Dat=[]
        createTable()
        db.transaction((tx)=>{
            tx.executeSql(
                "SELECT Id,Name,Date,Interval FROM Alerts",
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

    const CloseAdd=(props)=> {
        AddShow(false)
        if(props.status==true){
            addRow(props.name,props.date,props.interval)
        }
    };

    const CloseEdit=(props)=> {
        EditShow(false)
        if(props.status==true){
            delRow(props.id)
            addRow(props.name,props.date,props.interval)
        }
    };

    const styles = StyleSheet.create({
        main: {
            height: "100%",
            alignItems: "center",
            backgroundColor: `${bgcolor}`,
            flexDirection: "column",
            justifyContent: "space-between",
        },
        top: {
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
        swipecontainer: {
            paddingLeft: '9%',
        },
        swipeable: {
            flexDirection: 'row',
        },
        details: {
            width: '70%',
            paddingVertical: 11,
            backgroundColor: `${bgcolor}`,
        },
        days: {
            width: '30%',
            backgroundColor: `${bgcolor}`,
            alignItems: 'center',
            justifyContent: 'center'
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
        daytext: {
            color: `${dayscolor}`,
            fontSize: 15,
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

    const style = StyleSheet.create({
        view: {
            width: 150,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        },
        deletebutton: {
            width: '50%',
            height: '100%',
            backgroundColor: '#f55',
            justifyContent: 'center',
            alignItems: 'center'
        },
        editbutton: {
            width: '50%',
            height: '100%',
            backgroundColor: '#55f',
            justifyContent: 'center',
            alignItems: 'center'
        },
    });

    return(
    <Provider>
    <View style={styles.main}>
        <View style={styles.top}>
            <Text style={styles.heading}>Alerts</Text>
        </View>
        <Image source={require('../img/scar.png')} style={styles.car}/>
        <View style={styles.maincontainer}>
            <View style={styles.border}></View>
            <ScrollView
                onTouchStart={()=>{
                    [...datarefs.entries()].forEach(([key, ref]) => {
                        ref.close();
                    });
                }}
            >
            {Data.map(item=>(
                <View key={item.Id}>
                <View style={styles.swipecontainer}>
                    <Swipeable
                        ref={ref => {datarefs.set(item.Id, ref)}}
                        renderRightActions={()=>{
                            return (
                                <View style={style.view}>
                                <TouchableOpacity style={style.editbutton} onPress={()=>{
                                    EditShow(true)
                                    CurrentId(item.Id)
                                    Name(item.Name)
                                    setDate(item.Date)
                                    Interval(item.Interval.toString())
                                }}>
                                    <Icon name="pencil" size={27} color='#fff'/>
                                </TouchableOpacity>
                                <Edit show={editshow} onDismiss={CloseEdit} id={currentid} name={name} date={date} interval={interval} enableBackdropDismiss></Edit>
                                <TouchableOpacity style={style.deletebutton} onPress={()=>{
                                    [...delrefs.entries()].forEach(([key, ref]) => {
                                        if (key==item.Id){ref.show()}
                                    });
                                }}>
                                    <Icon name="trash" size={28} color="#fff"/>
                                </TouchableOpacity>
                                <ActionSheet
                                    ref={ref => {delrefs.set(item.Id, ref)}}
                                    title={'Are you sure ??'}
                                    options={delarray}
                                    cancelButtonIndex={1}
                                    destructiveButtonIndex={0}
                                    onPress={(index) =>{
                                        if (delarray[index]=='Delete'){
                                            delRow(item.Id)
                                        }
                                    }}/>
                                </View>
                            );
                        }}
                        overshootRight={false}
                        useNativeAnimations
                        >
                        <View style={styles.swipeable}>
                            <View style={styles.details}>
                                <Text style={styles.upperText}>{item.Name}</Text>
                                <Text style={styles.lowerText}> <Icon name="time" size={15} color="#0f815a" />  {item.Date}            <Icon name="reload-circle" size={15} color="#0f815a" />  {item.Interval} Months</Text>
                            </View>
                            <View style={styles.days}>
                                {(()=>{
                                    if (days(item.Date,item.Interval)<0){
                                        return(
                                            <Text style={{color:'#f55',fontSize:15}}>{days(item.Date,item.Interval)}</Text>
                                        )
                                    }else if (5>days(item.Date,item.Interval)>0) {
                                        return(
                                            <Text style={{color:'#fc0',fontSize:15}}>{days(item.Date,item.Interval)}</Text>
                                        )
                                    } else {
                                        return(
                                            <Text style={{color:'#0f815a',fontSize:15}}>{days(item.Date,item.Interval)}</Text>
                                        )
                                    }
                                })()}
                                <Text style={styles.daytext}>days</Text>
                            </View>
                        </View>
                    </Swipeable>
                </View>
                <View style={styles.border}></View>
                </View>
            ))}
            </ScrollView>
        </View>
        <View style={styles.bottom}>
            <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate('Garage')}>
                <Icon name="arrow-back" size={30} color="#fff"/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={()=>AddShow(true)}>
                <Icon name="add" size={35} color="#fff"/>
            </TouchableOpacity>
        </View>
        <Add show={addshow} onDismiss={CloseAdd} enableBackdropDismiss></Add>
    </View>
    </Provider>
    );
};