let autoUpdateList = [];

function getTechnologyObj(technology) {
    const name = getTechnologyName(technology);
    const level = getTechnologyLevel(technology);
    const status = getTechnologyStatus(technology);
    const isUpgradeable = isTechnologyUpgradeable(technology);
    const isInAutoUpdateList = checkAutoUpdateList(name);
    return {
        name: name,
        level: level,
        status: status,
        isUpgradeable: isUpgradeable && isInAutoUpdateList,
        isInAutoUpdateList: isInAutoUpdateList,
        technology: technology
    };
}

function getTechnologyObjByClass(className) {
    const technology = getTechnology(className);
    return getTechnologyObj(technology);
}

function getTechnologyObjByBtn(btn) {
    const technology = jQuery(btn).closest('li.technology');
    return getTechnologyObj(technology);
}

function checkAutoUpdateList(technologyName) {
    return autoUpdateList.includes(technologyName);
}

async function autoUpdateClick(btn) {
    const technology = await getTechnologyObjByBtn(btn);
    console.log('Auto-Update button clicked: ', technology.name);

    if(checkAutoUpdateList(technology.name)) {
        console.log('Removing technology from auto-upgrade list:', technology.name);
        autoUpdateList = autoUpdateList.filter(t => t !== technology.name);
        btn.text('-');
        btn.addClass('disabled');
        btn.removeClass('enabled');
    } else {
        console.log('Adding technology to auto-upgrade list:', technology.name);
        autoUpdateList.push(technology.name);
        btn.text('+');
        btn.removeClass('disabled');
        btn.addClass('enabled');
    }

    ogameExtConfig.autoUpdate[currentView] = autoUpdateList;
    await chrome.storage.local.set({ [STORAGE_CONFIGS_ID]: { ...ogameExtConfig, autoUpdate: ogameExtConfig.autoUpdate } });
}

async function loadAutoUpdateIcons() {    
    const technologiesIcons = jQuery('#pageContent #middle #technologies ul li.technology span.icon');
    
    technologiesIcons.each(function() {
        const technology = getTechnologyObjByBtn(this);
        if(technology.status === "off") {
            return;
        }

        const text = technology.isInAutoUpdateList ? "+" : "-";
        const className = technology.isInAutoUpdateList ? "enabled" : "disabled";
        
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

async function loadAutoUpdateView() {
   if (typeof checkAutoUpdateView === "function") {
        console.log(getTime(), "Loading auto-update view ...");
        await checkAutoUpdateView();
   } else {
         console.log(getTime(), "No auto-update view function defined for this page.");
   }
}

async function autoUpdate() {

    if(["shipyard", "defenses", "fleetdispatch"].includes(currentView)) {
        console.log(getTime(), "Auto-update skipped.");
        return;
    }
    console.log(getTime(), "Loading auto-update ...");
    ogameExtConfig.autoUpdate = ogameExtConfig.autoUpdate || {};
    ogameExtConfig.autoUpdate[currentView] = ogameExtConfig.autoUpdate[currentView] || [];
    autoUpdateList = ogameExtConfig.autoUpdate[currentView];

    await loadAutoUpdateIcons();
    await loadAutoUpdateView();
}