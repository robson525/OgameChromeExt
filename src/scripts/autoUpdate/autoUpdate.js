async function getTechnologyObj(technology) {
    return {
        name: getTechnologyName(technology),
        level: getTechnologyLevel(technology),
        status: getTechnologyStatus(technology),
        isUpgradeable: isTechnologyUpgradeable(technology)
    };
}

async function getTechnologyObjByBtn(btn) {
    const technology = jQuery(btn).closest('li.technology');
    return await getTechnologyObj(technology);
}

async function autoUpdateClick(btn) {
    const technology = await getTechnologyObjByBtn(btn);
    let autoUpdate = ogameExtConfig.autoUpdate[currentView];
    console.log('Auto-Update button clicked: ', technology.name);

    if(autoUpdate.includes(technology.name)) {
        console.log('Removing technology from auto-upgrade list:', technology.name);
        autoUpdate = autoUpdate.filter(t => t !== technology.name);
        btn.text('-');
        btn.addClass('disabled');
        btn.removeClass('enabled');
    } else {
        console.log('Adding technology to auto-upgrade list:', technology.name);
        autoUpdate.push(technology.name);
        btn.text('+');
        btn.removeClass('disabled');
        btn.addClass('enabled');
    }

    ogameExtConfig.autoUpdate[currentView] = autoUpdate;
    await chrome.storage.local.set({ [STORAGE_CONFIGS_ID]: { ...ogameExtConfig, autoUpdate: ogameExtConfig.autoUpdate } });
}

async function loadAutoUpdate() {
    let autoUpdate = ogameExtConfig.autoUpdate[currentView];
    
    const technologiesIcons = jQuery('#pageContent #middle #technologies ul li.technology span.icon');
    
    technologiesIcons.each(async function() {
        const technology = await getTechnologyObjByBtn(this);
        if(technology.status === "off") {
            return;
        }

        const technologyIncluded = autoUpdate.includes(technology.name);
        const text = technologyIncluded ? "+" : "-";
        const className = technologyIncluded ? "enabled" : "disabled";
        
        const upgradeButton = jQuery('<button>', {
            class: 'upgrade-btn ' + className,
            title: 'Auto-Upgrade ' + className,
            text: text,
        });
        jQuery(this).append(upgradeButton);
    });

    // Exemplo de evento de clique para o botão de upgrade
    technologiesIcons.on('click', '.upgrade-btn', function(e) {
        e.stopPropagation();
        autoUpdateClick(jQuery(this));
    });
}

async function autoUpdate() {

    if(["shipyard", "defenses", "fleetdispatch"].includes(currentView)) {
        console.log(getTime(), "Auto-update skipped.");
        return;
    }
    console.log(getTime(), "Checking for auto-updates...");
    ogameExtConfig.autoUpdate = ogameExtConfig.autoUpdate || {};
    ogameExtConfig.autoUpdate[currentView] = ogameExtConfig.autoUpdate[currentView] || [];

    await loadAutoUpdate();
}