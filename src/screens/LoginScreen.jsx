import React from "react";
import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { styled } from "nativewind";
import { MaterialIcons } from "@expo/vector-icons";
import { supabase } from "../services/supabaseClient";
import { useUser } from "../services/userContext";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const { user } = useUser();

  React.useEffect(() => {
    if (user) {
      navigation.replace("Dashbaord");
    }
  }, [user]);

  const handleSubmit = async () => {
    setError(null);

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    let { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    setLoading(false);

    if (error) {
      setError(error.message || "Login failed");
    } else {
      navigation.navigate("Dashbaord");
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
        <StyledView className="items-center mt-20 mb-10">
          <StyledView className="w-20 h-20 bg-white rounded-2xl items-center justify-center mb-4">
            <MaterialIcons name="psychology" size={40} color="#047857" />
          </StyledView>
          <StyledText className="text-4xl font-bold text-emerald-600 tracking-wider">
            BrainBash
          </StyledText>
          <StyledText className="text-white/80 mt-2 text-base">
            Train your coding skills
          </StyledText>
        </StyledView>

        {/* Login Form */}
        <StyledView className="flex-1 bg-white rounded-t-3xl px-8 pt-10">
          <StyledText className="text-2xl font-semibold text-gray-800 mb-6">
            Welcome Back
          </StyledText>

          {/* Error Message */}
          {error && (
            <StyledText className="text-red-500 mb-4">{error}</StyledText>
          )}

          {/* Email Input */}
          <StyledView className="mb-4">
            <StyledView className="flex-row items-center border-b-2 border-gray-200 py-2">
              <MaterialIcons name="email" size={20} color="#9CA3AF" />
              <StyledTextInput
                placeholder="Email Address"
                className="flex-1 ml-3 text-base text-gray-700"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </StyledView>
          </StyledView>

          {/* Password Input */}
          <StyledView className="mb-6">
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

          {/* Forgot Password */}
          <StyledTouchableOpacity
            onPress={() => navigation.navigate("Forgot")}
            className="items-end mb-8"
          >
            <StyledText className="text-emerald-600 text-sm">
              Forgot Password?
            </StyledText>
          </StyledTouchableOpacity>

          {/* Login Button */}
          <StyledTouchableOpacity
            onPress={handleSubmit}
            className="bg-emerald-600 py-4 rounded-xl shadow-lg shadow-emerald-300"
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <StyledText className="text-center text-white text-lg font-semibold">
                Sign In
              </StyledText>
            )}
          </StyledTouchableOpacity>

          {/* Divider */}
          <StyledView className="flex-row items-center my-8">
            <StyledView className="flex-1 h-0.5 bg-gray-200" />
            <StyledText className="mx-4 text-gray-500">OR</StyledText>
            <StyledView className="flex-1 h-0.5 bg-gray-200" />
          </StyledView>

          {/* Google Sign In */}
          <StyledTouchableOpacity
            onPress={() => {
              navigation.navigate("Signup");
            }}
            className="flex-row items-center justify-center py-4 bg-gray-50 rounded-xl border border-gray-200"
          >
            <StyledText className="ml-3 text-gray-700 font-medium text-base">
              Create an account
            </StyledText>
          </StyledTouchableOpacity>

          {/* Sign Up Link */}
          <StyledView className="flex-row justify-center mt-8">
            <StyledText className="text-gray-600">
              New to BrainBash?{" "}
            </StyledText>
            <StyledTouchableOpacity>
              <StyledText className="text-emerald-600 font-semibold">
                Create an Account
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>
        </StyledView>
      </StyledView>
    </KeyboardAvoidingView>
  );
}
