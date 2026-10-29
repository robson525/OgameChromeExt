let oglSpyTable = null;

async function loadOglSpyTable() {
    let tries = 0;
    do{
        oglSpyTable = jQuery("#pageContent #messages .ogl-spyTable");
        await delay(500);
    } while(oglSpyTable.length == 0 && ++tries < 10);

    if(oglSpyTable.is(":hidden"))
        jQuery("#pageContent #messages .ogl-tableOptions .icon_eye")[0].click();
}

async function deleteMessage(row) {
    jQuery(row).find("td button.icon_trash")[0].click();
    console.log("Deleted row: " + jQuery(row).find("td")[0].innerText);
    await delay(500);
    await loadOglSpyTable();
}

async function choosePlaned() {
    const rows = oglSpyTable.find("tbody tr").not(".ogi-attacked").not(".hide").toArray().sort((r1, r2) => {
        const r1Sheeps = parseInt(jQuery(r1).find("td.ogl-cargo-choice")[0].innerText);
        const r2Sheeps = parseInt(jQuery(r2).find("td.ogl-cargo-choice")[0].innerText);
        return r2Sheeps - r1Sheeps;
    });

    if(rows.length === 0) {
        console.log("No spy message found.");
        await saveSpyAndAttack(false);
        return;
    }

    console.log("Sorted rows by sheeps: ", rows);

    const row = jQuery(rows[0]);
    const coords = row.find("td")[2].innerText;
    console.log("Chosen planet coordinates: " + coords);

    if(ogameExtConfig.attack.planetsAlreadyAttacked.includes(coords)) {
        console.log("Planet already attacked.");
        await deleteMessage(row);
        await choosePlaned();
        return;
    }

    const cargo = parseInt(row.find("td.ogl-cargo-choice")[0].innerText);
    if(cargo < 10) {
        console.log("Cargo too small.");
        await deleteMessage(row);
        await choosePlaned();
        return;
    }

    ogameExtConfig.attack.enabled = true;
    saveAttack(ogameExtConfig.attack);
    row.find("td.ogl-cargo-choice a")[0].click();
}

async function loadSpyMessages() {
    await loadOglSpyTable();

    const rowsAlreadyAttacked = oglSpyTable.find("tr.ogi-attacked");    
    for(const row of rowsAlreadyAttacked) {
        await deleteMessage(row);
    }

    const nextButton = jQuery("#pageContent #messages .messagePaginator .nextPage button.next")[0];
    if(nextButton && !nextButton.disabled){
        console.log("Clicking next page button...");
        nextButton.click();
        await delay(500);
        await loadSpyMessages();
        return;
    }

    await choosePlaned();
}

async function attack() {
    console.log("Attacking...");
    await delay(1000);

    const continuesBtn = jQuery("#pageContent #allornone #continueToFleet2");
    if(continuesBtn.hasClass("off"))
    {
        console.log("Continue button is off. Aborting attack.");
        await reloadPage(60);
        return;
    }

    continuesBtn[0].click();
    await delay(1000);

    const sendFleetButton = jQuery("#pageContent #naviActions #sendFleet");
    if(sendFleetButton.hasClass("off")) {
        console.log("Send fleet button is off. Aborting attack.");
        await reloadPage(60);
        return;
    }

    const coords = jQuery("#pageContent #fleetboxdestination #target .coords");
    const galaxy = coords.find("#galaxy").val();
    const system = coords.find("#system").val();
    const position = coords.find("#position").val();

    const planetCoords = galaxy + ":" + system + ":" + position;
    console.log("Attacking planet coordinates: " + planetCoords);
    ogameExtConfig.attack.planetsAlreadyAttacked.push(planetCoords);
    ogameExtConfig.attack.enabled = false;
    saveAttack(ogameExtConfig.attack);

    sendFleetButton[0].click();
}

async function main() {

    if(ogameExtConfig.spyAndAttack) {
        console.log(getTime(), "SpyAndAttack enabled.");
        
        if(!ogameExtConfig.attack.planetsAlreadyAttacked)
            ogameExtConfig.attack.planetsAlreadyAttacked = [];        

        if(currentView == "messages") {
            ogameExtConfig.attack.enabled = false;
            saveAttack(ogameExtConfig.attack);

            await delay(2000);
            await loadSpyMessages();
        } else {
            saveAttack(ogameExtConfig.attack);
        }
    }
}