let fleetSideStalk;

async function loadSideStalk() {
    let tries = 0;
    do {
        fleetSideStalk = jQuery("#pageContent #left #toolbarcomponent .ogl-sideStalk");
        await delay(500);
    } while(fleetSideStalk.length == 0 && ++tries < 10);
}

async function showSideStalk() {
    const status_abbr_longinactive = fleetSideStalk.find(".status_abbr_longinactive");
    if(status_abbr_longinactive.length > 0) {        
        status_abbr_longinactive[0].click();
        await delay(100);
        await loadSideStalk();
    }
}

async function disableSply() {
    ogameExtConfig.spy.currentPlayer = null;
    ogameExtConfig.spy.playersAlreadySpyed = null;
    ogameExtConfig.spy.enabled = false;
    saveSpy({enabled: false});
}

async function goToMessages() {
    console.log(getTime(), "Going to messages...");
    jQuery("#pageContent #newmessagesindicatorcomponent div.messagesIndicator")[0].click();
}

async function selectPlayer() {
    if(ogameExtConfig.spy.currentPlayer){
        console.log(getTime(), "Current player:", ogameExtConfig.spy.currentPlayer);
        return;
    }

    const minumizeButton = fleetSideStalk.find(".ogl-text-btn.ogi-sideStalk-minBtn");
    if(minumizeButton.length > 0) {
        const playersBtn = fleetSideStalk.find(".ogl-text-btn[title='History']");
        playersBtn[0].click();
        await delay(100);
    }
    await loadSideStalk();

    const players = fleetSideStalk.find(".ogl-player .status_abbr_longinactive");
    const lastPlayer = players[players.length - 1];
    const lastPlayerName = lastPlayer.textContent;
    console.log(getTime(), "Last player:", lastPlayerName);

    if(ogameExtConfig.spy.playersAlreadySpyed.includes(lastPlayerName)) {
        console.log(getTime(), "All Players Already spied. Disabling spy ...");
        await disableSply();
        await goToMessages();
        return;
    }

    ogameExtConfig.spy.currentPlayer = lastPlayerName;
    saveSpy(ogameExtConfig.spy);
    lastPlayer.click();
    await delay(500);
    await loadSideStalk();
}

async function selectPlanet() {
    let planets;
    do {
        planets = fleetSideStalk.find(".ogl-stalkPlanets a").not(".ogl-deleted").find(".ogl-planet-div").parent();
        await delay(1000);
    } while(planets.length == 0);
    
    let planetToSpy = null;
    for(const planet of planets) {
        const planetCoords = jQuery(planet).attr("data-coords");
        if(ogameExtConfig.spy.planetsAlreadySpyed.includes(planetCoords)) {
            console.log(getTime(), "Already spied planet:", planetCoords);
            continue;
        }

        console.log(getTime(), "Selecting planet:", planetCoords);
        planetToSpy = planet;
        planetToSpy.click();
        await delay(1000);
        break;
    }

    if(planetToSpy === null) {
        console.log(getTime(), "No planet to spy on.");
        ogameExtConfig.spy.playersAlreadySpyed.push(ogameExtConfig.spy.currentPlayer);
        ogameExtConfig.spy.currentPlayer = null;
        saveSpy(ogameExtConfig.spy);
        await spy();
    }
}

async function spyGalaxyPlanets() {
    if(currentView !== "galaxy"){
        console.log(getTime(), "Not in galaxy view. Aborting spy on galaxy planets.");
        return;
    }

    const planets = jQuery("#galaxycomponent #galaxyContent .galaxyRow.ctContentRow.inactive_filter").not(".vacation_filter");
    for(const planetRow of planets) {
        const planet = jQuery(planetRow).find(".cellPlanet a");
        const planetName = jQuery(planetRow).find(".cellPlanetName span").text();
        const planetCoords = jQuery(planetRow).find(".cellPlanet .galaxyTooltip span")[0].textContent.replace("[", '').replace("]", '');

        console.log(getTime(), "Spying on planet:", planetName, planetCoords);
        planet[0].click();
        ogameExtConfig.spy.planetsAlreadySpyed.push(planetCoords);
        await delay(1000);
    }
    
    saveSpy(ogameExtConfig.spy);
    await delay(1000);
    await spy();
}

async function init() {
    if(!ogameExtConfig.spy.playersAlreadySpyed)
        ogameExtConfig.spy.playersAlreadySpyed = [];
    if(!ogameExtConfig.spy.planetsAlreadySpyed)
        ogameExtConfig.spy.planetsAlreadySpyed = [];
}

async function spy() {
    console.log(getTime(),  "Espionage...");
    await loadSideStalk();

    if(fleetSideStalk.length == 0) {
        console.log(getTime(), "Side stalk not found.");
        return;
    }

    await init();
    await showSideStalk();
    await selectPlayer();
    await selectPlanet();
    await spyGalaxyPlanets();
}

async function main() {
    if(currentView == "galaxy") {
        await init();
        if(ogameExtConfig.spy && ogameExtConfig.spy.enabled) {
            console.log(getTime(), "Starting espionage in galaxy view.");
            await spyGalaxyPlanets();
        }
    }   
}