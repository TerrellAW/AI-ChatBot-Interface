import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

export default function ChatInterface() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    setIsLoading(true);
    try {
      const apiUrl = ""; // Insert your LM Studio API URL here

      console.log("Sending POST request to:", apiUrl);

      const requestBody = {
        model: "deepseek-coder-v2-lite-instruct",
        messages: [
          {
            role: "system",
            content: "You are a helping users navigate a difficult website.",
          },
          {
            role: "user",
            content: input,
          },
        ],
        temperature: 0.4,
        max_tokens: 1024,
      };

      // Use XMLHttpRequest instead of fetch
      const xhr = new XMLHttpRequest();
      xhr.open("POST", apiUrl, true);
      xhr.setRequestHeader("Content-Type", "application/json");

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              console.log("Raw response:", xhr.responseText);
              const data = JSON.parse(xhr.responseText);
              if (data.choices && data.choices[0] && data.choices[0].message) {
                const result = data.choices[0].message.content;
                setResponse(result);
              } else {
                console.error("Unexpected response format:", data);
                Alert.alert(
                  "Error",
                  "Unexpected response format from the server"
                );
              }
            } catch (error: any) {
              console.error("Error parsing response:", error);
              Alert.alert(
                "Error",
                "Failed to parse response: " + (error as Error).message
              );
            }
          } else {
            console.error("Request failed:", xhr.status, xhr.statusText);
            Alert.alert(
              "Error",
              `Request failed: ${xhr.status} ${xhr.statusText}`
            );
          }
          setIsLoading(false);
        }
      };

      xhr.onerror = function () {
        console.error("Network error occurred");
        Alert.alert("Error", "Network error occurred");
        setIsLoading(false);
      };

      console.log("Sending body:", JSON.stringify(requestBody));
      xhr.send(JSON.stringify(requestBody));
    } catch (error: any) {
      console.error("Error:", error);
      Alert.alert(
        "Error",
        "Failed to get response: " + (error as Error).message
      );
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.chatContainer}>
        {response ? (
          <View style={styles.responseContainer}>
            <Text style={styles.responseText}>{response}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="How can I help you?"
          multiline={true}
        />
        <TouchableOpacity
          style={[styles.sendButton, isLoading && styles.disabledButton]}
          onPress={handleSend}
          disabled={isLoading}
        >
          <Text style={styles.sendText}>{isLoading ? "..." : "Send"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    width: "100%",
  },
  chatContainer: {
    flex: 1,
    width: "100%",
  },
  responseContainer: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    width: "100%",
  },
  responseText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
    minHeight: 40,
  },
  sendButton: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#cccccc",
  },
  sendText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
