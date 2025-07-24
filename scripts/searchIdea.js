let searchBar = document.getElementById("search");
let typeFilter = document.getElementById("typeFilter");
let creativityTypeFilter = document.getElementById("creativityTypeFilter");
let orderByStatus = document.getElementById("orderByStatus");
let orderByPeople = document.getElementById("orderByPeople");

let compactFilters = document.getElementById("compactFilters");
let compactFiltersHidden = document.getElementById("compactFiltersHidden");

const listOfIdeas = document.getElementById("lastIdeasSrc");
const ideaLinkSrc = document.querySelectorAll(".ideaLinkSrc");
const ideaImageSrc = document.querySelectorAll(".ideaImageSrc");
const ideaTitleSrc = document.querySelectorAll(".ideaTitleSrc");
const ideaAuthorSrc = document.querySelectorAll(".ideaAuthorSrc");

let filtersData = ["", "", "", "", ""]; // Search | Type | Creativity | Status | Order

function updateFiltersIfExists() {
    searchBar = document.getElementById("search");
    typeFilter = document.getElementById("typeFilter");
    creativityTypeFilter = document.getElementById("creativityTypeFilter");
    orderByStatus = document.getElementById("orderByStatus");
    orderByPeople = document.getElementById("orderByPeople");

    compactFilters = document.getElementById("compactFilters");
    compactFiltersHidden = document.getElementById("compactFiltersHidden");

    if (searchBar) {
        searchBar.addEventListener("input", () => {
            const content = searchBar.value;
            
            filtersData[0] = content;
            updateDisplaiedData();
        });
    }
    
    if (typeFilter) {
        typeFilter.addEventListener("change", () => {
            const content = typeFilter.value;
            
            filtersData[1] = content=="All"?"":content;
            updateDisplaiedData();
        });
    }
    
    if (creativityTypeFilter) {
        creativityTypeFilter.addEventListener("change", () => {
            const content = creativityTypeFilter.value;
            
            filtersData[2] = content=="All"?"":content;
            updateDisplaiedData();
        });
    }
    
    if (orderByStatus) {
        orderByStatus.addEventListener("change", () => {
            const content = orderByStatus.value;
            
            filtersData[3] = content=="All"?"":content;
            updateDisplaiedData();
        });
    }
    
    if (orderByPeople) {
        orderByPeople.addEventListener("change", () => {
            const content = orderByPeople.value;
            
            filtersData[4] = content=="All"?"":content;
            updateDisplaiedData();
        });
    }

    if (compactFilters) {
        compactFilters.addEventListener("click", () => {
            compactFiltersClickGestor();
        });
    }

    if (compactFiltersHidden) {
        toggleCompactFiltersHidden();

        document.addEventListener("scroll", () => {
            if (compactFiltersHidden) {
                compactFiltersHidden.style.display = "none";
            }
        });
    }
}

