/*
@author Kristian Andersen Hole
*/

const contentArea = id("globalNavPageContentArea");

const studentCourseHeading = "Emner hvor du er: Student";
const assCourseHeading = "Emner hvor du er: Læringsassistent";

const waitLen = "Vent mens modulen lastes...".length;
const courseModule = id("div_3_1");
const announcementsModule = id("div_1_1");

const Dashboard = {
    url_match: /.*ntnu.blackboard.com\/webapps\/portal.*/g,

    ready: function() {
        if (courseModule == null || announcementsModule == null)
            return false;
        return (courseModule.innerHTML.length > waitLen 
                && announcementsModule.innerHTML.length > waitLen
                && id("block::1-dueView::1-dueView_1") != undefined);
    },

    loading: function() {
        if (courseModule == null || announcementsModule == null)
            return false;
        addLoadingScreen(contentArea);
    },
    
    unfuck: function() {
        var data = {studentCourses: [], assistantCourses: [], otherCourses: []};

        Array.from(document.getElementsByClassName("courseListing")).forEach(cl => {

            switch (cl.previousElementSibling.innerText) {
                case studentCourseHeading:
                    data.studentCourses.push.apply(data.studentCourses, Array.from(cl.children).map(li => {
                        var c = li.lastElementChild;
                        return {name: c.innerText, link: c.getAttribute("href")};
                    }));
                    break;
                case assCourseHeading:
                    data.assistantCourses.push.apply(data.assistantCourses, Array.from(cl.children).map(li => {
                        var c = li.lastElementChild;
                        return {name: c.innerText, link: c.getAttribute("href")};
                    }));
                    break;
                default:
                    data.otherCourses.push.apply(data.otherCourses,
                        Array.from(cl.children).map(li => {
                        var c = li.lastElementChild;
                        return {name: c.innerText, link: c.getAttribute("href")};
                    }));
                    break;
            }
        });
    
        data.todos = {};
        data.todos.dueToday = getTodosFromBlock("blocklist::1-dueView:::::1-dueView_1");
        data.todos.dueThisWeek = getTodosFromBlock("blocklist::1-dueView:::::1-dueView_3");
        data.todos.dueFuture = getTodosFromBlock("blocklist::1-dueView:::::1-dueView_4");
        data.todos.duePast = getTodosFromBlock("blocklist::0-pastDueView:::::0-pastDueView_pastdue_block");
    
        //rescue announcement module
        const announcementsHtml = announcementsModule.innerHTML;

        contentArea.className = "contentArea";
        contentArea.removeAttribute("style");
    
        window.onresize = function(event) {
            contentArea.removeAttribute("style");
        };
    
        Cactus.render(DashboardCac, data, contentArea);
        
        //inject announcement module
        id("bis_announcements_inject").innerHTML += announcementsHtml;

        //remove assistant-courses-module if none
        if (data.assistantCourses.length === 0) {
            const assCourseModule = id("assistantCourses");
            assCourseModule.parentNode.removeChild(assCourseModule);
        }
        //remove other-courses-module if none
        if (data.otherCourses.length === 0) {
            const otherCourseModule = id("otherCourses");
            otherCourseModule.parentNode.removeChild(otherCourseModule);
        }
    
        //Fixes the issue of assignments without links.. BB is weird.
        document.querySelectorAll("a").forEach(a => {
            if (a.getAttribute("href") === "" && a.getAttribute("onclick") === "") {
                const s = document.createElement('span');
                s.innerHTML = a.innerHTML;
                s.className = "ufAssignmentName";
                a.parentNode.replaceChild(s, a);
            }
        });
    }
};

/* ------------------------------------------------------------- */

