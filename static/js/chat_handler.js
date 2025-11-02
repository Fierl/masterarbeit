import { getFieldLabel } from './utils.js';

let currentArticleId = null;
let currentField = null;

export function setCurrentArticleId(articleId) {
  currentArticleId = articleId;
}

export function initChatHandler() {
  const chatSidebar = document.getElementById('chatSidebar');
  const chatToggle = document.getElementById('chatToggle');

  if (chatToggle && chatSidebar) {
    chatToggle.addEventListener('click', () => {
      chatSidebar.classList.toggle('translate-x-full');
    });
  }

  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('generieren-btn')) {
      const field = e.target.getAttribute('data-field');
      handleGenerate(field);
    } else if (e.target.classList.contains('umschreiben-btn')) {
      const field = e.target.getAttribute('data-field');
      openChatAndRewrite(field);
    }
  });
}

async function handleGenerate(field) {
  const chatSidebar = document.getElementById('chatSidebar');
  const chatContent = chatSidebar.querySelector('.space-y-3');
  
  if (!currentArticleId) {
    if (chatSidebar.classList.contains('translate-x-full')) {
      chatSidebar.classList.remove('translate-x-full');
    }
    chatContent.innerHTML = `
      <div class="bg-yellow-50 p-3 rounded">
        <strong>Hinweis</strong>
        <p class="text-sm mt-1">Bitte speichern Sie zuerst den Artikel, um die KI-Funktionen zu nutzen.</p>
      </div>
    `;
    return;
  }
  
  currentField = field;
  const prompt = `Generiere ${getFieldLabel(field)}`;
  
  try {
    let contextContent = '';
    
    if (field === 'text') {
      contextContent = document.getElementById('bulletpoints').value;
      if (!contextContent.trim()) {
        if (chatSidebar.classList.contains('translate-x-full')) {
          chatSidebar.classList.remove('translate-x-full');
        }
        chatContent.innerHTML = `
          <div class="bg-yellow-50 p-3 rounded">
            <strong>Hinweis</strong>
            <p class="text-sm mt-1">Bitte geben Sie zuerst Stichpunkte ein.</p>
          </div>
        `;
        return;
      }
    } else if (field === 'roofline' || field === 'headline' || field === 'subline') {
      contextContent = document.getElementById('text').value;
      if (!contextContent.trim()) {
        if (chatSidebar.classList.contains('translate-x-full')) {
          chatSidebar.classList.remove('translate-x-full');
        }
        chatContent.innerHTML = `
          <div class="bg-yellow-50 p-3 rounded">
            <strong>Hinweis</strong>
            <p class="text-sm mt-1">Bitte generieren Sie zuerst den Text.</p>
          </div>
        `;
        return;
      }
    }
    
    const res = await fetch('/api/chats/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        article_id: currentArticleId,
        field_name: field,
        prompt: prompt,
        context: contextContent
      })
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Fehler beim Generieren');
    }
    
    const data = await res.json();
    
    document.getElementById(field).value = data.content;
    
    // Chat-Sidebar öffnen und Historie laden
    if (chatSidebar.classList.contains('translate-x-full')) {
      chatSidebar.classList.remove('translate-x-full');
    }
    
    await loadChatHistory(field, chatContent);
    
  } catch (err) {
    console.error('Fehler beim Generieren:', err);
    if (chatSidebar.classList.contains('translate-x-full')) {
      chatSidebar.classList.remove('translate-x-full');
    }
    chatContent.innerHTML = `
      <div class="bg-red-50 p-3 rounded text-sm text-red-700">
        Fehler beim Generieren: ${err.message}
      </div>
    `;
  }
}

async function openChatAndGenerate(field) {
  const chatSidebar = document.getElementById('chatSidebar');
  const chatContent = chatSidebar.querySelector('.space-y-3');
  
  if (chatSidebar.classList.contains('translate-x-full')) {
    chatSidebar.classList.remove('translate-x-full');
  }
  
  currentField = field;
  
  if (currentArticleId) {
    await loadChatHistory(field, chatContent);
  } else {
    chatContent.innerHTML = `
      <div class="bg-yellow-50 p-3 rounded">
        <strong>Hinweis</strong>
        <p class="text-sm mt-1">Bitte speichern Sie zuerst den Artikel, um die KI-Funktionen zu nutzen.</p>
      </div>
    `;
    return;
  }
  
  document.getElementById('generateBtn').addEventListener('click', async () => {
    const prompt = document.getElementById('chatPrompt').value;
    if (!prompt.trim()) {
      alert('Bitte geben Sie einen Prompt ein.');
      return;
    }
    
    await generateContent(field, prompt, chatContent);
  });
}