function compactFiltersClickGestor() {
    const typeHidden = document.getElementById("typeHidden");
    const creativityHidden = document.getElementById("creativityHidden");
    const statusHidden = document.getElementById("statusHidden");
    const orderByHidden = document.getElementById("orderByHidden");

    const typeHiddenUl = document.getElementById("typeHiddenUl");
    const creativityHiddenUl = document.getElementById("creativityHiddenUl");
    const statusHiddenUl = document.getElementById("statusHiddenUl");
    const orderByHiddenUl = document.getElementById("orderByHiddenUl");

    typeHiddenUl.style.display = "none";
    creativityHiddenUl.style.display = "none";
    statusHiddenUl.style.display = "none";

    if (orderByHiddenUl) {
        orderByHiddenUl.style.display = "none";
    }

    if (compactFilters.dataset.type == 1) {
        toggleCompactFiltersHidden();
    }
    else if (compactFilters.dataset.type == 2) {
        toggleCompactFiltersHidden();

        orderByHidden.addEventListener("click", () => {
            toggleCompactFiltersHidden(orderByHiddenUl);

            if (creativityHiddenUl.style.display != "none") {
                toggleCompactFiltersHidden(creativityHiddenUl);
                document.querySelectorAll(".hiddenTypeFilterTextImg")[1].style.transform = "";
            }

            if (statusHiddenUl.style.display != "none") {
                toggleCompactFiltersHidden(statusHiddenUl);
                document.querySelectorAll(".hiddenTypeFilterTextImg")[2].style.transform = "";
            }

            if (typeHiddenUl.style.display != "none") {
                toggleCompactFiltersHidden(typeHiddenUl);
                document.querySelectorAll(".hiddenTypeFilterTextImg")[0].style.transform = "";
            }

            if (document.querySelectorAll(".hiddenTypeFilterTextImg")[3].style.transform == "") {
                document.querySelectorAll(".hiddenTypeFilterTextImg")[3].style.transform = "rotate(180deg)";
            } else {
                document.querySelectorAll(".hiddenTypeFilterTextImg")[3].style.transform = "";
            }

            document.querySelectorAll(".orderHiddenLi").forEach(element => {
                if (element.dataset.selected == "true") {
                    element.style.backgroundColor = "#b3e403";
                }
                else {
                    element.style.backgroundColor = "transparent";
                }

                element.addEventListener("click", () => {
                    document.querySelectorAll(".orderHiddenLi").forEach(hidden => {
                        if (hidden.dataset.selected) {
                            hidden.dataset.selected = false;
                            hidden.style.backgroundColor = "transparent";
                        }
                    });
                    
                    element.dataset.selected = true;
                    element.style.backgroundColor = "#b3e403";
                    
                    const content = element.innerHTML;
                
                    filtersData[4] = content=="All"?"":content;
                    updateDisplaiedData();
                });
            });
        });
    }

    typeHidden.addEventListener("click", () => {
        toggleCompactFiltersHidden(typeHiddenUl);

        if (creativityHiddenUl.style.display != "none") {
            toggleCompactFiltersHidden(creativityHiddenUl);
            document.querySelectorAll(".hiddenTypeFilterTextImg")[1].style.transform = "";
        }

        if (statusHiddenUl.style.display != "none") {
            toggleCompactFiltersHidden(statusHiddenUl);
            document.querySelectorAll(".hiddenTypeFilterTextImg")[2].style.transform = "";
        }

        if (orderByHiddenUl) {
            if (orderByHiddenUl.style.display != "none") {
                toggleCompactFiltersHidden(orderByHiddenUl);
                document.querySelectorAll(".hiddenTypeFilterTextImg")[3].style.transform = "";
            }
        }

        if (document.querySelectorAll(".hiddenTypeFilterTextImg")[0].style.transform == "") {
            document.querySelectorAll(".hiddenTypeFilterTextImg")[0].style.transform = "rotate(180deg)";
        } else {
            document.querySelectorAll(".hiddenTypeFilterTextImg")[0].style.transform = "";
        }

        document.querySelectorAll(".typeHiddenLi").forEach(element => {
            if (element.dataset.selected == "true") {
                element.style.backgroundColor = "#b3e403";
            }
            else {
                element.style.backgroundColor = "transparent";
            }

            element.addEventListener("click", () => {
                document.querySelectorAll(".typeHiddenLi").forEach(hidden => {
                    if (hidden.dataset.selected) {
                        hidden.dataset.selected = false;
                        hidden.style.backgroundColor = "transparent";
                    }
                });
                
                element.dataset.selected = true;
                element.style.backgroundColor = "#b3e403";
                
                const content = element.innerHTML;
            
                filtersData[1] = content=="All"?"":content;
                updateDisplaiedData();
            });
        });
    });

    creativityHidden.addEventListener("click", () => {
        toggleCompactFiltersHidden(creativityHiddenUl);

        if (typeHiddenUl.style.display != "none") {
            toggleCompactFiltersHidden(typeHiddenUl);
            document.querySelectorAll(".hiddenTypeFilterTextImg")[0].style.transform = "";
        }

        if (statusHiddenUl.style.display != "none") {
            toggleCompactFiltersHidden(statusHiddenUl);
            document.querySelectorAll(".hiddenTypeFilterTextImg")[2].style.transform = "";
        }

        if (orderByHiddenUl) {
            if (orderByHiddenUl.style.display != "none") {
                toggleCompactFiltersHidden(orderByHiddenUl);
                document.querySelectorAll(".hiddenTypeFilterTextImg")[3].style.transform = "";
            }
        }

        if (document.querySelectorAll(".hiddenTypeFilterTextImg")[1].style.transform == "") {
            document.querySelectorAll(".hiddenTypeFilterTextImg")[1].style.transform = "rotate(180deg)";
        } else {
            document.querySelectorAll(".hiddenTypeFilterTextImg")[1].style.transform = "";
        }

        document.querySelectorAll(".creativityHiddenLi").forEach(element => {
            if (element.dataset.selected == "true") {
                element.style.backgroundColor = "#b3e403";
            }
            else {
                element.style.backgroundColor = "transparent";
            }

            element.addEventListener("click", () => {
                document.querySelectorAll(".creativityHiddenLi").forEach(hidden => {
                    if (hidden.dataset.selected) {
                        hidden.dataset.selected = false;
                        hidden.style.backgroundColor = "transparent";
                    }
                });
                
                element.dataset.selected = true;
                element.style.backgroundColor = "#b3e403";
                
                const content = element.innerHTML;
            
                filtersData[2] = content=="All"?"":content;
                updateDisplaiedData();
            });
        });
    });

    statusHidden.addEventListener("click", () => {
        toggleCompactFiltersHidden(statusHiddenUl);

        if (typeHiddenUl.style.display != "none") {
            toggleCompactFiltersHidden(typeHiddenUl);
            document.querySelectorAll(".hiddenTypeFilterTextImg")[0].style.transform = "";
        }

        if (creativityHiddenUl.style.display != "none") {
            toggleCompactFiltersHidden(creativityHiddenUl);
            document.querySelectorAll(".hiddenTypeFilterTextImg")[1].style.transform = "";
        }

        if (orderByHiddenUl) {
            if (orderByHiddenUl.style.display != "none") {
                toggleCompactFiltersHidden(orderByHiddenUl);
                document.querySelectorAll(".hiddenTypeFilterTextImg")[3].style.transform = "";
            }
        }

        if (document.querySelectorAll(".hiddenTypeFilterTextImg")[2].style.transform == "") {
            document.querySelectorAll(".hiddenTypeFilterTextImg")[2].style.transform = "rotate(180deg)";
        } else {
            document.querySelectorAll(".hiddenTypeFilterTextImg")[2].style.transform = "";
        }

        document.querySelectorAll(".statusHiddenLi").forEach(element => {
            if (element.dataset.selected == "true") {
                element.style.backgroundColor = "#b3e403";
            }
            else {
                element.style.backgroundColor = "transparent";
            }

            element.addEventListener("click", () => {
                document.querySelectorAll(".statusHiddenLi").forEach(hidden => {
                    if (hidden.dataset.selected) {
                        hidden.dataset.selected = false;
                        hidden.style.backgroundColor = "transparent";
                    }
                });
                
                element.dataset.selected = true;
                element.style.backgroundColor = "#b3e403";
                
                const content = element.innerHTML;
            
                filtersData[3] = content=="All"?"":content;
                updateDisplaiedData();
            });
        });
    });
}

