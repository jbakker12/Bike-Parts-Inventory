
// "StAuth10244: I Jacob Bakker certify that this material is my original work. 
// No other person's work has been used without due acknowledgement. I have not made my work available to anyone else."

import { Text, View, StyleSheet,TextInput, Button, TouchableOpacity,Image,Alert } from "react-native";
import{useEffect, useState} from 'react';
import axios from 'axios';


export default function Index() {
  const [newMake,onChangeMake] = useState('');
  const [newModel,onChangeModel] = useState('');
  const [newType,onChangeType] = useState('');
  const [newMRSP,onChangeMRSP] = useState('');
  const [search, onChangeSearch] = useState('');
  const [data, setData] = useState('');
  const [loading, setLoading] = useState(false);
  const [addEdit, setAddEdit] = useState("Add an Item");
  const [currentId, setCurrentId] = useState('(Auto-Generated)'); 

  const tableHead = ['ID', 'Make', 'Model','Type', 'MRSP'];
  const [tableData,setTableData] = useState<(string|number)[][]>([]);
  
  /*
  This function loads the data on page load
  */
    const loadCollection = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:3001/api');
        const formatted = (response.data.map((item: { 
          id: number; 
          make: string; 
          model: string; 
          type: string; 
          mrsp: number 
        }) => [
          item.id,
          item.make,
          item.model,
          item.type,
          `$${item.mrsp.toFixed(2)}`
        ]));
        
        setTableData(formatted);
        
      } catch (error) {
        console.error('Error fetching data:', error);
        // setData('Error fetching data');
      } finally {
        setLoading(false);
      }
    };
  useEffect(() => {
    loadCollection();
  }, []);


  /*
  This function adds an item to the SQlite database and updates the frontend to match
  */
  function addItem(){
      const handleGetRequest = async () => {
        setLoading(true);
        try {
          const response = await axios.post('http://localhost:3001/api',{
            make: newMake,
            model: newModel,
            type: newType,
            mrsp: parseFloat(newMRSP)
          });
          setData(JSON.stringify(response.data));
          loadCollection();
         onChangeMake('');
         onChangeModel('');
         onChangeType('');
         onChangeMRSP('0');
        } catch (error) {
          console.error('Error fetching data:', error);
          setData('Error fetching data');
        } finally {
          setLoading(false);
        }
      };
      handleGetRequest();
     
  }

  /*
  This function sets the place holder values from the 'Add item' section as the values from the selected inventory item to edit.
  The 'submitEdit()' function will be activated later one the 'Edit an Item' button is clicked.
  */
  function editItem(rowData:any){
    const index = rowData[0];
    const make = rowData[1];
    const model = rowData[2];
    const type = rowData[3];
    const mrsp = rowData[4].slice(1);

    onChangeMake(make);
    onChangeModel(model);
    onChangeType(type);
    onChangeMRSP(mrsp);
    setAddEdit("Edit an Item");
    setCurrentId(index);
  }

  /*
   This function determines which function should be used depending on the state of the button when pressed
   */
  function addEditFunction(){
    if(addEdit=="Edit an Item"){
      submitEdit();
    }
    else{
      addItem();
    }
  }

  /*
  This function submits the edited responses to the SQlite backend and updates the frontend table accordingly
  */
  function submitEdit(){
    const handleGetRequest = async () => {
      setLoading(true);
      try {
        const response = await axios.put('http://localhost:3001/api/id',{
          id: currentId,
          make: newMake,
          model: newModel,
          type: newType,
          mrsp: parseFloat(newMRSP)
        });
      
      loadCollection();
       setCurrentId('(Auto-Generated)'); 
       onChangeMake('');
       onChangeModel('');
       onChangeType('');
       onChangeMRSP('0');
       setAddEdit('Add Item');
      } catch (error) {
        console.error('Error fetching data:', error);
       
      } finally {
        setLoading(false);
      }
    };
    handleGetRequest();   
  }
 
  /*
  This function deletes the selected item from the SQlite backend, and updates the front end table accordingly
  */
  function deleteItem(index: any){
    const handleGetRequest = async () => {
      setLoading(true);
      try {
        const response = await axios.delete('http://localhost:3001/api/id',{data: {id: index}});
          loadCollection();
          setCurrentId('(Auto-Generated)'); 
          onChangeMake('');
          onChangeModel('');
          onChangeType('');
          onChangeMRSP('0');
          setAddEdit('Add Item');
      } catch (error) {
        console.error('Error fetching data:', error);
        setData('Error fetching data');
      } finally {
        setLoading(false);
      }
    };
    handleGetRequest();
  }
 
  /*
  This function deletes all entries in the SQlite database, and updates the frontend table accordingly
  */
  const deleteAll = () => {
    alert("All items deleted");
    const handleGetRequest = async () => {
      setLoading(true);
      try {
        const response = await axios.delete('http://localhost:3001/api').then((response)=>{
           setData(JSON.stringify(response.data));
           loadCollection();
        })
       
      } catch (error) {
        console.error('Error fetching data:', error);
        setData('Error fetching data');
      } finally {
        setLoading(false);
      }
    };
    handleGetRequest();

  };

  /**
   * This function allows the user to search for an item by ID. Once the search button is pressed, the table will display the inventory item only.
   * If the search textInput is blank when the button is pressed the full collection will be shown again.
   */
  function findItem(){
    if(search == ""){
      loadCollection();
    }
    const handleGetRequest = async () => {
      setLoading(true);
      
      try {
        const response = await axios.get(`http://localhost:3001/api/id`, {params: { id: parseInt(search)}});
        const item = response.data;
        const formatted = [[
          item.id,
          item.make,
          item.model,
          item.type,
          `$${item.mrsp.toFixed(2)}`
        ]];

        setTableData(formatted);

      } catch (error) {
        console.error('Error fetching data:', error);
        setData('Inventory Item not Found');
      } finally {
        setLoading(false);
      }
    };
    handleGetRequest();
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        margin: 50,
        backgroundColor: 'white'
      }}
    >
      {/* Header sectino */}
      <Text style={styles.title}>JDB Bike Shop Inventory</Text>
      <Text style={styles.title2}>{data}</Text>
      <Text style={styles.addTitle}>{addEdit}</Text>

      {/* Add/Edit an Item Section */}
      <View style={styles.table}>
          <View style={styles.tableRow}>
              <View style={styles.tableCell}><Text style={styles.textNull}>{currentId}</Text></View>
              <View style={styles.tableCell}><TextInput style={styles.input} placeholder="Make" value={newMake} onChangeText={onChangeMake}></TextInput></View>
              <View style={styles.tableCell}><TextInput style={styles.input} placeholder="Model" value={newModel}  onChangeText={onChangeModel}></TextInput></View>
              <View style={styles.tableCell}><TextInput style={styles.input} placeholder="Type" value={newType}  onChangeText={onChangeType}></TextInput></View>
              <View style={styles.tableCell}><TextInput style={styles.input} placeholder="MRSP" value={newMRSP}  onChangeText={onChangeMRSP}></TextInput></View>
              <View style={styles.tableCell}><Button title={addEdit} onPress={()=>addEditFunction()}></Button></View>
          </View>
      </View>

      {/* Search by ID section */}
      <View style={styles.partsHeader}>
        <Text style={styles.subtitle}>Parts Inventory</Text>
        <View style={styles.searchElements}>
        <TextInput placeholder="Search for Item by ID" style={styles.input} onChangeText={onChangeSearch}></TextInput>
        <Button title="Search" onPress={()=>findItem()}></Button>
        </View>
      </View>
      
      {/* Main table header */}
      <View style={styles.table}>
        <View style={styles.tableRow}>
          {tableHead.map((header, index) => (
            <View key={index} style={styles.tableCell}><Text style={[styles.text, styles.headerText]}>{header}</Text></View>
          ))}
        </View>
        
           {/* Main Table Rows */}
           {tableData.map((rowData, rowIndex) => (
          <View key={rowIndex} style={styles.tableRow}>
            {rowData.map((cellData: string|number, cellIndex: number) => (
              <View key={cellIndex} style={styles.tableCell}>
                {/* edit button only shows on first column */}
                {cellIndex === 0 &&
                <TouchableOpacity onPress={()=>editItem(rowData)}>
                  <Image source={require('../assets/images/pencil.png')} style={styles.icon}></Image>
                </TouchableOpacity>}

                <Text style={styles.text}>{cellData}</Text>

                {/* delete button only shows on first column */}
                {cellIndex === 0 &&
                <TouchableOpacity onPress={()=>deleteItem(rowData[0])}>
                  <Image source={require('../assets/images/delete.png')} style={styles.icon}></Image>
                </TouchableOpacity>}
              </View>
            ))}
          </View>
        ))}
        </View>
        {/* Delete All Button */}
        <Button title="Delete All" color="red" onPress={deleteAll}></Button> 
    </View>
  );
}

const styles=StyleSheet.create({
  title:{
    fontSize: 30,
    textAlign: 'center'
  },
  subtitle:{
    fontSize: 20,
    textAlign: 'left'
  },
  table: {
    padding: 10,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCell: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'black',
    padding: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  text: {
    fontSize: 14,
  },
  textNull:{
    fontSize: 14,
    color: 'lightgray',
    borderColor: 'lightgrey',
    borderWidth: 1,
    padding: 5
  },
  headerText: {
    fontWeight: 'bold'
  },
  input:{
    borderColor: 'black',
    borderWidth: 1,
    padding: 5,
    textAlign: 'center',
    color: 'grey'
  },
  icon:{
    width: 30,
    height: 30
  },
  partsHeader:{
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10
  },
  searchElements:{
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  addTitle:{
    paddingLeft: 10,
    fontSize: 20
  },
  title2:{
    fontSize: 15,
    textAlign: 'center'
  }
})
