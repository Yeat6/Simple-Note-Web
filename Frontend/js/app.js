const note_form = document.getElementById('note-form');
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