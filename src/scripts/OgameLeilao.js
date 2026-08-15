const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const getTime = () => {
    var now = new Date();
    return now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
};
async function checkLeilao() {

    const currentPlayer = jQuery("#div_traderAuctioneer .left_box .currentPlayer").html().trim();    
    if(currentPlayer == "Robson525") {
        console.log('Current User is the winer.');
        return;
    }
    const disabledLayer = jQuery("#div_traderAuctioneer .right_box .noAuctionOverlay").is(':visible');
    if(disabledLayer) {
        console.log('No auction available.');
        return;
    }

    const maxBtn = jQuery(metalLine).find("a.js_valButton.max");
    maxBtn.click();
    console.log(getTime(),  'Clicked on max button for metal.');
    await delay(500);

    const submitBtn = jQuery("#div_traderAuctioneer .right_box .pay");
    submitBtn.click();
    console.log(getTime(),  'Clicked on submit button for metal.');
}
//checkLeilao();
setInterval(checkLeilao, 5000);