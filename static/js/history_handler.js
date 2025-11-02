import { setCurrentArticleId } from './chat_handler.js';

const SOURCE_URL = '/api/articles';

export function initHistoryHandler() {
  const historyList = document.getElementById('historyList');
  
  if (!historyList) {
    console.warn('History list element not found');
    return;
  }

  loadArticleHistory();
  
  document.addEventListener('reloadHistory', () => {
    loadArticleHistory();
  });
}

async function loadArticleHistory() {
  const historyList = document.getElementById('historyList');
  
  try {
    const res = await fetch(SOURCE_URL);
    if (!res.ok) throw new Error('Failed to load articles');
    
    const articles = await res.json();
    renderHistory(articles || []);
  } catch (err) {
    console.error('Error loading articles:', err);
    historyList.innerHTML = '<li class="text-red-500 text-sm">Keine Artikel geladen.</li>';
  }
}

function renderHistory(articles) {
  const historyList = document.getElementById('historyList');
  
  if (!articles.length) {
    historyList.innerHTML = '<li class="text-gray-500 text-sm">Keine Artikel vorhanden.</li>';
    return;
  }
  
  historyList.innerHTML = '';
  articles.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  
  articles.forEach(article => {
    const li = document.createElement('li');
    li.className = 'p-2 rounded hover:bg-gray-50 cursor-pointer';
    li.dataset.id = article.id;
    li.innerHTML = `
      <div class="font-medium text-sm">${article.headline || 'Untitled'}</div>
      <div class="text-xs text-gray-500">${new Date(article.created_at).toLocaleString()}</div>
    `;
    li.addEventListener('click', () => loadArticleIntoForm(article));
    historyList.appendChild(li);
  });
}

function loadArticleIntoForm(article) {
  const fields = {
    bulletpoints: document.getElementById('bulletpoints'),
    roofline: document.getElementById('roofline'),
    headline: document.getElementById('headline'),
    subline: document.getElementById('subline'),
    teaser: document.getElementById('teaser'),
    text: document.getElementById('text')
  };

  fields.bulletpoints.value = article.bulletpoints || '';
  fields.roofline.value = article.roofline || '';
  fields.headline.value = article.headline || '';
  fields.subline.value = article.subline || '';
  fields.teaser.value = article.teaser || '';
  fields.text.value = article.text || '';
  
  // Setze die aktuelle Artikel-ID für Chat-Funktionen
  setCurrentArticleId(article.id);
}
