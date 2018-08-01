// ==UserScript==
// @name     primoloisirs_offre
// @version  1
// @grant    none
// @description     Affiche les offres PrimoLoisirs en toutes lettre directement sur les tuiles 
// @include         https://primoloisirs.com/* 
// ==/UserScript==

function primoloisirs_offre() {
	var card = document.getElementsByClassName('text-card');
	for (var i = 0; i < card.length; i++) {
	    card[i].innerHTML = card[i].innerHTML.replace(/(\/([^\/]+)" class=[^>]+>)à/gm, "$1$2à");
	}
}

function waitForKeyElements (
    selectorTxt,    /* Required: The selector string that
                        specifies the desired element(s).
                    */
    actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
    bWaitOnce      /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
) {
    var targetNodes, btargetsFound;
    targetNodes = document.querySelectorAll(selectorTxt);

    if (targetNodes  &&  targetNodes.length > 0) {
        btargetsFound = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.forEach(function(element) {
            var alreadyFound = element.dataset.found == 'alreadyFound' ? 'alreadyFound' : false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound     = actionFunction (element);
                if (cancelFound)
                    btargetsFound   = false;
                else
                    element.dataset.found = 'alreadyFound';
            }
        } );
    }
    else {
        btargetsFound = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj  = waitForKeyElements.controlObj  ||  {};
    var controlKey  = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl = controlObj [controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval (timeControl);
        delete controlObj [controlKey];
    }
    else {
        //--- Set a timer, if needed.
        if ( ! timeControl) {
            timeControl = setInterval ( function () {
                    waitForKeyElements (    selectorTxt,
                                            actionFunction,
                                            bWaitOnce
                                        );
                },
                300
            );
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj   = controlObj;
}

waitForKeyElements (
	"div.text-card"
	, primoloisirs_offre
	);
