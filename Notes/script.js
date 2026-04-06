document.addEventListener('DOMContentLoaded', () => {
    // 元素選取
    const addBtn = document.getElementById('add-btn');
    const notesGrid = document.getElementById('notes-grid');
    const titleInput = document.getElementById('note-title');
    const contentInput = document.getElementById('note-content');
    
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeModal = document.getElementById('close-modal');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const clearAllBtn = document.getElementById('clear-all-btn');

    // 1. 初始化資料
    let notes = JSON.parse(localStorage.getItem('glass_notes')) || [];
    let config = JSON.parse(localStorage.getItem('glass_config')) || { darkMode: false };

    // 2. 初始化主題
    if (config.darkMode) {
        document.body.classList.add('dark-mode');
        darkModeToggle.checked = true;
    }
    renderNotes();

    // 3. 新增筆記
    addBtn.addEventListener('click', () => {
        const title = titleInput.value.trim();
        const content = contentInput.value.trim();

        if (!title && !content) return alert('請輸入內容！');

        const newNote = {
            id: Date.now(),
            title: title || '無標題',
            content: content,
            date: new Date().toLocaleDateString()
        };

        notes.unshift(newNote);
        saveAndRender();

        titleInput.value = '';
        contentInput.value = '';
    });

    // 4. 設定視窗邏輯
    settingsBtn.addEventListener('click', () => settingsModal.style.display = 'block');
    closeModal.addEventListener('click', () => settingsModal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === settingsModal) settingsModal.style.display = 'none';
    });

    // 5. 主題切換
    darkModeToggle.addEventListener('change', () => {
        config.darkMode = darkModeToggle.checked;
        document.body.classList.toggle('dark-mode', config.darkMode);
        localStorage.setItem('glass_config', JSON.stringify(config));
    });

    // 6. 清空所有筆記
    clearAllBtn.addEventListener('click', () => {
        if (confirm('確定要永久刪除所有筆記嗎？')) {
            notes = [];
            saveAndRender();
            settingsModal.style.display = 'none';
        }
    });

    // 7. 渲染函數
    function renderNotes() {
        notesGrid.innerHTML = '';
        notes.forEach(note => {
            const card = document.createElement('div');
            card.className = 'note-card';
            card.innerHTML = `
                <button class="delete-btn" onclick="removeNote(${note.id})">✖</button>
                <h3>${escapeHtml(note.title)}</h3>
                <p>${escapeHtml(note.content)}</p>
                <small style="color: var(--text-secondary); font-size: 0.75rem;">${note.date}</small>
            `;
            notesGrid.appendChild(card);
        });
    }

    function saveAndRender() {
        localStorage.setItem('glass_notes', JSON.stringify(notes));
        renderNotes();
    }

    // 全域刪除函數
    window.removeNote = function(id) {
        notes = notes.filter(n => n.id !== id);
        saveAndRender();
    };

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});
