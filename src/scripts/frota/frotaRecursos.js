async function loadMainTarget() {
    const planets = await getPlanets();    
    const mainTarget = await getPlanetObj(planets.first());
    console.log(getTime(), 'Main target loaded: ' + mainTarget.name + ' (' + mainTarget.koords + ')');
    ogameExtConfig.sendResources.target = mainTarget
    saveSendResources(ogameExtConfig.sendResources);
}

async function goToNextPlanet() {
    console.log(getTime(), 'Going to the next planet.');
    const planets = await getPlanets();
    const currentPlanet = await getHightlightPlanetName();
    const currentIndex = planets.toArray().findIndex(planet => jQuery(planet).find(".planet-name").html().trim() === currentPlanet);
    const nextIndex = (currentIndex + 1) % planets.length;

    if(nextIndex > 0){
        const nextPlanet = planets.eq(nextIndex);    
        console.log(getTime(), 'Next planet: ' + nextPlanet.find(".planet-name").html().trim());
        nextPlanet[0].click();
    } else {
        console.log(getTime(), 'No next planet available.');
        ogameExtConfig.sendResources.enabled = false;
        ogameExtConfig.sendResources.alreadySent = null;
        saveSendResources(ogameExtConfig.sendResources);
    }
}

async function sendShips() {
    await delay(100);
    const oglDispatch = jQuery("#pageContent .content .ogl-dispatch");
    if(oglDispatch.is(':hidden')) {
        jQuery("#pageContent .content .ogl-dispatch-icons .ogi-plus-icon")[0].click();
        await delay(100);
    }

    oglDispatch.find(".ogl-cargo .select-most")[0].click();
    await delay(100);

    oglDispatch.find(".ogl-transport .ogl-res-transport .ogl-fleet-203")[0].click();
    await delay(500);

    jQuery("#pageContent #fleetdispatchcomponent #continueToFleet2")[0].click();
    console.log(getTime(), 'Proceeded to fleet 2.');
    await delay(500);

    jQuery("#pageContent #fleetboxdestination #shortcuts div .ogl-quickBtn").click()
    await delay(500);

    const targets = jQuery("div.ogl-dialogOverlay .ogl-dialogContent .ogl-quickPlanet");
    const targetIndex = targets.toArray().findIndex(planet => jQuery(planet).html().includes(ogameExtConfig.sendResources.target.name));
    targets.eq(targetIndex)[0].click();
    console.log(getTime(), 'Target selected: ' + ogameExtConfig.sendResources.target.name);
    await delay(1000);

    jQuery("#pageContent #resources #loadAllResources .select-most")[0].click();
    console.log(getTime(), 'All resources loaded.');
    await delay(500);

    jQuery("#pageContent #fleetdispatchcomponent #sendFleet")[0].click();
    console.log(getTime(), 'Fleet sent.');
}

async function saveLastSent(currentPlanet) {

    ogameExtConfig.sendResources.lastSent = currentPlanet;
    if(!ogameExtConfig.sendResources.alreadySent)
        ogameExtConfig.sendResources.alreadySent = [];
    ogameExtConfig.sendResources.alreadySent.push(currentPlanet.koords);
    saveSendResources(ogameExtConfig.sendResources);

}

async function sendResources() {
    if(!ogameExtConfig.sendResources.target){
        await loadMainTarget();
    }

    const currentPlanet = await getPlanetObj(await getHightlightPlanet());
    console.log(getTime(), 'Current planet: ' + currentPlanet.name);

    if(currentPlanet.name === ogameExtConfig.sendResources.target.name){
        console.log(getTime(), 'Current planet is the main target.');
        await goToNextPlanet();
        return;    
    }
    if(ogameExtConfig.sendResources.alreadySent && ogameExtConfig.sendResources.alreadySent.includes(currentPlanet.koords)) {
        console.log(getTime(), 'Resources have already been sent from this planet.');
        await goToNextPlanet();
        return;
    }

    await sendShips();
    await saveLastSent(currentPlanet);
}

async function main() {
    await delay(500);

    if(ogameExtConfig.sendResources && ogameExtConfig.sendResources.enabled) {
        await sendResources();
    } else {
        console.log("Send resources setting is disabled.");
    }
}

main();