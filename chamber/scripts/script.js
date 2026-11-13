// Footer Dynamic Dates
const currentYearSpan = document.getElementById("currentyear");
if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
}

const lastModifiedParagraph = document.getElementById("lastModified");
if (lastModifiedParagraph) {
    lastModifiedParagraph.textContent = `Last Modification: ${document.lastModified}`;
}

// Mobile Navigation Toggle
const menuToggle = document.getElementById("menu-toggle");
const primaryNav = document.getElementById("primary-nav");

if (menuToggle && primaryNav) {
    menuToggle.addEventListener("click", () => {
        primaryNav.classList.toggle("open");
    });
}

// --- Home Page: OpenWeatherMap API ---
const currentWeatherDiv = document.getElementById("current-weather");
const forecastDiv = document.getElementById("forecast");

const lat = "6.4654";
const lon = "3.4064";
const apiKey = "caceab2b2ce02b3a3cedad2cc2a4cdb0";

async function fetchWeather() {
    if (!currentWeatherDiv || !forecastDiv) return;

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

    try {
        const [weatherRes, forecastRes] = await Promise.all([
            fetch(weatherUrl),
            fetch(forecastUrl)
        ]);

        if (weatherRes.ok) {
            const weatherData = await weatherRes.json();
            displayCurrentWeather(weatherData);
        }

        if (forecastRes.ok) {
            const forecastData = await forecastRes.json();
            displayForecast(forecastData);
        }
    } catch (error) {
        console.error("Weather fetch error:", error);
    }
}

function displayCurrentWeather(data) {
    const temp = Math.round(data.main.temp);
    const desc = data.weather[0].description;
    const icon = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    currentWeatherDiv.innerHTML = `
        <div class="weather-current-display">
            <img src="${iconUrl}" alt="${desc}" width="60" height="60">
            <div>
                <p class="weather-temp">${temp}&deg;C</p>
                <p class="weather-desc">${desc}</p>
            </div>
        </div>
    `;
}

function displayForecast(data) {
    const dailyList = data.list.filter(item => item.dt_txt.includes("12:00:00")).slice(0, 3);

    let html = `<h4>3-Day Forecast</h4><ul class="forecast-list">`;
    dailyList.forEach(day => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
        const temp = Math.round(day.main.temp);
        html += `<li><span>${dayName}</span> <strong>${temp}&deg;C</strong></li>`;
    });
    html += `</ul>`;

    forecastDiv.innerHTML = html;
}

fetchWeather();

// --- Home Page: Random Spotlights ---
const spotlightContainer = document.getElementById("spotlight-container");

async function fetchSpotlights() {
    if (!spotlightContainer) return;

    try {
        const response = await fetch("data/members.json");
        if (response.ok) {
            const data = await response.json();
            const members = Array.isArray(data) ? data : data.members;

            const eligible = members.filter(member => {
                const level = String(member.membershipLevel).toLowerCase();
                return level === "gold" || level === "silver" || level === "3" || level === "2";
            });

            const selected = eligible.sort(() => 0.5 - Math.random()).slice(0, 3);
            displaySpotlights(selected);
        }
    } catch (error) {
        console.error("Spotlights fetch error:", error);
    }
}

function displaySpotlights(members) {
    spotlightContainer.innerHTML = "";
    members.forEach(member => {
        const card = document.createElement("article");
        card.className = "spotlight-card";
        card.innerHTML = `
            <h3>${member.name}</h3>
            <img src="${member.image}" alt="${member.name} logo" width="110" height="80" loading="lazy">
            <p>${member.address}</p>
            <p>${member.phone}</p>
            <p><a href="${member.website}" target="_blank" rel="noopener">Visit Website</a></p>
            <span class="membership-badge">${member.membershipLevel} Member</span>
        `;
        spotlightContainer.appendChild(card);
    });
}

fetchSpotlights();

// --- Directory Page: Member Loading & View Toggle ---
const memberContainer = document.getElementById("member-container");
const gridBtn = document.getElementById("grid-btn");
const listBtn = document.getElementById("list-btn");

async function fetchMembers() {
    if (!memberContainer) return;

    try {
        const response = await fetch("data/members.json");
        if (response.ok) {
            const members = await response.json();
            displayMembers(members);
        }
    } catch (error) {
        console.error("Error loading members:", error);
    }
}

function displayMembers(members) {
    memberContainer.innerHTML = "";
    members.forEach(member => {
        const card = document.createElement("article");
        card.className = "member-card";
        
        let levelName = "Member";
        if (member.membershipLevel === 3) levelName = "Gold Member";
        else if (member.membershipLevel === 2) levelName = "Silver Member";

        card.innerHTML = `
            <img src="${member.image}" alt="${member.name} logo" width="110" height="80" loading="lazy">
            <div class="member-info">
                <h3>${member.name}</h3>
                <p class="member-desc">${member.description || ""}</p>
                <p>${member.address}</p>
                <p>${member.phone}</p>
                <p><a href="${member.website}" target="_blank" rel="noopener">Website</a></p>
                <span class="member-level"><strong>${levelName}</strong></span>
            </div>
        `;
        memberContainer.appendChild(card);
    });
}

if (gridBtn && listBtn && memberContainer) {
    gridBtn.addEventListener("click", () => {
        memberContainer.classList.add("grid-view");
        memberContainer.classList.remove("list-view");
        gridBtn.classList.add("active");
        listBtn.classList.remove("active");
    });

    listBtn.addEventListener("click", () => {
        memberContainer.classList.add("list-view");
        memberContainer.classList.remove("grid-view");
        listBtn.classList.add("active");
        gridBtn.classList.remove("active");
    });
}

fetchMembers();