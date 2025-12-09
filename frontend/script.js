async function show(msg){
    document.getElementById('output').innerText = msg;
}

document.getElementById('check').onclick = async () => {
    const index = document.getElementById('index').value.trim();
    const pin = document.getElementById('pin').value.trim();

    if (!index || !pin) return show('index and pin required');

    show('Checking...');

    try{
        const q = new URLSearchParams({ index, pin });
        const r = await fetch('/result?' + q.toString());
        const j = await r.json();

        if (!j.found) return show('Result not found');

        // Use BACKTICKS to allow multiline strings
        show(
            `Name: ${j.name}
Grades:
${Object.entries(j.grades).map(e => `${e[0]}: ${e[1]}`).join('\n')}`
        );

    }catch(e){
        show('Error: ' + e.message);
    }
}
