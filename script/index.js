/*
@author Kristian Andersen Hole
*/

/* Multiplexer */

const ufLocation = window.location.href;

var page;

if (Dashboard.url_match.test(ufLocation)) {
    page = Dashboard;
    page.loading();
} else if (Course.url_match.test(ufLocation)) {
    page = Course;
    page.loading();
}

var upstartInterval;

function check() {
    if (page.ready()) {
        clearInterval(upstartInterval);
        page.unfuck();
    }
 }

if (page)
    upstartInterval = setInterval(check, 10);