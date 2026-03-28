(function(){
  const depth = parseInt(document.body.dataset.depth || '0');
  const root = depth === 0 ? './' : '../'.repeat(depth);

  const links = [
    { label: 'Home',         path: '',           icon: '' },
    { label: 'Reading',      path: 'reading/',   icon: '📖 ' },
    { label: 'Writing',      path: 'writing/',   icon: '✍️ ' },
    { label: 'Listening',    path: 'listening/',  icon: '🎧 ' },
    { label: 'Speaking',     path: 'speaking/',   icon: '🗣️ ' },
    { label: 'Quiz',         path: 'quiz/',       icon: '🧠 ' },
    { label: 'Revision',     path: 'revision/',   icon: '📝 ' },
  ];

  // Detect active link: data-active override (for shared lessons) or URL match
  const loc = window.location.pathname.replace(/\/index\.html$/, '/');
  const activeOverride = document.body.dataset.active || '';
  function isActive(linkPath) {
    if (activeOverride) return linkPath.replace(/\/$/, '') === activeOverride;
    if (linkPath === '') return loc === '/' || loc.endsWith('/ielts/');
    return loc.includes('/' + linkPath);
  }

  const nav = document.getElementById('nav');
  if (!nav) return;

  nav.className = 'nav';
  nav.innerHTML = `
    <a href="${root}" class="nav-brand">IELTS Hub</a>
    <div class="nav-links">
      ${links.map(l => {
        const href = root + l.path;
        const active = isActive(l.path) ? ' active' : '';
        return `<a href="${href}" class="nav-link${active}">${l.icon}${l.label}</a>`;
      }).join('\n      ')}
    </div>`;
})();
