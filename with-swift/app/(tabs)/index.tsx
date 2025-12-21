import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { ActivityStartResponse } from "../../modules/live-activity-manager/src/LiveActivityManager.types";
import { LiveActivityManagerNativeModule } from "../../modules/live-activity-manager/src/LiveActivityManagerModule";

export default function App() {
  const [activity, setActivity] = useState<ActivityStartResponse | null>(null);
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);

  const homeTeam = "Home Team";
  const awayTeam = "Away Team";

  const handleStartActivity = async () => {
    const result = await LiveActivityManagerNativeModule.start(
      homeTeam,
      awayTeam,
      homeScore,
      awayScore,
      1,
      "15:00"
    );
    setActivity(result);
  };

  const handleUpdateScore = async (team: "home" | "away", points: number) => {
    if (!activity?.id) return;

    const newHomeScore = team === "home" ? homeScore + points : homeScore;
    const newAwayScore = team === "away" ? awayScore + points : awayScore;

    setHomeScore(newHomeScore);
    setAwayScore(newAwayScore);

    await LiveActivityManagerNativeModule.ongoing(
      activity.id,
      newHomeScore,
      newAwayScore,
      1,
      "12:34"
    );
  };

  const handleStopActivity = async () => {
    if (!activity?.id) return;
    await LiveActivityManagerNativeModule.stop(activity.id);
    setActivity(null);
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

      {!activity ? (
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
