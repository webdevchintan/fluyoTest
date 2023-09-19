import React, {FC, useEffect, useState} from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import {RenderList} from '../components';
import firestore from '@react-native-firebase/firestore';
import {FlatList} from 'react-native-gesture-handler';
import {palette} from '../theme/palette';

interface Translation {
  [key: string]: string;
}

interface Exercise {
  option: object[];
  question: string | '';
  trans: Translation;
  english: string | '',
  answer: string | '',
  correctAnswer: string
  // Add other properties as needed
}

const Home: FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [isCorrectAnswer, setIsCorrectAnswer] = useState<boolean>(false);
  const [isAnswerSelected, setIsAnswerSelected] = useState<boolean>(false);


  useEffect(() => {
    const subscribeExercises = firestore()
      .collection('exercises')
      .where('isChecked', '==', false)
      .limit(1)
      .onSnapshot(querySnapShot => {
        const documents:Exercise[] = [];
        querySnapShot.forEach(documentSnapshot => {
          documents.push({
            key: documentSnapshot.id,
            ...documentSnapshot.data(),
          });
        });
        setExercises(documents);
      });
    // Unsubscribe from events when no longer in use
    return () => subscribeExercises();
  }, []);

  const updateAnswer = async (answer:string, key:string, isCorrect:boolean) => {
    if (answer) {
      setSelectedAnswer(answer);
      try {
        await firestore()
          .collection('exercises')
          .doc(key)
          .update({
            answer: answer,
            isCompleted: isCorrect || false,
          });
      } catch (err) {
        console.log(err);
      }
    } else {
      Alert.alert('Missing Fields');
    }
  };

  const checkAnswer = async (answer:string) => {
    setIsCorrectAnswer(answer === selectedAnswer);
    setIsAnswerSelected(true);
  };
  const onPressContinue = async (key : string) => {
    if (key) {
      try {
        await firestore().collection('exercises').doc(key).update({
          isChecked: true,
          answer:'',
        });
        setIsAnswerSelected(false);
      } catch (err) {
        setIsAnswerSelected(false);
        console.log(err);
      }
    } else {
      setIsAnswerSelected(false);
      Alert.alert('Missing Fields');
    }
  }
  return (
    <View style={styles.container}>
      <View />
      <View style={styles.questionContainer}>
        {exercises?.length > 0 ? (
          <FlatList
            data={exercises}
            renderItem={({item, index}) => (
              <RenderList
                option={item.option}
                question={item.question}
                translation={item.trans}
                englishVersion={item.english}
                index={index}
                id={item.key}
                answer={item.answer}
                updateAnswer={updateAnswer}
                checkAnswer={checkAnswer}
                selectedAnswer={selectedAnswer}
                correctAnswer={item.correctAnswer}
                isCorrectAnswer={isCorrectAnswer}
                isAnswerSelected={isAnswerSelected}
                onPressContinue={onPressContinue}
              />
            )}
          />
        ) : (
          <View style={styles.noData}>
            <Text>Nothing To Display</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    borderWidth: 2,
    justifyContent: 'space-between',

    backgroundColor: palette.blue,
  },
  questionContainer: {
    marginTop: '45%',
    alignItems: 'center',
    paddingVertical: 25,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    backgroundColor: palette.weldonBlue,
  },
  noData: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
