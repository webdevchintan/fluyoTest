import React, {FC} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {AppButton, AppText} from '.';
import {palette} from '../theme/palette';

interface Props {
  option: Array<object>;
  question: string;
  answer: string;
  translation: Translation;
  index: number;
  id: string;
  englishVersion: string;
  selectedAnswer:string;
  correctAnswer: string;
  isCorrectAnswer: boolean;
  isAnswerSelected:boolean;
  updateAnswer: (answer: string, id: string, isCorrect : boolean) => void;
  checkAnswer: (correctAnswer: string) => void;
  onPressContinue: (id: string) => void;
}
interface Translation {
  [key: string]: string;
}

const renderQuestion = (
  question: string,
  answer: string,
  translation: Translation,
) => {
  const questionString = question?.split(' ');
  return (
    <View style={styles.questionContainer}>
      {questionString?.map(questionPart =>
        questionPart === '${BLANK}' && answer ? (
          <AppButton
            title={answer}
            onPress={() => null}
            style={styles.answerButton}
            textStyle={styles.answerText}
          />
        ) : questionPart === '${BLANK}' ? (
          <View style={styles.blankValue} />
        ) : (
          <AppText
            style={styles.questionStyle}
            onPress={() => Alert.alert(translation[questionPart])}>
            {questionPart}
          </AppText>
        ),
      )}
    </View>
  );
};

const renderOptions = (options: Array<any>, updateAnswer: (answer: string, id: string, isCorrect : boolean) => void, id : string, selectedAnswer: string) => {
  return (
    <View style={styles.optionContainer}>
      <FlatList
        data={options}
        numColumns={2}
        renderItem={({item, index}) => {
            return (
              <AppButton
                title={selectedAnswer !== item.title ? item.title : ''}
                key={index}
                onPress={() => updateAnswer(item.title, id, item.ans)}
                style={selectedAnswer !== item.title ? styles.optionButton : styles.optionButtonSelected}
                textStyle={styles.optionText}
              />
            );
        }}
      />
    </View>
  );
};
const RenderList: FC<Props> = props => {
  return (
    <View style={styles.container}>
      <AppText text="Fill in the missing word" style={styles.headingStyle} />
      <View>
        <AppText style={styles.englishTranslation}>
          {props.englishVersion}
        </AppText>
      </View>
      <View>
        {renderQuestion(props.question, props.answer, props.translation)}
      </View>
      <View>{renderOptions(props.option, props.updateAnswer, props.id, props.selectedAnswer)}</View>
      <View style={styles.checkAnswerButton}>
        <AppButton
          title={props.isAnswerSelected ? "Continue" : "Check Answer"}
          onPress={() => (!props.isAnswerSelected ? props.checkAnswer(props.correctAnswer) : props.onPressContinue(props.id))}
          style={!props.isAnswerSelected ? styles.buttonStyle : props.isCorrectAnswer ?  styles.buttonStyle : styles.wrongButtonStyle }
          textStyle={styles.buttonText}
        />
      </View>
      { props.isAnswerSelected ? <AppText style={styles.englishTranslation} text={props.isCorrectAnswer ? 'Great Job! ' : `Correct answer is : ${props.correctAnswer}`} /> : null}
    </View>
  );
};

export default RenderList;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'space-between',
    marginVertical: 5,
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  highlightText: {
    backgroundColor: 'yellow',
    fontSize: 26,
    textAlign: 'center',
  },
  blankValue: {
    borderBottomWidth: 1,
    width: 50,
  },
  questionStyle: {
    marginHorizontal: 2,
    marginVertical: 15,
    color: palette.white,
  },
  optionContainer: {
    alignItems: 'center',
    marginVertical: 55,
  },
  answerButton: {
    height: 50,
    backgroundColor: palette.white,
  },
  wrongAnswerButton: {
    height: 50,
    backgroundColor: palette.red,
  },
  answerText: {
    fontSize: 15,
    color: palette.weldonBlue,
    fontWeight: 'bold',
  },
  wrongAnswerText: {
    fontSize: 15,
    color: palette.white,
    fontWeight: 'bold',
  },
  optionButton: {
    marginVertical: 10,
    height: 50,
    backgroundColor: palette.white,
  },
  optionButtonSelected: {
    marginVertical: 10,
    height: 50,
    width:80,
    backgroundColor: palette.transparent,
    borderColor:palette.white,
    borderWidth:1,
  },
  optionText: {
    fontSize: 15,
    color: palette.weldonBlue,
    fontWeight: 'bold',
  },
  answerStyle: {marginHorizontal: 2},
  checkAnswerButton: {
    marginVertical: 25,
  },
  questionContainer: {
    flexDirection: 'row',
  },
  headingStyle: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '400',
    color: palette.white,
  },
  buttonStyle: {
    marginVertical: 40,
    height: 70,
    backgroundColor: palette.robinEggBlue,
  },
  wrongButtonStyle: {
    marginVertical: 40,
    height: 70,
    backgroundColor: palette.red,
  },
  buttonText: {
    fontSize: 18,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  englishTranslation: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.white,
    textAlign: 'center',
    marginVertical: 15,
  },
});
