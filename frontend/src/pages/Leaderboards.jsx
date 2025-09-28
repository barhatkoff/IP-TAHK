import React from 'react';
import { Trophy, TrendingUp, TrendingDown, Minus, Crown, Medal, Award } from 'lucide-react';
import { mockData } from '../utils/mockData';

export const Leaderboards = () => {
  const [activeTab, setActiveTab] = React.useState('kills');

  const tabs = [
    { id: 'kills', label: 'По убийствам', icon: Trophy },
    { id: 'playtime', label: 'По времени игры', icon: TrendingUp },
  ];

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return Crown;
      case 2: return Medal;
      case 3: return Award;
      default: return null;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return 'text-yellow-400';
      case 2: return 'text-gray-300';
      case 3: return 'text-orange-400';
      default: return 'text-text-muted';
    }
  };

  const getChangeIcon = (change) => {
    const numChange = parseInt(change.replace(/[+\-]/g, ''));
    if (change.startsWith('+')) return { icon: TrendingUp, color: 'text-green-400' };
    if (change.startsWith('-')) return { icon: TrendingDown, color: 'text-red-400' };
    return { icon: Minus, color: 'text-text-muted' };
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="display-md text-text-primary mb-4">Рейтинги игроков</h1>
          <p className="body-lg text-text-secondary max-w-2xl mx-auto">
            Соревнуйтесь с другими игроками и занимайте топовые позиции в различных категориях
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-bg-secondary rounded-lg p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
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
        </div>

        {/* Leaderboard */}
        <div className="feature-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-subtle">
                  <th className="text-left py-4 px-6 h4 text-text-primary">Место</th>
                  <th className="text-left py-4 px-6 h4 text-text-primary">Игрок</th>
                  <th className="text-left py-4 px-6 h4 text-text-primary">
                    {activeTab === 'kills' ? 'Убийства' : 'Время игры'}
                  </th>
                  <th className="text-left py-4 px-6 h4 text-text-primary">Изменения</th>
                </tr>
              </thead>
              <tbody>
                {mockData.leaderboards[activeTab].map((player, index) => {
                  const RankIcon = getRankIcon(player.rank);
                  const rankColor = getRankColor(player.rank);
                  const changeData = getChangeIcon(player.change);
                  const ChangeIcon = changeData.icon;

                  return (
                    <tr
                      key={player.player}
                      className={`border-b border-border-subtle hover:bg-bg-secondary transition-colors ${
                        player.rank <= 3 ? 'bg-accent-bg/10' : ''
                      }`}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          {RankIcon ? (
                            <RankIcon className={`w-6 h-6 ${rankColor}`} />
                          ) : (
                            <div className="w-6 h-6 flex items-center justify-center">
                              <span className="body-md font-bold text-text-muted">#{player.rank}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="body-md font-medium text-text-primary">{player.player}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="h4 text-accent-primary">{player.score}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <ChangeIcon className={`w-4 h-4 ${changeData.color}`} />
                          <span className={`body-sm ${changeData.color}`}>{player.change}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Season Info */}
        <div className="mt-12 feature-card bg-accent-bg/20 border-accent-primary/30 text-center">
          <Trophy className="w-16 h-16 text-accent-primary mx-auto mb-4" />
          <h3 className="h2 text-text-primary mb-4">Сезон 3 - Август 2025</h3>
          <p className="body-lg text-text-secondary mb-6">
            Соревнуйтесь за призовые места! В конце сезона лучшие игроки получат эксклюзивные награды и внутриигровые бонусы.
          </p>
          <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div>
              <div className="h3 text-yellow-400">🥇 1-е место</div>
              <p className="body-sm text-text-muted">50,000 игровых монет</p>
            </div>
            <div>
              <div className="h3 text-gray-300">🥈 2-е место</div>
              <p className="body-sm text-text-muted">30,000 игровых монет</p>
            </div>
            <div>
              <div className="h3 text-orange-400">🥉 3-е место</div>
              <p className="body-sm text-text-muted">15,000 игровых монет</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboards;