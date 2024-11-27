import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Keyboard,
} from 'react-native';
import {
  createTable,
  insertTodo,
  getTodos,
  toggleTodo,
  deleteTodo,
  Todo,
} from './db';
import { FAB, Icon } from 'react-native-paper';
import BottomSheet from '@gorhom/bottom-sheet';
import {
  GestureHandlerRootView,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';

const App = () => {
  const [task, setTask] = useState<string>('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [bottomSheetIndex, setBottomSheetIndex] = useState<number>(-1);
  const textInputRef = useRef<TextInput | null>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['25%'], []);

  useEffect(() => {
    const initialize = async () => {
      await createTable();
      await loadTodos();
    };

    initialize();
  }, []);

  useEffect(() => {
    Keyboard.addListener('keyboardDidHide', () => {
      bottomSheetRef?.current?.close();
    });
  }, []);

  const loadTodos = async (): Promise<void> => {
    const todos = await getTodos();
    setTodos(todos);
  };

  const handleAddTask = async (): Promise<void> => {
    if (task.trim()) {
      await insertTodo(task);
      setTask('');
      await loadTodos();
    }
  };

  const handleToggleTodo = async (id: number, done: number): Promise<void> => {
    await toggleTodo(id, done);
    await loadTodos();
  };

  const handleDeleteTodo = async (id: number): Promise<void> => {
    await deleteTodo(id);
    await loadTodos();
  };

  const handleOpenBottomSheet = (val: number) => {
    if (val === 0) {
      textInputRef?.current?.focus();
    }
    if (val === -1) {
      textInputRef?.current?.blur();
    }
    setBottomSheetIndex(val);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableWithoutFeedback
            onPress={() => handleToggleTodo(item.id, item.done)}
          >
            <View style={styles.todoItem}>
              <View style={styles.iconStyle}>
                {item.done === 1 ? (
                  <Icon source='check-circle-outline' size={25} color='gray' />
                ) : (
                  <Icon source='radiobox-blank' size={25} color='white' />
                )}
                <Text
                  style={
                    item.done === 1 ? styles.completed : styles.notCompleted
                  }
                >
                  {item.task}
                </Text>
              </View>

              <TouchableWithoutFeedback
                style={styles.touch}
                onPress={() => handleDeleteTodo(item.id)}
              >
                <Icon source='delete' size={20} color='white' />
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        )}
      />

      <FAB
        style={styles.fab}
        size='medium'
        icon='plus'
        onPress={() => handleOpenBottomSheet(0)}
      />

      <BottomSheet
        ref={bottomSheetRef}
        backgroundStyle={styles.bottomSheet}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        enablePanDownToClose={true}
        index={bottomSheetIndex}
        onChange={(index) => handleOpenBottomSheet(index)}
      >
        <View style={styles.bottomSheetContent}>
          <TextInput
            ref={textInputRef}
            placeholderTextColor='gray'
            style={styles.input}
            value={task}
            onChangeText={setTask}
            placeholder='Enter a value'
            onSubmitEditing={handleAddTask}
            submitBehavior='submit'
          />
        </View>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  iconStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  touch: {
    padding: 7,
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#151515',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'transparent',
    borderWidth: 1,
    color: 'white',
    marginBottom: 10,
    paddingLeft: 8,
  },
  todoItem: {
    backgroundColor: '#201F1F',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
    padding: 15,
    fontSize: 20,
    color: 'white',
    alignItems: 'center',
  },
  notCompleted: {
    display: 'flex',
    alignItems: 'center',
    color: 'white',
    fontSize: 20,
  },
  completed: {
    textDecorationLine: 'line-through',
    fontSize: 20,
    color: 'gray',
  },
  fab: {
    position: 'absolute',
    bottom: 25,
    right: 15,
    backgroundColor: '#ffac30',
  },
  bottomSheetContent: {
    padding: 20,
  },
  bottomSheet: {
    padding: 20,
    backgroundColor: '#201F1F',
  },
  addBtn: {
    backgroundColor: '#ffac30',
  },
});

export default App;
