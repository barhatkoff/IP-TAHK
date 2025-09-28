import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Users, Calendar, BookOpen, Download, Trophy, MessageCircle, Shield, Zap, Target, Globe } from 'lucide-react';
import { mockData } from '../utils/mockData';

export const Homepage = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [onlinePlayers, setOnlinePlayers] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);
  const [serverStats, setServerStats] = useState({});

  useEffect(() => {
    // Load mock data
    setOnlinePlayers(mockData.onlinePlayers);
    setRecentEvents(mockData.recentEvents.slice(0, 3));
    setServerStats(mockData.serverStats);

    // Video rotation
    const videoInterval = setInterval(() => {
      setCurrentVideoIndex(prev => (prev + 1) % mockData.backgroundVideos.length);
    }, 15000);

    return () => clearInterval(videoInterval);
  }, []);

  const features = [
    {
      icon: Shield,
      title: "Безопасность",
      description: "Система античита и модерации 24/7"
    },
    {
      icon: Zap,
      title: "Производительность", 
      description: "Высокопроизводительные сервера, минимальные лаги"
    },
    {
      icon: Target,
      title: "События",
      description: "Регулярные PvP турниры и особые события"
    },
    {
      icon: Globe,
      title: "Сообщество",
      description: "Активное русскоязычное комьюнити"
    }
  ];

  const quickActions = [
    { icon: Calendar, label: 'События', path: '/events', color: 'text-purple-400' },
    { icon: BookOpen, label: 'Руководства', path: '/guides', color: 'text-blue-400' },
    { icon: Download, label: 'Скачать', path: '/downloads', color: 'text-green-400' },
    { icon: Trophy, label: 'Рейтинги', path: '/leaderboards', color: 'text-orange-400' },
  ];

  return (
    <div className="min-h-screen">
      {/* Video Background */}
      <div className="fixed inset-0 z-0">
        {mockData.backgroundVideos.map((video, index) => (
          <video
            key={video.id}
            className={`video-background ${index === currentVideoIndex ? 'opacity-40' : 'opacity-0'}`}
            autoPlay
            loop
            muted
            playsInline
            style={{ transition: 'opacity 1s ease-in-out' }}
          >
            <source src={video.url} type="video/mp4" />
          </video>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-bg-primary/60 via-bg-primary/40 to-bg-primary/80"></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32">
        <div className="container">
          <div className="text-center animate-fade-in">
            <h1 className="display-lg text-text-primary mb-6">
              DEADSIDE
              <span className="block text-accent-primary">РОССИЯ</span>
            </h1>
            <p className="body-lg max-w-2xl mx-auto mb-8">
              Лучший русскоязычный сервер Deadside с активным комьюнити, регулярными событиями 
              и профессиональной поддержкой игроков 24/7
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link to="/downloads" className="btn-primary">
                <Download className="w-5 h-5 mr-2" />
                Начать играть
              </Link>
              <Link to="/rules" className="btn-secondary">
                <Shield className="w-5 h-5 mr-2" />
                Правила сервера
              </Link>
            </div>

            {/* Server Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              <div className="feature-card text-center">
                <div className="h2 text-accent-primary">{serverStats.onlinePlayers}</div>
                <div className="body-sm text-text-muted">Онлайн</div>
              </div>
              <div className="feature-card text-center">
                <div className="h2 text-accent-primary">{serverStats.totalPlayers}</div>
                <div className="body-sm text-text-muted">Всего игроков</div>
              </div>
              <div className="feature-card text-center">
                <div className="h2 text-accent-primary">{serverStats.uptime}</div>
                <div className="body-sm text-text-muted">Аптайм</div>
              </div>
              <div className="feature-card text-center">
                <div className="h2 text-accent-primary">{serverStats.ping}ms</div>
                <div className="body-sm text-text-muted">Пинг</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="relative z-10 py-16 bg-bg-secondary/80 backdrop-blur-sm">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link
                  key={index}
                  to={action.path}
                  className="feature-card hover-lift text-center group"
                >
                  <Icon className={`w-8 h-8 mx-auto mb-4 ${action.color} group-hover:text-accent-primary transition-colors`} />
                  <div className="h4 text-text-primary group-hover:text-accent-primary transition-colors">
                    {action.label}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="display-sm text-text-primary mb-4">Почему выбирают нас?</h2>
            <p className="body-lg text-text-secondary max-w-2xl mx-auto">
              Мы создали лучшие условия для игры в Deadside с фокусом на комьюнити и качество игрового процесса
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="feature-card hover-lift text-center">
                  <Icon className="w-12 h-12 text-accent-primary mx-auto mb-6" />
                  <h3 className="h3 text-text-primary mb-4">{feature.title}</h3>
                  <p className="body-md text-text-secondary">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recent Events & Online Players */}
      <section className="relative z-10 py-16 bg-bg-secondary/60 backdrop-blur-sm">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Recent Events */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="h1 text-text-primary">Последние события</h2>
                <Link to="/events" className="btn-ghost">
                  Все события
                </Link>
              </div>
              <div className="space-y-4">
                {recentEvents.map((event) => (
                  <div key={event.id} className="feature-card hover-lift">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-accent-bg rounded-lg flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-accent-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="h4 text-text-primary mb-2">{event.title}</h3>
                        <p className="body-sm text-text-secondary mb-2">{event.description}</p>
                        <div className="body-sm text-text-muted">{event.date}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Online Players */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="h1 text-text-primary">Игроки онлайн</h2>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="body-sm text-text-secondary">{onlinePlayers.length} онлайн</span>
                </div>
              </div>
              <div className="feature-card max-h-96 overflow-y-auto">
                <div className="space-y-3">
                  {onlinePlayers.map((player, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-border-subtle last:border-b-0">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-accent-bg rounded-full flex items-center justify-center">
                          <Users className="w-4 h-4 text-accent-primary" />
                        </div>
                        <span className="body-md text-text-primary">{player.nickname}</span>
                      </div>
                      <div className="body-sm text-text-muted">{player.playtime}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20">
        <div className="container">
          <div className="text-center">
            <h2 className="display-md text-text-primary mb-6">
              Готов присоединиться?
            </h2>
            <p className="body-lg text-text-secondary mb-8 max-w-2xl mx-auto">
              Скачай игру, изучи правила и начни свое приключение в мире Deadside уже сегодня
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/downloads" className="btn-primary glow-effect">
                <Download className="w-5 h-5 mr-2" />
                Скачать игру
              </Link>
              <Link to="/community" className="btn-secondary">
                <MessageCircle className="w-5 h-5 mr-2" />
                Discord сообщество
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;