async function openChatAndRewrite(field) {
  const chatSidebar = document.getElementById('chatSidebar');
  const chatContent = chatSidebar.querySelector('.space-y-3');
  
  if (chatSidebar.classList.contains('translate-x-full')) {
    chatSidebar.classList.remove('translate-x-full');
  }
  
  currentField = field;
  const currentValue = document.getElementById(field).value;
  
  if (currentArticleId) {
    await loadChatHistory(field, chatContent);
  } else {
    chatContent.innerHTML = `
      <div class="bg-yellow-50 p-3 rounded">
        <strong>Hinweis</strong>
        <p class="text-sm mt-1">Bitte speichern Sie zuerst den Artikel, um die KI-Funktionen zu nutzen.</p>
      </div>
    `;
    return;
  }
  
  if (!currentValue.trim()) {
    const warningSection = document.createElement('div');
    warningSection.className = 'bg-yellow-50 p-3 rounded mt-3';
    warningSection.innerHTML = `
      <strong>Umschreiben ${getFieldLabel(field)}</strong>
      <p class="text-sm mt-1">Bitte geben Sie zuerst Text ein, der umgeschrieben werden soll.</p>
    `;
    chatContent.appendChild(warningSection);
  } else {
    const editSection = document.createElement('div');
    editSection.className = 'bg-orange-50 p-3 rounded mt-3';
    editSection.innerHTML = `
      <strong>Schreibe ${getFieldLabel(field)} um</strong>
      <div class="text-xs mt-2 p-2 bg-white rounded border">
        <strong>Aktueller Text:</strong><br>
        ${currentValue}
      </div>
      <textarea id="chatEdit" class="w-full mt-2 p-2 border rounded text-sm" rows="3" placeholder="Bearbeiteter Text...">${currentValue}</textarea>
      <button id="editBtn" class="mt-2 bg-orange-600 text-white px-3 py-1 text-sm rounded hover:bg-orange-700">
        Speichern
      </button>
    `;
    chatContent.appendChild(editSection);
    
    document.getElementById('editBtn').addEventListener('click', async () => {
      const content = document.getElementById('chatEdit').value;
      if (!content.trim()) {
        alert('Der Text darf nicht leer sein.');
        return;
      }
      
      await editContent(field, content, chatContent);
    });
  }
}

async function loadChatHistory(field, chatContent) {
  try {
    const res = await fetch(`/api/chats?article_id=${currentArticleId}&field_name=${field}`);
    
    if (!res.ok) {
      throw new Error('Fehler beim Laden der Chat-Historie');
    }
    
    const chats = await res.json();
    
    chatContent.innerHTML = `
      <div class="mb-3">
        <strong class="text-sm">Historie für ${getFieldLabel(field)}</strong>
      </div>
    `;
    
    if (chats.length === 0) {
      const emptyMsg = document.createElement('div');
      emptyMsg.className = 'text-sm text-gray-500 italic';
      emptyMsg.textContent = 'Noch keine Einträge vorhanden.';
      chatContent.appendChild(emptyMsg);
    } else {
      chats.forEach(chat => {
        const chatItem = document.createElement('div');
        chatItem.className = 'bg-gray-50 p-2 rounded mb-2 cursor-pointer hover:bg-gray-100';
        chatItem.innerHTML = `
          <div class="text-xs text-gray-500">${new Date(chat.created_at).toLocaleString()}</div>
          <div class="text-sm mt-1">${chat.content}</div>
        `;
        chatItem.addEventListener('click', () => {
          document.getElementById(field).value = chat.content;
        });
        chatContent.appendChild(chatItem);
      });
    }
  } catch (err) {
    console.error('Fehler beim Laden der Chats:', err);
    chatContent.innerHTML = `
      <div class="bg-red-50 p-3 rounded text-sm text-red-700">
        Fehler beim Laden der Historie.
      </div>
    `;
  }
}

async function generateContent(field, prompt, chatContent) {
  try {
    let contextContent = '';
    
    if (field === 'text') {
      contextContent = document.getElementById('bulletpoints').value;
    } else if (field === 'roofline' || field === 'headline' || field === 'subline') {
      contextContent = document.getElementById('text').value;
    }
    
    const res = await fetch('/api/chats/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        article_id: currentArticleId,
        field_name: field,
        prompt: prompt,
        context: contextContent
      })
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Fehler beim Generieren');
    }
    
    const data = await res.json();
    
    document.getElementById(field).value = data.content;
    
    await loadChatHistory(field, chatContent);
    
    alert('Text wurde erfolgreich generiert!');
  } catch (err) {
    console.error('Fehler beim Generieren:', err);
    alert('Fehler beim Generieren: ' + err.message);
  }
}

async function editContent(field, content, chatContent) {
  try {
    const res = await fetch('/api/chats/edit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        article_id: currentArticleId,
        field_name: field,
        content: content
      })
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Fehler beim Speichern');
    }
    
    const data = await res.json();
    
    document.getElementById(field).value = data.content;
    
    await loadChatHistory(field, chatContent);
    
    alert('Text wurde erfolgreich gespeichert!');
  } catch (err) {
    console.error('Fehler beim Speichern:', err);
    alert('Fehler beim Speichern: ' + err.message);
  }
}
