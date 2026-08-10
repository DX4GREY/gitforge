// GitForge Content Script - Injects a sleek "GitForge Profile" badge on GitHub user pages
(function () {
  const isProfilePage = document.querySelector('.vcard-names') !== null;
  if (!isProfilePage) return;

  const usernameElement = document.querySelector('.p-nickname.vcard-username');
  if (!usernameElement) return;

  const username = usernameElement.textContent.trim();
  const vcard = document.querySelector('.vcard-names');

  if (vcard && !document.getElementById('gitforge-badge')) {
    const badge = document.createElement('a');
    badge.id = 'gitforge-badge';
    badge.href = `https://gitforge.ai.studio/profile/${username}`;
    badge.target = '_blank';
    badge.style.display = 'inline-flex';
    badge.style.alignItems = 'center';
    badge.style.gap = '6px';
    badge.style.marginTop = '10px';
    badge.style.padding = '6px 12px';
    badge.style.borderRadius = '20px';
    badge.style.backgroundColor = '#111827';
    badge.style.border = '1px solid #3b82f6';
    badge.style.color = '#60a5fa';
    badge.style.fontSize = '12px';
    badge.style.fontWeight = '600';
    badge.style.textDecoration = 'none';
    badge.style.cursor = 'pointer';
    badge.innerHTML = `⚡ View on GitForge`;

    vcard.appendChild(badge);
  }
})();
