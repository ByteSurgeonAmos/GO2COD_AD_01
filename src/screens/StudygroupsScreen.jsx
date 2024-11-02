import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Modal,
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
const StyledTextInput = styled(TextInput);

const StudyGroupCard = ({ group, onJoin, isMember }) => (
  <StyledView className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden">
    {/* Header with group image/color banner */}
    <StyledView
      className={`h-20 ${
        group.category === "JavaScript"
          ? "bg-yellow-500"
          : group.category === "Python"
          ? "bg-blue-500"
          : group.category === "Java"
          ? "bg-orange-500"
          : "bg-emerald-500"
      } p-4`}
    >
      <StyledView className="flex-row justify-between items-start">
        <StyledView className="bg-white/20 rounded-lg px-3 py-1">
          <StyledText className="text-white text-xs">
            {group.category}
          </StyledText>
        </StyledView>
        <StyledView className="flex-row items-center">
          <MaterialIcons name="group" size={16} color="white" />
          <StyledText className="text-white text-xs ml-1">
            {group.member_count}/{group.max_members}
          </StyledText>
        </StyledView>
      </StyledView>
    </StyledView>

    {/* Group Content */}
    <StyledView className="p-4">
      <StyledText className="text-lg font-semibold text-gray-800">
        {group.name}
      </StyledText>
      <StyledText className="text-gray-600 text-sm mt-1">
        {group.description}
      </StyledText>

      {/* Tags */}
      <StyledView className="flex-row flex-wrap mt-3">
        {group.tags?.map((tag, index) => (
          <StyledView
            key={index}
            className="bg-gray-100 rounded-full px-3 py-1 mr-2 mb-2"
          >
            <StyledText className="text-gray-600 text-xs">{tag}</StyledText>
          </StyledView>
        ))}
      </StyledView>

      {/* Upcoming Session */}
      {group.next_session && (
        <StyledView className="flex-row items-center mt-3 bg-gray-50 p-3 rounded-lg">
          <MaterialIcons name="event" size={20} color="#059669" />
          <StyledView className="ml-2">
            <StyledText className="text-sm font-medium text-gray-800">
              Next Session
            </StyledText>
            <StyledText className="text-xs text-gray-600">
              {new Date(group.next_session).toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </StyledText>
          </StyledView>
        </StyledView>
      )}

      {/* Action Button */}
      <StyledTouchableOpacity
        onPress={() => onJoin(group.id)}
        className={`mt-4 p-3 rounded-lg ${
          isMember
            ? "bg-gray-100"
            : group.member_count >= group.max_members
            ? "bg-gray-100"
            : "bg-emerald-500"
        }`}
      >
        <StyledText
          className={`text-center font-medium ${
            isMember
              ? "text-gray-600"
              : group.member_count >= group.max_members
              ? "text-gray-600"
              : "text-white"
          }`}
        >
          {isMember
            ? "Already Joined"
            : group.member_count >= group.max_members
            ? "Group Full"
            : "Join Group"}
        </StyledText>
      </StyledTouchableOpacity>
    </StyledView>
  </StyledView>
);

const CreateGroupModal = ({ visible, onClose, onCreateGroup }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("JavaScript");
  const [maxMembers, setMaxMembers] = useState("10");

  const handleCreate = () => {
    onCreateGroup({
      name,
      description,
      category,
      maxMembers: parseInt(maxMembers),
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <StyledView className="flex-1 bg-black/50 justify-end">
        <StyledView className="bg-white rounded-t-3xl p-6">
          <StyledView className="flex-row justify-between items-center mb-6">
            <StyledText className="text-xl font-bold text-gray-800">
              Create Study Group
            </StyledText>
            <StyledTouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color="#374151" />
            </StyledTouchableOpacity>
          </StyledView>

          <StyledTextInput
            className="bg-gray-100 rounded-lg p-3 mb-4"
            placeholder="Group Name"
            value={name}
            onChangeText={setName}
          />

          <StyledTextInput
            className="bg-gray-100 rounded-lg p-3 mb-4"
            placeholder="Description"
            multiline
            numberOfLines={3}
            value={description}
            onChangeText={setDescription}
          />

          <StyledView className="flex-row mb-4">
            <StyledTouchableOpacity
              onPress={() => setCategory("JavaScript")}
              className={`flex-1 p-3 rounded-lg mr-2 ${
                category === "JavaScript" ? "bg-yellow-500" : "bg-gray-100"
              }`}
            >
              <StyledText
                className={`text-center ${
                  category === "JavaScript" ? "text-white" : "text-gray-600"
                }`}
              >
                JavaScript
              </StyledText>
            </StyledTouchableOpacity>
            <StyledTouchableOpacity
              onPress={() => setCategory("Python")}
              className={`flex-1 p-3 rounded-lg mr-2 ${
                category === "Python" ? "bg-blue-500" : "bg-gray-100"
              }`}
            >
              <StyledText
                className={`text-center ${
                  category === "Python" ? "text-white" : "text-gray-600"
                }`}
              >
                Python
              </StyledText>
            </StyledTouchableOpacity>
            <StyledTouchableOpacity
              onPress={() => setCategory("Java")}
              className={`flex-1 p-3 rounded-lg ${
                category === "Java" ? "bg-orange-500" : "bg-gray-100"
              }`}
            >
              <StyledText
                className={`text-center ${
                  category === "Java" ? "text-white" : "text-gray-600"
                }`}
              >
                Java
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>

          <StyledTextInput
            className="bg-gray-100 rounded-lg p-3 mb-6"
            placeholder="Max Members (5-20)"
            keyboardType="numeric"
            value={maxMembers}
            onChangeText={setMaxMembers}
          />

          <StyledTouchableOpacity
            onPress={handleCreate}
            className="bg-emerald-500 p-4 rounded-lg"
          >
            <StyledText className="text-white text-center font-medium">
              Create Group
            </StyledText>
          </StyledTouchableOpacity>
        </StyledView>
      </StyledView>
    </Modal>
  );
};

export default function StudyGroupsScreen({ navigation }) {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState([]);
  const [userGroups, setUserGroups] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetchGroups();
    fetchUserGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("study_groups")
        .select("*, study_group_members(*)");

      if (error) throw error;

      setGroups(data);
    } catch (error) {
      console.error("Error fetching groups:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserGroups = async () => {
    try {
      const { data, error } = await supabase
        .from("study_group_members")
        .select("group_id")
        .eq("user_id", user.id);

      if (error) throw error;

      // Check if data is defined and is an array
      if (Array.isArray(data)) {
        console.log("study group members:", JSON.stringify(data));
        setUserGroups(data.map((item) => item.group_id));
      } else {
        console.warn("No groups found or data is not an array:", data);
        setUserGroups([]); // Set an empty array if no data is found
      }
    } catch (error) {
      console.error("Error fetching user groups:", error);
    }
  };

  const handleJoinGroup = async (groupId) => {
    try {
      const { error } = await supabase.from("study_group_members").insert({
        group_id: groupId,
        user_id: user.id,
      });

      if (error) throw error;

      fetchGroups();
      fetchUserGroups();
    } catch (error) {
      console.error("Error joining group:", error);
    }
  };

  const handleCreateGroup = async (groupData) => {
    try {
      const { data, error } = await supabase
        .from("study_groups")
        .insert({
          name: groupData.name,
          description: groupData.description,
          category: groupData.category,
          max_members: groupData.maxMembers,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      await handleJoinGroup(data.id);

      fetchGroups();
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  const filteredGroups = groups.filter((group) => {
    const matchesSearch = group.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      group.category.trim().toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

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
            Study Groups
          </StyledText>
        </StyledView>

        {/* Search Bar */}
        <StyledView className="flex-row items-center mt-4">
          <StyledView className="flex-1 flex-row items-center bg-gray-100 rounded-lg px-4 py-2">
            <MaterialIcons name="search" size={20} color="#9CA3AF" />
            <StyledTextInput
              className="flex-1 ml-2 text-gray-800"
              placeholder="Search groups..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </StyledView>
          <StyledTouchableOpacity
            onPress={() => setShowCreateModal(true)}
            className="ml-4 bg-emerald-500 p-2 rounded-lg"
          >
            <MaterialIcons name="add" size={24} color="white" />
          </StyledTouchableOpacity>
        </StyledView>
      </StyledView>

      {/* Category Filter */}
      <StyledScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-6 py-4"
      >
        {["All", "JavaScript", "Python", "Java"].map((category) => (
          <StyledTouchableOpacity
            key={category}
            onPress={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full mr-2 ${
              selectedCategory === category ? "bg-emerald-500" : "bg-gray-100"
            }`}
          >
            <StyledText
              className={
                selectedCategory === category ? "text-white" : "text-gray-600"
              }
            >
              {category}
            </StyledText>
          </StyledTouchableOpacity>
        ))}
      </StyledScrollView>

      {/* Groups List */}
      <StyledScrollView className="flex-1 px-6">
        {filteredGroups.map((group) => (
          <StudyGroupCard
            key={group.id}
            group={group}
            onJoin={handleJoinGroup}
            isMember={userGroups.includes(group.id)}
          />
        ))}
      </StyledScrollView>

      {/* Create Group Modal */}
      <CreateGroupModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateGroup={handleCreateGroup}
      />
    </StyledView>
  );
}
