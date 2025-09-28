import React from 'react';
import { MessageCircle, Mail, Clock, HelpCircle, AlertCircle, CheckCircle } from 'lucide-react';

export const Support = () => {
  const [formData, setFormData] = React.useState({
    type: 'general',
    subject: '',
    message: '',
    email: '',
    urgent: false
  });

  const supportTypes = [
    { id: 'general', label: 'Общий вопрос', icon: HelpCircle },
    { id: 'technical', label: 'Техническая проблема', icon: AlertCircle },
    { id: 'report', label: 'Жалоба на игрока', icon: MessageCircle },
    { id: 'suggestion', label: 'Предложение', icon: CheckCircle },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock form submission
    alert('Ваше сообщение отправлено! Мы ответим в течение 24 часов.');
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="display-md text-text-primary mb-4">Поддержка</h1>
          <p className="body-lg text-text-secondary max-w-2xl mx-auto">
            Нужна помощь? Мы здесь, чтобы помочь вам с любыми вопросами или проблемами
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <div className="feature-card">
              <h2 className="h2 text-text-primary mb-6">Отправить запрос</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Support Type */}
                <div>
                  <label className="block h4 text-text-primary mb-3">Тип запроса</label>
                  <div className="grid grid-cols-2 gap-3">
                    {supportTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, type: type.id }))}
                          className={`flex items-center space-x-3 p-4 rounded-lg border transition-all ${
                            formData.type === type.id
                              ? 'border-accent-primary bg-accent-bg text-accent-primary'
                              : 'border-border-primary bg-bg-secondary text-text-secondary hover:border-accent-primary/50'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="body-sm">{type.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block h4 text-text-primary mb-3">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="input-field"
                    placeholder="your.email@example.com"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="block h4 text-text-primary mb-3">Тема</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    className="input-field"
                    placeholder="Краткое описание проблемы"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block h4 text-text-primary mb-3">Сообщение</label>
                  <textarea
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    className="input-field resize-none"
                    placeholder="Подробно опишите вашу проблему или вопрос..."
                  />
                </div>

                {/* Urgent Checkbox */}
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="urgent"
                    checked={formData.urgent}
                    onChange={(e) => setFormData(prev => ({ ...prev, urgent: e.target.checked }))}
                    className="w-5 h-5 text-accent-primary bg-bg-secondary border-border-primary rounded focus:ring-accent-primary"
                  />
                  <label htmlFor="urgent" className="body-md text-text-secondary">
                    Срочный запрос (ответ в течение 4 часов)
                  </label>
                </div>

                {/* Submit Button */}
                <button type="submit" className="btn-primary w-full">
                  <Mail className="w-5 h-5 mr-2" />
                  Отправить запрос
                </button>
              </form>
            </div>
          </div>

          {/* Contact Info & FAQ */}
          <div className="space-y-8">
            {/* Contact Methods */}
            <div className="feature-card">
              <h3 className="h2 text-text-primary mb-6">Способы связи</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-indigo-600/20 rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="h4 text-text-primary">Discord</h4>
                    <p className="body-sm text-text-secondary mb-2">
                      Самый быстрый способ получить помощь
                    </p>
                    <a href="#" className="body-sm text-accent-primary hover:text-text-primary">
                      Присоединиться к каналу поддержки
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h4 className="h4 text-text-primary">Email</h4>
                    <p className="body-sm text-text-secondary mb-2">
                      Для подробных запросов и отчетов
                    </p>
                    <a href="mailto:support@deadside-russia.com" className="body-sm text-accent-primary hover:text-text-primary">
                      support@deadside-russia.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-600/20 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <h4 className="h4 text-text-primary">Время ответа</h4>
                    <p className="body-sm text-text-secondary">
                      Обычно: 2-24 часа<br />
                      Срочные запросы: до 4 часов
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="feature-card">
              <h3 className="h2 text-text-primary mb-6">Частые вопросы</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="h4 text-text-primary mb-2">Как подключиться к серверу?</h4>
                  <p className="body-sm text-text-secondary">
                    Найдите наш сервер в игре по названию "DEADSIDE РОССИЯ" или используйте IP-адрес из раздела "Скачать".
                  </p>
                </div>

                <div>
                  <h4 className="h4 text-text-primary mb-2">Что делать если меня забанили?</h4>
                  <p className="body-sm text-text-secondary">
                    Создайте запрос в поддержку с типом "Жалоба на игрока" и опишите ситуацию. Мы рассмотрим ваше дело.
                  </p>
                </div>

                <div>
                  <h4 className="h4 text-text-primary mb-2">Как стать модератором?</h4>
                  <p className="body-sm text-text-secondary">
                    Активные и адекватные игроки могут подать заявку через Discord или форму обратной связи.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;