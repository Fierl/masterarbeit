document.addEventListener('DOMContentLoaded', () => {
  const chatSidebar = document.getElementById('chatSidebar');
  const chatToggle = document.getElementById('chatToggle');
  const saveBtn = document.getElementById('saveBtn');

  if (chatToggle && chatSidebar) {
    chatToggle.addEventListener('click', () => {
      chatSidebar.classList.toggle('translate-x-full');
    });
  }

  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('generieren-btn')) {
      const field = e.target.getAttribute('data-field');
      openChatAndGenerate(field);
    } else if (e.target.classList.contains('umschreiben-btn')) {
      const field = e.target.getAttribute('data-field');
      openChatAndRewrite(field);
    }
  });

  function openChatAndGenerate(field) {
    if (chatSidebar.classList.contains('translate-x-full')) {
      chatSidebar.classList.remove('translate-x-full');
    }
    
    console.log(`Generiere Inhalt für Feld: ${field}`);
    
    const chatContent = chatSidebar.querySelector('.space-y-3');
    chatContent.innerHTML = `
      <div class="bg-blue-50 p-3 rounded">
        <strong>Generiere ${getFieldLabel(field)}</strong>
        <p class="text-sm mt-1">KI generiert Inhalt für dieses Feld...</p>
      </div>
    `;
  }

  function openChatAndRewrite(field) {
    if (chatSidebar.classList.contains('translate-x-full')) {
      chatSidebar.classList.remove('translate-x-full');
    }
    
    console.log(`Schreibe Inhalt um für Feld: ${field}`);

    const chatContent = chatSidebar.querySelector('.space-y-3');
    const currentValue = document.getElementById(field).value;
    
    if (!currentValue.trim()) {
      chatContent.innerHTML = `
        <div class="bg-yellow-50 p-3 rounded">
          <strong>Umschreiben ${getFieldLabel(field)}</strong>
          <p class="text-sm mt-1">Bitte geben Sie zuerst Text ein, der umgeschrieben werden soll.</p>
        </div>
      `;
    } else {
      chatContent.innerHTML = `
        <div class="bg-orange-50 p-3 rounded">
          <strong>Schreibe ${getFieldLabel(field)} um</strong>
          <p class="text-sm mt-1">KI schreibt den vorhandenen Text um...</p>
          <div class="text-xs mt-2 p-2 bg-white rounded border">
            <strong>Aktueller Text:</strong><br>
            ${currentValue}
          </div>
        </div>
      `;
    }
  }

  function getFieldLabel(field) {
    const labels = {
      'roofline': 'Dachzeile',
      'headline': 'Titel',
      'subline': 'Untertitel',
      'teaser': 'Paywall-Teaser',
      'text': 'Text'
    };
    return labels[field] || field;
  }

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

  const SOURCE_URL = '/api/articles';

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