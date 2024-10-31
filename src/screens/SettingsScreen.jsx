import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Switch,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { styled } from "nativewind";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { supabase } from "../services/supabaseClient";
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);
const StyledTextInput = styled(TextInput);
import { useUser } from "../services/userContext";
export default function SettingsScreen({ navigation }) {
  const [pushNotificationsEnabled, setPushNotificationsEnabled] =
    useState(false);
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] =
    useState(false);
  const [changePasswordModalVisible, setChangePasswordModalVisible] =
    useState(false);
  const [manageDevicesModalVisible, setManageDevicesModalVisible] =
    useState(false);
  const [userPreferencesModalVisible, setUserPreferencesModalVisible] =
    useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [selectedTheme, setSelectedTheme] = useState("Light");
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "All fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New password and confirmation do not match.");
      return;
    }
    // TODO: Add password change logic here
    Alert.alert("Success", "Password changed successfully.");
    setChangePasswordModalVisible(false);
  };

  const handleRemoveDevice = (device) => {
    // TODO: Add logic to remove the device
    Alert.alert("Success", `${device} has been removed.`);
  };
  const { setUser } = useUser();
  const logOut = async () => {
    let { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
      return;
    }
    setUser(null);
    navigation.navigate("Login");
  };
  return (
    <StyledView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />

      {/* Header */}
      <StyledView className="bg-white pt-12 pb-4 px-6 shadow-sm flex-row items-center">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <MaterialIcons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <StyledText className="text-2xl font-bold text-gray-800">
          Settings
        </StyledText>
      </StyledView>

      <StyledScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* User Preferences */}
        <StyledView className="mx-6 bg-white rounded-2xl p-4 shadow-sm mb-4">
          <StyledText className="text-lg font-semibold text-gray-800">
            User Preferences
          </StyledText>
          <StyledTouchableOpacity
            onPress={() => setUserPreferencesModalVisible(true)}
            className="flex-row justify-between items-center border-b border-gray-200 py-3"
          >
            <StyledText className="text-gray-800">Preferences</StyledText>
            <MaterialIcons name="chevron-right" size={20} color="#9CA3AF" />
          </StyledTouchableOpacity>
          <StyledTouchableOpacity className="flex-row justify-between items-center border-b border-gray-200 py-3">
            <StyledText className="text-gray-800">Language</StyledText>
            <StyledText className="text-gray-600">
              {selectedLanguage}
            </StyledText>
          </StyledTouchableOpacity>
        </StyledView>

        {/* Account Settings */}
        <StyledView className="mx-6 bg-white rounded-2xl p-4 shadow-sm mb-4">
          <StyledText className="text-lg font-semibold text-gray-800">
            Account Settings
          </StyledText>
          <StyledTouchableOpacity
            onPress={() => setChangePasswordModalVisible(true)}
            className="flex-row justify-between items-center border-b border-gray-200 py-3"
          >
            <StyledText className="text-gray-800">Change Password</StyledText>
            <MaterialIcons name="chevron-right" size={20} color="#9CA3AF" />
          </StyledTouchableOpacity>
          <StyledTouchableOpacity
            onPress={() => setManageDevicesModalVisible(true)}
            className="flex-row justify-between items-center border-b border-gray-200 py-3"
          >
            <StyledText className="text-gray-800">Manage Devices</StyledText>
            <MaterialIcons name="chevron-right" size={20} color="#9CA3AF" />
          </StyledTouchableOpacity>
        </StyledView>

        {/* Notifications */}
        <StyledView className="mx-6 bg-white rounded-2xl p-4 shadow-sm mb-4">
          <StyledText className="text-lg font-semibold text-gray-800">
            Notifications
          </StyledText>
          <StyledView className="flex-row justify-between items-center border-b border-gray-200 py-3">
            <StyledText className="text-gray-800">
              Push Notifications
            </StyledText>
            <Switch
              value={pushNotificationsEnabled}
              onValueChange={setPushNotificationsEnabled}
              thumbColor={pushNotificationsEnabled ? "#059669" : "#f4f3f4"}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
            />
          </StyledView>
          <StyledView className="flex-row justify-between items-center border-b border-gray-200 py-3">
            <StyledText className="text-gray-800">
              Email Notifications
            </StyledText>
            <Switch
              value={emailNotificationsEnabled}
              onValueChange={setEmailNotificationsEnabled}
              thumbColor={emailNotificationsEnabled ? "#059669" : "#f4f3f4"}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
            />
          </StyledView>
        </StyledView>

        {/* Logout Button */}
        <StyledView className="mx-6 mt-6">
          <StyledTouchableOpacity
            onPress={logOut}
            className="bg-red-500 p-4 rounded-xl shadow-sm"
          >
            <StyledText className="text-white text-center font-semibold">
              Logout
            </StyledText>
          </StyledTouchableOpacity>
        </StyledView>
      </StyledScrollView>

      {/* Change Password Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={changePasswordModalVisible}
        onRequestClose={() => setChangePasswordModalVisible(false)}
      >
        <StyledView className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <StyledView className="bg-white rounded-lg p-6 w-11/12">
            <StyledText className="text-lg font-semibold mb-4">
              Change Password
            </StyledText>
            <StyledTextInput
              placeholder="Current Password"
              secureTextEntry
              className="border border-gray-300 rounded-md p-2 mb-4"
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
            <StyledTextInput
              placeholder="New Password"
              secureTextEntry
              className="border border-gray-300 rounded-md p-2 mb-4"
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <StyledTextInput
              placeholder="Confirm New Password"
              secureTextEntry
              className="border border-gray-300 rounded-md p-2 mb-4"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <StyledTouchableOpacity
              onPress={handleChangePassword}
              className="bg-blue-500 p-4 rounded-md"
            >
              <StyledText className="text-white text-center font-semibold">
                Change Password
              </StyledText>
            </StyledTouchableOpacity>
            <StyledTouchableOpacity
              onPress={() => setChangePasswordModalVisible(false)}
              className="mt-2"
            >
              <StyledText className="text-blue-500 text-center">
                Cancel
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>
        </StyledView>
      </Modal>

      {/* Manage Devices Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={manageDevicesModalVisible}
        onRequestClose={() => setManageDevicesModalVisible(false)}
      >
        <StyledView className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <StyledView className="bg-white rounded-lg p-6 w-11/12">
            <StyledText className="text-lg font-semibold mb-4">
              Manage Devices
            </StyledText>
            {/* Example Devices List */}
            {["Device 1", "Device 2", "Device 3"].map((device, index) => (
              <StyledView
                key={index}
                className="flex-row justify-between items-center border-b border-gray-200 py-3"
              >
                <StyledText className="text-gray-800">{device}</StyledText>
                <StyledTouchableOpacity
                  onPress={() => handleRemoveDevice(device)}
                >
                  <StyledText className="text-red-500">Remove</StyledText>
                </StyledTouchableOpacity>
              </StyledView>
            ))}
            <StyledTouchableOpacity
              onPress={() => setManageDevicesModalVisible(false)}
              className="mt-4 bg-blue-500 p-4 rounded-md"
            >
              <StyledText className="text-white text-center font-semibold">
                Close
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>
        </StyledView>
      </Modal>

      {/* User Preferences Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={userPreferencesModalVisible}
        onRequestClose={() => setUserPreferencesModalVisible(false)}
      >
        <StyledView className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <StyledView className="bg-white rounded-lg p-6 w-11/12">
            <StyledText className="text-lg font-semibold mb-4">
              User Preferences
            </StyledText>

            <StyledText className="text-gray-800">Select Theme:</StyledText>
            <StyledView className="flex-row justify-between mb-4">
              <StyledTouchableOpacity
                onPress={() => setSelectedTheme("Light")}
                className={`p-2 rounded-md ${
                  selectedTheme === "Light" ? "bg-blue-500" : "bg-gray-200"
                }`}
              >
                <StyledText className="text-gray-800">Light</StyledText>
              </StyledTouchableOpacity>
              <StyledTouchableOpacity
                onPress={() => setSelectedTheme("Dark")}
                className={`p-2 rounded-md ${
                  selectedTheme === "Dark" ? "bg-blue-500" : "bg-gray-200"
                }`}
              >
                <StyledText className="text-gray-800">Dark</StyledText>
              </StyledTouchableOpacity>
            </StyledView>

            <StyledText className="text-gray-800">Select Language:</StyledText>
            <StyledView className="flex-row justify-between mb-4">
              <StyledTouchableOpacity
                onPress={() => setSelectedLanguage("English")}
                className={`p-2 rounded-md ${
                  selectedLanguage === "English" ? "bg-blue-500" : "bg-gray-200"
                }`}
              >
                <StyledText className="text-gray-800">English</StyledText>
              </StyledTouchableOpacity>
              <StyledTouchableOpacity
                onPress={() => setSelectedLanguage("Spanish")}
                className={`p-2 rounded-md ${
                  selectedLanguage === "Spanish" ? "bg-blue-500" : "bg-gray-200"
                }`}
              >
                <StyledText className="text-gray-800">Spanish</StyledText>
              </StyledTouchableOpacity>
            </StyledView>

            <StyledTouchableOpacity
              onPress={() => setUserPreferencesModalVisible(false)}
              className="mt-4 bg-blue-500 p-4 rounded-md"
            >
              <StyledText className="text-white text-center font-semibold">
                Save Preferences
              </StyledText>
            </StyledTouchableOpacity>
            <StyledTouchableOpacity
              onPress={() => setUserPreferencesModalVisible(false)}
              className="mt-2"
            >
              <StyledText className="text-blue-500 text-center">
                Cancel
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>
        </StyledView>
      </Modal>
    </StyledView>
  );
}
