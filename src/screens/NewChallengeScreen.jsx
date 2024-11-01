import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
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

const DifficultyButton = ({ level, selected, onSelect }) => (
  <StyledTouchableOpacity
    onPress={() => onSelect(level)}
    className={`px-4 py-2 rounded-full mr-3 ${
      selected ? "bg-emerald-500" : "bg-gray-100"
    }`}
  >
    <StyledText
      className={`font-medium ${selected ? "text-white" : "text-gray-600"}`}
    >
      {level}
    </StyledText>
  </StyledTouchableOpacity>
);

const ChallengeCard = ({ challenge, onSelect, selected }) => (
  <StyledTouchableOpacity
    onPress={() => onSelect(challenge)}
    className={`p-4 rounded-xl mb-4 ${
      selected ? "bg-emerald-50 border-2 border-emerald-500" : "bg-white"
    }`}
  >
    <StyledView className="flex-row justify-between items-start">
      <StyledView className="flex-1">
        <StyledText className="text-lg font-semibold text-gray-800">
          {challenge.title}
        </StyledText>
        <StyledText className="text-gray-500 mt-1">
          {challenge.description}
        </StyledText>
        <StyledView className="flex-row mt-2">
          <StyledView className="bg-gray-100 rounded-full px-3 py-1 mr-2">
            <StyledText className="text-gray-600 text-sm">
              {challenge.points} Points
            </StyledText>
          </StyledView>
          <StyledView className="bg-gray-100 rounded-full px-3 py-1">
            <StyledText className="text-gray-600 text-sm">
              {challenge.estimated_time} mins
            </StyledText>
          </StyledView>
        </StyledView>
      </StyledView>
      <MaterialIcons
        name={selected ? "check-circle" : "arrow-forward-ios"}
        size={24}
        color={selected ? "#059669" : "#9CA3AF"}
      />
    </StyledView>
  </StyledTouchableOpacity>
);

export default function NewChallengeScreen({ navigation }) {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [challenges, setChallenges] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState("Beginner");
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [startingChallenge, setStartingChallenge] = useState(false);

  useEffect(() => {
    fetchChallenges();
  }, [selectedDifficulty]);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("challenges")
        .select("*")
        .eq("difficulty", selectedDifficulty)
        .order("created_at", { ascending: false });
      console.log(data);
      if (error) throw error;
      setChallenges(data);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch challenges");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const startChallenge = async () => {
    if (!selectedChallenge) return;

    try {
      setStartingChallenge(true);

      // Create new user challenge regardless of existing challenge status
      const { error: createError } = await supabase
        .from("user_challenges")
        .insert({
          user_id: user.id,
          challenge_id: selectedChallenge.id,
          status: "in_progress", // Or however you want to represent the status
          progress: 0,
          started_at: new Date().toISOString(),
        });

      if (createError) throw createError;

      navigation.navigate("ChallengeDetails", {
        challengeId: selectedChallenge.id,
      });
    } catch (error) {
      Alert.alert("Error", "Failed to start challenge");
      console.error("Error:", error);
    } finally {
      setStartingChallenge(false);
    }
  };

  return (
    <StyledView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />

      {/* Header */}
      <StyledView className="bg-white pt-12 pb-4 px-6 shadow-sm">
        <StyledView className="flex-row items-center">
          <StyledTouchableOpacity
            onPress={() => navigation.goBack()}
            className="mr-4"
          >
            <MaterialIcons name="arrow-back" size={24} color="#374151" />
          </StyledTouchableOpacity>
          <StyledText className="text-2xl font-bold text-gray-800">
            New Challenge
          </StyledText>
        </StyledView>
      </StyledView>

      <StyledScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Difficulty Selection */}
        <StyledView className="px-6 py-4">
          <StyledText className="text-lg font-semibold text-gray-800 mb-3">
            Select Difficulty
          </StyledText>
          <StyledScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row"
          >
            {["Beginner", "Intermediate", "Advanced"].map((level) => (
              <DifficultyButton
                key={level}
                level={level}
                selected={selectedDifficulty === level}
                onSelect={setSelectedDifficulty}
              />
            ))}
          </StyledScrollView>
        </StyledView>

        {/* Challenge List */}
        <StyledView className="px-6 pb-6">
          <StyledText className="text-lg font-semibold text-gray-800 mb-4">
            Available Challenges
          </StyledText>

          {loading ? (
            <StyledView className="items-center justify-center py-8">
              <ActivityIndicator size="large" color="#059669" />
            </StyledView>
          ) : challenges.length === 0 ? (
            <StyledView className="items-center justify-center py-8">
              <StyledText className="text-gray-500 text-center">
                No challenges available for this difficulty level.
              </StyledText>
            </StyledView>
          ) : (
            challenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                selected={selectedChallenge?.id === challenge.id}
                onSelect={setSelectedChallenge}
              />
            ))
          )}
        </StyledView>
      </StyledScrollView>

      {/* Bottom Action Button */}
      {selectedChallenge && (
        <StyledView className="p-6 bg-white shadow-lg">
          <StyledTouchableOpacity
            onPress={startChallenge}
            disabled={startingChallenge}
            className="bg-emerald-500 py-4 rounded-xl items-center"
          >
            {startingChallenge ? (
              <ActivityIndicator color="white" />
            ) : (
              <StyledText className="text-white font-semibold text-lg">
                Start Challenge
              </StyledText>
            )}
          </StyledTouchableOpacity>
        </StyledView>
      )}
    </StyledView>
  );
}
