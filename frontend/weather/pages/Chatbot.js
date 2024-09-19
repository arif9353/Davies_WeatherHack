import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { Icon } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import ChatIcon from "../assets/chat_icon.png";
import BackIcon from "../assets/back_chat.png";
import IP from './IP_Address';

const ChatScreen = () => {
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();

    const sendMessage = async () => {
        if (messageText.trim()) {
            const newMessage = { id: Date.now(), text: messageText, sender: 'user' };
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
                    body: JSON.stringify({ message: newMessage.text }),
                });
                const responseData = await response.json();
                console.log(responseData)
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
    }


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
                            placeholder="Type Here"
                        />
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
        // paddingTop: 20
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
        // paddingTop: 36,
        // paddingBottom: 4,
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
    back: {
        flexDirection: "row",
        alignItems: "center"
    },
    backTxt: {
        paddingHorizontal: 6,
        fontSize: 18,
        fontWeight: "500",
        // fontFamily: "Inter-Medium",
        color: "#224c6a",
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: "#000",
        textAlign: "left",
    },
    helpSection: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8
    },
    helpButton: {
        backgroundColor: "green",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 5,
    },
    helpText: {
        color: "white",
        fontSize: 16,
    },
    account: {
        marginLeft: 12,
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
        // backgroundColor: '#add8e6',
        alignSelf: 'flex-end',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 2,
        borderBottomLeftRadius: 30,
        backgroundColor: "#fff",
        // flex: 1,
        // width: "100%",
        flexDirection: "row",
        // alignItems: "center",
        // justifyContent: "center",
        paddingHorizontal: 18,
        // paddingVertical: 16
    },
    botMessage: {
        // backgroundColor: '#90ee90',
        alignSelf: 'flex-start',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 30,
        borderBottomRightRadius: 30,
        borderBottomLeftRadius: 2,
        backgroundColor: "#002e4f",
        flex: 1,
        // width: "100%",
        flexDirection: "row",
        // alignItems: "center",
        // justifyContent: "center",
        paddingHorizontal: 18,
        // paddingVertical: 12
    },
    userMessageText: {
        fontSize: 16,
        fontWeight: "500",
        // fontFamily: "Inter-Medium",
        color: "#002e4f",
        textAlign: "left"
    },
    botMessageText: {
        fontSize: 16,
        fontWeight: "500",
        // fontFamily: "Inter-Medium",
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
        zIndex: 99999999999,
        elevation: 4
    },
    input: {
        flex: 1,
        // height: 40,
        // paddingHorizontal: 2,
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

export default ChatScreen;
