document.addEventListener('DOMContentLoaded', () => {
  const chatSidebar = document.getElementById('chatSidebar');
  const chatToggle = document.getElementById('chatToggle');
  const saveBtn = document.getElementById('saveBtn');

  if (chatToggle && chatSidebar) {
    chatToggle.addEventListener('click', () => {
      chatSidebar.classList.toggle('translate-x-full');
    });
  }

  if (saveBtn) {
    saveBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      saveBtn.disabled = true;
      const payload = {
        bulletpoints: document.getElementById('bulletpoints').value,
        roofline: document.getElementById('roofline').value,
        headline: document.getElementById('headline').value,
        subline: document.getElementById('subline').value,
        text: document.getElementById('text').value,
        teaser: document.getElementById('teaser').value
      };
      try {
        const res = await fetch('/api/articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const body = await res.json();
          alert('Artikel gespeichert, id=' + body.id);
        } else {
          const txt = await res.text();
          console.error('Save error', res.status, txt);
          alert('Fehler beim Speichern');
        }
      } catch (err) {
        console.error(err);
        alert('Netzwerkfehler');
      } finally {
        saveBtn.disabled = false;
      }
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const historyList = document.getElementById('historyList');
  const fields = {
    bulletpoints: document.getElementById('bulletpoints'),
    roofline: document.getElementById('roofline'),
    headline: document.getElementById('headline'),
    subline: document.getElementById('subline'),
    teaser: document.getElementById('teaser'),
    text: document.getElementById('text')
  };

  // Aktuell: Mock-Datei. Später: '/api/articles' oder ähnliches
  const SOURCE_URL = '/static/articles.json';

  fetch(SOURCE_URL)
    .then(res => {
      if (!res.ok) throw new Error('Failed to load articles');
      return res.json();
    })
    .then(articles => {
      renderHistory(articles || []);
    })
    .catch(err => {
      console.error('Error loading articles:', err);
      historyList.innerHTML = '<li class="text-red-500 text-sm">Keine Artikel geladen.</li>';
    });

  function renderHistory(articles) {
    if (!articles.length) {
      historyList.innerHTML = '<li class="text-gray-500 text-sm">Keine Artikel vorhanden.</li>';
      return;
    }
    historyList.innerHTML = '';
    articles.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
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
    fields.bulletpoints.value = article.bulletpoints || '';
    fields.roofline.value = article.roofline || '';
    fields.headline.value = article.headline || '';
    fields.subline.value = article.subline || '';
    fields.teaser.value = article.teaser || '';
    fields.text.value = article.text || '';
  }
});