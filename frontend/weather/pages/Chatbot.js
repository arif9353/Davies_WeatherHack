import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet, KeyboardAvoidingView, Platform, Image, Alert } from 'react-native';
import { Icon } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';  // Make sure to install expo-av if you haven't already
import ChatIcon from "../assets/chat_icon.png";
import BackIcon from "../assets/back_chat.png";
import IP from "./IP_Address";
import RNPickerSelect from 'react-native-picker-select';

const loadLocalizedData = async (language) => {
    try {
        switch (language) {
            case "Hindi":
                return require("../assets/assets/Hindi/static.json");
            case "Marathi":
                return require("../assets/assets/Marathi/static.json");
            case "Tamil":
                return require("../assets/assets/Tamil/static.json");
            case "English":
                return require("../assets/assets/English/static.json");
            case "Bengali":
                return require("../assets/assets/Bengali/static.json");
            case "Telugu":
                return require("../assets/assets/Telugu/static.json");
            case "Kannada":
                return require("../assets/assets/Kannada/static.json");
            case "Punjabi":
                return require("../assets/assets/Punjabi/static.json");
            case "Assamese":
                return require("../assets/assets/Assamese/static.json");
            case "Gujarati":
                return require("../assets/assets/Gujarati/static.json");
            case "Malayalam":
                return require("../assets/assets/Malayalam/static.json");
            case "Oriya":
                return require("../assets/assets/Oriya/static.json");
            default:
                return require("../assets/assets/English/static.json"); // default to English if undefined
        }
    } catch (error) {
        console.error("Failed to load the language file", error);
        return require("../assets/assets/English/static.json"); // default to English on error
    }
};

