import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { styled } from "nativewind";
import { MaterialIcons } from "@expo/vector-icons";
import questionsData from "../components/questions.json"; // Make sure to point to the correct JSON file

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);
const StyledTextInput = styled(TextInput);

export default function PracticeModeScreen({ navigation }) {
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    // Shuffle questions when component mounts
    const shuffleQuestions = (questions) => {
      return questions.sort(() => Math.random() - 0.5);
    };
    setQuestions(shuffleQuestions(questionsData));
  }, []);

  const handleCheckAnswer = () => {
    setLoading(true);
    const correctAnswer = questions[currentQuestionIndex].answer; // Use the current question's answer

    setTimeout(() => {
      if (userInput.trim() === correctAnswer) {
        setFeedback("Correct! Great job!");
      } else {
        setFeedback("Incorrect. Try again.");
      }
      setLoading(false);
    }, 1000);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserInput("");
      setFeedback("");
    } else {
      setFeedback("No more questions.");
    }
  };

  // Get the current question
  const currentQuestion = questions[currentQuestionIndex];

  // If there are no questions, show a message
  if (!currentQuestion) {
    return (
      <StyledView className="flex-1 items-center justify-center">
        <StyledText className="text-lg text-gray-600">
          No more questions available.
        </StyledText>
      </StyledView>
    );
  }

  return (
    <StyledView className="flex-1 bg-gray-50 px-6 pt-12">
      <StatusBar style="dark" />
      <StyledView className="bg-white p-6 shadow-sm mb-4">
        <StyledTouchableOpacity
          onPress={() => navigation.goBack()}
          className="mb-2"
        >
          <MaterialIcons name="arrow-back" size={24} color="#059669" />
        </StyledTouchableOpacity>
        <StyledText className="text-2xl font-bold text-gray-800">
          Practice Mode
        </StyledText>
        <StyledText className="text-gray-600 mt-2">
          Solve the coding challenge below.
        </StyledText>
      </StyledView>

      <StyledScrollView
        className="flex-1 p-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Exercise Prompt */}
        <StyledView className="bg-white p-4 rounded-xl shadow-sm mb-4">
          <StyledText className="text-lg font-semibold">Challenge:</StyledText>
          <StyledText className="mt-2 text-gray-600">
            {currentQuestion.question}
          </StyledText>
        </StyledView>

        {/* User Input Area */}
        <StyledView className="bg-white p-4 rounded-xl shadow-sm mb-4">
          <StyledText className="text-lg font-semibold">
            Your Answer:
          </StyledText>
          <StyledTextInput
            value={userInput}
            onChangeText={setUserInput}
            placeholder="Type your answer here..."
            className="mt-2 border border-gray-300 rounded-md p-2"
            keyboardType="default"
          />
        </StyledView>

        {/* Submit Button */}
        <StyledTouchableOpacity
          onPress={handleCheckAnswer}
          className="bg-emerald-600 p-4 rounded-lg items-center"
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <StyledText className="text-white font-semibold">
              Check Answer
            </StyledText>
          )}
        </StyledTouchableOpacity>

        {/* Feedback Section */}
        <StyledView className="mt-4">
          <StyledText
            className={`text-lg text-center ${
              feedback.includes("Correct") ? "text-green-500" : "text-red-500"
            }`}
          >
            {feedback}
          </StyledText>
        </StyledView>

        {/* Next Question Button */}
        {feedback && (
          <StyledTouchableOpacity
            onPress={handleNextQuestion}
            className="bg-blue-600 p-4 rounded-lg items-center mt-4"
          >
            <StyledText className="text-white font-semibold">
              Next Question
            </StyledText>
          </StyledTouchableOpacity>
        )}
      </StyledScrollView>
    </StyledView>
  );
}
