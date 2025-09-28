import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);
  const [channels, setChannels] = useState([]);
  const [activeChannel, setActiveChannel] = useState(null);
  const [messages, setMessages] = useState({});
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [voiceParticipants, setVoiceParticipants] = useState({});
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Initialize socket connection
  useEffect(() => {
    if (isAuthenticated && user) {
      const newSocket = io(BACKEND_URL, {
        auth: {
          user_id: user.id,
          username: user.username
        }
      });

      setSocket(newSocket);

      // Socket event listeners
      newSocket.on('new_message', (message) => {
        setMessages(prev => ({
          ...prev,
          [message.channel_id]: [...(prev[message.channel_id] || []), message]
        }));
      });

      newSocket.on('user_typing', ({ user_id }) => {
        setTypingUsers(prev => [...prev.filter(id => id !== user_id), user_id]);
        setTimeout(() => {
          setTypingUsers(prev => prev.filter(id => id !== user_id));
        }, 3000);
      });

      newSocket.on('user_stopped_typing', ({ user_id }) => {
        setTypingUsers(prev => prev.filter(id => id !== user_id));
      });

      newSocket.on('user_joined_voice', ({ channel_id, user }) => {
        setVoiceParticipants(prev => ({
          ...prev,
          [channel_id]: [...(prev[channel_id] || []).filter(p => p.user_id !== user.id), user]
        }));
      });

      newSocket.on('user_left_voice', ({ channel_id, user_id }) => {
        setVoiceParticipants(prev => ({
          ...prev,
          [channel_id]: (prev[channel_id] || []).filter(p => p.user_id !== user_id)
        }));
      });

      return () => {
        newSocket.close();
      };
    }
  }, [isAuthenticated, user]);

  // Load channels
  useEffect(() => {
    const loadChannels = async () => {
      if (isAuthenticated) {
        try {
          const response = await axios.get(`${API}/channels`);
          setChannels(response.data);
          if (response.data.length > 0 && !activeChannel) {
            setActiveChannel(response.data[0]);
          }
        } catch (error) {
          console.error('Failed to load channels:', error);
        }
      }
    };

    loadChannels();
  }, [isAuthenticated]);

  // Load messages when active channel changes
  useEffect(() => {
    const loadMessages = async () => {
      if (activeChannel && isAuthenticated && !messages[activeChannel.id]) {
        try {
          const response = await axios.get(`${API}/channels/${activeChannel.id}/messages`);
          setMessages(prev => ({
            ...prev,
            [activeChannel.id]: response.data
          }));

          // Join socket room for this channel
          if (socket) {
            socket.emit('join_channel', { channel_id: activeChannel.id });
          }
        } catch (error) {
          console.error('Failed to load messages:', error);
        }
      }
    };

    loadMessages();
  }, [activeChannel, isAuthenticated, socket]);

  const sendMessage = async (content, type = 'text', voiceFile = null) => {
    if (!activeChannel || !isAuthenticated) return;

    try {
      const formData = new FormData();
      formData.append('content', content);
      formData.append('message_type', type);
      if (voiceFile) {
        formData.append('voice_file', voiceFile);
      }

      await axios.post(`${API}/channels/${activeChannel.id}/messages`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const startTyping = () => {
    if (socket && activeChannel) {
      socket.emit('typing_start', {
        channel_id: activeChannel.id,
        user_id: user.id
      });
    }
  };

  const stopTyping = () => {
    if (socket && activeChannel) {
      socket.emit('typing_stop', {
        channel_id: activeChannel.id,
        user_id: user.id
      });
    }
  };

  // Voice recording functions
  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioFile = new File([audioBlob], 'voice_message.wav', { type: 'audio/wav' });
        sendMessage('Голосовое сообщение', 'voice', audioFile);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const joinVoiceChannel = async (channelId) => {
    try {
      await axios.post(`${API}/voice/join/${channelId}`);
      if (socket) {
        socket.emit('join_voice_room', { channel_id: channelId });
      }
    } catch (error) {
      console.error('Failed to join voice channel:', error);
    }
  };

  const leaveVoiceChannel = async (channelId) => {
    try {
      await axios.post(`${API}/voice/leave/${channelId}`);
    } catch (error) {
      console.error('Failed to leave voice channel:', error);
    }
  };

  const createChannel = async (name, type, description, isPrivate = false) => {
    try {
      const response = await axios.post(`${API}/channels`, {
        name,
        type,
        description,
        is_private: isPrivate
      });
      setChannels(prev => [...prev, response.data]);
      return response.data;
    } catch (error) {
      console.error('Failed to create channel:', error);
      return null;
    }
  };

  const value = {
    socket,
    channels,
    activeChannel,
    setActiveChannel,
    messages: messages[activeChannel?.id] || [],
    onlineUsers,
    typingUsers,
    voiceParticipants: voiceParticipants[activeChannel?.id] || [],
    isRecording,
    sendMessage,
    startTyping,
    stopTyping,
    startVoiceRecording,
    stopVoiceRecording,
    joinVoiceChannel,
    leaveVoiceChannel,
    createChannel
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};