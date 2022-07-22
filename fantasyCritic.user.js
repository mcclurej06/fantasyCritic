// ==UserScript==
// @name         fantasyCritic
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://www.fantasycritic.games/games
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fantasycritic.games
// @grant        none
// ==/UserScript==

function main() {
    var intv = setInterval(function() {
        if(jQ('tr').size() < 1){
            return false;
        }
        clearInterval(intv);
        jQ.get("https://www.fantasycritic.games/api/League/GetLeagueYear?leagueID=b2cae783-c71f-477b-a119-840e1218501f&year=2022", function(data){
            let annotate = () => {
                let pickedGames = data.publishers.flatMap(publisher => publisher.games)
                let picks = pickedGames.filter(game => !game.counterPick)
                let counterPicks = pickedGames.filter(game => game.counterPick)

                jQ(".annotation").remove()
                counterPicks.forEach(game => {
                    jQ('a:contains("' + game.gameName + '")').parent().prepend('<span class="annotation">(cp)</span>')
                })

                picks.forEach(game => {
                    jQ('a:contains("' + game.gameName + '")').parent().prepend('<span class="annotation">(p)</span>')
                })
            }

            annotate()

            let observer = new MutationObserver((mutationList, observer)=>{
                observer.disconnect()
                annotate()
                observer.observe(document.getElementsByTagName("table")[0], { attributes: true, childList: true, subtree: true })
            })

            observer.observe(document.getElementsByTagName("table")[0], { attributes: true, childList: true, subtree: true })
        });
    }, 100);
}

window.addEventListener('load', function() {
    'use strict';
    addJQuery(main);
}, false);

function addJQuery(callback) {
  var script = document.createElement("script");
  script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
  script.addEventListener('load', function() {
    var script = document.createElement("script");
    script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
    document.body.appendChild(script);
  }, false);
  document.body.appendChild(script);
}


