const popupOverlay = document.getElementById('popup-overlay');
const newNoteBtn = document.getElementById('new-note');
const cancelBtn = document.getElementById('cancel-btn');
const saveBtn = document.getElementById('save-btn');
const noteForm = document.getElementById('note-form');

newNoteBtn.addEventListener('click', () => {
    editingNoteId = null;
    noteForm.reset();
    document.querySelector('.popup-form h2').textContent = 'Create New Note';
    saveBtn.textContent = 'Create note';
    popupOverlay.classList.add('active');
})

window.openEditPopup = function (note){
    editingNoteId = note.id
    document.getElementById('note-title').value = note.title;
    document.getElementById('note-content').value = note.note_content;
    document.querySelector('.popup-form h2').textContent = 'Edit note';
    saveBtn.textContent = 'Update Note';
    popupOverlay.classList.add('active'); 
}

cancelBtn.addEventListener('click', ()=>{
    popupOverlay.classList.remove('active');
    noteForm.reset();
    editingNoteId = null;
})

popupOverlay.addEventListener('click', (e) => {
    if (e.target === popupOverlay){
        popupOverlay.classList.remove('active');
        noteForm.reset();
        editingNoteId = null;
    }
})

window.getEditingNoteId = () => editingNoteId;

window.closePopup = () =>{
    popupOverlay.classList.remove('active');
    noteForm.reset();
    editingNoteId = null;
}