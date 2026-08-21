const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const getDiscoveryBtns = () => jQuery('#galaxyContent div.galaxyRow.ctContentRow .planetDiscoverIcons a.planetDiscover');
const getTime = () => {
    var now = new Date();
    return now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
};

const getSytem = () => jQuery('#galaxycomponent #galaxyHeader #system_input').val();
async function sendAll() {
    var discoverBtns = getDiscoveryBtns();
    while(discoverBtns.length > 0) {
        var discoverBtn = discoverBtns[0];
        var discoverBtnJq = jQuery(discoverBtn);
        var position = Array.from(discoverBtn.classList).find(c => c.startsWith('position'));

        discoverBtnJq[0].click();
        console.log(getTime(),  'Clicked on discover button for planet: ' + position + ' in system: ' + getSytem());
        
        await delay(1000);

        var confirmBtn = jQuery('#errorBoxDecision #errorBoxDecisionYes').parent();
        confirmBtn[0].click();           
        console.log(getTime(),  position + ' - Confirmed discovery mission.');

        await delay(1000);  
        discoverBtns = getDiscoveryBtns();
    }
}
function checkDiscovery() {
    var discoverBtns = getDiscoveryBtns();
    if(discoverBtns.length > 0) {
        console.log(getTime(),  'There are planets available for discovery.');
        return true;
    } else {
        console.log(getTime(),  'No planets available for discovery.');
        return false;
    }
}

async function checkSlots() {
    var slots = jQuery('#galaxyContent div.galaxyRow .galaxyCell #slots');
    var used = parseInt(jQuery(slots).find('#slotUsed').html());
    var total = parseInt(jQuery(slots).find('#slotValue').html());
    console.log(getTime(),  'Used slots: ' + used + ' / ' + total + ' in system: ' + getSytem());

    if(used < total) {
        if(checkDiscovery()) {
            console.log(getTime(),  'Sending discovery missions...');
            await sendAll();
            await checkSlots();
        } else {
            console.log(getTime(),  'Going to the next system ...');
            jQuery('#galaxycomponent #galaxyHeader span.next')[1].click();
            await delay(1000);
            await checkSlots();
        }        
    } else {
        console.log(getTime(),  'All slots are used. Reloading the page in 60 seconds ...');
        await delay(1000 * 60);
        console.log(getTime(),  'Reloading the page ...');
        window.location.reload();
    }
}

async function start() {
    await delay(1000);
    console.log(getTime(), "Ogame - Start");
    checkSlots();
    //setInterval(checkSlots, 1000);
}

start();