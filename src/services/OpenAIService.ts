import axios from 'axios';
import { OPENAI_API_KEY } from '@env';

const API_URL = 'https://api.openai.com/v1/chat/completions';

// Define the GPT response type
type GPTMessage = {
  role: 'assistant' | 'user';
  content: string;
};

type GPTChoice = {
  message: GPTMessage;
};

type GPTResponse = {
  choices: GPTChoice[];
};

export const sendMessageToGPT = async (messages: any[]): Promise<GPTResponse> => {
  try {
    const response = await axios.post(
      API_URL,
      {
        model: 'gpt-3.5-turbo', // Use 'gpt-4' if you have access
        messages,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );
    return response.data as GPTResponse;  // Cast the response to GPTResponse
  } catch (error) {
    console.error('Error communicating with OpenAI:', error);
    throw error;
  }
};