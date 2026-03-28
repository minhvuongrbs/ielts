(function(){
  const depth = parseInt(document.body.dataset.depth || '0');
  const root = depth === 0 ? './' : '../'.repeat(depth);

  const links = [
    { label: 'Home',         path: '',                 key: '',          icon: '' },
    { label: 'Reading',      path: 'hubs/reading/',    key: 'reading',   icon: '📖 ' },
    { label: 'Listening',    path: 'hubs/listening/',   key: 'listening', icon: '🎧 ' },
    { label: 'Writing',      path: 'hubs/writing/',     key: 'writing',   icon: '✍️ ' },
    { label: 'Speaking',     path: 'hubs/speaking/',    key: 'speaking',  icon: '🗣️ ' },
    { label: 'Quiz',         path: 'hubs/quiz/',        key: 'quiz',      icon: '🧠 ' },
    { label: 'Phrases',     path: 'hubs/phrases/',     key: 'phrases',   icon: '💬 ' },
    { label: 'Revision',     path: 'hubs/revision/',    key: 'revision',  icon: '📝 ' },
  ];

  // Detect active link: data-active override or URL keyword match
  const loc = window.location.pathname.replace(/\/index\.html$/, '/');
  const activeOverride = document.body.dataset.active || '';
  function isActive(link) {
    if (activeOverride) return link.key === activeOverride;
    if (link.key === '') return loc === '/' || loc.endsWith('/ielts/');
    return loc.includes('/' + link.key + '/');
  }

  const nav = document.getElementById('nav');
  if (!nav) return;

  nav.className = 'nav';
  nav.innerHTML = `
    <a href="${root}" class="nav-brand">IELTS Hub</a>
    <div class="nav-links">
      ${links.map(l => {
        const href = root + l.path;
        const active = isActive(l) ? ' active' : '';
        return `<a href="${href}" class="nav-link${active}">${l.icon}${l.label}</a>`;
      }).join('\n      ')}
    </div>`;
})();
