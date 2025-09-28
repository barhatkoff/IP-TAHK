import React from 'react';
import { Shield, AlertTriangle, Users, MessageSquare } from 'lucide-react';
import { mockData } from '../utils/mockData';

export const ServerRules = () => {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="display-md text-text-primary mb-4">Правила сервера</h1>
          <p className="body-lg text-text-secondary max-w-2xl mx-auto">
            Для комфортной игры всех участников соблюдайте правила нашего сервера
          </p>
        </div>

        {/* Rules Categories */}
        <div className="space-y-8">
          {mockData.serverRules.map((category, index) => (
            <div key={category.id} className="feature-card">
              <div className="flex items-center space-x-3 mb-6">
                {index === 0 && <Shield className="w-8 h-8 text-accent-primary" />}
                {index === 1 && <Users className="w-8 h-8 text-accent-primary" />}
                {index === 2 && <MessageSquare className="w-8 h-8 text-accent-primary" />}
                <h2 className="h2 text-text-primary">{category.category}</h2>
              </div>
              <div className="space-y-4">
                {category.rules.map((rule, ruleIndex) => (
                  <div key={ruleIndex} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-accent-primary rounded-full mt-3 flex-shrink-0"></div>
                    <p className="body-md text-text-secondary">{rule}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Warning Notice */}
        <div className="mt-12 feature-card bg-red-900/20 border-red-500/30">
          <div className="flex items-start space-x-4">
            <AlertTriangle className="w-8 h-8 text-red-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="h3 text-red-300 mb-2">Важно!</h3>
              <p className="body-md text-text-secondary">
                Нарушение правил может привести к временному или постоянному бану. 
                В спорных ситуациях решение администрации является окончательным. 
                Незнание правил не освобождает от ответственности.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServerRules;