import "./global.css";
import "tailwindcss/tailwind.css";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ThemeProvider } from "./src/theme/ThemeProvider";
import HomeScreen from "./src/screens/HomeScreen";
import LoginScreen from "./src/screens/LoginScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import ExploreScreen from "./src/screens/ExploreScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import ForgotPasswordScreen from "./src/screens/ForgotPasswordScreen";
import { UserProvider } from "./src/services/userContext";
import NewChallengeScreen from "./src/screens/NewChallengeScreen";
import ChallengeDetailsScreen from "./src/screens/ChallengeScreen";
import QuizScreen from "./src/screens/QuizScreen";
import LeaderboardScreen from "./src/screens/LeaderboardScreen";
import StudyGroupsScreen from "./src/screens/StudygroupsScreen";
import PracticeModeScreen from "./src/screens/PracticeModeScreen";

export default function App() {
  const Stack = createStackNavigator();

  return (
    <UserProvider>
      <ThemeProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignUpScreen} />
            <Stack.Screen name="Dashbaord" component={DashboardScreen} />
            <Stack.Screen name="Explore" component={ExploreScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Forgot" component={ForgotPasswordScreen} />
            <Stack.Screen name="NewChallenge" component={NewChallengeScreen} />
            <Stack.Screen
              name="ChallengeDetails"
              component={ChallengeDetailsScreen}
            />
            <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
            <Stack.Screen name="Practice" component={PracticeModeScreen} />
            <Stack.Screen name="StudyGroups" component={StudyGroupsScreen} />
            <Stack.Screen name="Quiz" component={QuizScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </UserProvider>
  );
}
