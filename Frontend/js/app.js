const note_form = document.getElementById('note-form');

FormData.addEventListener('submit', function(e) {
    e.preventDefault();

    const title = document.getElementById('note-title').value;
    const content = document.getElementById('note-content').value;

    fetch('../Backend/index.php', {
        
    })

})