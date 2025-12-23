import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as LiveActivity from "expo-live-activity";

const homeTeam = "Home Team";
const awayTeam = "Away Team";
const quarter = 1;

export default function Index() {
  const [activityId, setActivityId] = useState<string | null>(null);
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);

  const buildState = (
    home: number,
    away: number,
    timeRemaining: string
  ): LiveActivity.LiveActivityState => {
    return {
      title: `${homeTeam} ${home} - ${away} ${awayTeam}`,
      subtitle: `Q${quarter} ${timeRemaining}`,
      progressBar: {
        progress: 0,
      },
      imageName: "home",
      dynamicIslandImageName: "away",
    };
  };

  const handleStartActivity = async () => {
    const state = buildState(homeScore, awayScore, "15:00");

    const config: LiveActivity.LiveActivityConfig = {
      backgroundColor: "#000000",
      titleColor: "#FFFFFF",
      subtitleColor: "#FFFFFF",
      progressViewTint: "#FFFFFF",
      progressViewLabelColor: "#FFFFFF",
      imagePosition: "left",
      imageAlign: "center",
      imageSize: { width: 30, height: 30 },
      contentFit: "cover",
      timerType: "digital",
      padding: 16,
    };

    const id = LiveActivity.startActivity(state, config);
    if (id) {
      setActivityId(id);
    }
  };

  const handleUpdateScore = async (team: "home" | "away", points: number) => {
    if (!activityId) return;

    const newHomeScore = team === "home" ? homeScore + points : homeScore;
    const newAwayScore = team === "away" ? awayScore + points : awayScore;

    setHomeScore(newHomeScore);
    setAwayScore(newAwayScore);

    const state = buildState(newHomeScore, newAwayScore, "12:34");
    LiveActivity.updateActivity(activityId, state);
  };

  const handleStopActivity = async () => {
    if (!activityId) return;

    const finalState = buildState(homeScore, awayScore, "00:00");
    LiveActivity.stopActivity(activityId, finalState);
    setActivityId(null);
    setHomeScore(0);
    setAwayScore(0);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Football Scoreboard</Text>
      <StatusBar style="auto" />

      <View style={styles.scoreboard}>
        <View style={styles.team}>
          <Text style={styles.teamName}>{homeTeam}</Text>
          <Text style={styles.score}>{homeScore}</Text>
        </View>
        <Text style={styles.vs}>VS</Text>
        <View style={styles.team}>
          <Text style={styles.teamName}>{awayTeam}</Text>
          <Text style={styles.score}>{awayScore}</Text>
        </View>
      </View>

      {!activityId ? (
        <TouchableOpacity style={styles.button} onPress={handleStartActivity}>
          <Text style={styles.buttonText}>Start Live Activity</Text>
        </TouchableOpacity>
      ) : (
        <>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.scoreButton}
              onPress={() => handleUpdateScore("home", 6)}
            >
              <Text style={styles.buttonText}>Home TD (6)</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.scoreButton}
              onPress={() => handleUpdateScore("home", 3)}
            >
              <Text style={styles.buttonText}>Home FG (3)</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.scoreButton}
              onPress={() => handleUpdateScore("away", 6)}
            >
              <Text style={styles.buttonText}>Away TD (6)</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.scoreButton}
              onPress={() => handleUpdateScore("away", 3)}
            >
              <Text style={styles.buttonText}>Away FG (3)</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.button, styles.stopButton]}
            onPress={handleStopActivity}
          >
            <Text style={styles.buttonText}>Stop Live Activity</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  scoreboard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 30,
  },
  team: {
    alignItems: "center",
  },
  teamName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
  },
  score: {
    fontSize: 48,
    fontWeight: "bold",
  },
  vs: {
    fontSize: 24,
    fontWeight: "bold",
  },
  button: {
    marginVertical: 10,
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: "blue",
    borderRadius: 8,
  },
  stopButton: {
    backgroundColor: "red",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 10,
  },
  scoreButton: {
    backgroundColor: "green",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 5,
    flex: 1,
  },
});

