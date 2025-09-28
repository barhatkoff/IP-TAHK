import React from 'react';
import { BookOpen, Eye, User, Star } from 'lucide-react';
import { mockData } from '../utils/mockData';

export const PlayerGuides = () => {
  const categories = ['Все', 'Новички', 'PvP', 'Исследование', 'Крафт'];
  const [activeCategory, setActiveCategory] = React.useState('Все');

  const filteredGuides = activeCategory === 'Все' 
    ? mockData.playerGuides 
    : mockData.playerGuides.filter(guide => guide.category === activeCategory);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="display-md text-text-primary mb-4">Руководства для игроков</h1>
          <p className="body-lg text-text-secondary max-w-2xl mx-auto">
            Изучайте игровые механики, стратегии и секреты с нашими подробными гайдами
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeCategory === category
                  ? 'bg-accent-primary text-bg-primary'
                  : 'bg-bg-secondary text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Guides Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredGuides.map((guide) => (
            <div key={guide.id} className="feature-card hover-lift">
              {/* Guide Image Placeholder */}
              <div className="w-full h-48 bg-bg-tertiary rounded-lg mb-4 flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-text-muted" />
              </div>

              {/* Category Badge */}
              <div className="inline-block px-3 py-1 bg-accent-bg rounded-full mb-3">
                <span className="body-sm text-accent-primary font-medium">{guide.category}</span>
              </div>

              {/* Guide Title */}
              <h3 className="h3 text-text-primary mb-3">{guide.title}</h3>
              
              {/* Description */}
              <p className="body-md text-text-secondary mb-4 line-clamp-2">
                {guide.description}
              </p>

              {/* Author & Stats */}
              <div className="flex items-center justify-between text-text-muted mb-4">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span className="body-sm">{guide.author}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4" />
                  <span className="body-sm">{guide.views.toLocaleString()}</span>
                </div>
              </div>

              {/* Read Button */}
              <button className="btn-primary w-full">
                Читать гайд
              </button>
            </div>
          ))}
        </div>

        {/* No Guides Message */}
        {filteredGuides.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-text-muted mx-auto mb-4" />
            <h3 className="h2 text-text-primary mb-2">Гайды не найдены</h3>
            <p className="body-lg text-text-secondary">
              В категории "{activeCategory}" пока нет доступных руководств
            </p>
          </div>
        )}

        {/* Contribute Section */}
        <div className="mt-16 feature-card bg-accent-bg/20 border-accent-primary/30 text-center">
          <Star className="w-16 h-16 text-accent-primary mx-auto mb-4" />
          <h3 className="h2 text-text-primary mb-4">Поделитесь знаниями!</h3>
          <p className="body-lg text-text-secondary mb-6">
            Если у вас есть полезные советы или стратегии, создайте свой собственный гайд для сообщества
          </p>
          <button className="btn-primary">
            Создать гайд
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerGuides;