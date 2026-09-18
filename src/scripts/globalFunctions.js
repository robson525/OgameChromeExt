const planetsUpgradeList = [];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const getTime = () => {
    var now = new Date();
    return now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
};

async function reloadPage(seconds) {
    console.log(getTime(),  'Reloading the page in ' + seconds + ' seconds ...');
    await delay(1000 * seconds);
    console.log(getTime(),  'Reloading the page ...');
    window.location.reload();
}

function getTechnology(technology) {
    return jQuery("#technologies li.technology." + technology);
}
function getTechnologyLevel(technology) {
    return parseInt(jQuery(technology).find("span.level span.stockAmount").html().trim());
}
function isTechnologyUpgradeable(technology) {
    return jQuery(technology).attr("data-status") == "on"
}
async function upgradeTechnology(technology) {
     const upgradeButton = jQuery(technology).find("button.upgrade");
     if(upgradeButton.length === 0) {
        console.log(getTime(), 'Upgrade button not found for technology:');
        return;
     }
     upgradeButton[0].click();
}

async function getHightlightPlanet(){
    return jQuery("#planetList div.hightlightPlanet");
}
async function getHightlightPlanetName(){
    const currentPlanet = await getHightlightPlanet();
    return currentPlanet.find(".planet-name").html().trim();
}

async function checkPlanetsUpgradeable(){
    const currentPlanet = await getHightlightPlanetName();
    const isUpgradeable = planetsUpgradeList.includes(currentPlanet);
    if(isUpgradeable) {
        console.log(getTime(), 'Current planet is in the upgrade list. Proceeding...');
    } else {
        console.log(getTime(), 'Current planet is not in the upgrade list. Exiting...');
    }
    return isUpgradeable;
}

async function goToPlanet(planetName){
    const planet = jQuery("#planetList div.smallplanet .planet-name").filter(function() {
        return jQuery(this).html().trim() === planetName;
    }).first();
    if(planet.length > 0) {
        console.log(getTime(), 'Navigating to planet: ' + planetName);
        planet.parent()[0].click();
    } else {
        console.log(getTime(), 'Planet not found: ' + planetName);
    }
}

async function checkAtack(){
    const attackAlert = jQuery("#pageContent #top #notificationbarcomponent #attack_alert");
    if(attackAlert.length > 0) {
        console.log(getTime(), 'Attack alert detected!');
        const currentPlanet = await getHightlightPlanetName();

        const planetAlert = jQuery("#planetList div.smallplanet .ogi-planet_alert");
        for(let i = 0; i < planetAlert.length; i++) {
            const planet = planetAlert[i];
            const planetName = jQuery(planet).parent().find(".planet-name").html().trim();
            const planetkoords = jQuery(planet).parent().find(".planet-koords").html().trim();
            console.log(getTime(), 'Planet alert detected: ' + planetName + ' (' + planetkoords + ')');
            
            if(currentPlanet == planetName) {
                console.log(getTime(), 'Current planet is under attack: ' + currentPlanet);
                // Add any additional logic for handling the current planet under attack here.
            }
            else {
                // await goToPlanet(planetName);
                break;
            }
        }
    }   
}

async function main() {
    await delay(2000);
    await checkAtack();
}
main();