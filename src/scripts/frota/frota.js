async function getPlanetObj(planet) {
    const mainTargetName = planet.find(".planet-name").html().trim();
    const mainTargetKoords = planet.find(".planet-koords").html().trim();
    console.log(getTime(), 'Main target loaded: ' + mainTargetName + ' (' + mainTargetKoords + ')');

    const targetKoordsSplit = mainTargetKoords.split(':');
    const targetGalaxy = targetKoordsSplit[0];
    const targetSystem = targetKoordsSplit[1];
    const targetPlanet = targetKoordsSplit[2];

    return {
        name: mainTargetName,
        koords: mainTargetKoords,
        galaxy: targetGalaxy,
        system: targetSystem,
        planet: targetPlanet
    };
}

async function main() {
    await delay(500);

    if(ogameExtConfig.sendResources && ogameExtConfig.sendResources.enabled) {
        await sendResources();
    } else if(ogameExtConfig.spy && ogameExtConfig.spy.enabled) {
        await spy();
    } else if(ogameExtConfig.attack && ogameExtConfig.attack.enabled) {
        await attack();
    } else {
        console.log("No attack action configured.");
    }
}

main();