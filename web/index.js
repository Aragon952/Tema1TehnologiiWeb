async function load() {
    document.getElementsByTagName('input')[0].onkeyup = addItem;
    const response = await fetch('/items');
    if (response.status === 200) {
        const body = await response.json();
        body.forEach(({id, text}) => appendItem(id, text));
    }
}

async function addItem(event) {
    const text = event.target.value.trim();
    if (event.key === 'Enter' && text.length > 0) {
        const response = await fetch('/items', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: text
        });
        if (response.status === 201) {
            const body = await response.text();
            appendItem(body, text);
        }
        event.target.value = '';
    }
}



function appendItem(id, text) {
    const listItem = document.createElement('li');
    listItem.data = id;

    const inputElement = document.createElement('input');
    inputElement.type = 'text';
    inputElement.value = text;
    inputElement.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            changeItem(id, inputElement.value);
        }
    });
    listItem.appendChild(inputElement);

    const remove = document.createElement('a');
    remove.href = 'javascript:void(0)';
    remove.innerText = 'Remove';
    remove.onclick = () => removeItem(listItem);
    listItem.appendChild(remove);

    document.getElementsByTagName('ul')[0].appendChild(listItem);
}

async function changeItem(id, text) {
    console.log('ID: %d, text: %s', id, text);
    const response = await fetch(`/items/${id}`, {
        method: 'PUT',
        body: text
    });
    

    if (response.status === 200) {
        alert('Item-ul a fost modificat.');
    } else {
        alert('Item-ul nu a putut fi modificat.');
    }
}

async function removeItem(listItem) {
    const response = await fetch(`/items/${listItem.data}`, {
        method: 'DELETE'
    });
    if (response.status === 204) {
        listItem.parentNode.removeChild(listItem);
    } else {
        alert('Item-ul nu a putut fi sters.');
    }
}
