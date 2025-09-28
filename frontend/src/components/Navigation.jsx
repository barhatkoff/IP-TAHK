import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Users, Activity, Gamepad2, MessageCircle, LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ChatInterface } from './ChatInterface';
import AuthModal from './AuthModal';

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [serverStatus, setServerStatus] = useState({ online: true, players: 247 });
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  // Mock server status update
  useEffect(() => {
    const interval = setInterval(() => {
      setServerStatus(prev => ({
        online: Math.random() > 0.1, // 90% uptime simulation
        players: Math.floor(Math.random() * 300) + 180
      }));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { path: '/', label: 'Главная', icon: Gamepad2 },
    { path: '/rules', label: 'Правила' },
    { path: '/events', label: 'События' },
    { path: '/guides', label: 'Руководства' },
    { path: '/community', label: 'Сообщество' },
    { path: '/downloads', label: 'Скачать' },
    { path: '/leaderboards', label: 'Рейтинги' },
    { path: '/support', label: 'Поддержка' },
  ];

  const handleLogout = () => {
    logout();
    setIsChatOpen(false);
  };

  return (
    <>
      <nav className="bg-secondary border-b border-border-subtle sticky top-0 z-50 backdrop-blur-md">
        <div className="container">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-accent-primary rounded-lg flex items-center justify-center">
                <Gamepad2 className="w-6 h-6 text-bg-primary" />
              </div>
              <div>
                <div className="h2 text-text-primary">DEADSIDE</div>
                <div className="body-sm text-text-muted -mt-1">Сервер</div>
              </div>
            </Link>

            {/* Server Status */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${serverStatus.online ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
                <span className="body-sm">
                  {serverStatus.online ? 'Сервер онлайн' : 'Сервер оффлайн'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-accent-primary" />
                <span className="body-sm">{serverStatus.players} игроков</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`body-md transition-colors hover:text-accent-primary ${
                      isActive ? 'text-accent-primary' : 'text-text-secondary'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {/* Chat Button */}
              {isAuthenticated && (
                <button
                  onClick={() => setIsChatOpen(!isChatOpen)}
                  className={`p-2 rounded-lg transition-colors ${
                    isChatOpen 
                      ? 'bg-accent-primary text-bg-primary' 
                      : 'text-text-secondary hover:text-accent-primary hover:bg-accent-bg'
                  }`}
                  title="Открыть чат"
                >
                  <MessageCircle className="w-5 h-5" />
                </button>
              )}

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <div className="hidden md:flex items-center space-x-2">
                    <div className="w-8 h-8 bg-accent-primary rounded-full flex items-center justify-center">
                      {user?.avatar ? (
                        <img src={user.avatar} alt="" className="w-8 h-8 rounded-full" />
                      ) : (
                        <span className="body-sm font-bold text-bg-primary">
                          {user?.username?.[0]?.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <span className="body-sm text-text-primary">{user?.username}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-text-secondary hover:text-red-400 transition-colors"
                    title="Выйти"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center space-x-2 btn-primary"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Войти</span>
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-2 text-text-secondary hover:text-text-primary transition-colors"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Открыть меню"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Server Status */}
          <div className="md:hidden flex items-center justify-center space-x-6 pb-4">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${serverStatus.online ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
              <span className="body-sm">
                {serverStatus.online ? 'Онлайн' : 'Оффлайн'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-accent-primary" />
              <span className="body-sm">{serverStatus.players}</span>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isOpen && (
            <div className="lg:hidden border-t border-border-subtle bg-bg-secondary">
              <div className="py-4 space-y-2">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive 
                          ? 'bg-accent-bg text-accent-primary' 
                          : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {Icon && <Icon className="w-5 h-5" />}
                      <span className="body-md">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Chat Interface */}
      <ChatInterface 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
};

export default Navigation;