const note_form = document.getElementById('note-form');
const notes_container = document.getElementById('notes-container');
const popupOverlay = document.getElementById('popup-overlay');
const saveBtn = document.getElementById('save-btn');
const baseUrl = encodeURI('http://localhost/Simple Note Web/Backend/index.php/notes');

let editingNoteId = null; // simpan ID note yang lagi diedit

// Handle form submit (Create / Update)
note_form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const title = document.getElementById('note-title').value;
    const note_content = document.getElementById('note-content').value;

    let url = baseUrl;
    let method = 'POST';

    if (editingNoteId) {
        url = `${baseUrl}/${editingNoteId}`;
        method = 'PUT';
    }

    try {
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, note_content })
        });

        const text = await response.text();
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = JSON.parse(text);
        console.log('server response:', data);

        note_form.reset();
        popupOverlay.classList.remove('active');
        editingNoteId = null; // reset ke create mode
        saveBtn.textContent = "Create Note";
        document.querySelector('.popup-form h2').textContent = "Create New Note";

        fetchNotes();
    } catch (err) {
        console.error('Failed to save note:', err);
    }
});

// Fetch all notes
async function fetchNotes() {
    try {
        const res = await fetch(baseUrl, { method: 'GET', headers: { 'Accept': 'application/json' } });
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const notes = await res.json();
        renderNotes(notes);
    } catch (err) {
        console.error('Failed to fetch notes:', err);
        notes_container.innerHTML = '<p class="error">Failed to load notes</p>';
    }
}

// Render notes
function renderNotes(notes) {
    notes_container.innerHTML = '';

    if (!Array.isArray(notes) || notes.length === 0) {
        notes_container.innerHTML = '<p>No notes yet. Create one!</p>';
        return;
    }

    notes.forEach(note => {
        const card = document.createElement('div');
        card.className = 'note-card hidden';
        card.dataset.id = note.id ?? '';

        const header = document.createElement('div');
        header.className = 'note-header';
        const titleEl = document.createElement('h3');
        titleEl.textContent = note.title || '';
        const toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.className = 'toggle-btn';
        toggleBtn.textContent = 'Show';
        header.appendChild(titleEl);
        header.appendChild(toggleBtn);

        const body = document.createElement('div');
        body.className = 'note-body';
        body.style.display = 'block';

        const contentEl = document.createElement('p');
        contentEl.textContent = note.note_content || '';

        const createdEl = document.createElement('small');
        if (note.created_at) createdEl.textContent = `Created: ${note.created_at}`;

        const actions = document.createElement('div');
        actions.className = 'note-actions';

        const editBtn = document.createElement('button');
        editBtn.type = 'button';
        editBtn.className = 'edit-btn';
        editBtn.textContent = 'Edit';

        const delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.className = 'delete-btn';
        delBtn.textContent = 'Delete';

        actions.appendChild(editBtn);
        actions.appendChild(delBtn);
        
        body.appendChild(contentEl);
        body.appendChild(createdEl);
        body.appendChild(actions);

        card.appendChild(header);
        card.appendChild(body);

        notes_container.appendChild(card);

        // Toggle
        toggleBtn.addEventListener('click', () => {
            const isHidden = body.style.display === 'none';
            body.style.display = isHidden ? 'block' : 'none';
            toggleBtn.textContent = isHidden ? 'Hide' : 'Show';
        });

        // Edit
        editBtn.addEventListener('click', () => {
            document.getElementById('note-title').value = note.title;
            document.getElementById('note-content').value = note.note_content;
            editingNoteId = note.id;

            saveBtn.textContent = "Update Note";
            document.querySelector('.popup-form h2').textContent = "Edit Note";

            popupOverlay.classList.add('active');
        });

        // Delete
        delBtn.addEventListener('click', async () => {
            if (!confirm('Delete this note?')) return;
            try {
                const res = await fetch(`${baseUrl}/${note.id}`, { method: 'DELETE' });
                if (!res.ok) throw new Error(`Delete failed ${res.status}`);
                fetchNotes();
            } catch (err) {
                console.error('Failed to delete note:', err);
                alert('Failed to delete note. Check Console');
            }
        });
    });
}

window.addEventListener('DOMContentLoaded', fetchNotes);
