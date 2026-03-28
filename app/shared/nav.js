(function(){
  const depth = parseInt(document.body.dataset.depth || '0');
  const prefix = document.body.dataset.prefix || '';
  const root = (depth === 0 ? './' : '../'.repeat(depth)) + prefix;

  const links = [
    { label: 'Home',         path: '',                 key: '',          icon: '' },
    { label: 'Reading',      path: 'pages/reading/',    key: 'reading',   icon: '📖 ' },
    { label: 'Listening',    path: 'pages/listening/',   key: 'listening', icon: '🎧 ' },
    { label: 'Writing',      path: 'pages/writing/',     key: 'writing',   icon: '✍️ ' },
    { label: 'Speaking',     path: 'pages/speaking/',    key: 'speaking',  icon: '🗣️ ' },
    { label: 'Tips',         path: 'pages/tips/',        key: 'tips',      icon: '💡 ' },
    { label: 'Quiz',         path: 'pages/quiz/',        key: 'quiz',      icon: '🧠 ' },
    { label: 'Phrases',     path: 'pages/phrases/',     key: 'phrases',   icon: '💬 ' },
    { label: 'Revision',     path: 'pages/revision/',    key: 'revision',  icon: '📝 ' },
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

  // Home link: from root page (prefix set), go to './' not './app/'
  const homeHref = prefix ? './' : root;

  nav.className = 'nav';
  nav.innerHTML = `
    <a href="${homeHref}" class="nav-brand">IELTS Hub</a>
    <div class="nav-links">
      ${links.map(l => {
        const href = l.key === '' ? homeHref : root + l.path;
        const active = isActive(l) ? ' active' : '';
        return `<a href="${href}" class="nav-link${active}">${l.icon}${l.label}</a>`;
      }).join('\n      ')}
    </div>`;
})();