function toggleCompactFiltersHidden(tempcompactFiltersHidden=compactFiltersHidden) {
    if (tempcompactFiltersHidden.style.display != "none") {
        tempcompactFiltersHidden.style.display = "none";
    }
    else {
        tempcompactFiltersHidden.style.display = "block";
    }
}

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

    if (result) {
        loadData2(result);
    }
    else {
        printError(421);
    }
}

function loadData2(result) {
    listOfIdeas.innerHTML = "";

    if (result['format'] == "mono") {
        result['data'].forEach(ideaData => {
            addChildToList(`./ideaVoid.php?idea=${ideaData['id']}`, ideaData['title'], ideaData['username'], ideaData['ideaimage']);
        });
    } else if (result['format'] == "double") {
        result['data']['data'].forEach(accountData => {
            addChildToList(`./accountVoid.php?account=${accountData['id']}`, accountData['username'], `${accountData['name']} ${accountData['surname']}`, accountData['userimage']);
        });

        result['subdata']['data'].forEach(ideaData => {
            addChildToList(`./ideaVoid.php?idea=${ideaData['id']}`, ideaData['title'], ideaData['username'], ideaData['ideaimage']);
        });
    }
    else if (result['format'] == "void") {
        result['data'].forEach(ideaData => {
            addChildToList(`./ideaVoid.php?idea=${ideaData['id']}`, ideaData['title'], ideaData['username'], ideaData['ideaimage']);
        });
    }

    function addChildToList(href, title, author, imgSrc) {
        const childOfListIdeas = document.createElement("a");

        childOfListIdeas.classList.add("ideaLinkSrc");
        childOfListIdeas.href = href;
        childOfListIdeas.innerHTML = `
            <li class="ideaBoxScr">
                <img src="${imgSrc!=null?imgSrc:"./images/FreeIdeas.svg"}" alt="Idea Image" class="ideaImageSrc">
                <p class="ideaTitleSrc">${title}</p>
                <p class="ideaAuthorSrc">${author}</p>
            </li>`;

        listOfIdeas.appendChild(childOfListIdeas);
    }
}

