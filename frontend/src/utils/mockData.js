export const mockData = {
  // Background videos for homepage
  backgroundVideos: [
    {
      id: 1,
      url: "https://player.vimeo.com/progressive_redirect/playback/758668076/rendition/1080p/file.mp4?loc=external&signature=d6dc01c6a4b35b9d08e9f7c0c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8",
      title: "Deadside Gameplay 1"
    },
    {
      id: 2,
      url: "https://player.vimeo.com/progressive_redirect/playbook/758668076/rendition/720p/file.mp4?loc=external&signature=d6dc01c6a4b35b9d08e9f7c0c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8",
      title: "Deadside Gameplay 2"
    }
  ],

  // Server statistics
  serverStats: {
    onlinePlayers: 247,
    totalPlayers: "12.5K",
    uptime: "99.8%",
    ping: 15
  },

  // Online players list
  onlinePlayers: [
    { nickname: "SniperWolf_RU", playtime: "12h 34m" },
    { nickname: "DeadEye2024", playtime: "8h 15m" },
    { nickname: "RussianBear", playtime: "6h 42m" },
    { nickname: "StealthKiller", playtime: "5h 18m" },
    { nickname: "Москва_Воин", playtime: "4h 56m" },
    { nickname: "SiberianHunter", playtime: "4h 23m" },
    { nickname: "RedAlert_RU", playtime: "3h 47m" },
    { nickname: "NightStalker", playtime: "3h 15m" },
    { nickname: "CyberSpetsnaz", playtime: "2h 58m" },
    { nickname: "IronFist_007", playtime: "2h 33m" },
    { nickname: "WarriorSoul", playtime: "2h 12m" },
    { nickname: "GhostRecon_RU", playtime: "1h 45m" },
    { nickname: "StormTrooper", playtime: "1h 28m" },
    { nickname: "DeadZone_Hero", playtime: "1h 15m" },
    { nickname: "RussianLegend", playtime: "0h 52m" }
  ],

  // Recent events
  recentEvents: [
    {
      id: 1,
      title: "PvP Турнир 'Битва за склад'",
      description: "Командный турнир на выживание с призовым фондом 50,000 игровых монет",
      date: "25 августа 2025, 19:00 МСК",
      type: "tournament",
      image: "/images/events/pvp-tournament.jpg"
    },
    {
      id: 2,
      title: "Двойной опыт выходного дня",
      description: "Получайте x2 опыта за все действия в течение выходных дней",
      date: "23-24 августа 2025",
      type: "bonus",
      image: "/images/events/double-xp.jpg"
    },
    {
      id: 3,
      title: "Обновление карты 'Заброшенный город'",
      description: "Новые локации, улучшенная графика и дополнительный лут",
      date: "20 августа 2025",
      type: "update",
      image: "/images/events/map-update.jpg"
    },
    {
      id: 4,
      title: "Ивент 'Ночная охота'",
      description: "Специальные задания доступны только в ночное время",
      date: "18 августа 2025, 22:00 МСК",
      type: "event",
      image: "/images/events/night-hunt.jpg"
    }
  ],

  // Server rules
  serverRules: [
    {
      id: 1,
      category: "Общие правила",
      rules: [
        "Запрещено использование читов, багов и эксплоитов",
        "Уважительное общение с другими игроками обязательно",
        "Запрещены оскорбления по национальному, религиозному признаку",
        "Администрация имеет право наказать за нарушения по своему усмотрению"
      ]
    },
    {
      id: 2,
      category: "PvP правила",
      rules: [
        "Запрещено убийство новичков (игроков с уровнем ниже 10)",
        "Кемпинг точек респауна карается баном",
        "Тимкиллинг разрешен только в составе одной группы",
        "Запрещено использование глитчей карты для получения преимущества"
      ]
    },
    {
      id: 3,
      category: "Чат и коммуникация",
      rules: [
        "Запрещен флуд и спам в чате",
        "Реклама других серверов запрещена",
        "Торговля игровыми предметами за реальные деньги запрещена",
        "Использование голосового чата должно быть культурным"
      ]
    }
  ],

  // Player guides
  playerGuides: [
    {
      id: 1,
      title: "Начало игры для новичков",
      description: "Полный гайд по первым шагам в Deadside",
      category: "Новички",
      author: "AdminVladimir",
      views: 15420,
      image: "/images/guides/beginner.jpg",
      content: `
        # Добро пожаловать в Deadside!
        
        ## Первые шаги
        - Создайте персонажа и выберите внешность
        - Изучите интерфейс игры
        - Найдите безопасное место для изучения механик
        
        ## Базовые механики
        - Система здоровья и голода
        - Крафт базовых предметов
        - Поиск лута и ресурсов
      `
    },
    {
      id: 2,
      title: "Лучшие места для лута",
      description: "Подробная карта всех локаций с ценным лутом",
      category: "Исследование",
      author: "MapMaster2024",
      views: 23150,
      image: "/images/guides/loot-spots.jpg"
    },
    {
      id: 3,
      title: "Гайд по PvP сражениям",
      description: "Тактики и стратегии для побед в PvP",
      category: "PvP",
      author: "ProGamer_RU",
      views: 18900,
      image: "/images/guides/pvp-guide.jpg"
    }
  ],

  // Community news
  communityNews: [
    {
      id: 1,
      title: "Августовское обновление: новые возможности!",
      excerpt: "Встречайте масштабное обновление с новыми локациями, оружием и системой достижений",
      author: "AdminTeam",
      date: "2025-08-22",
      category: "Обновления",
      image: "/images/news/august-update.jpg"
    },
    {
      id: 2,
      title: "Результаты летнего турнира",
      excerpt: "Поздравляем победителей летнего PvP турнира и анонсируем осенние соревнования",
      author: "TournamentOrg",
      date: "2025-08-20",
      category: "Турниры",
      image: "/images/news/summer-tournament.jpg"
    }
  ],

  // Download links
  downloads: [
    {
      id: 1,
      title: "Deadside - Базовая игра",
      description: "Официальный клиент игры Deadside",
      version: "0.7.1.2",
      size: "12.5 GB",
      platform: "Windows",
      link: "https://store.steampowered.com/app/895400/Deadside/",
      type: "steam"
    },
    {
      id: 2,
      title: "Модпак сервера",
      description: "Дополнительные моды и улучшения для нашего сервера",
      version: "2.1.0",
      size: "850 MB",
      platform: "Windows",
      link: "/downloads/server-modpack.zip",
      type: "direct"
    }
  ],

  // Leaderboards
  leaderboards: {
    kills: [
      { rank: 1, player: "DeathMachine_RU", score: 2847, change: "+5" },
      { rank: 2, player: "SniperElite", score: 2654, change: "+12" },
      { rank: 3, player: "NightKiller", score: 2531, change: "-1" },
      { rank: 4, player: "HeadHunter_007", score: 2398, change: "+3" },
      { rank: 5, player: "StormBreaker", score: 2245, change: "+8" }
    ],
    playtime: [
      { rank: 1, player: "NoLifeGamer", score: "1,247h", change: "+15h" },
      { rank: 2, player: "DedicatedPlayer", score: "1,156h", change: "+23h" },
      { rank: 3, player: "ServerVeteran", score: "1,089h", change: "+12h" },
      { rank: 4, player: "AlwaysOnline", score: "987h", change: "+18h" },
      { rank: 5, player: "GrindMaster", score: "945h", change: "+25h" }
    ]
  }
};