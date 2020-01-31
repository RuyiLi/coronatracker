const ENDPOINTS = {
    REPORTS: 'https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/ncov_cases/FeatureServer/1/query?f=json&where=Recovered%3C%3E0&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=Recovered%20desc&resultOffset=0&resultRecordCount=250&cacheHint=true',
    TOTALS: 'https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/ncov_cases/FeatureServer/1/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outStatistics=%5B%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22Confirmed%22%2C%22outStatisticFieldName%22%3A%22confirmed%22%7D%2C%20%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22Deaths%22%2C%22outStatisticFieldName%22%3A%22deaths%22%7D%2C%20%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22Recovered%22%2C%22outStatisticFieldName%22%3A%22recovered%22%7D%5D&outSR=102100&cacheHint=false',
    REPORTS_BY_COUNTRY_OR_REGION: 'https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/ncov_cases/FeatureServer/2/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=Confirmed%20desc&outSR=102100&resultOffset=0&resultRecordCount=250&cacheHint=true',
}

const $ = document.querySelector.bind(document);

const totalDeaths = $('#total-deaths');
const totalConfirmed = $('#total-confirmed');
const totalRecovered = $('#total-recovered');
const lastUpdated = $('#last-updated');

const deathsTable = $('#deaths-table > tbody');
const recoveredTable = $('#recovered-table > tbody');
const confirmedTable = $('#confirmed-table > tbody');
const cumulativeTable = $('#cumu-table > tbody');

fetch(ENDPOINTS.TOTALS)
    .then(res => res.json())
    .then(res => {
        const { confirmed, deaths, recovered } = res.features[ 0 ].attributes;
        totalDeaths.innerHTML = `Total Deaths: <strong> ${ deaths } </strong>`;
        totalConfirmed.innerHTML = `Total Confirmed Cases: <strong> ${ confirmed } </strong>`;
        totalRecovered.innerHTML = `Total Recovered: <strong> ${ recovered } </strong>`;
    });


const attributesOfInterest = [
    'Country_Region',
    'Confirmed',
    'Deaths',
    'Recovered',
]

fetch(ENDPOINTS.REPORTS_BY_COUNTRY_OR_REGION)
    .then(res => res.json())
    .then(res => {
        for (const { attributes } of res.features) {
            const row = document.createElement('tr');
            for (const attr of attributesOfInterest) {
                const cell = document.createElement('td');
                cell.innerText = attributes[ attr ] || 0;
                row.appendChild(cell);
            }
            cumulativeTable.appendChild(row);
        }
    });

fetch(ENDPOINTS.REPORTS)
    .then(res => res.json())
    .then(res => {
        const lastUpdate = res.features[ 0 ].attributes.Last_Update;
        lastUpdated.innerHTML = `Last Updated: <strong> ${ lastUpdate } </strong>`;

        for (const {
            attributes: {
                Province_State: prov,
                Country_Region: region,
                Deaths: deaths,
                Recovered: recovered,
                Confirmed: confirmed,
            }
        } of res.features) {
            function appendLocations (element) {
                const provCell = document.createElement('td');
                const regionCell = document.createElement('td');
                provCell.innerText = prov;
                regionCell.innerText = region;
                element.appendChild(provCell);
                element.appendChild(regionCell);
            }

            const deathCell = document.createElement('td');
            const recoveredCell = document.createElement('td');
            const confirmedCell = document.createElement('td');

            deathCell.innerText = deaths;
            recoveredCell.innerText = recovered;
            confirmedCell.innerText = confirmed;

            const deathRow = document.createElement('tr');
            const recoveredRow = document.createElement('tr');
            const confirmedRow = document.createElement('tr');

            appendLocations(deathRow);
            appendLocations(recoveredRow);
            appendLocations(confirmedRow);

            deathRow.appendChild(deathCell);
            recoveredRow.appendChild(recoveredCell);
            confirmedRow.appendChild(confirmedCell);

            deathsTable.appendChild(deathRow);
            recoveredTable.appendChild(recoveredRow);
            confirmedTable.appendChild(confirmedRow);
        }
    });