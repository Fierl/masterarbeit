import { setCurrentArticleId, getCurrentArticleId } from './chat_handler.js';

export function initArticleHandler() {
  const saveBtn = document.getElementById('saveBtn');
  const newChatBtn = document.getElementById('newChatBtn');

  if (saveBtn) {
    saveBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      await saveArticle(saveBtn);
    });
  }
  
  if (newChatBtn) {
    newChatBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      await createNewChat();
    });
  }
}

async function saveArticle(saveBtn) {
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
    const currentId = getCurrentArticleId();
    let res;
    
    if (currentId) {
      // Update existing article
      res = await fetch(`/api/articles/${currentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } else {
      // Create new article
      res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }
    
    if (res.ok) {
      const body = await res.json();
      setCurrentArticleId(body.id);
      alert('Artikel gespeichert!');
      
      const historyEvent = new CustomEvent('reloadHistory');
      document.dispatchEvent(historyEvent);
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
}

async function createNewChat() {
  const fields = {
    bulletpoints: document.getElementById('bulletpoints'),
    roofline: document.getElementById('roofline'),
    headline: document.getElementById('headline'),
    subline: document.getElementById('subline'),
    teaser: document.getElementById('teaser'),
    text: document.getElementById('text')
  };
  
  Object.values(fields).forEach(field => {
    if (field) field.value = '';
  });
  
  const payload = {
    bulletpoints: '',
    roofline: '',
    headline: '',
    subline: '',
    text: '',
    teaser: ''
  };
  
  try {
    const res = await fetch('/api/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (res.ok) {
      const body = await res.json();
      setCurrentArticleId(body.id);
      
      if (fields.bulletpoints) {
        fields.bulletpoints.focus();
      }
      
      const historyEvent = new CustomEvent('reloadHistory');
      document.dispatchEvent(historyEvent);
      
    } else {
      const txt = await res.text();
      console.error('Create error', res.status, txt);
      alert('Fehler beim Erstellen des neuen Chats');
    }
  } catch (err) {
    console.error(err);
    alert('Netzwerkfehler beim Erstellen des neuen Chats');
  }
}
