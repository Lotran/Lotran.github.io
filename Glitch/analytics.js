// analytics.js — атмосферный трекер для ARG
(function() {
  'use strict';

  const CONFIG = {
    
    DISCORD_WEBHOOK: '',
    PROJECT_ID: 'glitch_arg_v1',
    RATE_LIMIT: 3000 // мин. интервал между событиями (мс)
  };

  let lastEventTime = 0;


  window.argTrack = function(event, details = {}) {
  // Локально (уже работает)
  const localKey = `glitch_arg_${event}`;
  const count = parseInt(localStorage.getItem(localKey) || '0') + 1;
  localStorage.setItem(localKey, count);
  console.log(`%c[ARG] 📦 ${event} | Локально: ${count}`, 'color:#0f0');
  
  // Глобально (простой API)
  const userId = 'GlitchGoblin-arg-2026'; // Уникальное имя
  fetch(`https://api.countapi.xyz/hit/${userId}/${event}`)
    .catch(e => console.log('Stats offline'));
};
    

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
