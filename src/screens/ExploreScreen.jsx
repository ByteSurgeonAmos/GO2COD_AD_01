import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { styled } from "nativewind";
import { MaterialIcons } from "@expo/vector-icons";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);
const StyledTextInput = styled(TextInput);

const CategoryCard = ({ title, count, icon, color }) => (
  <StyledTouchableOpacity className="bg-white rounded-2xl p-4 shadow-sm flex-1 mx-2 min-w-[160px]">
    <StyledView className={`${color} self-start p-2 rounded-lg`}>
      <MaterialIcons name={icon} size={24} color="white" />
    </StyledView>
    <StyledText className="text-gray-800 font-semibold mt-2">
      {title}
    </StyledText>
    <StyledText className="text-gray-500 text-sm">
      {count} Challenges
    </StyledText>
  </StyledTouchableOpacity>
);

const CourseCard = ({ title, level, duration, enrolled, image, color }) => (
  <StyledTouchableOpacity className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
    <StyledView className="flex-row">
      <StyledView
        className={`${color} w-16 h-16 rounded-xl items-center justify-center`}
      >
        <MaterialIcons name={image} size={32} color="white" />
      </StyledView>
      <StyledView className="flex-1 ml-4">
        <StyledView className="flex-row justify-between items-start">
          <StyledText className="text-gray-800 font-semibold flex-1">
            {title}
          </StyledText>
          <StyledView className="bg-gray-100 rounded-full px-2 py-1">
            <StyledText className="text-gray-600 text-xs">{level}</StyledText>
          </StyledView>
        </StyledView>
        <StyledView className="flex-row items-center mt-2">
          <MaterialIcons name="schedule" size={16} color="#9CA3AF" />
          <StyledText className="text-gray-500 text-sm ml-1">
            {duration}
          </StyledText>
          <StyledView className="w-1 h-1 bg-gray-300 rounded-full mx-2" />
          <MaterialIcons name="people" size={16} color="#9CA3AF" />
          <StyledText className="text-gray-500 text-sm ml-1">
            {enrolled} enrolled
          </StyledText>
        </StyledView>
      </StyledView>
    </StyledView>
  </StyledTouchableOpacity>
);

export default function ExploreScreen({ navigation }) {
  return (
    <StyledView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />

      {/* Header */}
      <StyledView className="bg-white pt-12 pb-4 px-6 shadow-sm">
        <StyledView className="flex-row justify-between items-center">
          <StyledText className="text-2xl font-bold text-gray-800">
            Explore
          </StyledText>
          <StyledTouchableOpacity className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center">
            <MaterialIcons name="search" size={24} color="#374151" />
          </StyledTouchableOpacity>
        </StyledView>
      </StyledView>

      <StyledScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Categories */}
        <StyledView className="mt-6">
          <StyledView className="px-6 flex-row justify-between items-center">
            <StyledText className="text-lg font-semibold text-gray-800">
              Categories
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
            <CategoryCard
              title="Frontend"
              count={42}
              icon="computer"
              color="bg-emerald-500"
            />
            <CategoryCard
              title="Backend"
              count={35}
              icon="dns"
              color="bg-blue-500"
            />
            <CategoryCard
              title="Mobile"
              count={28}
              icon="phone-android"
              color="bg-purple-500"
            />
          </StyledScrollView>
        </StyledView>

        {/* Popular Courses */}
        <StyledView className="mt-6 px-6">
          <StyledText className="text-lg font-semibold text-gray-800 mb-4">
            Popular Courses
          </StyledText>

          <CourseCard
            title="Master React Native"
            level="Intermediate"
            duration="8 weeks"
            enrolled="2.4k"
            image="phone-android"
            color="bg-emerald-500"
          />

          <CourseCard
            title="Node.js Fundamentals"
            level="Beginner"
            duration="6 weeks"
            enrolled="1.8k"
            image="dns"
            color="bg-blue-500"
          />

          <CourseCard
            title="Advanced JavaScript"
            level="Advanced"
            duration="10 weeks"
            enrolled="3.2k"
            image="code"
            color="bg-purple-500"
          />
        </StyledView>
      </StyledScrollView>

      {/* Bottom Navigation */}
      <StyledView className="bg-white flex-row justify-around py-4 shadow-lg">
        <StyledTouchableOpacity
          className="items-center"
          onPress={() => {
            navigation.navigate("Dashbaord");
          }}
        >
          <MaterialIcons name="dashboard" size={24} color="#9CA3AF" />
          <StyledText className="text-gray-400 text-xs mt-1">Home</StyledText>
        </StyledTouchableOpacity>
        <StyledTouchableOpacity className="items-center">
          <MaterialIcons name="explore" size={24} color="#059669" />
          <StyledText className="text-emerald-600 text-xs mt-1">
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
