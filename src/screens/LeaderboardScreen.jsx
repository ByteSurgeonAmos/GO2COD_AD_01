import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
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

const LeaderboardItem = ({ rank, username, points, isCurrentUser }) => (
  <StyledView
    className={`flex-row items-center p-4 ${
      isCurrentUser ? "bg-emerald-50" : "bg-white"
    } mb-2 rounded-xl shadow-sm`}
  >
    <StyledView className="w-8">
      {rank <= 3 ? (
        <MaterialIcons
          name="emoji-events"
          size={24}
          color={
            rank === 1
              ? "#FCD34D"
              : rank === 2
              ? "#94A3B8"
              : rank === 3
              ? "#B45309"
              : "#374151"
          }
        />
      ) : (
        <StyledText className="text-gray-600 text-lg font-semibold">
          {rank}
        </StyledText>
      )}
    </StyledView>

    <StyledView className="flex-1 ml-4">
      <StyledText
        className={`font-semibold ${
          isCurrentUser ? "text-emerald-700" : "text-gray-800"
        }`}
      >
        {username}
        {isCurrentUser && " (You)"}
      </StyledText>
    </StyledView>

    <StyledView className="flex-row items-center">
      <MaterialIcons name="stars" size={16} color="#EA580C" />
      <StyledText className="ml-1 font-semibold text-gray-700">
        {points.toLocaleString()}
      </StyledText>
    </StyledView>
  </StyledView>
);

const TimeFilterButton = ({ title, isActive, onPress }) => (
  <StyledTouchableOpacity
    onPress={onPress}
    className={`px-4 py-2 rounded-full mr-2 ${
      isActive ? "bg-emerald-500" : "bg-gray-100"
    }`}
  >
    <StyledText
      className={isActive ? "text-white font-medium" : "text-gray-600"}
    >
      {title}
    </StyledText>
  </StyledTouchableOpacity>
);

export default function LeaderboardScreen({ navigation }) {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [timeFilter, setTimeFilter] = useState("weekly"); // weekly, monthly, allTime
  const [userRank, setUserRank] = useState(null);

  useEffect(() => {
    fetchLeaderboardData();
  }, [timeFilter]);

  const fetchLeaderboardData = async () => {
    try {
      setLoading(true);

      // Fetch leaderboard data from user_statistics
      const { data: statisticsData, error: statisticsError } = await supabase
        .from("user_statistics")
        .select("id, user_id, total_points")
        .order("total_points", { ascending: false })
        .limit(100);

      if (statisticsError) throw statisticsError;

      // Retrieve usernames using user_id from auth.users metadata
      const leaderboardData = await Promise.all(
        statisticsData.map(async (stat) => {
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("email")
            .eq("id", stat.user_id)
            .single();

          if (userError) throw userError;

          return {
            rank: stat.rank,
            userId: stat.user_id,
            username: userData.email || "Unknown",
            points: stat.total_points,
          };
        })
      );
      console.log(leaderboardData);
      setLeaderboardData(leaderboardData);

      // Find and set current user’s rank
      const userRankData = leaderboardData.find(
        (item) => item.userId === user.id
      );
      setUserRank(userRankData?.rank || null);
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
    } finally {
      setLoading(false);
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
        <StyledView className="flex-row items-center">
          <StyledTouchableOpacity
            onPress={() => navigation.goBack()}
            className="mr-4"
          >
            <MaterialIcons name="arrow-back" size={24} color="#374151" />
          </StyledTouchableOpacity>
          <StyledText className="text-2xl font-bold text-gray-800">
            Leaderboard
          </StyledText>
        </StyledView>
      </StyledView>

      {/* Time Filter */}
      <StyledScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-6 py-4"
      >
        <TimeFilterButton
          title="This Week"
          isActive={timeFilter === "weekly"}
          onPress={() => setTimeFilter("weekly")}
        />
        <TimeFilterButton
          title="This Month"
          isActive={timeFilter === "monthly"}
          onPress={() => setTimeFilter("monthly")}
        />
        <TimeFilterButton
          title="All Time"
          isActive={timeFilter === "allTime"}
          onPress={() => setTimeFilter("allTime")}
        />
      </StyledScrollView>

      {/* User's Current Rank */}
      {userRank && (
        <StyledView className="px-6 mb-4">
          <StyledView className="bg-emerald-100 p-4 rounded-xl">
            <StyledText className="text-emerald-800 font-medium text-center">
              Your Current Rank: #{userRank}
            </StyledText>
          </StyledView>
        </StyledView>
      )}

      {/* Leaderboard List */}
      <StyledScrollView className="flex-1 px-6">
        {leaderboardData.map((item) => (
          <LeaderboardItem
            key={item.userId}
            rank={item.rank}
            username={item.username}
            points={item.points}
            isCurrentUser={item.userId === user.id}
          />
        ))}
      </StyledScrollView>
    </StyledView>
  );
}
