
const note_form = document.getElementById('note-form');
const notes_container = document.getElementById('notes-container')
const baseUrl = encodeURI('http://localhost/Simple Note Web/Backend/index.php/notes');

note_form.addEventListener('submit', function(e) {
    e.preventDefault();

    const title = document.getElementById('note-title').value;
    const note_content = document.getElementById('note-content').value;

    console.log('data send:', {title, note_content});

    fetch(baseUrl, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({title, note_content})
    })

    .then(async response => {
        const text = await response.text();

        if (!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        try{
            return JSON.parse(text);
        } catch (e){
            throw new Error('Invalid JSON response from server');
        }
    })
    .then(data => {
        console.log(data);
        note_form.reset();

    })
    .catch(err => console.error(err));

})

async function fetchNotes(){
    try {
        const res = await fetch(baseUrl, 
            {method: 'GET', headers: {'Accept': 'application/json'}});
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const notes = await res.json();
        renderNotes(notes);
    } catch (err){
        console.error('Failed to fetch notes:', err);
        notes_container.innerHTML = '<p class="error">Failed to load notes</p>'
    }
}

function renderNotes(notes){
    notes_container.innerHTML = '';

    if (!Array.isArray(notes) || notes.length === 0){
        notes_container.innerHTML = '<p>No notes yet. Create one!</p>';
        return;

    }

    notes.forEach(note =>{
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

        toggleBtn.addEventListener('click', ()=>{
            const isHidden = body.style.display === 'none';
            body.style.display = isHidden ? 'block' : 'none';
            toggleBtn.textContent = isHidden ? 'Hide' : 'Show';
        })

        editBtn.addEventListener('click', () =>{
            // TODO implement PUT
            console.log('Edit note', note.id);
        })


        // FIXME Not Working delete btn
        delBtn.addEventListener('click', async () =>{
            if (!confirm('Delete this note?')) return;
            try{
                const res = await fetch(`${baseUrl}/${note.id}`, {method: 'DELETE'});
                if(!res.ok) throw new Error(`Delete failed ${res.status}`);
                fetchNotes();
            } catch (err) {
                console.error('Failed to delete note:', err);
                alert('Failed to delete note. Check Console');
            }
        })

    })
}

window.addEventListener('DOMContentLoaded', fetchNotes);