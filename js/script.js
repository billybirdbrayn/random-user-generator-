const searchWrapper = document.querySelector('.search-wrapper');
const galleryImages = document.querySelector('#galleryImages');
let completeList = [];
let filteredList = [];
let strSearch = '';
let currIndex;

dynamicSrch();

galleryImages.addEventListener('click', e => openModal(e));


// Get 12 random users from API w/fetch
fetch('https://randomuser.me/api/?results=12&nat=us')
    .then(response => response.json())
    .then(data => showEmployees(data.results));


function showEmployees(employees) {

    filteredList = employees;

    if (completeList.length === 0) {
        completeList = employees;
    }

    let galleryImagesHTML = '';

    employees.map(function (employee) {
        galleryImagesHTML += `
            <div class="placard">
                <div class="placard-img-container">
                    <img class="placard-img" src="${employee.picture.large}"
                    alt="photo">
                </div>
                <div class="placard-info-wrapper">
                    <h3 id="name" class="placard-name cap">${employee.name.first} ${employee.name.last}</h3>
                    <p class="placard-text">${employee.email}</p>
                    <p class="placard-text cap">${employee.location.city}</p>
                </div>
            </div>
        `;
    });

    galleryImages.innerHTML = galleryImagesHTML;
}

function dynamicSrch() {
    let formHTML = `
        <form action="#" method="get">
            <input type="search" id="search-input" class="search-input" placeholder="Search...">
        </form>
    `;

    searchWrapper.innerHTML = formHTML;

    const searchInput = document.querySelector('#search-input')

    searchInput.addEventListener('input', () => {
        strSearch = searchInput.value.toUpperCase();
        newSearch();
    });
}

const newSearch = () => {
    filteredList = [];

    for (let i = 0; i < completeList.length; i++) {

        let name = `
            ${completeList[i].name.first} ${completeList[i].name.last}
        `;
        if (name.includes(strSearch)) {
            filteredList.push(completeList[i]);
        }
    }

    showEmployees(filteredList);
};

function hide(element) {
    element.style.visibility = 'hidden';
}

function show(element) {
    element.style.visibility = 'visible';
}

function updateInfo(employeeIndex) {

    let employee = filteredList[employeeIndex];

    let birthday = new Date(employee.dob.date);
    birthday = birthday.getMonth() + 1 + '/' +
        birthday.getDate() + '/' +
        birthday.getFullYear();

    let dataHTML = `
        <img class="modal-photo" src="${employee.picture.large}" alt="photo">
        <h3 id="name" class="modal-name cap">
            ${employee.name.first} ${employee.name.last}
        </h3>
        <p class="modal-text">${employee.email}</p>
        <p class="modal-text cap">${employee.location.city}</p>
        <hr>
        <p class="modal-text">${employee.cell}</p>
        <p class="modal-text cap">
            ${employee.location.street.number}
            ${employee.location.street.name},
            ${employee.location.city}, 
            ${employee.location.state} ${employee.location.postcode}
        </p>
        <p class="modal-text">birthday: ${birthday}</p>
    `;

    document.querySelector('.modal-info-container').innerHTML = dataHTML;
}


function shutModal() {
    const modalContainer = document.querySelector('.modal-wrapper');
    modalContainer.remove();
}

function openModal(event) {

    let placard = event.target.closest('.placard');
    if (placard) {

        const employeeEmail = placard.children[1].children[1].textContent;
        const container = document.createElement('div');
        container.classList.add('modal-wrapper');


        currIndex = filteredList.findIndex(employee => employee.email === employeeEmail);

        container.innerHTML = `
            <div class="modal">
                <button type="button" id="modal-button" class="modal-button"><strong>X</strong></button>
                <div class="modal-info-container">
                </div>
            </div>
            <div class="modal-button-wrapper">
                <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>
        `;

        document.querySelector('body').append(container);
        updateInfo(currIndex);

        const closeButton = document.querySelector('.modal-button');
        const prev = document.querySelector('#modal-prev');
        const next = document.querySelector('#modal-next');


        closeButton.addEventListener('click', e => shutModal(e));

        if (currIndex === 0) hide(prev);
        if (currIndex === filteredList.length - 1) hide(next);

        prev.addEventListener('click', () => reviseModal(prev, next));
        next.addEventListener('click', () => reviseModal(next, prev));

        document.querySelector('.modal-wrapper').addEventListener('click', e => {
            if (!e.target.closest('.modal')
                && !e.target.closest('.modal-button-wrapper')) {
                shutModal();
            }
        });
    }
}

function reviseModal(modalBtnClick, secondBtn) {

    currIndex = (modalBtnClick.textContent === 'Prev')
        ? (currIndex - 1) : (currIndex + 1);

    if (currIndex === 0) hide(modalBtnClick);
    if (currIndex === filteredList.length - 1) hide(modalBtnClick);

    updateInfo(currIndex);
    show(secondBtn);
}