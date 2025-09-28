import React from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, MessageCircle, Users, Mail, ExternalLink } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    game: [
      { label: 'Правила сервера', path: '/rules' },
      { label: 'Скачать игру', path: '/downloads' },
      { label: 'Руководства', path: '/guides' },
      { label: 'Рейтинги', path: '/leaderboards' },
    ],
    community: [
      { label: 'События', path: '/events' },
      { label: 'Сообщество', path: '/community' },
      { label: 'Discord', href: 'https://discord.gg/deadside-russia' },
      { label: 'Поддержка', path: '/support' },
    ],
    info: [
      { label: 'О проекте', path: '/about' },
      { label: 'Контакты', path: '/contact' },
      { label: 'Политика конфиденциальности', path: '/privacy' },
      { label: 'Пожертвования', path: '/donate' },
    ]
  };

  const socialLinks = [
    { 
      name: 'Discord', 
      href: 'https://discord.gg/deadside-russia', 
      icon: MessageCircle,
      color: 'hover:text-indigo-400' 
    },
    { 
      name: 'VK', 
      href: 'https://vk.com/deadside_russia', 
      icon: Users,
      color: 'hover:text-blue-400' 
    },
    { 
      name: 'Telegram', 
      href: 'https://t.me/deadside_russia', 
      icon: Mail,
      color: 'hover:text-cyan-400' 
    }
  ];

  return (
    <footer className="bg-bg-secondary border-t border-border-subtle mt-20">
      <div className="container">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <Link to="/" className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-accent-primary rounded-lg flex items-center justify-center">
                  <Gamepad2 className="w-7 h-7 text-bg-primary" />
                </div>
                <div>
                  <div className="h2 text-text-primary">DEADSIDE</div>
                  <div className="body-sm text-text-muted -mt-1">Россия</div>
                </div>
              </Link>
              <p className="body-md text-text-secondary mb-6">
                Лучший русскоязычный сервер Deadside с активным сообществом и профессиональной поддержкой игроков.
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-10 h-10 bg-bg-tertiary rounded-lg flex items-center justify-center text-text-muted transition-all hover:bg-accent-primary hover:text-bg-primary transform hover:-translate-y-1 ${social.color}`}
                      aria-label={social.name}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Links Columns */}
            <div className="lg:col-span-3 grid md:grid-cols-3 gap-8">
              {/* Game Links */}
              <div>
                <h3 className="h4 text-text-primary mb-4">Игра</h3>
                <ul className="space-y-3">
                  {footerLinks.game.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.path}
                        className="body-md text-text-muted hover:text-accent-primary transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Community Links */}
              <div>
                <h3 className="h4 text-text-primary mb-4">Сообщество</h3>
                <ul className="space-y-3">
                  {footerLinks.community.map((link) => (
                    <li key={link.label}>
                      {link.href ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="body-md text-text-muted hover:text-accent-primary transition-colors flex items-center space-x-1"
                        >
                          <span>{link.label}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <Link
                          to={link.path}
                          className="body-md text-text-muted hover:text-accent-primary transition-colors"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Info Links */}
              <div>
                <h3 className="h4 text-text-primary mb-4">Информация</h3>
                <ul className="space-y-3">
                  {footerLinks.info.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.path}
                        className="body-md text-text-muted hover:text-accent-primary transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-border-subtle py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="body-sm text-text-muted mb-4 md:mb-0">
              © {currentYear} DEADSIDE Россия. Все права защищены.
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="body-sm text-text-muted">Сервер онлайн</span>
              </div>
              <div className="body-sm text-text-muted">
                Версия сайта: 2.1.0
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;