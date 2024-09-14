// src/screens/ChatScreen.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  ActivityIndicator,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  GiftedChat,
  IMessage,
  Bubble,
  Send,
  SendProps,
  Actions,
  InputToolbar,
  Composer,
} from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { sendMessageToGPT } from '../services/OpenAIService';
import { Alert } from 'react-native';


type ChatScreenRouteProp = RouteProp<RootStackParamList, 'Chat'>;

type Props = {
  route: ChatScreenRouteProp;
};

const ChatScreen: React.FC<Props> = ({ route }) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [image, setImage] = useState<{ uri: string } | null>(null);
  const [gptMessages, setGptMessages] = useState<any[]>([]);
  const { helperId, assistantName } = route.params;
  const navigation = useNavigation();
  const [currentTypingMessage, setCurrentTypingMessage] = useState<IMessage | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearChatHistory = useCallback(async () => {
    Alert.alert(
      "Clear Chat History",
      "Are you sure you want to clear all messages? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Clear", 
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(`chat_${helperId}`);
              await AsyncStorage.removeItem(`gpt_chat_${helperId}`);
              setMessages([]);
              setGptMessages([]);
              // Optionally, you can add the welcome message back
              const welcomeMessage: IMessage = {
                _id: '1',
                text: `Hello! I'm ${assistantName}. How can I assist you today?`,
                createdAt: new Date(),
                user: { _id: '2', name: assistantName },
              };
              setMessages([welcomeMessage]);
              setGptMessages([
                {
                  role: 'assistant',
                  content: `Hello! I'm ${assistantName}. How can I assist you today?`,
                },
              ]);
            } catch (error) {
              console.error('Failed to clear chat history:', error);
              Alert.alert("Error", "Failed to clear chat history. Please try again.");
            }
          }
        }
      ]
    );
  }, [helperId, assistantName]);

  useEffect(() => {
    navigation.setOptions({
      title: assistantName || 'Chat',
      headerRight: () => (
        <TouchableOpacity onPress={clearChatHistory} style={{ marginRight: 15 }}>
          <Icon name="delete" size={24} color="#FF3B30" />
        </TouchableOpacity>
      ),
    });
    loadMessages();
  }, [navigation, assistantName, clearChatHistory]);

  useEffect(() => {
    saveMessages();
  }, [messages]);

  const loadMessages = async () => {
    try {
      const storedMessages = await AsyncStorage.getItem(`chat_${helperId}`);
      const storedGptMessages = await AsyncStorage.getItem(`gpt_chat_${helperId}`);
      if (storedMessages && storedGptMessages) {
        setMessages(JSON.parse(storedMessages));
        setGptMessages(JSON.parse(storedGptMessages));
      } else {
        // Welcome message from the AI helper
        const welcomeMessage: IMessage = {
          _id: '1',
          text: `Hello! I'm ${assistantName}. How can I assist you today?`,
          createdAt: new Date(),
          user: { _id: '2', name: assistantName },
        };
        setMessages([welcomeMessage]);
        // Initialize GPT conversation
        setGptMessages([
          {
            role: 'assistant',
            content: `Hello! I'm ${assistantName}. How can I assist you today?`,
          },
        ]);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const saveMessages = async () => {
    try {
      await AsyncStorage.setItem(`chat_${helperId}`, JSON.stringify(messages));
      await AsyncStorage.setItem(`gpt_chat_${helperId}`, JSON.stringify(gptMessages));
    } catch (error) {
      console.error('Failed to save messages:', error);
    }
  };

  const onSend = useCallback(
    async (newMessages: IMessage[] = []) => {
      let messageToSend = newMessages[0];

      // If there's an attached image, add it to the message for display purposes only
      if (image) {
        messageToSend = {
          ...messageToSend,
          image: image.uri,
        };
        setImage(null); // Clear the image after sending
      }

      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [messageToSend])
      );

      // Add user's message to GPT conversation (text only)
      const userMessage = {
        role: 'user',
        content: messageToSend.text,
      };
      setGptMessages((prev) => [...prev, userMessage]);

      setIsTyping(true);

      try {
        // Send message to OpenAI (text only)
        const response = await sendMessageToGPT(gptMessages.concat(userMessage));
        const assistantMessageContent = response.choices[0].message.content;

        const assistantMessage: IMessage = {
          _id: Math.random().toString(),
          text: assistantMessageContent,
          createdAt: new Date(),
          user: { _id: '2', name: assistantName },
        };

        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, [assistantMessage])
        );

        // Add assistant's response to GPT conversation
        const assistantGptMessage = {
          role: 'assistant',
          content: assistantMessageContent,
        };
        setGptMessages((prev) => [...prev, assistantGptMessage]);

      } catch (error) {
        console.error('Error getting response from GPT:', error);
        // Optionally, show an error message to the user
      } finally {
        setIsTyping(false);
      }
    },
    [gptMessages, assistantName, image]
  );

  // Function to open image picker
