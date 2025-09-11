const newNoteBtn = document.getElementById('new-note-btn');
const popupOverlay = document.getElementById('popup-overlay');
const cancelBtn = document.getElementById('cancel-btn');
const noteForm = document.getElementById('note-form');

newNoteBtn.addEventListener('click', () => {
    popupOverlay.classList.add('active');
})

cancelBtn.addEventListener('click', ()=>{
    popupOverlay.classList.remove('active');
    noteForm.reset();
})

popupOverlay.addEventListener('click', (e) => {
    if (e.target === popupOverlay){
        popupOverlay.classList.remove('active');
        noteForm.reset();
    }
})