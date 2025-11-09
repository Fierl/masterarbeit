import { setCurrentArticleId, getCurrentArticleId, generateField } from './chat_handler.js';

export function initArticleHandler() {
  const saveBtn = document.getElementById('saveBtn');
  const newChatBtn = document.getElementById('newChatBtn');
  const generateAllBtn = document.getElementById('generateAllBtn');

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

  if (generateAllBtn) {
    generateAllBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      await generateAllFields(generateAllBtn);
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

async function generateAllFields(generateAllBtn) {
  const bulletpoints = document.getElementById('bulletpoints').value;
  
  if (!bulletpoints.trim()) {
    alert('Bitte geben Sie zuerst Stichpunkte ein.');
    return;
  }
  
  if (!getCurrentArticleId()) {
    alert('Bitte speichern Sie zuerst den Artikel.');
    return;
  }
  
  generateAllBtn.disabled = true;
  const originalText = generateAllBtn.textContent;
  
  try {
    // Generate text first
    generateAllBtn.textContent = 'Generiere Text...';
    await generateField('text');
    
    // Wait a bit to ensure text is saved
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate other fields
    const fields = ['roofline', 'headline', 'subline', 'teaser'];
    for (const field of fields) {
      generateAllBtn.textContent = `Generiere ${getFieldLabel(field)}...`;
      await generateField(field);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    generateAllBtn.textContent = 'Fertig!';
    setTimeout(() => {
      generateAllBtn.textContent = originalText;
    }, 2000);
    
  } catch (err) {
    console.error('Fehler beim Generieren aller Felder:', err);
    alert('Fehler beim Generieren: ' + err.message);
    generateAllBtn.textContent = originalText;
  } finally {
    generateAllBtn.disabled = false;
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
