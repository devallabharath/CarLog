import React, { useState, useEffect } from 'react';
import {View,Text,Image,TouchableOpacity,StyleSheet,Appearance} from 'react-native';
import Icon  from 'react-native-vector-icons/Ionicons';
import SQLite from 'react-native-sqlite-storage';
import Edit from '../components/editHome'; 
import Dialog from '../components/homeDialog';
import { Provider } from "react-native-paper";

function Main({navigation}) {
    
    const [color, Color] = useState('#000');
    const [bgcolor, BgColor] = useState('#fff');
    const [bgcolor2, BgColor2] = useState('#0f815a');

    const [icon, setIcon] = useState('create-outline');
    const [iconsize, setIconsize] = useState(26);
    const [Data, setData] = useState([]);
    const [show, setShow] = useState(false);
    const [showdlg, ShowDlg] = useState(false);
    const headers = ["Car Name     :","Car Model    :","Mfg Year       :","Capacity       :","Fuel Type     :","Car Plate      :","Chassis No  :","Engine No    :"]

    useEffect(() => {
        DarkMode()
        getData()
    }, []);

    const DarkMode=()=>{
        if (Appearance.getColorScheme()==='dark'){
            Color('#fff')
            BgColor('#0E0E0E')
            BgColor2('#0E0E0E')
        }
    };
    
    const db = SQLite.openDatabase({
        name: 'CarLog',
        location: 'default'
    });
        
    const createTable =()=>{
        db.transaction((tx)=>{
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS HomeData "+
                "(Id INTEGER PRIMARY KEY AUTOINCREMENT, Head TEXT, Value TEXT)",
                []
            )
        })
    };

    const dropTable =()=>{
        db.transaction((tx)=>{
            tx.executeSql(
                "DROP TABLE HomeData"
            )
        })
    };

    const StoreData = (vals)=>{
        dropTable()
        createTable()
        db.transaction((tx)=>{
            for (var i=0; i<8; i++){
                tx.executeSql(
                    "INSERT INTO HomeData (Head,Value) VALUES (?,?)",
                    [headers[i], vals[i]]
                )
            };
        });
        getData();
    };
    
    const getData = () => {
        const Dat=[]
        createTable()
        db.transaction((tx)=>{
            tx.executeSql(
                "SELECT Id,Head,Value FROM HomeData",
                [],
                (tx, res)=>{
                    for (var i=0; i<res.rows.length; i++){
                        Dat.push(res.rows.item(i))
                    }
                    if (Dat.length==0){
                        setIcon('add')
                        setIconsize(32)
                        ShowDlg(true)
                    }else{
                        setData(Dat)
                        setIcon('create-outline')
                        setIconsize(26)
                    }
                }
            )
        })
    };

    const CloseAdd =(props)=> {
        setShow(false)
        if (props.status==true){
            StoreData(props.values)
        }
    };

    const OpenEdit=()=>{
        ShowDlg(false)
        setShow(true)
    };

    const styles = StyleSheet.create({
        main: {
            height: "100%",
            alignItems: 'center',
            backgroundColor: `${bgcolor}`
        },
        top :{
            height: '10%',
            flexDirection: 'column',
            alignItems: 'center',
        },
        heading: {
            color: `${color}`,
            fontSize: 20,
            fontWeight: '600',
            paddingTop:50,
        },
        car: {
            width: "93%",
            height: "24%",
            resizeMode: "cover",
        },
        container: { 
            height: "55%",
            width: "100%",
            marginTop: 5,
            paddingTop: 30,
            paddingBottom: 30,
            flexDirection: "column",
            backgroundColor: `${bgcolor2}`,
            justifyContent: "space-between",
        },
        msg: {
            height: '90%',
            alignSelf: 'center',
            paddingTop: '45%'
        },
        msgtext: {
            color: '#fff',
            fontSize: 16
        },
        detailsview: {
            height: '90%',
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "space-between",
        },
        details: {
            flexDirection: "row",
            justifyContent: "center",
            paddingHorizontal: 50,
        },
        editView: {
            height: '10%',
            flexDirection: 'row',
            alignSelf: 'flex-end'
        },
        field: {
            color: "#ddd",
            fontSize: 17,
            fontWeight: "600",
        },
        text: {
            color: "#eee",
            fontSize: 16,
            fontWeight: "400",
            paddingLeft: 10,
        },
        Buttons: {
            height: '10.5%',
            width: '100%',
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: 'center',
            paddingBottom: 20,
            backgroundColor: '#0f815a'
        },
        Button: {
            width: '30%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center'
        },
    });

    return (
    <Provider>
    <View style={styles.main}>
        <View style={styles.top}>
            <Text style={styles.heading}>Garage</Text>
        </View>
        <Image source={require('../img/pcar.png')} style={styles.car}/>
        <View style={styles.container}>
            <View style={styles.detailsview}>
            {(()=>{
                if (icon=='add'){
                    return(
                        <View style={styles.msg}>
                            <Text style={styles.msgtext}>No Car details to show</Text>
                            <Text style={styles.msgtext}>Click + to add new Car</Text>
                        </View>
                    )
                }else{
                    return(
                        Data.map(item=>(
                            <View style={styles.details} key={item.Id}>
                                <Text style={styles.field}>{item.Head}</Text>
                                <Text style={styles.text}>{item.Value}</Text>
                            </View>
                        ))
                    )
                }
            })()}
            </View>
            <View style={styles.editView}>
                <TouchableOpacity style={styles.Button} onPress={()=>setShow('true')}>
                    <Icon name={icon} size={iconsize} color="#fff" />
                </TouchableOpacity>
            </View>
            <Edit
                show={show}
                onDismiss={CloseAdd}
                enableBackdropDismiss
                values={Data.map(item=>(item.Value))}
                >
            </Edit>
            <Dialog show={showdlg} edit={OpenEdit} Close={()=>ShowDlg(false)}/>
        </View>
        <View style={styles.Buttons}>
            <TouchableOpacity style={styles.Button} onPress={()=>{navigation.navigate('Trips')}}>
                <Icon name="earth" size={26} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.Button} onPress={()=>navigation.navigate('Services')}>
                <Icon name="build" size={27} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.Button} onPress={()=>navigation.navigate('Alert')}>
                <Icon name="notifications" size={26} color="#fff" />
            </TouchableOpacity>
        </View>
    </View>
    </Provider>
    );
    
};


export default Main;