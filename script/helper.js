/*
@author Kristian Andersen Hole
*/

function id(s) {
    return document.getElementById(s);
}

function getTodosFromBlock(sel) {
    return Array.from(id(sel).children).map(li => {
        var assignment = li.firstChild.firstChild;
        var courseDiv = li.firstChild.lastChild;
        var dueString = courseDiv.lastChild.innerText.replace("- Leveringsfrist", "");
        dueString = dueString.replace("Leveringsfrist ", "");
        dueString = dueString.replace("- Due", "");
        dueString = dueString.replace("Due", "");
        var r = {
            course: courseDiv.firstChild.innerText,
            due: dueString,
            onclick: "", href: ""
        };
        if (assignment.innerText) {
            r.title = assignment.innerText;
            r.onclick = assignment.getAttribute("onclick");
            r.href = assignment.getAttribute("href");
        } else {
            r.title = assignment.textContent;
        }
        return r;
    });
}

function getCourseTodosFromBlock(sel) {
    return Array.from(id(sel).children).map(li => {
        var assignment = li.firstChild.firstChild;
        var deadlineSpan = li.firstChild.lastChild;
        var dueString = deadlineSpan.innerText.replace("- Leveringsfrist", "");
        dueString = dueString.replace("Leveringsfrist ", "");
        dueString = dueString.replace("- Due", "");
        dueString = dueString.replace("Due", "");
        var r = {
            due: dueString,
            onclick: "", href: ""
        };
        if (assignment.innerText) {
            r.title = assignment.innerText;
            r.onclick = assignment.getAttribute("onclick");
            r.href = assignment.getAttribute("href");
        } else {
            r.title = assignment.textContent;
        }
        return r;
    });
}