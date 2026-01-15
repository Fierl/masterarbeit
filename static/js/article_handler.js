import { setCurrentArticleId, getCurrentArticleId, generateField } from './chat_handler.js';

export function initArticleHandler() {
  const saveBtn = document.getElementById('saveBtn');
  const newChatBtn = document.getElementById('newChatBtn');
  const generateAllBtn = document.getElementById('generateAllBtn');
  const generateTextBtn = document.getElementById('generateTextBtn');
  const generateOtherFieldsBtn = document.getElementById('generateOtherFieldsBtn');
  const generateSubheadingsBtn = document.getElementById('generateSubheadingsBtn');

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

  if (generateTextBtn) {
    generateTextBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      await generateTextOnly(generateTextBtn);
    });
  }

  if (generateOtherFieldsBtn) {
    generateOtherFieldsBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      await generateOtherFields(generateOtherFieldsBtn);
    });
  }

  if (generateSubheadingsBtn) {
    generateSubheadingsBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      await generateSubheadingsOnly(generateSubheadingsBtn);
    });
  }

  initTabs();
  
  initPreviewUpdates();
  
  initCopyButtons();
}

async function saveArticle(saveBtn) {
  saveBtn.disabled = true;
  
  const payload = {
    bulletpoints: document.getElementById('bulletpoints').value,
    roofline: document.getElementById('roofline').value,
    headline: document.getElementById('headline').value,
    subline: document.getElementById('subline').value,
    text: document.getElementById('text').value,
    teaser: document.getElementById('teaser').value,
    subheadings: document.getElementById('subheadings').value
  };
  
  try {
    const currentId = getCurrentArticleId();
    let res;
    
    if (currentId) {
      res = await fetch(`/api/articles/${currentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } else {
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
    text: document.getElementById('text'),
    subheadings: document.getElementById('subheadings')
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
    teaser: '',
    subheadings: ''
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
    generateAllBtn.textContent = 'Generiere Text...';
    await generateField('text');
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const fields = ['roofline', 'headline', 'subline', 'teaser', 'subheadings'];
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

async function generateTextOnly(generateTextBtn) {
  const bulletpoints = document.getElementById('bulletpoints').value;
  
  if (!bulletpoints.trim()) {
    alert('Bitte geben Sie zuerst Stichpunkte ein.');
    return;
  }
  
  if (!getCurrentArticleId()) {
    alert('Bitte speichern Sie zuerst den Artikel.');
    return;
  }
  
  generateTextBtn.disabled = true;
  const originalText = generateTextBtn.textContent;
  
  try {
    generateTextBtn.textContent = 'Generiere Text...';
    await generateField('text');
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    generateTextBtn.textContent = 'Generiere Zwischenüberschriften...';
    await generateField('subheadings');
    
    generateTextBtn.textContent = 'Fertig!';
    setTimeout(() => {
      generateTextBtn.textContent = originalText;
    }, 2000);
    
  } catch (err) {
    console.error('Fehler beim Generieren des Textes:', err);
    alert('Fehler beim Generieren: ' + err.message);
    generateTextBtn.textContent = originalText;
  } finally {
    generateTextBtn.disabled = false;
  }
}

async function generateOtherFields(generateOtherFieldsBtn) {
  const text = document.getElementById('text').value;
  
  if (!text.trim()) {
    alert('Bitte generieren oder geben Sie zuerst einen Artikel-Text ein.');
    return;
  }
  
  if (!getCurrentArticleId()) {
    alert('Bitte speichern Sie zuerst den Artikel.');
    return;
  }
  
  generateOtherFieldsBtn.disabled = true;
  const originalText = generateOtherFieldsBtn.textContent;
  
  try {
    const fields = ['roofline', 'headline', 'subline', 'teaser'];
    for (const field of fields) {
      generateOtherFieldsBtn.textContent = `Generiere ${getFieldLabel(field)}...`;
      await generateField(field);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    generateOtherFieldsBtn.textContent = 'Fertig!';
    setTimeout(() => {
      generateOtherFieldsBtn.textContent = originalText;
    }, 2000);
    
  } catch (err) {
    console.error('Fehler beim Generieren der anderen Felder:', err);
    alert('Fehler beim Generieren: ' + err.message);
    generateOtherFieldsBtn.textContent = originalText;
  } finally {
    generateOtherFieldsBtn.disabled = false;
  }
}

async function generateSubheadingsOnly(generateSubheadingsBtn) {
  const text = document.getElementById('text').value;
  
  if (!text.trim()) {
    alert('Bitte generieren oder geben Sie zuerst einen Artikel-Text ein.');
    return;
  }
  
  if (!getCurrentArticleId()) {
    alert('Bitte speichern Sie zuerst den Artikel.');
    return;
  }
  
  generateSubheadingsBtn.disabled = true;
  const originalText = generateSubheadingsBtn.textContent;
  
  try {
    generateSubheadingsBtn.textContent = 'Generiere...';
    await generateField('subheadings');
    
    generateSubheadingsBtn.textContent = 'Fertig!';
    setTimeout(() => {
      generateSubheadingsBtn.textContent = originalText;
    }, 2000);
    
  } catch (err) {
    console.error('Fehler beim Generieren der Zwischenüberschriften:', err);
    alert('Fehler beim Generieren: ' + err.message);
    generateSubheadingsBtn.textContent = originalText;
  } finally {
    generateSubheadingsBtn.disabled = false;
  }
}

function getFieldLabel(field) {
  const labels = {
    'roofline': 'Dachzeile',
    'headline': 'Titel',
    'subline': 'Untertitel',
    'teaser': 'Paywall-Teaser',
    'text': 'Text',
    'subheadings': 'Zwischenüberschriften'
  };
  return labels[field] || field;
}

function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.getAttribute('data-tab');
      
      // Remove active class from all buttons
      tabButtons.forEach(btn => {
        btn.classList.remove('active', 'border-blue-600', 'text-blue-600');
        btn.classList.add('border-transparent', 'text-gray-600');
      });
      
      // Add active class to clicked button
      button.classList.add('active', 'border-blue-600', 'text-blue-600');
      button.classList.remove('border-transparent', 'text-gray-600');
      
      // Hide all tab contents
      tabContents.forEach(content => {
        content.classList.add('hidden');
      });
      
      // Show target tab content
      const targetContent = document.getElementById(`tab-${targetTab}`);
      if (targetContent) {
        targetContent.classList.remove('hidden');
      }
      
      // Update preview if switching to overview tab
      if (targetTab === 'uebersicht') {
        updatePreview();
      }
    });
  });
}

function initPreviewUpdates() {
  const fields = ['roofline', 'headline', 'subline', 'teaser', 'text', 'subheadings'];
  
  fields.forEach(fieldName => {
    const field = document.getElementById(fieldName);
    if (field) {
      field.addEventListener('input', () => {
        updatePreviewField(fieldName);
      });
    }
  });
}

function updatePreview() {
  const fields = ['roofline', 'headline', 'subline', 'teaser', 'text', 'subheadings'];
  fields.forEach(fieldName => {
    updatePreviewField(fieldName);
  });
}

function updatePreviewField(fieldName) {
  const field = document.getElementById(fieldName);
  const preview = document.getElementById(`preview-${fieldName}`);
  
  if (field && preview) {
    const value = field.value.trim();
    preview.textContent = value || '—';
  }
}

function initCopyButtons() {
  const copyButtons = document.querySelectorAll('.copy-btn');
  
  copyButtons.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const fieldName = btn.dataset.field;
      const field = document.getElementById(fieldName);
      
      if (!field || !field.value.trim()) {
        showCopyFeedback(btn, 'Kein Inhalt zum Kopieren', false);
        return;
      }
      
      try {
        await navigator.clipboard.writeText(field.value);
        showCopyFeedback(btn, '✓ Kopiert!', true);
      } catch (err) {
        console.error('Fehler beim Kopieren:', err);
        showCopyFeedback(btn, '✗ Fehler', false);
      }
    });
  });
}

function showCopyFeedback(button, message, success) {
  const originalText = button.textContent;
  const originalColor = button.className;
  
  button.textContent = message;
  
  if (success) {
    button.className = button.className.replace('bg-gray-500 hover:bg-gray-600', 'bg-green-500 hover:bg-green-600');
  } else {
    button.className = button.className.replace('bg-gray-500 hover:bg-gray-600', 'bg-red-500 hover:bg-red-600');
  }
  
  setTimeout(() => {
    button.textContent = originalText;
    button.className = originalColor;
  }, 2000);
}