const ChatScreen = () => {
    const [recording, setRecording] = useState();
    const [isListening, setIsListening] = useState(false);
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [Isshowsplashsscreen, setIsshowsplashsscreen] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('en');
    const [jsonData, setJsonData] = useState({
        ChatBot: {
            Back: "Back",
            HELP: "Help",
            TypeHere: "Ty..",
            PermissionsRequired: "a",
            PleaseGrantAudioRecordingPermissions: "b",
            RecrodingFailed: "c",
            AnErrorOccuredWhileTryingToStartRecording: "d",
        }
    });

    useEffect(() => {
        // Load the localized data when component mounts
        loadLocalizedData(selectedLanguage).then(setJsonData);
    }, []);
    const navigation = useNavigation();


    // Function to load language and reset the state when language changes
    const refreshPage = async (language) => {
        setIsLoading(true);  // Show loading while refreshing
        const newJsonData = await loadLocalizedData(language);
        setJsonData(newJsonData);
        setMessages([]);  // Clear previous messages
        setMessageText('');  // Clear input
        setIsLoading(false); // End loading
    };

    // useEffect to listen for language changes and refresh the page
    useEffect(() => {
        refreshPage(selectedLanguage);  // Call refresh when language changes
    }, [selectedLanguage]);

    const sendMessage = async () => {
        if (messageText.trim()) {
            const userdetails = await AsyncStorage.getItem('userSelections');
            const AQI = await AsyncStorage.getItem('AQI');
            const newMessage = { id: Date.now(), text: messageText, sender: 'user', language: selectedLanguage };
            setMessages([...messages, newMessage]);
            setIsLoading(true);
            setMessageText('');
            console.log(newMessage);
            try {
                const endpoint = `${IP}/chattext`;
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ message: newMessage.text, language: selectedLanguage, userdetails: userdetails, AQI: AQI }),
                });
                const responseData = await response.json();
                console.log(responseData);
                if (responseData.success) {
                    setMessages([...messages, { ...newMessage, id: Date.now() }, { id: Date.now() + 1, text: responseData.message, sender: 'bot' }]);
                    console.log(responseData.message);
                } else {
                    throw new Error(responseData.message || "Server error");
                }
            } catch (error) {
                console.error('Error fetching response:', error);
                setMessages(prevMessages => [...prevMessages, newMessage, { id: Date.now(), text: 'Error getting response', sender: 'bot' }]);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleBack = async () => {
        navigation.goBack();
    };

    async function startRecording() {
        try {
            const perm = await Audio.requestPermissionsAsync();
            if (perm.status === "granted") {
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true,
                });
                const { recording } = await Audio.Recording.createAsync(
                    Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
                );
                setRecording(recording);
                setIsListening(true);
            } else {
                Alert.alert(
                    jsonData.ChatBot.PermissionsRequired,
                    jsonData.ChatBot.PleaseGrantAudioRecordingPermissions
                );
            }
        } catch (err) {
            Alert.alert(
                jsonData.ChatBot.RecrodingFailed,
                jsonData.ChatBot.AnErrorOccuredWhileTryingToStartRecording
            );
        }
    }

    async function stopRecording() {
        try {
            setRecording(undefined);
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();
            console.log("Recording stopped and stored at", uri);
            sendAudioToServer(uri);
            setIsListening(false);
        } catch (error) {
            console.error("Stop recording error:", error);
        }
    }

    const sendAudioToServer = async (audioPath) => {

        const formData = new FormData();
        formData.append("file", {
            uri: audioPath,
            type: "audio/3gp", // Make sure the MIME type matches the actual file format
            name: "audio.3gp",
        });
        formData.append("language", selectedLanguage);

        try {
            // Read the audio file and convert it to a base64 string
            console.log('Sending audio to server with the following formData:', formData);

            // Send the base64 string to the backend
            const response = await fetch(`${IP}/chat_audio`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });

            const data = await response.json();
            console.log('Response from server:', data);

            if (data.success) {
                setMessageText(data.message);  // Set the TextInput with the transcribed text
            } else {
                throw new Error(data.message || "Server error");
            }

        } catch (error) {
            console.error('Error uploading file:', error);
            setMessages(prevMessages => [...prevMessages, { id: Date.now(), text: 'Error getting response', sender: 'bot' }]);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.containkeyboard}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 2} // Adjust this value if needed
        >
            {/* Header */}
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.backLogo}>
                        <TouchableOpacity style={styles.back_view} onPress={handleBack}>
                            <Image source={BackIcon} style={styles.back_icon} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.helpSection}>
                        <View style={styles.chat_icon_container}>
                            <Image source={ChatIcon} style={styles.chat_icon} />
                        </View>
                        {/* Language Picker */}
                        <RNPickerSelect
                            onValueChange={(value) => setSelectedLanguage(value)}
                            items={[
                                { label: 'English', value: 'English' },
                                { label: 'Hindi', value: 'Hindi' },
                                { label: 'Oriya', value: 'Oriya' },
                                { label: 'Tamil', value: 'Tamil' },
                                { label: 'Telugu', value: 'Telugu' },
                                { label: 'Marathi', value: 'Marathi' },
                                { label: 'Bengali', value: 'Bengali' },
                                { label: 'Kannada', value: 'Kannada' },
                                { label: 'Punjabi', value: 'Punjabi' },
                                { label: 'Assamese', value: 'Assamese' },
                                { label: 'Gujarati', value: 'Gujarati' },
                                { label: 'Malayalam', value: 'Malayalam' },
                            ]}
                            placeholder={{ label: 'Select Language', value: null }}
                            style={pickerSelectStyles}
                            value={selectedLanguage}  // Bind selected value to picker
                        />
                    </View>
                </View>

                {/* Main message panel */}
                <ScrollView style={styles.messagesContainer}>
                    {messages.map(msg => (
                        <View key={msg.id} style={[styles.message, msg.sender === 'user' ? styles.userMessage : styles.botMessage]}>
                            <Text style={[styles.messageText, msg.sender === 'user' ? styles.userMessageText : styles.botMessageText]}>{msg.text}</Text>
                        </View>
                    ))}
                    {isLoading && <ActivityIndicator size="small" color="#0000ff" />}
                </ScrollView>

                {/* Input Box */}
                <View style={styles.inpCont}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value={messageText}
                            onChangeText={setMessageText}
                            placeholder={jsonData.ChatBot.TypeHere}
                        />
                        <TouchableOpacity style={styles.audioButton} onPress={isListening ? stopRecording : startRecording}>
                            <Icon source={isListening ? "stop" : "microphone"} size={26} style={styles.icon}></Icon>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                            <Icon source="send" size={26} style={styles.icon}></Icon>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    containkeyboard: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 52,
        padding: 12,
        borderBottomColor: "#B6B6B6",
        borderBottomWidth: 0.5,
        backgroundColor: "white",
        elevation: 18,
        zIndex: 999
    },
    back_view: {
        paddingLeft: 4,
        backgroundColor: "white",
        zIndex: 9999999
    },
    back_icon: {
        width: 10,
        height: 20
    },
    app_icon: {
        height: 45,
        width: 65
    },
    backLogo: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 20
    },
    chat_icon: {
        width: 28.83,
        height: 24,
        marginLeft: 4
    },
    chat_icon_container: {
        padding: 10,
        borderRadius: 10,
        backgroundColor: "#E8EEF3"
    },
    messagesContainer: {
        flex: 1,
        paddingHorizontal: 14,
        backgroundColor: "#E7ECEF",
    },
    message: {
        padding: 10,
        borderRadius: 20,
        marginVertical: 6,
        maxWidth: '80%',
    },
    userMessage: {
        alignSelf: 'flex-end',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 2,
        borderBottomLeftRadius: 30,
        backgroundColor: "#fff",
        flexDirection: "row",
        paddingHorizontal: 18,
    },
    botMessage: {
        alignSelf: 'flex-start',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 30,
        borderBottomRightRadius: 30,
        borderBottomLeftRadius: 2,
        backgroundColor: "#002e4f",
        flexDirection: "row",
        paddingHorizontal: 18,
    },
    userMessageText: {
        fontSize: 16,
        fontWeight: "500",
        color: "#002e4f",
        textAlign: "left"
    },
    botMessageText: {
        fontSize: 16,
        fontWeight: "500",
        color: "#fff",
        textAlign: "left",
    },
    inpCont: {
        backgroundColor: "#E7ECEF",

    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        marginHorizontal: 14,
        borderRadius: 40,
        backgroundColor: "white",
        shadowColor: "rgba(0, 0, 0, 0.45)",
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowRadius: 8,
        shadowOpacity: 1,
        elevation: 4
    },
    input: {
        flex: 1,
        paddingLeft: 14,
        paddingVertical: 14
    },
    sendButton: {
        padding: 10,
    },
    icon: {
        color: "#002E4F"
    }
});

const pickerSelectStyles = {
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30,
        marginTop: 5, // Adjust based on your layout
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'gray',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30,
        marginTop: 5, // Adjust based on your layout
    },
};

export default ChatScreen;
