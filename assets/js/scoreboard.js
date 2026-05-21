// Same Apps Script URL used by registration.js
const APPS_SCRIPT_URL = 'https://script.google.com/a/macros/paloaltonetworks.com/s/AKfycbzq4TVyn_nE0Fyu93qIRxwxQ7fIV_lv6RF15gLq8fiKDY1n2grPkFLJxZQ6EpQ4mGRJ/exec';

const REFRESH_INTERVAL_MS = 60000;

async function loadScoreboard() {
  const tbody       = document.getElementById('scoreboard-body');
  const status      = document.getElementById('scoreboard-status');
  const lastUpdated = document.getElementById('last-updated');

  if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL.startsWith('YOUR_')) {
    status.innerHTML = '<p>Scoreboard not configured yet. Paste the Apps Script URL into <code>scoreboard.js</code>.</p>';
    return;
  }

  try {
    const res = await fetch(`${APPS_SCRIPT_URL}?action=scores`);
    if (!res.ok) throw new Error('fetch failed');
    const { rows } = await res.json();

    if (!rows || rows.length <= 1) {
      status.innerHTML = '<p>No responses yet. Check back soon!</p>';
      return;
    }

    const headers  = rows[0].map(h => String(h).toLowerCase().trim());
    const tsIdx    = headers.findIndex(h => h.includes('timestamp'));
    const nameIdx  = headers.findIndex(h => h.includes('name'));
    const emailIdx = headers.findIndex(h => h.includes('email'));
    const scoreIdx = headers.findIndex(h => h.includes('score') || h.includes('point'));

    const data = rows.slice(1).filter(r => r.length > 1).map(r => ({
      timestamp: r[tsIdx]    || '',
      name:      r[nameIdx]  || 'Anonymous',
      email:     r[emailIdx] || '',
      score:     parseScore(r[scoreIdx]),
    }));

    data.sort((a, b) => b.score - a.score || new Date(a.timestamp) - new Date(b.timestamp));

    status.style.display = 'none';
    tbody.innerHTML = '';

    data.forEach((entry, i) => {
      const rank = i + 1;
      const badgeClass = rank <= 3 ? `rank-${rank}` : 'rank-other';
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><span class="rank-badge ${badgeClass}">${rank}</span></td>
        <td>${escHtml(entry.name)}</td>
        <td>${escHtml(entry.email)}</td>
        <td><span class="score-pill">${entry.score}</span></td>
        <td style="color:var(--muted);font-size:0.82rem">${formatTs(entry.timestamp)}</td>
      `;
      tbody.appendChild(tr);
    });

    lastUpdated.textContent = 'Last updated: ' + new Date().toLocaleTimeString();
  } catch {
    status.innerHTML = '<p>Could not load scoreboard. Please try again shortly.</p>';
  }
}

function parseScore(val) {
  if (!val) return 0;
  const m = String(val).match(/(\d+(?:\.\d+)?)\s*\/?\s*(\d+)?/);
  if (!m) return 0;
  if (m[2]) return Math.round((parseFloat(m[1]) / parseFloat(m[2])) * 100);
  return parseFloat(m[1]);
}

function formatTs(ts) {
  if (!ts) return '—';
  const d = new Date(ts);
  return isNaN(d) ? ts : d.toLocaleString();
}

function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

loadScoreboard();
setInterval(loadScoreboard, REFRESH_INTERVAL_MS);
