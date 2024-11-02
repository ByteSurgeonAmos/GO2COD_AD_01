import React from "react";
import { StatusBar } from "expo-status-bar";
import { Text, View, TouchableOpacity, ScrollView, Image } from "react-native";
import { styled } from "nativewind";
import { MaterialIcons } from "@expo/vector-icons";
import { supabase } from "../services/supabaseClient";
import { useUser } from "../services/userContext";
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);

const AchievementCard = ({ icon, title, subtitle, color }) => (
  <StyledView className="flex-row items-center bg-white p-4 rounded-xl shadow-sm mb-4">
    <StyledView className={`${color} p-3 rounded-xl`}>
      <MaterialIcons name={icon} size={24} color="white" />
    </StyledView>
    <StyledView className="ml-4 flex-1">
      <StyledText className="text-gray-800 font-semibold">{title}</StyledText>
      <StyledText className="text-gray-500 text-sm">{subtitle}</StyledText>
    </StyledView>
    <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
  </StyledView>
);

const MenuOption = ({ icon, title, subtitle, showBorder = true }) => (
  <StyledTouchableOpacity
    className={`flex-row items-center py-4 ${
      showBorder ? "border-b border-gray-100" : ""
    }`}
  >
    <MaterialIcons name={icon} size={24} color="#374151" />
    <StyledView className="ml-4 flex-1">
      <StyledText className="text-gray-800 font-medium">{title}</StyledText>
      {subtitle && (
        <StyledText className="text-gray-500 text-sm">{subtitle}</StyledText>
      )}
    </StyledView>
    <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
  </StyledTouchableOpacity>
);

export default function ProfileScreen({ navigation }) {
  const { user, setUser } = useUser();
  console.log(user?.user_metadata);
  const [userStats, setUserStats] = React.useState(null);
  const logOut = async () => {
    let { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
      return;
    }
    setUser(null);

    // Perform logout logic here
    navigation.navigate("Login");
  };
  const getStats = async () => {
    const { data: stats, error: statsError } = await supabase
      .from("user_statistics")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (statsError) throw statsError;
    setUserStats(stats);
  };
  React.useEffect(() => {
    getStats();
  }, []);
  console.log(userStats);
  return (
    <StyledView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />

      {/* Header */}
      <StyledView className="bg-white pt-12 pb-4 px-6 shadow-sm">
        <StyledView className="flex-row justify-between items-center">
          <StyledText className="text-2xl font-bold text-gray-800">
            Profile
          </StyledText>
          <StyledTouchableOpacity
            onPress={() => navigation.navigate("Settings")}
            className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
          >
            <MaterialIcons name="settings" size={24} color="#374151" />
          </StyledTouchableOpacity>
        </StyledView>
      </StyledView>

      <StyledScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile Info */}
        <StyledView className="bg-white px-6 py-6">
          <StyledView className="flex-row items-center">
            <StyledView className="w-20 h-20 rounded-full bg-gray-200 items-center justify-center">
              <MaterialIcons name="person" size={40} color="#9CA3AF" />
            </StyledView>
            <StyledView className="ml-4 flex-1">
              <StyledText className="text-xl font-bold text-gray-800">
                {user?.user_metadata.full_name}
              </StyledText>
              <StyledText className="text-gray-500">
                {user?.user_metadata.username}
              </StyledText>
              <StyledView className="flex-row items-center mt-1">
                <StyledText className="text-gray-500 text-sm ml-1">
                  {user?.user_metadata.email}
                </StyledText>
              </StyledView>
            </StyledView>
            <StyledTouchableOpacity className="bg-emerald-500 px-4 py-2 rounded-full">
              <StyledText className="text-white font-medium">Edit</StyledText>
            </StyledTouchableOpacity>
          </StyledView>

          {/* Stats */}
          <StyledView className="flex-row justify-between mt-6 pb-6 border-b border-gray-100">
            <StyledView className="items-center">
              <StyledText className="text-2xl font-bold text-gray-800">
                {userStats?.challenges_completed}
              </StyledText>
              <StyledText className="text-gray-500 text-sm">
                Completed
              </StyledText>
            </StyledView>
            <StyledView className="items-center">
              <StyledText className="text-2xl font-bold text-gray-800">
                {userStats?.total_points}
              </StyledText>
              <StyledText className="text-gray-500 text-sm">Points</StyledText>
            </StyledView>
            <StyledView className="items-center">
              <StyledText className="text-2xl font-bold text-gray-800">
                5
              </StyledText>
              <StyledText className="text-gray-500 text-sm">
                Day Streak
              </StyledText>
            </StyledView>
          </StyledView>
        </StyledView>

        {/* Recent Achievements */}
        <StyledView className="px-6 mt-6">
          <StyledText className="text-lg font-semibold text-gray-800 mb-4">
            Recent Achievements
          </StyledText>

          <AchievementCard
            icon="emoji-events"
            title="JavaScript Master"
            subtitle="Completed all JavaScript challenges"
            color="bg-emerald-500"
          />

          <AchievementCard
            icon="local-fire-department"
            title="5 Day Streak"
            subtitle="Completed challenges for 5 days in a row"
            color="bg-orange-500"
          />

          <AchievementCard
            icon="psychology"
            title="Quick Learner"
            subtitle="Completed 10 challenges in one day"
            color="bg-purple-500"
          />
        </StyledView>

        {/* Menu Options */}
        <StyledView className="px-6 mt-6 bg-white rounded-xl">
          <MenuOption
            icon="folder"
            title="My Courses"
            subtitle="View your enrolled courses"
          />
          <MenuOption
            icon="history"
            title="Learning History"
            subtitle="Track your progress"
          />
          <MenuOption
            icon="favorite"
            title="Saved Challenges"
            subtitle="Access your bookmarked content"
          />
          <MenuOption
            icon="groups"
            title="Study Groups"
            subtitle="Manage your study groups"
          />
          <MenuOption
            icon="help"
            title="Help & Support"
            subtitle="Get assistance"
            showBorder={false}
          />
        </StyledView>

        {/* Logout Button */}
        <StyledView className="px-6 mt-6 mb-8">
          <StyledTouchableOpacity
            onPress={logOut}
            className="bg-gray-100 py-4 rounded-xl"
          >
            <StyledText className="text-red-500 font-medium text-center">
              Log Out
            </StyledText>
          </StyledTouchableOpacity>
        </StyledView>
      </StyledScrollView>

      {/* Bottom Navigation */}
      <StyledView className="bg-white flex-row justify-around py-4 shadow-lg">
        <StyledTouchableOpacity
          onPress={() => navigation.navigate("Dashbaord")}
          className="items-center"
        >
          <MaterialIcons name="dashboard" size={24} color="#9CA3AF" />
          <StyledText className="text-gray-400 text-xs mt-1">Home</StyledText>
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
        <StyledTouchableOpacity className="items-center">
          <MaterialIcons name="person" size={24} color="#059669" />
          <StyledText className="text-emerald-600 text-xs mt-1">
            Profile
          </StyledText>
        </StyledTouchableOpacity>
      </StyledView>
    </StyledView>
  );
}