const pickImage = async () => {
  // Request permission to access media library
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    alert('Sorry, we need camera roll permissions to make this work!');
    return;
  }

  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: false,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      // Access the URI from the assets array
      setImage({ uri: result.assets[0].uri });
    } else {
      console.log('User cancelled image picker');
    }
  } catch (error) {
    console.error('Error picking image: ', error);
  }
};

  // Custom actions component to show the image picker icon
  const renderActions = (props: any) => (
    <Actions
      {...props}
      containerStyle={styles.actionsContainer}
      icon={() => <Icon name="camera" size={28} color="#0084FF" />}
      onPressActionButton={pickImage}
    />
  );

  // Render the image attachment preview
  const renderChatFooter = () => {
    if (image) {
      return (
        <View style={styles.imagePreviewContainer}>
          <Image source={{ uri: image.uri }} style={styles.imagePreview} />
          <TouchableOpacity
            onPress={() => setImage(null)}
            style={styles.removeImageButton}
          >
            <Icon name="close-circle" size={24} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  const renderSend = (props: SendProps<IMessage>) => (
    <Send {...props} containerStyle={styles.sendContainer}>
      <View style={styles.sendButton}>
        <Icon name="arrow-up" size={24} color="#fff" />
      </View>
    </Send>
  );

  const renderInputToolbar = (props: any) => (
    <InputToolbar
      {...props}
      containerStyle={styles.inputToolbar}
      primaryStyle={{ alignItems: 'center' }}
    />
  );

  const renderComposer = (props: any) => (
    <Composer
      {...props}
      textInputStyle={styles.textInput}
      multiline={true}
      scrollEnabled={false}  // Prevent scrolling inside the input field when text fits
    />
  );

  const renderBubble = (props: any) => (
    <Bubble
      {...props}
      wrapperStyle={{
        left: { backgroundColor: '#F1F0F0' },
        right: { backgroundColor: '#0084FF' },
      }}
      textStyle={{
        left: { color: '#000' },
        right: { color: '#fff' },
      }}
      isTyping={props.currentMessage._id === currentTypingMessage?._id}
    />
  );

  // Add this useEffect for cleanup
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{ _id: '1' }}
        isTyping={isTyping}
        renderAvatar={null}
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0084FF" />
          </View>
        )}
        placeholder="Type a message..."
        alwaysShowSend
        scrollToBottom
        renderSend={renderSend}
        renderActions={renderActions}
        renderInputToolbar={renderInputToolbar}
        renderComposer={renderComposer}
        renderChatFooter={renderChatFooter}
        renderBubble={renderBubble}
        minComposerHeight={40}
        maxComposerHeight={200}
      />
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  inputToolbar: {
    borderTopWidth: 0,
    paddingHorizontal: 10,
    backgroundColor: '#F2F2F7',
    paddingVertical: Platform.OS === 'ios' ? 8 : 6,  // Add vertical padding for proper containment
  },
  actionsContainer: {
    marginLeft: 0,
    marginBottom: 0,
    marginRight: 5,
  },
  textInput: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 8 : 5,
    marginLeft: 0,
    marginRight: 0,
    color: '#000',
    overflow: 'hidden'
  },
  sendContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 0,
    marginLeft: 8,
    marginBottom: 0,
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#0084FF',
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
  },
  imagePreview: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  removeImageButton: {
    marginLeft: 10,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    width: 24,   // Adjust icon size
    height: 24,  // Adjust icon size
    marginRight: 8,  // Space between icon and text
  },
  headerTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});