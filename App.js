// App.js

import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker'; 
import { Ionicons } from '@expo/vector-icons'; 
import Task from './components/Task';

import AsyncStorage from '@react-native-async-storage/async-storage'; 

export default function App() {
  const [taskName, setTaskName] = useState('');
  const [category, setCategory] = useState('All');
  const [taskList, setTaskList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const loadTasks = async () => {
    try {
      const tasks = await AsyncStorage.getItem('tasks');
      if (tasks !== null) {
        setTaskList(JSON.parse(tasks));
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };
  
  useEffect(() => {
    loadTasks();
  }, []);
  
  const handleAddTask = () => {
    if (taskName.trim() !== '') {
      const newTask = { text: taskName, category: category, date: new Date().toLocaleString(), completed: false };
      const updatedTasks = [...taskList, newTask];
      setTaskList(updatedTasks);
      setTaskName('');
      setModalVisible(false);
      saveTasks(updatedTasks); 
    }
  };

  const saveTasks = async (tasks) => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  };


  const deleteTask = (index) => {
    const updatedTaskList = [...taskList];
    updatedTaskList.splice(index, 1);
    setTaskList(updatedTaskList);
    saveTasks(updatedTaskList); 
  };

  const toggleCompleteTask = (index) => {
    const updatedTaskList = [...taskList];
    updatedTaskList[index].completed = !updatedTaskList[index].completed;
    setTaskList(updatedTaskList);
    saveTasks(updatedTaskList); 
  };

  const filterTasks = () => {
    if (category === 'All') {
      return taskList;
    } else {
      return taskList.filter(task => task.category === category);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>All Tasks</Text>
        <Picker
          selectedValue={category}
          style={styles.picker}
          onValueChange={(itemValue, itemIndex) => setCategory(itemValue)}
        >
          <Picker.Item label="All" value="All" />
          <Picker.Item label="Work" value="Work" />
          <Picker.Item label="Personal" value="Personal" />
          <Picker.Item label="Study" value="Study" />
          {/* Add other categories as needed */}
        </Picker>
      </View>
      <View style={styles.taskWrapper}>
        <ScrollView style={styles.tasks}>
          {filterTasks().map((task, index) => (
            <View key={index} style={styles.task}>
              <TouchableOpacity onPress={() => toggleCompleteTask(index)}>
                <Ionicons name={task.completed ? 'checkmark-circle' : 'ellipse-outline'} size={24} color={task.completed ? 'green' : 'black'} />
              </TouchableOpacity>
              <Task text={task.text} completed={task.completed} />
              <TouchableOpacity onPress={() => deleteTask(index)}>
                <Ionicons name="trash-outline" size={24} color="red" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={36} color="white" />
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>New Task</Text>
            <TextInput
              style={styles.input}
              placeholder="Task name"
              value={taskName}
              onChangeText={(text) => setTaskName(text)}
            />
            <Picker
              selectedValue={category}
              style={styles.input}
              onValueChange={(itemValue, itemIndex) => setCategory(itemValue)}
            >
              <Picker.Item label="Work" value="Work" />
              <Picker.Item label="Personal" value="Personal" />
              <Picker.Item label="Study" value="Study" />
              {/* Add other categories as needed */}
            </Picker>
            <TouchableOpacity onPress={handleAddTask} style={styles.addButton}>
              <Text style={styles.addButtonText}>Add Task</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.modalClose}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  picker: {
    width: 150,
  },
  taskWrapper: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  tasks: {
    flex: 1,
  },
  task: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'blue',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 20,
    marginBottom: 15,
  },
  input: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#C0C0C0',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'blue',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    width: 60,
  },
  modalClose: {
    marginTop: 10,
    color: 'red',
    fontWeight: 'bold',
  },
});
