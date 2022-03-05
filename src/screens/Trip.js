import React, {useRef, useState, useEffect} from "react";
import { View,Text,TouchableOpacity,ScrollView,StyleSheet,Appearance,LogBox} from "react-native";
import ActionSheet from "react-native-actionsheet";
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Icon from 'react-native-vector-icons/Ionicons';
import AddinTrip from '../components/addInTrip';
import EditinTrip from '../components/editInTrip';
import SQLite from 'react-native-sqlite-storage';
import ContentLoader from "react-native-easy-content-loader";
import { Provider } from "react-native-paper";

LogBox.ignoreLogs([
    "Non-serializable values were found in the navigation state",
    "Sending `onAnimatedValueUpdate` with no listeners registered"
])

export default function main (props) {
    const [color, Color] = useState('#000');
    const [bgcolor, BgColor] = useState('#fff');
    const [brcolor, BrColor] = useState('#d9d9d9');

    const [avisible, aVisible] = useState(false);
    const [addtype, Addtype] = useState('');
    const [evisible, eVisible] = useState(false);

    let refs = new Map()
    let itemdelrefs = new Map()
    let addoptions = useRef()
    let tripdelrefs = useRef()
    let addarray = ['Add Distance','Add Fuel','Toll Expence','Other','Cancel']
    let delarray = ['Delete','Cancel']

    const [id, Id] = useState(null)
    const [type, Type] = useState(null)
    const [value, Value] = useState('')
    const [dt, setdt] = useState(new Date().toString().substring(4, 15))

    const Table = 'Trip'+props.route.params.id
    var [Data, setData] = useState([])
    const [loading, Loading] = useState(true);
    const [nodata, NoData] = useState(false);

    useEffect(() => {
        DarkMode()
        createTable()
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
                `CREATE TABLE IF NOT EXISTS  ${Table}`+
                "(Id INTEGER PRIMARY KEY AUTOINCREMENT, Date TEXT,Kind TEXT, Value INTEGER)",
                []
            )
        })
    };

    const dropTable =(table)=>{
        db.transaction((tx)=>{
            tx.executeSql(
                `DROP TABLE ${table}`
            )
        })
    };

    const addRow = (date,kind,value) => {
        db.transaction((tx)=>{
            tx.executeSql(
                `INSERT INTO ${Table} (Date,Kind,Value) VALUES (?,?,?)`,
                [date,kind,value]
            )
        });
        getData();
    };

    const delRow = (id)=>{
        db.transaction((tx)=>{
            tx.executeSql(`DELETE FROM ${Table} WHERE Id= ${id}`)
        });
        getData();
    };

    function getData() {
        const Dat=[]
        db.transaction((tx)=>{
            tx.executeSql(
                `SELECT Id,Date,Kind,Value FROM ${Table}`,
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

    const Options= (op) =>{
        if (op=='add') {addoptions.current.show()}
        else if (op=='trip') {tripdelrefs.current.show()}
        else {
            [...itemdelrefs.entries()].forEach(([key, ref]) => {
                if (key==item.Id){ref.show()}
            });
        }
    }

    const showAdd= (op) =>{
        if (op=='Add Distance') {
            aVisible(true); Addtype('dist')
        }else if (op=='Add Fuel') {
            aVisible(true); Addtype('fuel')
        }else if (op=='Toll Expence') {
            aVisible(true); Addtype('toll')
        }else if (op=='Other') {
            aVisible(true); Addtype('other')
        }else{aVisible(false)}
    }

    const Add =(d,v)=>{
        addRow(d,addtype,v)
        aVisible(false)
    }

    const addClose =()=>{
        aVisible(false)
    }

    const Edit =(s,i,d,v)=>{
        eVisible(false)
        if(s==true){
            alert(v)
            getData()
        }
    }

    const getCosts = (op) =>{
        let v = 0
        if (op=='f'){
            for (var i=0; i<Data.length; i++) {
                if (Data[i].Kind=='fuel') {v+=Data[i].Value}
            }
            return(v+ ' ₹        ')
        }else if (op=='t'){
            for (var i=0; i<Data.length; i++) {
                if (Data[i].Kind=='toll') {v+=Data[i].Value}
            }
            return(v+ ' ₹        ')
        }else if(op=='o'){
            for (var i=0; i<Data.length; i++) {
                if (Data[i].Kind=='other') {v+=Data[i].Value}
            }
            return(v+ ' ₹')
        }else if(op=='d'){
            for (var i=0; i<Data.length; i++) {
                if (Data[i].Kind=='dist') {v+=Data[i].Value}
            }
            return(v)
        }else{
            for (var i=0; i<Data.length; i++) {
                if (Data[i].Kind!='dist') {v+=Data[i].Value}
            }
            return(v)
        }
    }

    const getName = (k)=>{
        if (k=='fuel'){
            return('Fuel Cost')
        }else if(k=='dist'){
            return('Distance')
        }else if (k=='toll'){
            return('Toll Expence')
        }else {
            return('Other')
        }
    }

    const getValue = (k,v)=>{
        if(k=='dist'){
            return(v + ' Km')
        }else{
            return(v + ' ₹')
        }
    }

    const getPic = (k,n)=>{
        if (n=='name'){
            if (k=='fuel'){
                return('water-outline')
            }else if(k=='dist'){
                return('code-working')
            }else if (k=='toll'){
                return('remove-circle-outline')
            }else {
                return('card-outline')
            }
        }else{
            if (k=='fuel'){
                return(26)
            }else if(k=='dist'){
                return(24)
            }else if (k=='toll'){
                return(24)
            }else {
                return(22)
            }
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
            <ScrollView
                onTouchStart={()=>{
                    [...refs.entries()].forEach(([key, ref]) => {
                        ref.close();
                    });
                }}
            >
            {Data.map(item=>(
                <View key={item.Id}>
                <View style={styles.swipecontainer} >
                    <Swipeable
                        ref={ref => {refs.set(item.Id, ref)}}
                        renderRightActions={()=>{
                            return (
                                <View style={style.view}>
                                <TouchableOpacity style={style.editbutton} onPress={()=>{
                                    Id(item.Id);
                                    Type(item.Kind);
                                    Value(item.Value.toString());
                                    setdt(item.Date);
                                    eVisible(true)
                                }}>
                                    <Icon name="pencil" size={27} color='#fff' />
                                </TouchableOpacity>
                                <EditinTrip
                                    BackdropDismiss
                                    show={evisible}
                                    Edit={Edit}
                                    id={id}
                                    type={type}
                                    value={value}
                                    date={dt}
                                />
                                <TouchableOpacity style={style.deletebutton} onPress={()=>{
                                    [...itemdelrefs.entries()].forEach(([key, ref]) => {
                                        if (key==item.Id){ref.show()}
                                    });
                                }}>
                                    <Icon name="trash" size={28} color="#fff" />
                                </TouchableOpacity>
                                <ActionSheet
                                    ref={ref => {itemdelrefs.set(item.Id, ref)}}
                                    title={'This will Delete Item !!'}
                                    options={delarray}
                                    cancelButtonIndex={1}
                                    destructiveButtonIndex={0}
                                    onPress={(index) =>{
                                        if (delarray[index]=='Delete'){delRow(item.Id)}
                                    }}
                                    />
                            </View>
                            );
                        }}
                        overshootRight={false}
                        useNativeAnimations
                        >
                        <View style={styles.swipeable}>
                            <View style={styles.details}>
                                <Text style={styles.upperText}>{getName(item.Kind)}</Text>
                                <Text style={styles.lowerText}> <Icon name="time" size={15} color="#0f815a" /> {item.Date}             {getValue(item.Kind,item.Value)}</Text>
                            </View>
                            <View style={styles.img}>
                                <Icon name={getPic(item.Kind, 'name')} size={getPic(item.Kind)} color={'#0f815a'}/>
                            </View>
                        </View>
                    </Swipeable>
                </View>
                <View style={styles.border}></View>
                </View>
            ))}
        </ScrollView>
        )
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
            fontSize: 15,
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
            fontWeight: '500',
            color: `${color}`,
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
        loading: {
            paddingTop: 15,
            paddingHorizontal: "10%",
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

    return (
        <Provider>
        <View>
            <View style={styles.top}>
                <Text style={styles.heading}>Trip</Text>
            </View>
            <View style={styles.container}>
                <Text style={styles.date}>{props.route.params.date}</Text>
                <Text style={styles.name}>{props.route.params.name}</Text>
                <Text style={styles.rate}>{getCosts('d')} Km   {getCosts('tot')} ₹</Text>
                <Text style={styles.dist}><Icon name="water" size={22} color={'#0f815a'}/> {getCosts('f')}<Icon name="remove-circle" size={20} color={'#0f815a'}/> {getCosts('t')}<Icon name="card" size={20} color={'#0f815a'}/> {getCosts('o')}</Text>
            </View>
            <View style={styles.maincontainer}>
                <View style={styles.border}></View>
                <ContentLoader
                    loading={loading}
                    containerStyles={styles.loading}
                    listSize={6}
                    tWidth={'40%'}
                    pRows={1}
                    pHeight={[10]}
                    pWidth={['100%']}/>
                {(()=>{
                    if (nodata==true){return(msg())}
                    else{return(dataView())}
                })()}
            </View>
            <View style={styles.bottom}>
                <TouchableOpacity style={styles.button} onPress={()=>{props.route.params.refresh();props.navigation.navigate('Trips')}}>
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
                    destructiveButtonIndex={4}
                    onPress={(index) =>{
                        showAdd(addarray[index])
                    }}
                />
                <AddinTrip isVisible={avisible} Add={Add} onClose={addClose} type={addtype}/>
                <TouchableOpacity style={styles.button} onPress={()=>{Options("trip")}}>
                    <Icon name="trash-outline" size={28} color="#fff" />
                </TouchableOpacity>
                <ActionSheet
                    ref={tripdelrefs}
                    title={'This will Delete Trip !!'}
                    options={delarray}
                    cancelButtonIndex={1}
                    destructiveButtonIndex={0}
                    onPress={(index) =>{
                        if (delarray[index]=='Delete') {
                            dropTable(Table)
                            db.transaction((tx)=>{
                                tx.executeSql(`DELETE FROM Trips WHERE Id= ${props.route.params.id}`)
                            });
                            props.route.params.refresh()
                            props.navigation.navigate('Trips')
                        }
                    }}
                />
            </View>
        </View>
        </Provider>
    )
}
