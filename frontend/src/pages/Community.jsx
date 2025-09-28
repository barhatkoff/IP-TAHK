import React from 'react';
import { MessageCircle, Users, Calendar, TrendingUp } from 'lucide-react';
import { mockData } from '../utils/mockData';

export const Community = () => {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="display-md text-text-primary mb-4">Сообщество</h1>
          <p className="body-lg text-text-secondary max-w-2xl mx-auto">
            Присоединяйтесь к активному сообществу игроков Deadside, делитесь опытом и находите новых союзников
          </p>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="feature-card text-center">
            <Users className="w-8 h-8 text-accent-primary mx-auto mb-3" />
            <div className="h2 text-text-primary">12.5K</div>
            <div className="body-sm text-text-muted">Участников</div>
          </div>
          <div className="feature-card text-center">
            <MessageCircle className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <div className="h2 text-text-primary">2.3K</div>
            <div className="body-sm text-text-muted">Сообщений/день</div>
          </div>
          <div className="feature-card text-center">
            <Calendar className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <div className="h2 text-text-primary">15</div>
            <div className="body-sm text-text-muted">Событий/месяц</div>
          </div>
          <div className="feature-card text-center">
            <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <div className="h2 text-text-primary">247</div>
            <div className="body-sm text-text-muted">Онлайн сейчас</div>
          </div>
        </div>

        {/* News Section */}
        <div className="mb-16">
          <h2 className="h1 text-text-primary mb-8">Новости сообщества</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {mockData.communityNews.map((news) => (
              <div key={news.id} className="feature-card hover-lift">
                {/* News Image Placeholder */}
                <div className="w-full h-48 bg-bg-tertiary rounded-lg mb-4 flex items-center justify-center">
                  <MessageCircle className="w-12 h-12 text-text-muted" />
                </div>

                {/* Category & Date */}
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 bg-accent-bg text-accent-primary rounded-full body-sm">
                    {news.category}
                  </span>
                  <span className="body-sm text-text-muted">{news.date}</span>
                </div>

                {/* Title */}
                <h3 className="h3 text-text-primary mb-3">{news.title}</h3>
                
                {/* Excerpt */}
                <p className="body-md text-text-secondary mb-4">{news.excerpt}</p>

                {/* Author & Read More */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-accent-primary rounded-full"></div>
                    <span className="body-sm text-text-muted">{news.author}</span>
                  </div>
                  <button className="btn-ghost text-accent-primary hover:text-text-primary">
                    Читать далее
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Discord Section */}
        <div className="feature-card bg-indigo-900/20 border-indigo-500/30 text-center">
          <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="w-10 h-10 text-white" />
          </div>
          <h3 className="display-sm text-text-primary mb-4">Присоединяйтесь к Discord!</h3>
          <p className="body-lg text-text-secondary mb-6 max-w-2xl mx-auto">
            Наш Discord сервер - центр активности сообщества. Здесь вы найдете:
          </p>
          <div className="grid md:grid-cols-3 gap-4 mb-8 max-w-4xl mx-auto">
            <div className="text-left">
              <h4 className="h4 text-text-primary mb-2">💬 Общение</h4>
              <p className="body-sm text-text-secondary">Чаты для игроков, поиск команды</p>
            </div>
            <div className="text-left">
              <h4 className="h4 text-text-primary mb-2">📢 Новости</h4>
              <p className="body-sm text-text-secondary">Анонсы событий и обновлений</p>
            </div>
            <div className="text-left">
              <h4 className="h4 text-text-primary mb-2">🎮 Голосовые каналы</h4>
              <p className="body-sm text-text-secondary">Координация во время игры</p>
            </div>
          </div>
          <button className="btn-primary glow-effect">
            Присоединиться к Discord
          </button>
        </div>
      </div>
    </div>
  );
};

export default Community;