/* HTML Template using Cactus syntax */
var DashboardCac = `
<div class="bis_row">
<div id="bis_left_column">
    <div id="ufToolBox">
        <button class="ufBtn" onclick="window.location.href='/webapps/bb-social-learning-BBLEARN/execute/mybb?cmd=display&toolId=MyGradesOnMyBb_____MyGradesTool'">
            Mine Resultater
        </button>
        <button class="ufBtn" onclick="window.location.href='/webapps/bb-social-learning-BBLEARN/execute/mybb?cmd=display&toolId=AlertsOnMyBb_____AlertsTool'">
            Oppdateringer
        </button>
        <button class="ufBtn btnRed" onclick="window.location.href='/webapps/portal/execute/tabs/tabAction?tab_tab_group_id=_70_1&forwardUrl=edit_module%2F_3_1%2Fbbcourseorg%3Fcmd%3Dedit&recallUrl=%2Fwebapps%2Fportal%2Fexecute%2Ftabs%2FtabAction%3Ftab_tab_group_id%3D_70_1'">
            Vis/skjul emner
        </button>
    </div>
    <div id="studentCourses" class="bis_courses">
        <table class="ufTable">
            <tr class="ufTr"><th class="ufTh dark">Emner</th></tr>
[studentCourses]<tr class="ufTr"><td class="ufTd"><a class="ufCourseName" href="{link}">{name}</a></td></tr>
        </table>
    </div>
    <div id="assistantCourses" class="bis_courses">
        <table class="ufTable">
            <tr class="ufTr"><th class="ufTh dark">Stud.ass-emner</th></tr>
[assistantCourses]<tr class="ufTr"><td class="ufTd"><a class="ufCourseName" href="{link}">{name}</a></td></tr>
        </table>
    </div>
    <div id="otherCourses" class="bis_courses">
        <table class="ufTable">
            <tr class="ufTr"><th class="ufTh dark">Andre emner</th></tr>
[otherCourses]<tr class="ufTr"><td class="ufTd"><a class="ufCourseName" href="{link}">{name}</a></td></tr>
        </table>
    </div>
    <div id="bis_announcements">
        <table class="ufTable">
            <tr class="ufTr"><th class="ufTh dark">Kunngjøringer</th></tr>
            <tr class="ufTr"><td class="ufTd" id="bis_announcements_inject"></td></tr>
        </table>
    </div>
</div>
<div class="bis_todos">
    <h1 class="ufTodoTitle">Todo</h1>
    <table class="ufTable">
    <tr class="ufTr">
{{todos.dueToday}}<th class="ufTh">I dag ({length})</th>
        <th class="ufTh">Deadline</th>
    </tr>
[todos.dueToday]<tr class="ufTr"><td class="ufTd"><a class="ufAssignmentName" onclick="{onclick}" href="{href}">{title}<br/><span class="lite">{course}</span></a></td><td class="ufTd"><span class="red">{due}</span></td></tr>
    </table>
    <table class="ufTable">
    <tr class="ufTr">
{{todos.dueThisWeek}}<th class="ufTh">Denne uken ({length})</th>
        <th class="ufTh">Deadline</th>
    </tr>
[todos.dueThisWeek]<tr class="ufTr"><td class="ufTd"><a class="ufAssignmentName" onclick="{onclick}" href="{href}">{title}<br/><span class="lite">{course}</span></a></td><td class="ufTd">{due}</td></tr>
    </table>
    <table class="ufTable">
    <tr class="ufTr">
{{todos.dueFuture}}<th class="ufTh">Fremtid ({length})</th>
        <th class="ufTh">Deadline</th>
    </tr>
[todos.dueFuture]<tr class="ufTr"><td class="ufTd"><a class="ufAssignmentName" onclick="{onclick}" href="{href}">{title}<br/><span class="lite">{course}</span></a></td><td class="ufTd">{due}</td></tr>
    </table>
    <table class="ufTable">
    <tr class="ufTr">
{{todos.duePast}}<th class="ufTh"><span class="red">Overskredet tidsfrist ({length})</span></th>
        <th class="ufTh">Deadline</th>
    </tr>
[todos.duePast]<tr class="ufTr"><td class="ufTd"><a class="ufAssignmentName" onclick="{onclick}" href="{href}">{title}<br/><span class="lite">{course}</span></a></td><td class="ufTd"><span class="red">{due}</span></td></tr>
    </table>
</div>
</div>
`;
