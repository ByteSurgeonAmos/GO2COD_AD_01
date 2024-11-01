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
import {
  MaterialIcons,
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { supabase } from "../services/supabaseClient";
import { useUser } from "../services/userContext";
import { useState, useEffect } from "react";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);

const ChallengeCard = ({ title, level, progress, color }) => (
  <StyledTouchableOpacity
    className={`${color} p-4 rounded-2xl flex-1 mx-2 min-w-[160px]`}
  >
    <StyledView className="flex-row justify-between items-start">
      <MaterialCommunityIcons name="code-brackets" size={24} color="white" />
      <StyledView className="bg-white/30 rounded-full px-2 py-1">
        <StyledText className="text-white text-xs">{level}</StyledText>
      </StyledView>
    </StyledView>
    <StyledText className="text-white font-semibold mt-2">{title}</StyledText>
    <StyledView className="mt-2">
      <StyledView className="w-full h-1 bg-white/30 rounded-full">
        <StyledView
          className="h-1 bg-white rounded-full"
          style={{ width: `${progress}%` }}
        />
      </StyledView>
      <StyledText className="text-white/90 text-xs mt-1">
        {progress}% Complete
      </StyledText>
    </StyledView>
  </StyledTouchableOpacity>
);

export default function DashboardScreen({ navigation }) {
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState(null);
  const [activeChallenges, setActiveChallenges] = useState([]);
  const [streak, setStreak] = useState(0);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user) {
      setUser(null);
      navigation.navigate("Login");
      return;
    }

    fetchUserData();
  }, [user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);

      // Fetch user statistics
      const { data: stats, error: statsError } = await supabase
        .from("user_statistics")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (statsError) throw statsError;
      setUserStats(stats);

      // Fetch active challenges
      const { data: challenges, error: challengesError } = await supabase
        .from("user_challenges")
        .select(
          `
          *,
          challenge:challenges(*)
        `
        )
        .eq("user_id", user.id)
        .eq("status", "in_progress")
        .limit(3);

      if (challengesError) throw challengesError;
      setActiveChallenges(challenges);

      // Fetch streak data
      const { data: streakData, error: streakError } = await supabase
        .from("user_streaks")
        .select("current_streak")
        .eq("user_id", user.id)
        .single();

      if (streakError) throw streakError;
      setStreak(streakData.current_streak);

      // Fetch notifications
      const { data: notifs, error: notifsError } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .eq("read", false)
        .order("created_at", { ascending: false });

      if (notifsError) throw notifsError;
      setNotifications(notifs);
    } catch (error) {
      console.error("Error fetching user data:", error);
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
        <StyledView className="flex-row justify-between items-center">
          <StyledView>
            <StyledText className="text-2xl font-bold text-gray-800">
              Dashboard
            </StyledText>
            <StyledText className="text-gray-500">
              Welcome back, {user?.user_metadata.username}
            </StyledText>
          </StyledView>
          <StyledTouchableOpacity className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center">
            {notifications.length > 0 && (
              <StyledView className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full items-center justify-center">
                <StyledText className="text-white text-xs">
                  {notifications.length}
                </StyledText>
              </StyledView>
            )}
            <MaterialIcons
              name="notifications-none"
              size={24}
              color="#374151"
            />
          </StyledTouchableOpacity>
        </StyledView>
      </StyledView>

      <StyledScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Stats Cards */}
        <StyledView className="flex-row px-6 py-4">
          <StyledView className="flex-1 bg-white rounded-2xl p-4 mr-3 shadow-sm">
            <StyledView className="bg-emerald-100 self-start p-2 rounded-lg">
              <MaterialIcons name="assessment" size={20} color="#059669" />
            </StyledView>
            <StyledText className="text-2xl font-bold text-gray-800 mt-2">
              {userStats?.challenges_completed || 0}
            </StyledText>
            <StyledText className="text-gray-500 text-sm">
              Challenges Completed
            </StyledText>
          </StyledView>
          <StyledView className="flex-1 bg-white rounded-2xl p-4 shadow-sm">
            <StyledView className="bg-blue-100 self-start p-2 rounded-lg">
              <MaterialIcons name="emoji-events" size={20} color="#2563EB" />
            </StyledView>
            <StyledText className="text-2xl font-bold text-gray-800 mt-2">
              {userStats?.total_points || 0}
            </StyledText>
            <StyledText className="text-gray-500 text-sm">
              Total Points
            </StyledText>
          </StyledView>
        </StyledView>

        {/* Current Streak */}
        <StyledView className="mx-6 bg-white rounded-2xl p-4 shadow-sm">
          <StyledView className="flex-row justify-between items-center">
            <StyledText className="text-lg font-semibold text-gray-800">
              Current Streak
            </StyledText>
            <StyledView className="bg-orange-100 p-2 rounded-lg">
              <MaterialIcons
                name="local-fire-department"
                size={20}
                color="#EA580C"
              />
            </StyledView>
          </StyledView>
          <StyledView className="flex-row justify-between mt-4">
            {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
              <StyledView key={index} className="items-center">
                <StyledView
                  className={`w-8 h-8 rounded-full items-center justify-center ${
                    index < streak ? "bg-emerald-500" : "bg-gray-200"
                  }`}
                >
                  <MaterialIcons
                    name="check"
                    size={16}
                    color={index < streak ? "white" : "#9CA3AF"}
                  />
                </StyledView>
                <StyledText className="text-gray-600 mt-1">{day}</StyledText>
              </StyledView>
            ))}
          </StyledView>
        </StyledView>

        {/* Active Challenges */}
        <StyledView className="mt-6">
          <StyledView className="px-6 flex-row justify-between items-center">
            <StyledText className="text-lg font-semibold text-gray-800">
              Active Challenges
            </StyledText>
            <StyledTouchableOpacity>
              <StyledText className="text-emerald-600">See All</StyledText>
            </StyledTouchableOpacity>
          </StyledView>

          <StyledScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-4 pl-6"
          >
            {activeChallenges.map((userChallenge) => (
              <ChallengeCard
                key={userChallenge.id}
                title={userChallenge.challenge.title}
                level={userChallenge.challenge.difficulty}
                progress={userChallenge.progress}
                color={`bg-${userChallenge.challenge.category_color}-500`}
              />
            ))}
          </StyledScrollView>
        </StyledView>

        {/* Quick Actions */}
        <StyledView className="mt-6 px-6 pb-6">
          <StyledText className="text-lg font-semibold text-gray-800 mb-4">
            Quick Actions
          </StyledText>
          <StyledView className="flex-row flex-wrap justify-between">
            {[
              {
                icon: "code",
                title: "New Challenge",
                color: "bg-emerald-100",
                iconColor: "#059669",
                onPress: () => navigation.navigate("NewChallenge"),
              },
              {
                icon: "leaderboard",
                title: "Leaderboard",
                color: "bg-blue-100",
                iconColor: "#2563EB",
                onPress: () => navigation.navigate("Leaderboard"),
              },
              {
                icon: "groups",
                title: "Study Groups",
                color: "bg-purple-100",
                iconColor: "#7C3AED",
                onPress: () => navigation.navigate("StudyGroups"),
              },
              {
                icon: "psychology",
                title: "Practice Mode",
                color: "bg-orange-100",
                iconColor: "#EA580C",
                onPress: () => navigation.navigate("Practice"),
              },
            ].map((item, index) => (
              <StyledTouchableOpacity
                key={index}
                onPress={item.onPress}
                className="w-[48%] bg-white p-4 rounded-xl mb-4 shadow-sm"
              >
                <StyledView
                  className={`${item.color} self-start p-2 rounded-lg mb-2`}
                >
                  <MaterialIcons
                    name={item.icon}
                    size={24}
                    color={item.iconColor}
                  />
                </StyledView>
                <StyledText className="text-gray-800 font-medium">
                  {item.title}
                </StyledText>
              </StyledTouchableOpacity>
            ))}
          </StyledView>
        </StyledView>
      </StyledScrollView>

      {/* Bottom Navigation */}
      <StyledView className="bg-white flex-row justify-around py-4 shadow-lg">
        <StyledTouchableOpacity className="items-center">
          <MaterialIcons name="dashboard" size={24} color="#059669" />
          <StyledText className="text-emerald-600 text-xs mt-1">
            Home
          </StyledText>
        </StyledTouchableOpacity>
        <StyledTouchableOpacity
          onPress={() => navigation.navigate("Explore")}
          className="items-center"
        >
          <MaterialIcons name="explore" size={24} color="#9CA3AF" />
          <StyledText className="text-gray-400 text-xs mt-1">
            Explore
          </StyledText>
        </StyledTouchableOpacity>
        <StyledTouchableOpacity
          onPress={() => navigation.navigate("Profile")}
          className="items-center"
        >
          <MaterialIcons name="person" size={24} color="#9CA3AF" />
          <StyledText className="text-gray-400 text-xs mt-1">
            Profile
          </StyledText>
        </StyledTouchableOpacity>
      </StyledView>
    </StyledView>
  );
}
