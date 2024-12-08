import React, { useEffect, useState } from "react";
import { Image, StyleSheet, View, Text } from "react-native";
import AppleHealthKit, {
  HealthKitPermissions,
  HealthPermission,
} from "react-native-health";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function HomeScreen() {
  const [heartRate, setHeartRate] = useState<number | null>(null);

  useEffect(() => {
    // Berechtigungen definieren
    const permissions: HealthKitPermissions = {
      permissions: {
        read: [HealthPermission.HeartRate], // Korrekte Nutzung der Enum
        write: [],
      },
    };

    // HealthKit initialisieren
    AppleHealthKit.initHealthKit(permissions, (err: string | null) => {
      if (err) {
        console.error("HealthKit Error:", err);
        return;
      }

      const heartRateOptions = {
        unit: AppleHealthKit.Constants.Units.bpm,
        startDate: new Date(2023, 0, 1).toISOString(),
      };

      // Herzfrequenz abrufen
      AppleHealthKit.getHeartRateSamples(
        heartRateOptions,
        (err: string | null, results: Array<{ value: number }> | null) => {
          if (!err && results && results.length > 0) {
            setHeartRate(results[0].value); // Setze den ersten Wert
          }
        }
      );
    });
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Hallo, Apple Watch!</ThemedText>
        <ThemedText>
          Herzfrequenz: {heartRate ? `${heartRate} bpm` : "Lade..."}
        </ThemedText>
        <HelloWave />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
