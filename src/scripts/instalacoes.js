async function updateRoboticsFactory() {
    const roboticsFactory = getTechnology("roboticsFactory");
    if(isTechnologyUpgradeable(roboticsFactory)) {
        console.log(getTime(), 'Robotics Factory is upgradeable. Upgrading...');
        await upgradeTechnology(roboticsFactory);
    } else {
        console.log(getTime(), 'Robotics Factory is not upgradeable. Skipping...');
    }
}

async function main() {

    if(!(await checkPlanetsUpgradeable())) {
        return;
    }
    
    if(ogameExtConfig.updateRoboticsFactory) {
        console.log(getTime(), 'updateRoboticsFactory is enabled. Proceeding...');
        await updateRoboticsFactory();
    } else {
        console.log(getTime(), 'updateRoboticsFactory is disabled.');
    }

    await reloadPage(60 * 60);
}