updateFiltersIfExists();
updateDisplaiedData();

/* Window size responsive part */
let allFiltersBackup = document.getElementById("allFilters").innerHTML;
let partialyFiltersBackup = document.getElementById("allFilters").innerHTML;

window.addEventListener("resize", () => {
    toggleWindowSize2();
});

function toggleWindowSize2() {
    if (window.innerWidth < 1100 && window.innerWidth > 600) {
        if (document.getElementById("allFilters").innerHTML == partialyFiltersBackup || document.getElementById("allFilters").innerHTML == allFiltersBackup) {
            partialyFiltersBackup = document.getElementById("allFilters").innerHTML;

            document.getElementById("allFilters").innerHTML = `
            <li class="filterBlock">
                <div id="compactFilters" data-type="1">
                    <img id="compactFiltersImg" src="./images/filters${themeIsLight?"":"_Pro"}.svg">
                    <span>Filters</span>
                </div>
            </li>

            <li class="filterBlock">
                <label class="labelInfoSearch">Order by:</label>
                <select id="orderByPeople" class="filterSearch">
                    <option selected>All</option>
                    <option>Most voted</option>
                    <option>Newest</option>
                    <option>Most discussed</option>
                </select>
            </li>
            
            <div id="compactFiltersHidden">
                <ul>
                    <li id="typeHidden"><div class="hiddenTypeFilterText">Type of project <img class="hiddenTypeFilterTextImg" src="./images/menuFilters.svg"></div></li>
                    <ul id="typeHiddenUl">
                        <li class="typeHiddenLi" data-selected="true">All</li>
                        <li class="typeHiddenLi">Technological Innovation</li>
                        <li class="typeHiddenLi">Environmental Sustainability</li>
                        <li class="typeHiddenLi">Education & Learning</li>
                        <li class="typeHiddenLi">Business & Startups</li>
                        <li class="typeHiddenLi">Art & Design</li>
                        <li class="typeHiddenLi">Social & Community</li>
                        <li class="typeHiddenLi">Health & Wellness</li>
                        <li class="typeHiddenLi">Travel & Experiences</li>
                        <li class="typeHiddenLi">Games & Entertainment</li>
                    </ul>

                    <li id="creativityHidden"><div class="hiddenTypeFilterText">Creativity Type <img class="hiddenTypeFilterTextImg" src="./images/menuFilters.svg"></div></li>
                    <ul id="creativityHiddenUl">
                        <li class="creativityHiddenLi" data-selected="true">All</li>
                        <li class="creativityHiddenLi">Practical and actionable</li>
                        <li class="creativityHiddenLi">Abstract or conceptual</li>
                        <li class="creativityHiddenLi">Thought-provoking</li>
                        <li class="creativityHiddenLi">Visionary or futuristic</li>
                        <li class="creativityHiddenLi">Humorous or satirical</li>
                    </ul>

                    <li id="statusHidden"><div class="hiddenTypeFilterText">Project status <img class="hiddenTypeFilterTextImg" src="./images/menuFilters.svg"></div></li>
                    <ul id="statusHiddenUl">
                        <li class="statusHiddenLi" data-selected="true">All</li>
                        <li class="statusHiddenLi">Finished</li>
                        <li class="statusHiddenLi">Work in progress</li>
                        <li class="statusHiddenLi">Need help</li>
                    </ul>
                </ul>
            </div>`;

            document.getElementById("compactFiltersImg").src = `./images/filters${themeIsLight?"":"_Pro"}.svg`;

            updateFiltersIfExists();
        }
    }
    else if (window.innerWidth <= 600) {
        if (document.getElementById("allFilters").innerHTML != partialyFiltersBackup || document.getElementById("allFilters").innerHTML == allFiltersBackup) {
            partialyFiltersBackup = document.getElementById("allFilters").innerHTML;

            document.getElementById("allFilters").innerHTML = `
            <li class="filterBlock">
                <div id="compactFilters" data-type="2">
                    <img id="compactFiltersImg" src="./images/filters${themeIsLight?"":"_Pro"}.svg">
                    <span>Filters</span>
                </div>
            </li>
            
            <div id="compactFiltersHidden">
                <ul>
                    <li id="typeHidden"><div class="hiddenTypeFilterText">Type of project <img class="hiddenTypeFilterTextImg" src="./images/menuFilters.svg"></div></li>
                    <ul id="typeHiddenUl">
                        <li class="typeHiddenLi" data-selected="true">All</li>
                        <li class="typeHiddenLi">Technological Innovation</li>
                        <li class="typeHiddenLi">Environmental Sustainability</li>
                        <li class="typeHiddenLi">Education & Learning</li>
                        <li class="typeHiddenLi">Business & Startups</li>
                        <li class="typeHiddenLi">Art & Design</li>
                        <li class="typeHiddenLi">Social & Community</li>
                        <li class="typeHiddenLi">Health & Wellness</li>
                        <li class="typeHiddenLi">Travel & Experiences</li>
                        <li class="typeHiddenLi">Games & Entertainment</li>
                    </ul>

                    <li id="creativityHidden"><div class="hiddenTypeFilterText">Creativity Type <img class="hiddenTypeFilterTextImg" src="./images/menuFilters.svg"></div></li>
                    <ul id="creativityHiddenUl">
                        <li class="creativityHiddenLi" data-selected="true">All</li>
                        <li class="creativityHiddenLi">Practical and actionable</li>
                        <li class="creativityHiddenLi">Abstract or conceptual</li>
                        <li class="creativityHiddenLi">Thought-provoking</li>
                        <li class="creativityHiddenLi">Visionary or futuristic</li>
                        <li class="creativityHiddenLi">Humorous or satirical</li>
                    </ul>

                    <li id="statusHidden"><div class="hiddenTypeFilterText">Project status <img class="hiddenTypeFilterTextImg" src="./images/menuFilters.svg"></div></li>
                    <ul id="statusHiddenUl">
                        <li class="statusHiddenLi" data-selected="true">All</li>
                        <li class="statusHiddenLi">Finished</li>
                        <li class="statusHiddenLi">Work in progress</li>
                        <li class="statusHiddenLi">Need help</li>
                    </ul>

                    <li id="orderByHidden"><div class="hiddenTypeFilterText">Order By <img class="hiddenTypeFilterTextImg" src="./images/menuFilters.svg"></div></li>
                    <ul id="orderByHiddenUl">
                        <li class="orderHiddenLi" data-selected="true">All</li>
                        <li class="orderHiddenLi">Most voted</li>
                        <li class="orderHiddenLi">Newest</li>
                        <li class="orderHiddenLi">Most discussed</li>
                    </ul>
                </ul>
            </div>`;

            document.getElementById("compactFiltersImg").src = `./images/filters${themeIsLight?"":"_Pro"}.svg`;

            updateFiltersIfExists();
        }
    }
    else {
        if (document.getElementById("allFilters").innerHTML != allFiltersBackup) {
            document.getElementById("allFilters").innerHTML = allFiltersBackup;
            updateFiltersIfExists();
        }
    }
}

toggleWindowSize2();
toggleWindowSize2();

/* Toggle theme */
new MutationObserver(() => {
    if (document.getElementById("compactFiltersImg")) {
        const compactFiltersImg = document.getElementById("compactFiltersImg");
        compactFiltersImg.src = `./images/filters${themeIsLight?"":"_Pro"}.svg`;
    }
}).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
});