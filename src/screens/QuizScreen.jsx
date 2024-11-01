import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  StyleSheet,
} from "react-native";
import { styled } from "nativewind";
import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome } from "@expo/vector-icons";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);

const ResultModal = ({ visible, score, total, onClose }) => {
  const isPass = score >= total / 2;

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <StyledView style={styles.modalBackground}>
        <StyledView
          style={[
            styles.modalContainer,
            {
              borderColor: isPass ? "#34D399" : "#F43F5E",
            },
          ]}
        >
          <StyledText style={styles.modalTitle}>
            {isPass ? "Congratulations!" : "Oops!"}
          </StyledText>
          <FontAwesome
            name={isPass ? "trophy" : "frown-o"}
            size={50}
            color={isPass ? "#34D399" : "#F43F5E"}
            style={styles.icon}
          />
          <StyledText style={styles.modalScore}>
            Your Score: {score}/{total}
          </StyledText>
          <StyledText style={styles.modalMessage}>
            {isPass
              ? "Great job! You've passed the quiz!"
              : "Don't worry, keep practicing!"}
          </StyledText>
          <StyledTouchableOpacity
            onPress={onClose}
            className="bg-emerald-500 rounded-lg p-3 mt-4"
          >
            <StyledText className="text-white text-center font-semibold">
              {isPass ? "Celebrate!" : "Try Again"}
            </StyledText>
          </StyledTouchableOpacity>
        </StyledView>
      </StyledView>
    </Modal>
  );
};

export default function QuizScreen({ route, navigation }) {
  const { lesson } = route.params;
  const [loading, setLoading] = useState(true);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [quizComplete, setQuizComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    console.log("Lesson Quiz" + JSON.stringify(lesson, null, 2));
    setQuizQuestions(lesson.content);
    setLoading(false);
  }, [lesson]);

  const handleAnswerSelect = (answerIndex) => {
    setUserAnswers((prevAnswers) => [
      ...prevAnswers,
      {
        questionId: quizQuestions[currentQuestionIndex].id,
        answer: answerIndex,
      },
    ]);
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      setQuizComplete(true);
      handleQuizComplete();
    }
  };

  const handleQuizComplete = async () => {
    const calculatedScore = userAnswers.reduce(
      (total, { questionId, answer }) => {
        const question = quizQuestions.find((q) => q.id === questionId);
        return total + (question.correct_option === answer ? 1 : 0);
      },
      0
    );

    setScore(calculatedScore);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    navigation.goBack();
  };

  if (loading) {
    return (
      <StyledView className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#059669" />
      </StyledView>
    );
  }

  return (
    <StyledView className="flex-1 justify-center items-center pt-12 px-6">
      <StatusBar style="dark" />
      <LinearGradient colors={["#F0F4F8", "#E2E8F0"]} style={{ flex: 1 }}>
        <StyledScrollView className="flex-1">
          <StyledView className="p-6">
            <StyledText className="text-3xl font-bold text-emerald-600 mb-4 text-center">
              {lesson.title} Quiz
            </StyledText>
            {!quizComplete ? (
              <StyledView className="bg-white shadow-lg rounded-lg p-4 mb-6">
                <StyledText className="text-lg font-semibold mb-2">
                  Question {currentQuestionIndex + 1}:
                </StyledText>
                <StyledText className="text-gray-700 mb-4">
                  {quizQuestions[currentQuestionIndex].question}
                </StyledText>
                {quizQuestions[currentQuestionIndex].options.options.map(
                  (answer, index) => (
                    <StyledTouchableOpacity
                      key={index}
                      onPress={() => handleAnswerSelect(index)}
                      className="bg-emerald-100 border border-gray-300 rounded-lg p-2 mb-2"
                    >
                      <StyledText className="text-lg">{answer}</StyledText>
                    </StyledTouchableOpacity>
                  )
                )}
              </StyledView>
            ) : null}
          </StyledView>
        </StyledScrollView>
      </LinearGradient>
      <ResultModal
        visible={modalVisible}
        score={score}
        total={quizQuestions.length}
        onClose={closeModal}
      />
    </StyledView>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    padding: 20,
    borderRadius: 10,
    backgroundColor: "white",
    elevation: 5,
    borderWidth: 2,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalScore: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  modalMessage: {
    textAlign: "center",
    marginBottom: 20,
  },
  icon: {
    alignSelf: "center",
    marginBottom: 10,
  },
});
