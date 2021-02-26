// ALL THE SELECTORS HERE BRUH !

const allCountriesCont = document.querySelector('.all_countries_container');
const headerConfirmed = document.querySelector('.header_confirmed');
const headerRecovered = document.querySelector('.header_recovered');
const headerCritical = document.querySelector('.header_critical');
const headerDead = document.querySelector('.header_dead');

const countryContainer = document.querySelector('.all_countries_container');
const favCountriesContainer = document.querySelector('.favourite_countries_container');

const countryName = document.querySelectorAll('.heading');
const dataTabs = document.querySelectorAll('.data_tab');

// GLOBAL VARIABLES 

let eachCountryData;

// THIS ONE WILL JUST FETCH AND UPDATE HEADER VALUES IMMEDIATELY, SAVING IS NOT NEEDED

const something = fetch("https://covid-19-data.p.rapidapi.com/totals", {
    "method": "GET",
    "headers": {
        "x-rapidapi-key": "9f8c89eeb5msh6588f204c8ccfd1p1f63d8jsn94fe2d76a051",
        "x-rapidapi-host": "covid-19-data.p.rapidapi.com"
    }
})
    .then(res => {
        return res.json();
    }).then(data => {
        let totalData = data[0];

        headerConfirmed.innerHTML = totalData.confirmed;
        headerRecovered.innerHTML = totalData.recovered;
        headerCritical.innerHTML = totalData.critical;
        headerDead.innerHTML = totalData.deaths;
    })
    .catch(err => {
        console.error(err);
    });

// THIS ASYNC FUNCTION WILL GET US ALL COUNTRIES DATA AND ASSIGN IT TO eachCountryData VARIABLE. AFTER ASSIGNMENT, eachCountryData WILL BE SORTED ALPHABETICALLY BY COUNTRY NAMES

// LOGIC FOR SORTING ARRAY OF OBJECTS BY COUNTRY NAME
function sortByObject(a, b) {
    if (a.country < b.country) {
        return -1;
    } else if (a.country > b.country) {
        return 1;
    } else {
        return 0;
    }
}

// LOGIC FOR SORTING ARRAY OF STRING BY COUNTRY NAME
function sortArr(a, b) {
    if (a < b) {
        return -1;
    } else if (a > b) {
        return 1;
    } else {
        return 0;
    }
}

async function getCountryData() {
    await fetch("https://covid-19-coronavirus-statistics2.p.rapidapi.com/countriesData", {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "9f8c89eeb5msh6588f204c8ccfd1p1f63d8jsn94fe2d76a051",
            "x-rapidapi-host": "covid-19-coronavirus-statistics2.p.rapidapi.com"
        }
    })
        .then(res => {
            return res.json();
        }).then(data => {
            eachCountryData = data.result;
            eachCountryData.sort(sortByObject);
        })
        .catch(err => {
            console.error(err);
        });
}

// THIS FUNCTION RENDERS ALL COUNTRIES BASED ON eachCountryData VARIABLE

async function render(data, place) {
    data.forEach(element => {
        place.insertAdjacentHTML("beforeend", `
<div class="individual_country_container">

<div class="heading">
    <span class="country_name">${element.country}</span>
    <img src="./images/heart.png" class='fav' alt="favourite">
</div>

<div class="data_container hidden">
    <div class="data_tab">
        <span class="tab_name">
            Confirmed
        </span>
        <span class="tab_data">
            ${element.totalCases}
        </span>
    </div>
    <div class="data_tab">
        <span class="tab_name">
            Recovered
        </span>
        <span class="tab_data">
            ${element.totalRecovered}
        </span>
    </div>
    <div class="data_tab">
        <span class="tab_name">
            New <br> Cases
        </span>
        <span class="tab_data">
            
            ${element.totalDeaths}
        </span>
    </div>
    <div class="data_tab">
        <span class="tab_name">
            Deaths
        </span>
        <span class="tab_data">
            ${element.totalDeaths}
        </span>
    </div>
</div>

</div>
`);
    });
}

function refresh() {
    countryContainer.innerHTML = '';
    eachCountryData.sort(sortByObject);
    render(eachCountryData, allCountriesCont);
}

// getting data from local storage if it is there 

let favData;

if (!localStorage.getItem('favourites')) {
    favData = [];
} else {
    favData = JSON.parse(localStorage.getItem('favourites'));
}

// Setting local storage 

function updateLocalStorage() {
    localStorage.clear();
    favData.sort(sortArr);
    localStorage.setItem('favourites', JSON.stringify(favData));
}

// This function gets country names from favData variable, then gets an up to date array of country related covid info and renders them. neat, right?

async function getFavourites() {
    const dataByNames = favData.map(
        x => eachCountryData.find(obj => {
            return obj.country === x;
        })
    )
    render(dataByNames, favCountriesContainer);
}

// EVENT LISTENERS // 

// This adds the functionality of showing and hiding individual country data :) 

const bothSections = [countryContainer, favCountriesContainer];

bothSections.forEach(element => {
    element.addEventListener(`click`, function (e) {
        if (e.target.classList.contains('country_name')) {
            let dataContainer = e.target.parentElement.parentElement.children;
            dataContainer[1].classList.toggle('hidden');
        }
    });
});



bothSections.forEach(element => {
    element.addEventListener(`click`, function (e) {
        if (e.target.classList.contains('fav')) {
            let favCountry = e.target.parentElement.parentElement;

            let nameOfCountry = e.target.parentElement.children[0].textContent;

            if (e.target.parentElement.parentElement.parentElement === countryContainer) {

                // push country name to favData variable
                if (favData.indexOf(nameOfCountry) === -1) {
                    favData.push(nameOfCountry);
                    updateLocalStorage();
                }

                const countryClone = favCountry.cloneNode(true);
                favCountriesContainer.appendChild(countryClone);

            } else if (e.target.parentElement.parentElement.parentElement === favCountriesContainer) {
                countryContainer.appendChild(favCountry);
                // remove country name from favData variable
                favData.splice(favData.indexOf(nameOfCountry), 1);
                updateLocalStorage();
            }
        }
    });
});

// MASTER WILL RUN ALL THE FUNCTIONS FOR US IN ASYNC MANNER 

async function master() {
    await getCountryData();
    await render(eachCountryData, allCountriesCont);
    await getFavourites();
}

master();