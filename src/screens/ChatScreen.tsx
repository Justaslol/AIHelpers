import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Platform, ActivityIndicator, Text } from 'react-native';
import { GiftedChat, IMessage, Bubble, Send, SendProps } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { SafeAreaView } from 'react-native-safe-area-context';

type ChatScreenRouteProp = RouteProp<RootStackParamList, 'Chat'>;

type Props = {
  route: ChatScreenRouteProp;
};

const ChatScreen: React.FC<Props> = ({ route }) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const { helperId } = route.params;

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
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, newMessages)
      );
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
    [helperId]
  );

  const renderSend = (props: SendProps<IMessage>) => {
    return (
      <Send {...props}>
        <View style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </View>
      </Send>
    );
  };

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
        textInputProps={{
          style: styles.textInput,
        }}
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
  textInput: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 5,
    flex: 1,
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginRight: 10,
    marginBottom: 5,
    backgroundColor: '#0084FF',
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});