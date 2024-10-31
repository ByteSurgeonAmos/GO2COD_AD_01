import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { styled } from "nativewind";

const StyledView = styled(View);
const StyledText = styled(Text);

export default function HomeScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 4000,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      navigation.navigate("Login");
    }, 5000);

    return () => clearTimeout(timer);
  }, [fadeAnim, navigation]);

  return (
    <StyledView className="flex-1 justify-center items-center bg-green-500">
      <Animated.Image
        source={require("../../assets/welcome.gif")}
        style={[{ opacity: fadeAnim }, styles.gif]}
        resizeMode="contain"
      />
      <Animated.Text
        style={{ opacity: fadeAnim }}
        className="text-3xl font-bold text-white mb-4"
      >
        Welcome to BrainBash!
      </Animated.Text>
      <Animated.Text
        style={{ opacity: fadeAnim }}
        className="text-xl text-white mb-8 p-3 text-center"
      >
        Test your coding knowledge and have fun!
      </Animated.Text>
      <Animated.Text
        style={{ opacity: fadeAnim }}
        onPress={() => {
          navigation.navigate("Login");
        }}
        className="text-sm text-white mb-8 p-3 text-center"
      >
        Go to log in!
      </Animated.Text>
    </StyledView>
  );
}

const styles = StyleSheet.create({
  gif: {
    width: 200, // Set the desired width
    height: 200, // Set the desired height
    marginBottom: 20,
    borderRadius: 20,
  },
});
