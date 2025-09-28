import React from 'react';
import { Calendar, Trophy, Gift, Zap } from 'lucide-react';
import { mockData } from '../utils/mockData';

export const Events = () => {
  const getEventIcon = (type) => {
    switch (type) {
      case 'tournament': return Trophy;
      case 'bonus': return Gift;
      case 'update': return Zap;
      default: return Calendar;
    }
  };

  const getEventColor = (type) => {
    switch (type) {
      case 'tournament': return 'text-purple-400';
      case 'bonus': return 'text-green-400';
      case 'update': return 'text-blue-400';
      default: return 'text-accent-primary';
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="display-md text-text-primary mb-4">События сервера</h1>
          <p className="body-lg text-text-secondary max-w-2xl mx-auto">
            Не пропустите увлекательные события, турниры и специальные акции на нашем сервере
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {mockData.recentEvents.map((event) => {
            const Icon = getEventIcon(event.type);
            const colorClass = getEventColor(event.type);
            
            return (
              <div key={event.id} className="feature-card hover-lift">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-12 h-12 bg-accent-bg rounded-lg flex items-center justify-center">
                    <Icon className={`w-6 h-6 ${colorClass}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="h3 text-text-primary mb-2">{event.title}</h3>
                    <p className="body-sm text-accent-primary uppercase tracking-wider">
                      {event.type === 'tournament' && 'Турнир'}
                      {event.type === 'bonus' && 'Бонусное событие'}
                      {event.type === 'update' && 'Обновление'}
                      {event.type === 'event' && 'Событие'}
                    </p>
                  </div>
                </div>
                
                <p className="body-md text-text-secondary mb-4">
                  {event.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-text-muted" />
                    <span className="body-sm text-text-muted">{event.date}</span>
                  </div>
                  <button className="btn-ghost text-accent-primary hover:text-text-primary">
                    Подробнее
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Upcoming Events Notice */}
        <div className="mt-16 feature-card bg-accent-bg/20 border-accent-primary/30 text-center">
          <Calendar className="w-16 h-16 text-accent-primary mx-auto mb-4" />
          <h3 className="h2 text-text-primary mb-2">Следите за новыми событиями!</h3>
          <p className="body-lg text-text-secondary">
            Подпишитесь на наш Discord канал, чтобы первыми узнавать о новых турнирах и акциях
          </p>
        </div>
      </div>
    </div>
  );
};

export default Events;