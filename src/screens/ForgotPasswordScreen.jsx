import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { styled } from "nativewind";
import { MaterialIcons } from "@expo/vector-icons";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);

export default function ForgotPasswordScreen({ navigation }) {
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
          <StyledText className="text-emerald-600/80 mt-2 text-base">
            Reset your password
          </StyledText>
        </StyledView>

        {/* Forgot Password Form */}
        <StyledView className="flex-1 bg-white rounded-t-3xl px-8 pt-10">
          <StyledText className="text-2xl font-semibold text-gray-800 mb-6">
            Forgot Password?
          </StyledText>

          {/* Email Input */}
          <StyledView className="mb-4">
            <StyledView className="flex-row items-center border-b-2 border-gray-200 py-2">
              <MaterialIcons name="email" size={20} color="#9CA3AF" />
              <StyledTextInput
                placeholder="Email Address"
                className="flex-1 ml-3 text-base text-gray-700"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="none"
              />
            </StyledView>
          </StyledView>

          {/* Submit Button */}
          <StyledTouchableOpacity className="bg-emerald-600 py-4 rounded-xl shadow-lg shadow-emerald-300 mb-8">
            <StyledText className="text-center text-white text-lg font-semibold">
              Send Reset Link
            </StyledText>
          </StyledTouchableOpacity>

          {/* Back to Login Link */}
          <StyledView className="flex-row justify-center mt-8">
            <StyledText className="text-gray-600">
              Remember your password?{" "}
            </StyledText>
            <StyledTouchableOpacity
              onPress={() => navigation.navigate("Login")}
            >
              <StyledText className="text-emerald-600 font-semibold">
                Sign In
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>
        </StyledView>
      </StyledView>
    </KeyboardAvoidingView>
  );
}
