import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import { styled } from "nativewind";
import { MaterialIcons } from "@expo/vector-icons";
import { supabase } from "../services/supabaseClient";
import { useUser } from "../services/userContext";
import { useState, useEffect } from "react";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);
const StyledTextInput = styled(TextInput);

const ProgressBar = ({ progress }) => (
  <StyledView className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
    <StyledView
      className="h-full bg-emerald-500"
      style={{ width: `${progress}%` }}
    />
  </StyledView>
);

const LessonCard = ({ lesson, isCompleted, isCurrent, onPress }) => (
  <StyledTouchableOpacity
    onPress={onPress}
    className={`p-4 rounded-xl mb-4 ${
      isCompleted
        ? "bg-emerald-50 border-emerald-200"
        : isCurrent
        ? "bg-white border-emerald-500"
        : "bg-gray-50 border-gray-200"
    } border-2`}
  >
    <StyledView className="flex-row justify-between items-center">
      <StyledView className="flex-1">
        <StyledText
          className={`text-lg font-semibold ${
            isCompleted || isCurrent ? "text-gray-800" : "text-gray-400"
          }`}
        >
          {lesson.title}
        </StyledText>
        <StyledText
          className={`mt-1 ${
            isCompleted || isCurrent ? "text-gray-600" : "text-gray-400"
          }`}
        >
          {lesson.description}
        </StyledText>
      </StyledView>
      <MaterialIcons
        name={isCompleted ? "check-circle" : "arrow-forward-ios"}
        size={24}
        color={isCompleted ? "#059669" : isCurrent ? "#374151" : "#9CA3AF"}
      />
    </StyledView>
  </StyledTouchableOpacity>
);

const CodeExample = ({ code, language }) => (
  <StyledView className="bg-gray-900 rounded-xl p-4 my-2">
    <StyledText className="font-mono text-white">{code}</StyledText>
  </StyledView>
);

