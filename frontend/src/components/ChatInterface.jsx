import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Users, Hash, Volume2, VolumeX, Settings } from 'lucide-react';
import { useChat } from '../contexts/ChatContext';
import { useAuth } from '../contexts/AuthContext';

export const ChatInterface = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const {
    channels,
    activeChannel,
    setActiveChannel,
    messages,
    typingUsers,
    voiceParticipants,
    isRecording,
    sendMessage,
    startTyping,
    stopTyping,
    startVoiceRecording,
    stopVoiceRecording,
    joinVoiceChannel,
    leaveVoiceChannel
  } = useChat();

  const [newMessage, setNewMessage] = useState('');
  const [isInVoiceChannel, setIsInVoiceChannel] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Auto scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    await sendMessage(newMessage);
    setNewMessage('');
    stopTyping();
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    
    // Start typing indicator
    startTyping();
    
    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Stop typing after 1 second of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 1000);
  };

  const handleJoinVoice = async () => {
    if (activeChannel && activeChannel.type === 'voice') {
      await joinVoiceChannel(activeChannel.id);
      setIsInVoiceChannel(true);
    }
  };

  const handleLeaveVoice = async () => {
    if (activeChannel) {
      await leaveVoiceChannel(activeChannel.id);
      setIsInVoiceChannel(false);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-bg-primary z-50 flex">
      {/* Sidebar - Channels */}
      <div className="w-64 bg-bg-secondary border-r border-border-subtle flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border-subtle">
          <div className="flex items-center justify-between">
            <h2 className="h3 text-text-primary">Чат</h2>
            <button onClick={onClose} className="text-text-muted hover:text-text-primary">
              ✕
            </button>
          </div>
        </div>

        {/* Channels List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <h3 className="h4 text-text-primary mb-3">Каналы</h3>
            <div className="space-y-1">
              {channels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setActiveChannel(channel)}
                  className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    activeChannel?.id === channel.id
                      ? 'bg-accent-primary text-bg-primary'
                      : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
                  }`}
                >
                  {channel.type === 'voice' ? (
                    <Volume2 className="w-4 h-4" />
                  ) : (
                    <Hash className="w-4 h-4" />
                  )}
                  <span className="body-sm font-medium">{channel.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-border-subtle bg-bg-secondary">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {activeChannel?.type === 'voice' ? (
                <Volume2 className="w-6 h-6 text-accent-primary" />
              ) : (
                <Hash className="w-6 h-6 text-accent-primary" />
              )}
              <div>
                <h3 className="h3 text-text-primary">{activeChannel?.name}</h3>
                <p className="body-sm text-text-muted">{activeChannel?.description}</p>
              </div>
            </div>

            {/* Voice Channel Controls */}
            {activeChannel?.type === 'voice' && (
              <div className="flex items-center space-x-2">
                {!isInVoiceChannel ? (
                  <button onClick={handleJoinVoice} className="btn-primary">
                    <Volume2 className="w-4 h-4 mr-2" />
                    Присоединиться
                  </button>
                ) : (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className={`p-2 rounded-lg ${isMuted ? 'bg-red-600' : 'bg-green-600'}`}
                    >
                      {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>
                    <button onClick={handleLeaveVoice} className="btn-secondary">
                      Покинуть
                    </button>
                  </div>
                )}

                {/* Voice Participants */}
                {voiceParticipants.length > 0 && (
                  <div className="flex items-center space-x-2 ml-4">
                    <Users className="w-4 h-4 text-text-muted" />
                    <span className="body-sm text-text-muted">
                      {voiceParticipants.length}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="flex items-start space-x-3">
              {/* Avatar */}
              <div className="w-8 h-8 bg-accent-primary rounded-full flex items-center justify-center flex-shrink-0">
                {message.avatar ? (
                  <img src={message.avatar} alt="" className="w-8 h-8 rounded-full" />
                ) : (
                  <span className="body-sm font-bold text-bg-primary">
                    {message.username[0].toUpperCase()}
                  </span>
                )}
              </div>

              {/* Message Content */}
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="body-sm font-medium text-text-primary">
                    {message.username}
                  </span>
                  <span className="body-xs text-text-muted">
                    {formatTime(message.created_at)}
                  </span>
                </div>
                
                {message.type === 'voice' ? (
                  <div className="bg-bg-secondary rounded-lg p-3 max-w-xs">
                    <div className="flex items-center space-x-2">
                      <Mic className="w-4 h-4 text-accent-primary" />
                      <span className="body-sm text-text-secondary">Голосовое сообщение</span>
                    </div>
                    {message.file_url && (
                      <audio controls className="w-full mt-2">
                        <source src={`${process.env.REACT_APP_BACKEND_URL}${message.file_url}`} type="audio/wav" />
                        Ваш браузер не поддерживает аудио
                      </audio>
                    )}
                  </div>
                ) : (
                  <p className="body-md text-text-secondary">{message.content}</p>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {typingUsers.length > 0 && (
            <div className="flex items-center space-x-2 text-text-muted">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-accent-primary rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-accent-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-accent-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="body-sm">Кто-то печатает...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        {activeChannel?.type !== 'voice' && (
          <div className="p-4 border-t border-border-subtle">
            <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={newMessage}
                  onChange={handleTyping}
                  placeholder={`Сообщение в #${activeChannel?.name}`}
                  className="input-field pr-12"
                />
                
                {/* Voice Message Button */}
                <button
                  type="button"
                  onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-colors ${
                    isRecording 
                      ? 'bg-red-600 text-white animate-pulse' 
                      : 'text-text-muted hover:text-accent-primary hover:bg-accent-bg'
                  }`}
                >
                  <Mic className="w-4 h-4" />
                </button>
              </div>

              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="btn-primary"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};