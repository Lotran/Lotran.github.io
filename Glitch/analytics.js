// analytics.js — атмосферный трекер для ARG
(function() {
  'use strict';

  const CONFIG = {
    
    DISCORD_WEBHOOK: '',
    PROJECT_ID: 'glitch_arg_v1',
    RATE_LIMIT: 3000 // мин. интервал между событиями (мс)
  };

  let lastEventTime = 0;

  // Глобальная функция для вызова из любого места
  window.argTrack = function(event, details = {}) {
    const now = Date.now();
    if (now - lastEventTime < CONFIG.RATE_LIMIT) {
      console.warn('[ARG] Rate limit. Событие пропущено.');
      return;
    }
    lastEventTime = now;
// Отправка в глобальный счётчик (анонимно)
try {
  fetch(`https://api.countapi.xyz/hit/glitch-arg-v1/${event}`);
} catch(e) {}
    // 1. Локальное сохранение (работает всегда, даже оффлайн)
    const localKey = `${CONFIG.PROJECT_ID}_${event}`;
    const count = parseInt(localStorage.getItem(localKey) || '0') + 1;
    localStorage.setItem(localKey, count);
    console.log(`%c[ARG] 📦 ${event} | Локально: ${count}`, 'color:#0f0');

    // 2. Отправка в Discord (если задан URL)
    if (CONFIG.DISCORD_WEBHOOK && CONFIG.DISCORD_WEBHOOK.startsWith('https://')) {
      const payload = {
        username: 'SYSTEM_LOG',
        avatar_url: 'https://i.imgur.com/7Q5kZ9L.png', // можно заменить на свою иконку
        content: `📊 **[${new Date().toLocaleTimeString()}] ${event}**\n${Object.entries(details).map(([k, v]) => `\`${k}\`: ${v}`).join('\n') || '_без деталей_'}`
      };

      fetch(CONFIG.DISCORD_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true // отправит даже при закрытии вкладки
      }).catch(e => console.warn('[ARG] Discord offline:', e));
    }
  };

  // Авто-трекинг загрузки страницы
  document.addEventListener('DOMContentLoaded', () => {
    const page = location.pathname.split('/').pop() || 'index.html';
    argTrack('page_load', { page, ref: document.referrer || 'direct' });
  });

  console.log('%c[ARG] ✅ Модуль аналитики загружен.', 'color:#0f0; font-weight:bold');
})();
