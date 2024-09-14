// src/screens/ChatScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
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
import * as ImagePicker from 'expo-image-picker';// Import an icon library
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type ChatScreenRouteProp = RouteProp<RootStackParamList, 'Chat'>;

type Props = {
  route: ChatScreenRouteProp;
};

const ChatScreen: React.FC<Props> = ({ route }) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [image, setImage] = useState<{ uri: string } | null>(null);
  const { helperId, assistantName } = route.params;
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={styles.headerTitleContainer}>
          <Image
            source={require('../../assets/assistant1.png')} // Path to the icon
            style={styles.headerIcon}
          />
          <Text style={styles.headerTitleText}>{assistantName || 'Chat'}</Text>
        </View>
      ),
    });
  }, [navigation, assistantName]);

  useEffect(() => {
    loadMessages();
    if (messages.length === 0) {
      const welcomeMessage: IMessage = {
        _id: '1',
        text: 'Hello! How can I assist you today?',
        createdAt: new Date(),
        user: { _id: '2', name: 'AI Helper' },
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  useEffect(() => {
    saveMessages();
  }, [messages]);

  const loadMessages = async () => {
    try {
      const storedMessages = await AsyncStorage.getItem(`chat_${helperId}`);
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const saveMessages = async () => {
    try {
      await AsyncStorage.setItem(`chat_${helperId}`, JSON.stringify(messages));
    } catch (error) {
      console.error('Failed to save messages:', error);
    }
  };

  const onSend = useCallback(
    (newMessages: IMessage[] = []) => {
      if (image) {
        // Include the image in the message
        const imageMessage: IMessage = {
          _id: Math.random().toString(),
          createdAt: new Date(),
          user: { _id: '1' },
          image: image.uri,
          text: newMessages[0]?.text || '', // Include any text entered
        };
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, [imageMessage])
        );
        setImage(null); // Reset the image after sending
      } else {
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, newMessages)
        );
      }

      // Simulate bot typing
      setIsTyping(true);
      setTimeout(() => {
        const botMessage: IMessage = {
          _id: Math.random().toString(),
          text: 'This is a hardcoded response from the bot.',
          createdAt: new Date(),
          user: { _id: '2', name: 'AI Helper' },
        };
        setIsTyping(false);
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, [botMessage])
        );
      }, 1500);
    },
    [helperId, image]
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
        renderBubble={(props) => (
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
          />
        )}
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