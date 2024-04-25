import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

const Task = (props) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const { text, completed } = props;
  
  const toggleCompleted = () => {
    setIsCompleted(!isCompleted);
  };

  return (
    <View style={styles.containerItem}>
        <TouchableOpacity onPress={props.onToggleComplete}>
          <View style={[styles.square, { backgroundColor: completed ? '#00FF00' : '#000' }]}>
            {completed && <Ionicons name="checkmark-circle" size={24} color="white" />}
          </View>
        </TouchableOpacity>
        <Text style={[styles.itemtext, { textDecorationLine: completed ? 'line-through' : 'none' }]}>
          {text}
        </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  containerItem: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default Task;