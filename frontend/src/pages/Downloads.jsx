import React from 'react';
import { Download, ExternalLink, Monitor, HardDrive, Cpu } from 'lucide-react';
import { mockData } from '../utils/mockData';

export const Downloads = () => {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="display-md text-text-primary mb-4">Скачать игру</h1>
          <p className="body-lg text-text-secondary max-w-2xl mx-auto">
            Загрузите игру и все необходимые файлы для комфортной игры на нашем сервере
          </p>
        </div>

        {/* System Requirements */}
        <div className="feature-card mb-12">
          <h2 className="h2 text-text-primary mb-6">Системные требования</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <Cpu className="w-12 h-12 text-accent-primary mx-auto mb-4" />
              <h3 className="h4 text-text-primary mb-2">Процессор</h3>
              <p className="body-sm text-text-muted">Intel Core i5-4590 / AMD FX 8350</p>
            </div>
            <div className="text-center">
              <HardDrive className="w-12 h-12 text-accent-primary mx-auto mb-4" />
              <h3 className="h4 text-text-primary mb-2">Память</h3>
              <p className="body-sm text-text-muted">8 GB RAM, 15 GB свободного места</p>
            </div>
            <div className="text-center">
              <Monitor className="w-12 h-12 text-accent-primary mx-auto mb-4" />
              <h3 className="h4 text-text-primary mb-2">Видеокарта</h3>
              <p className="body-sm text-text-muted">NVIDIA GTX 1050 / AMD RX 560</p>
            </div>
          </div>
        </div>

        {/* Downloads */}
        <div className="space-y-6">
          {mockData.downloads.map((download) => (
            <div key={download.id} className="feature-card hover-lift">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-accent-bg rounded-lg flex items-center justify-center">
                    <Download className="w-8 h-8 text-accent-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="h3 text-text-primary mb-2">{download.title}</h3>
                    <p className="body-md text-text-secondary mb-4">{download.description}</p>
                    <div className="flex items-center space-x-4 text-text-muted">
                      <span className="body-sm">Версия: {download.version}</span>
                      <span className="body-sm">Размер: {download.size}</span>
                      <span className="body-sm">Платформа: {download.platform}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  {download.type === 'steam' ? (
                    <a
                      href={download.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary flex items-center space-x-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Steam</span>
                    </a>
                  ) : (
                    <button className="btn-primary flex items-center space-x-2">
                      <Download className="w-4 h-4" />
                      <span>Скачать</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Installation Guide */}
        <div className="mt-16 feature-card bg-accent-bg/20 border-accent-primary/30">
          <h3 className="h2 text-text-primary mb-6">Инструкция по установке</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-accent-primary text-bg-primary rounded-full flex items-center justify-center flex-shrink-0 font-bold">1</div>
              <p className="body-md text-text-secondary">Скачайте и установите Deadside через Steam</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-accent-primary text-bg-primary rounded-full flex items-center justify-center flex-shrink-0 font-bold">2</div>
              <p className="body-md text-text-secondary">Загрузите и установите модпак нашего сервера</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-accent-primary text-bg-primary rounded-full flex items-center justify-center flex-shrink-0 font-bold">3</div>
              <p className="body-md text-text-secondary">Запустите игру и найдите наш сервер в списке</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-accent-primary text-bg-primary rounded-full flex items-center justify-center flex-shrink-0 font-bold">4</div>
              <p className="body-md text-text-secondary">Присоединяйтесь к нашему Discord для координации</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Downloads;