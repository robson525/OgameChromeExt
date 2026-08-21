async function checkLeilao() {

    const currentPlayer = jQuery("#div_auctioneer .left_box .currentPlayer").html().trim();    
    if(currentPlayer == "Robson525") {
        console.log('Current User is the winer.');
        return;
    }
    const disabledLayer = jQuery("#div_auctioneer .right_box .noAuctionOverlay").is(':visible');
    if(disabledLayer) {
        console.log('No auction available.');
        return;
    }

    const metalLine = jQuery("#div_auctioneer .right_box .normalResource .metal").parent().parent();
    const maxBtn = jQuery(metalLine).find("a.js_valButton.max");
    maxBtn[0].click();
    console.log(getTime(),  'Clicked on max button for metal.');
    await delay(500);

    const submitBtn = jQuery("#div_auctioneer .right_box .pay");
    submitBtn[0].click();
    console.log(getTime(),  'Clicked on submit button for metal.');

    await reloadPage(500);
}
//checkLeilao();
setInterval(checkLeilao, 5000);
setInterval(reloadPage, 1000 * 60);