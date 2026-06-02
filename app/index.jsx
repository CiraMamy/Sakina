import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";

const { width, height } = Dimensions.get("window");

export default function SplashScreen() {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const titleAnim = useRef(new Animated.Value(20)).current;
  const subtitleAnim = useRef(new Animated.Value(20)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const dotsOpacity = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const circle1Scale = useRef(new Animated.Value(1)).current;
  const circle2Scale = useRef(new Animated.Value(1.2)).current;

  useEffect(() => {
    // Logo entrance
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 60, friction: 7 }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
    ]).start();

    // Title slide up
    Animated.sequence([
      Animated.delay(300),
      Animated.parallel([
        Animated.timing(titleAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
        Animated.timing(titleOpacity, { toValue: 1, duration: 800, useNativeDriver: true }),
      ]),
    ]).start();

    // Subtitle slide up
    Animated.sequence([
      Animated.delay(600),
      Animated.parallel([
        Animated.timing(subtitleAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
        Animated.timing(subtitleOpacity, { toValue: 1, duration: 800, useNativeDriver: true }),
      ]),
    ]).start();

    // Dots appear
    Animated.sequence([
      Animated.delay(1200),
      Animated.timing(dotsOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
    ]).start();

    // Float animation on logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -10, duration: 2000, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    ).start();

    // Background circles pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(circle1Scale, { toValue: 1.2, duration: 4000, useNativeDriver: true }),
        Animated.timing(circle1Scale, { toValue: 1, duration: 4000, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(circle2Scale, { toValue: 1, duration: 4000, useNativeDriver: true }),
        Animated.timing(circle2Scale, { toValue: 1.2, duration: 4000, useNativeDriver: true }),
      ])
    ).start();

    // Navigate after 3s
    const timer = setTimeout(() => {
      router.replace("/onboarding");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const dotData = [0, 1, 2];
  const dotAnims = dotData.map((_, i) => {
    const dotScale = useRef(new Animated.Value(1)).current;
    Animated.loop(
      Animated.sequence([
        Animated.delay(i * 200),
        Animated.sequence([
          Animated.timing(dotScale, { toValue: 1.3, duration: 750, useNativeDriver: true }),
          Animated.timing(dotScale, { toValue: 1, duration: 750, useNativeDriver: true }),
        ]),
      ])
    ).start();
    return dotScale;
  });

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Background gradient circles */}
      <Animated.View style={[styles.circle1, { transform: [{ scale: circle1Scale }] }]} />
      <Animated.View style={[styles.circle2, { transform: [{ scale: circle2Scale }] }]} />

      {/* Logo */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            transform: [{ scale: scaleAnim }, { translateY: floatAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        <Text style={styles.logoEmoji}>✨</Text>
      </Animated.View>

      {/* App Name */}
      <Animated.Text
        style={[
          styles.title,
          { transform: [{ translateY: titleAnim }], opacity: titleOpacity },
        ]}
      >
        Sakina
      </Animated.Text>

      {/* Tagline */}
      <Animated.Text
        style={[
          styles.subtitle,
          { transform: [{ translateY: subtitleAnim }], opacity: subtitleOpacity },
        ]}
      >
        Respire. Parle. Guéris.
      </Animated.Text>

      {/* Loading dots */}
      <Animated.View style={[styles.dotsContainer, { opacity: dotsOpacity }]}>
        {dotAnims.map((anim, i) => (
          <Animated.View
            key={i}
            style={[styles.dot, { transform: [{ scale: anim }] }]}
          />
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#8CB8E8",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  circle1: {
    position: "absolute",
    top: -50,
    right: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  circle2: {
    position: "absolute",
    bottom: -60,
    left: -80,
    width: 360,
    height: 360,
    borderRadius: 180,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  logoContainer: {
    width: 128,
    height: 128,
    borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  logoEmoji: {
    fontSize: 64,
  },
  title: {
    fontSize: 60,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -1,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 20,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "300",
    textAlign: "center",
    paddingHorizontal: 40,
    lineHeight: 30,
  },
  dotsContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 60,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.6)",
  },
});
