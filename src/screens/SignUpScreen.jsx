import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { styled } from "nativewind";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { supabase } from "../services/supabaseClient";
import { useUser } from "../services/userContext";
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);

export default function SignUpScreen({ navigation }) {
  const [fullName, setFullName] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [termsAccepted, setTermsAccepted] = React.useState(false);
  const { user } = useUser();

  React.useEffect(() => {
    if (user) {
      navigation.replace("Dashbaord");
    }
  }, [user]);

  const handleSignUp = async () => {
    setError(null);

    // Basic validation
    if (!fullName || !username || !email || !password || !confirmPassword) {
      setError("Please fill all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!termsAccepted) {
      setError("You must accept the terms and conditions.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          username,
        },
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message || "SignUp failed");
    } else {
      navigation.navigate("Login");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <StyledView className="flex-1 bg-gradient-to-b from-emerald-600 to-emerald-800">
        <StatusBar style="light" />

        {/* Header Section */}
        <StyledView className="items-center mt-12 mb-6">
          <StyledView className="w-16 h-16 bg-white rounded-2xl items-center justify-center mb-3">
            <MaterialIcons name="psychology" size={32} color="#047857" />
          </StyledView>
          <StyledText className="text-3xl font-bold text-emerald-600 tracking-wider">
            Join BrainBash
          </StyledText>
          <StyledText className="text-emerald-600/80 mt-1 text-sm">
            Start your coding journey today
          </StyledText>
        </StyledView>

        {/* Sign Up Form */}
        <StyledView className="flex-1 bg-white rounded-t-3xl px-8 pt-8">
          <StyledScrollView showsVerticalScrollIndicator={false}>
            {/* Error Message */}
            {error && (
              <StyledText className="text-red-500 mb-4">{error}</StyledText>
            )}

            {/* Full Name Input */}
            <StyledView className="mb-4">
              <StyledView className="flex-row items-center border-b-2 border-gray-200 py-2">
                <Ionicons name="person-outline" size={20} color="#9CA3AF" />
                <StyledTextInput
                  placeholder="Full Name"
                  className="flex-1 ml-3 text-base text-gray-700"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="words"
                  value={fullName}
                  onChangeText={setFullName}
                />
              </StyledView>
            </StyledView>

            {/* Username Input */}
            <StyledView className="mb-4">
              <StyledView className="flex-row items-center border-b-2 border-gray-200 py-2">
                <MaterialIcons
                  name="alternate-email"
                  size={20}
                  color="#9CA3AF"
                />
                <StyledTextInput
                  placeholder="Username"
                  className="flex-1 ml-3 text-base text-gray-700"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="none"
                  value={username}
                  onChangeText={setUsername}
                />
              </StyledView>
            </StyledView>

            {/* Email Input */}
            <StyledView className="mb-4">
              <StyledView className="flex-row items-center border-b-2 border-gray-200 py-2">
                <MaterialIcons name="email" size={20} color="#9CA3AF" />
                <StyledTextInput
                  placeholder="Email Address"
                  className="flex-1 ml-3 text-base text-gray-700"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                />
              </StyledView>
            </StyledView>

            {/* Password Input */}
            <StyledView className="mb-4">
              <StyledView className="flex-row items-center border-b-2 border-gray-200 py-2">
                <MaterialIcons name="lock" size={20} color="#9CA3AF" />
                <StyledTextInput
                  secureTextEntry
                  placeholder="Password"
                  className="flex-1 ml-3 text-base text-gray-700"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={setPassword}
                />
              </StyledView>
            </StyledView>

            {/* Confirm Password Input */}
            <StyledView className="mb-6">
              <StyledView className="flex-row items-center border-b-2 border-gray-200 py-2">
                <MaterialIcons name="lock-outline" size={20} color="#9CA3AF" />
                <StyledTextInput
                  secureTextEntry
                  placeholder="Confirm Password"
                  className="flex-1 ml-3 text-base text-gray-700"
                  placeholderTextColor="#9CA3AF"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              </StyledView>
            </StyledView>

            {/* Terms and Conditions */}
            <StyledView className="flex-row items-center mb-6">
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color={termsAccepted ? "#047857" : "#9CA3AF"}
                onPress={() => setTermsAccepted(!termsAccepted)}
              />
              <StyledTouchableOpacity
                onPress={() => setTermsAccepted(!termsAccepted)}
                className="ml-2"
              >
                <StyledText className="text-gray-600 text-sm flex-1">
                  I agree to the{" "}
                  <StyledText className="text-emerald-600">
                    Terms of Service
                  </StyledText>{" "}
                  and{" "}
                  <StyledText className="text-emerald-600">
                    Privacy Policy
                  </StyledText>
                </StyledText>
              </StyledTouchableOpacity>
            </StyledView>

            {/* Sign Up Button */}
            <StyledTouchableOpacity
              onPress={handleSignUp}
              className="bg-emerald-600 py-4 rounded-xl shadow-lg shadow-emerald-300 mb-4"
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <StyledText className="text-center text-white text-lg font-semibold">
                  Create Account
                </StyledText>
              )}
            </StyledTouchableOpacity>

            {/* Login Link */}
            <StyledView className="flex-row justify-center mb-8">
              <StyledText className="text-gray-600">
                Already have an account?{" "}
              </StyledText>
              <StyledTouchableOpacity
                onPress={() => navigation.navigate("Login")}
              >
                <StyledText className="text-emerald-600 font-semibold">
                  Sign In
                </StyledText>
              </StyledTouchableOpacity>
            </StyledView>
          </StyledScrollView>
        </StyledView>
      </StyledView>
    </KeyboardAvoidingView>
  );
}
