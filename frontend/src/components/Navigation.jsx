import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Users, Activity, Gamepad2 } from 'lucide-react';

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [serverStatus, setServerStatus] = useState({ online: true, players: 247 });
  const location = useLocation();

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

  return (
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

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-text-secondary hover:text-text-primary transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Открыть меню"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
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
  );
};

export default Navigation;