export default function ChallengeDetailsScreen({ route, navigation }) {
  const { challengeId } = route.params;
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [challenge, setChallenge] = useState(null);
  const [userChallenge, setUserChallenge] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [updatingProgress, setUpdatingProgress] = useState(false);
  const [scrollViewRef, setScrollViewRef] = useState(null);

  useEffect(() => {
    fetchChallengeDetails();
  }, [challengeId]);

  const fetchChallengeDetails = async () => {
    try {
      setLoading(true);

      const { data: challengeData, error: challengeError } = await supabase
        .from("challenges")
        .select(
          `*,
        lessons:challenge_lessons(
          *,
          content:lesson_content(*)
        )
      `
        )
        .eq("id", challengeId)
        .single();

      if (challengeError) throw challengeError;
      setChallenge(challengeData);

      const { data: userChallengeData, error: userChallengeError } =
        await supabase
          .from("user_challenges")
          .select(
            `*,
        completed_lessons:user_completed_lessons(lesson_id)
      `
          )
          .eq("challenge_id", challengeId)
          .eq("user_id", user.id);

      if (userChallengeError) throw userChallengeError;

      if (userChallengeData.length === 0) {
        throw new Error("No progress data found for this user challenge.");
      }

      const userChallenge = userChallengeData[0]; // Get the first result
      setUserChallenge(userChallenge);

      const completedLessonIds = userChallenge.completed_lessons.map(
        (cl) => cl.lesson_id
      );
      setCompletedLessons(completedLessonIds);

      const currentLessonIndex = completedLessonIds.length;
      if (currentLessonIndex < challengeData.lessons.length) {
        setCurrentLesson(challengeData.lessons[currentLessonIndex]);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load challenge details");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLessonComplete = async () => {
    if (!currentLesson || updatingProgress) {
      console.log("Exiting due to missing currentLesson or in-progress update");
      return;
    }

    try {
      console.log("Updating progress...");
      setUpdatingProgress(true);

      const { error: lessonError } = await supabase
        .from("user_completed_lessons")
        .insert({
          user_challenge_id: userChallenge.id,
          lesson_id: currentLesson.id,
          completed_at: new Date().toISOString(),
        });

      if (lessonError) throw lessonError;

      const newProgress = Math.round(
        ((completedLessons.length + 1) / challenge.lessons.length) * 100
      );
      const { error: progressError } = await supabase
        .from("user_challenges")
        .update({ progress: newProgress })
        .eq("id", userChallenge.id);

      if (progressError) throw progressError;

      const hasQuiz = currentLesson.content.some(
        (content) => content.type === "quiz"
      );

      if (hasQuiz) {
        navigation.navigate("Quiz", {
          lesson: JSON.stringify(currentLesson.content, null, 2),
        });
      } else {
        if (newProgress === 100) {
          Alert.alert("Congratulations!", "You've completed the challenge!", [
            {
              text: "View Certificate",
              onPress: () =>
                navigation.navigate("Certificate", { challengeId }),
            },
            { text: "OK", onPress: () => navigation.goBack() },
          ]);
        } else {
          Alert.alert("Lesson Completed!", "You have completed the lesson.");
        }
      }

      await fetchChallengeDetails();
    } catch (error) {
      Alert.alert("Error", "Failed to update progress");
      console.error("Error:", error);
    } finally {
      setUpdatingProgress(false);
    }
  };

  const handleLessonSelect = (lesson) => {
    const lessonIndex = challenge.lessons.findIndex((l) => l.id === lesson.id);
    const isAccessible =
      completedLessons.includes(lesson.id) ||
      lessonIndex === completedLessons.length;

    if (isAccessible) {
      const hasQuiz = lesson.content.some((content) => content.type === "quiz");

      if (hasQuiz) {
        navigation.navigate("Quiz", { lesson });
      } else {
        setCurrentLesson(lesson);
      }

      if (scrollViewRef) {
        scrollViewRef.scrollTo({ x: 0, y: 0, animated: true });
      }
    } else {
      Alert.alert(
        "Locked Lesson",
        "Please complete the previous lessons first to unlock this one."
      );
    }
  };

  if (loading) {
    return (
      <StyledView className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#059669" />
      </StyledView>
    );
  }

  return (
    <StyledView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />

      {/* Header */}
      <StyledView className="bg-white pt-12 pb-4 px-6 shadow-sm">
        <StyledView className="flex-row items-center justify-between">
          <StyledView className="flex-row items-center">
            <StyledTouchableOpacity
              onPress={() => navigation.goBack()}
              className="mr-4"
            >
              <MaterialIcons name="arrow-back" size={24} color="#374151" />
            </StyledTouchableOpacity>
            <StyledText className="text-2xl font-bold text-gray-800">
              {challenge.title}
            </StyledText>
          </StyledView>
          <StyledView className="bg-emerald-100 rounded-full px-3 py-1">
            <StyledText className="text-emerald-700">
              {userChallenge.progress}%
            </StyledText>
          </StyledView>
        </StyledView>
      </StyledView>

      <StyledScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        ref={(ref) => setScrollViewRef(ref)}
      >
        <StyledView className="p-6">
          {/* Progress Bar */}
          <ProgressBar progress={userChallenge.progress} />

          {/* Current Lesson */}
          {currentLesson && (
            <StyledView className="mt-4">
              <StyledText className="text-xl font-semibold text-gray-800">
                Current Lesson: {currentLesson.title}
              </StyledText>
              <StyledText className="text-gray-600">
                {currentLesson.description}
              </StyledText>

              {/* Code Example */}
              {currentLesson.content.map((content) => {
                if (content.type === "code") {
                  return (
                    <CodeExample
                      key={content.id}
                      code={content.code}
                      language={content.language}
                    />
                  );
                }
                return null;
              })}
            </StyledView>
          )}

          {/* Lessons List */}
          <StyledText className="mt-6 text-lg font-semibold text-gray-800">
            Lessons
          </StyledText>
          {challenge.lessons.map((lesson) => {
            const isCompleted = completedLessons.includes(lesson.id);
            const isCurrent = currentLesson?.id === lesson.id;

            return (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                isCompleted={isCompleted}
                isCurrent={isCurrent}
                onPress={() => handleLessonSelect(lesson)}
              />
            );
          })}

          {/* Complete Challenge Button */}
          <StyledTouchableOpacity
            onPress={handleLessonComplete}
            className="bg-emerald-500 rounded-lg py-2 mt-4"
          >
            <StyledText className="text-white text-center font-semibold">
              Complete Lesson
            </StyledText>
          </StyledTouchableOpacity>
        </StyledView>
      </StyledScrollView>
    </StyledView>
  );
}
