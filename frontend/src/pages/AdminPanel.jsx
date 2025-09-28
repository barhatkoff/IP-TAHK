import React from 'react';
import { Settings, Users, MessageSquare, BarChart3, Shield, Edit, Trash2, Plus } from 'lucide-react';

export const AdminPanel = () => {
  const [activeTab, setActiveTab] = React.useState('content');
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [loginForm, setLoginForm] = React.useState({ username: '', password: '' });

  const handleLogin = (e) => {
    e.preventDefault();
    // Mock authentication - in real app this would be proper auth
    if (loginForm.username === 'admin' && loginForm.password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Неверные данные для входа');
    }
  };

  const adminTabs = [
    { id: 'content', label: 'Контент', icon: Edit },
    { id: 'users', label: 'Пользователи', icon: Users },
    { id: 'events', label: 'События', icon: MessageSquare },
    { id: 'analytics', label: 'Аналитика', icon: BarChart3 },
    { id: 'settings', label: 'Настройки', icon: Settings },
  ];

  // Mock data for admin panel
  const mockContent = [
    { id: 1, type: 'Новость', title: 'Августовское обновление', status: 'Опубликовано' },
    { id: 2, type: 'Событие', title: 'PvP Турнир', status: 'Запланировано' },
    { id: 3, type: 'Гайд', title: 'Начало игры для новичков', status: 'Черновик' },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="feature-card max-w-md w-full">
          <div className="text-center mb-8">
            <Shield className="w-16 h-16 text-accent-primary mx-auto mb-4" />
            <h1 className="h1 text-text-primary">Панель администратора</h1>
            <p className="body-md text-text-secondary">Войдите для доступа к панели управления</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block h4 text-text-primary mb-3">Имя пользователя</label>
              <input
                type="text"
                required
                value={loginForm.username}
                onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                className="input-field"
                placeholder="admin"
              />
            </div>

            <div>
              <label className="block h4 text-text-primary mb-3">Пароль</label>
              <input
                type="password"
                required
                value={loginForm.password}
                onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                className="input-field"
                placeholder="Введите пароль"
              />
            </div>

            <button type="submit" className="btn-primary w-full">
              Войти
            </button>
          </form>

          <div className="mt-6 p-4 bg-accent-bg/20 rounded-lg border border-accent-primary/30">
            <p className="body-sm text-text-muted">
              <strong>Демо-доступ:</strong><br />
              Логин: admin<br />
              Пароль: admin123
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="display-sm text-text-primary">Панель администратора</h1>
            <p className="body-md text-text-secondary">Управление контентом и настройками сервера</p>
          </div>
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="btn-secondary"
          >
            Выйти
          </button>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto mb-8 bg-bg-secondary rounded-lg p-2">
          {adminTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-accent-primary text-bg-primary'
                    : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="feature-card">
          {activeTab === 'content' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="h2 text-text-primary">Управление контентом</h2>
                <button className="btn-primary flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Создать</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border-subtle">
                      <th className="text-left py-3 h4 text-text-primary">Тип</th>
                      <th className="text-left py-3 h4 text-text-primary">Заголовок</th>
                      <th className="text-left py-3 h4 text-text-primary">Статус</th>
                      <th className="text-left py-3 h4 text-text-primary">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockContent.map((item) => (
                      <tr key={item.id} className="border-b border-border-subtle">
                        <td className="py-3 body-sm text-text-secondary">{item.type}</td>
                        <td className="py-3 body-md text-text-primary">{item.title}</td>
                        <td className="py-3">
                          <span className={`px-3 py-1 rounded-full text-xs ${
                            item.status === 'Опубликовано' ? 'bg-green-900/30 text-green-400' :
                            item.status === 'Запланировано' ? 'bg-blue-900/30 text-blue-400' :
                            'bg-yellow-900/30 text-yellow-400'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-accent-primary hover:bg-accent-bg rounded">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-red-400 hover:bg-red-900/20 rounded">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <h2 className="h2 text-text-primary mb-6">Управление пользователями</h2>
              <p className="body-md text-text-secondary">
                Здесь будет интерфейс для управления пользователями, их правами и банами.
              </p>
            </div>
          )}

          {activeTab === 'events' && (
            <div>
              <h2 className="h2 text-text-primary mb-6">Управление событиями</h2>
              <p className="body-md text-text-secondary">
                Создавайте и редактируйте события сервера, турниры и акции.
              </p>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div>
              <h2 className="h2 text-text-primary mb-6">Аналитика</h2>
              <p className="body-md text-text-secondary">
                Статистика посещаемости сайта, активности игроков и популярного контента.
              </p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h2 className="h2 text-text-primary mb-6">Настройки сервера</h2>
              <p className="body-md text-text-secondary">
                Общие настройки сервера, модерации и интеграций.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;