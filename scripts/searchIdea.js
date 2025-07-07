const searchBar = document.getElementById("search");
const typeFilter = document.getElementById("typeFilter");
const creativityTypeFilter = document.getElementById("creativityTypeFilter");
const orderByStatus = document.getElementById("orderByStatus");
const orderByPeople = document.getElementById("orderByPeople");

const listOfIdeas = document.getElementById("lastIdeasSrc");
const ideaLinkSrc = document.querySelectorAll(".ideaLinkSrc");
const ideaImageSrc = document.querySelectorAll(".ideaImageSrc");
const ideaTitleSrc = document.querySelectorAll(".ideaTitleSrc");
const ideaAuthorSrc = document.querySelectorAll(".ideaAuthorSrc");

let filtersData = ["", "", "", "", ""]; // Search | Type | Creativity | Status | Order

searchBar.addEventListener("input", () => {
    const content = searchBar.value;
    
    filtersData[0] = content;
    updateDisplaiedData();
});

typeFilter.addEventListener("change", () => {
    const content = typeFilter.value;
    
    filtersData[1] = content=="All"?"":content;
    updateDisplaiedData();
});

creativityTypeFilter.addEventListener("change", () => {
    const content = creativityTypeFilter.value;
    
    filtersData[2] = content=="All"?"":content;
    updateDisplaiedData();
});

orderByStatus.addEventListener("change", () => {
    const content = orderByStatus.value;
    
    filtersData[3] = content=="All"?"":content;
    updateDisplaiedData();
});

orderByPeople.addEventListener("change", () => {
    const content = orderByPeople.value;
    
    filtersData[4] = content=="All"?"":content;
    updateDisplaiedData();
});

async function updateDisplaiedData() {
    const formData = new FormData();

    formData.append("search", filtersData[0]);
    formData.append("type", filtersData[1]);
    formData.append("creativity", filtersData[2]);
    formData.append("status", filtersData[3]);
    formData.append("order", filtersData[4]);
    
    async function sendData(data) {
        try {
            const res = await fetch(`./api/searchAnIdea.php`, {
                method: 'POST',
                body: data
            });

            const resp = await res.json();

            return resp;
        } catch (error) {
            return null;
        }
    }

    const result = await sendData(formData);

    if (!result) {
        printError(421);
    }
    else {
        loadData2(result);
    }
}

function loadData2(result) {
    listOfIdeas.innerHTML = "";

    if (result['format'] == "mono") {
        result['data'].forEach(ideaData => {
            addChildToList(`./ideaVoid.html?idea=${ideaData['id']}`, ideaData['title'], ideaData['username'], ideaData['ideaimage']);
        });
    } else if (result['format'] == "double") {
        result['data']['data'].forEach(accountData => {
            addChildToList(`./`, accountData['username'], `${accountData['email']}<br>${accountData['name']} ${accountData['surname']}`, accountData['userimage']);
        });

        result['subdata']['data'].forEach(ideaData => {
            addChildToList(`./ideaVoid.html?idea=${ideaData['id']}`, ideaData['title'], ideaData['username'], ideaData['ideaimage']);
        });
    }
    else if (result['format'] == "void") {
        result['data'].forEach(ideaData => {
            addChildToList(`./ideaVoid.html?idea=${ideaData['id']}`, ideaData['title'], ideaData['username'], ideaData['ideaimage']);
        });
    }

    function addChildToList(href, title, author, imgSrc) {
        const childOfListIdeas = document.createElement("a");

        childOfListIdeas.classList.add("ideaLinkSrc");
        childOfListIdeas.href = href;
        childOfListIdeas.innerHTML = `
            <li class="ideaBoxScr">
                <img src="${imgSrc}" alt="Idea Image" class="ideaImageSrc">
                <p class="ideaTitleSrc">${title}</p>
                <p class="ideaAuthorSrc">${author}</p>
            </li>`;

        listOfIdeas.appendChild(childOfListIdeas);
    }
}

updateDisplaiedData();