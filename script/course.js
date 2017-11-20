/*
@author Kristian Andersen Hole
*/

const courseContentArea = id("contentPanel");

const courseWaitLen = "Please wait while the module loads...".length;
const courseAnnouncementsModule = id("div_1_1");

const Course = {
    url_match: /.*ntnu.blackboard.com\/webapps\/blackboard\/execute\/modulepage\/view\?course_id.*/g,

    ready: function() {
        if (courseAnnouncementsModule == null)
            return false;
        return (courseAnnouncementsModule.innerHTML.length > courseWaitLen
                && id("block::2-dueView::2-dueView_1") != undefined);
    },

    loading: function() {
        courseContentArea.firstElementChild.setAttribute("hidden", "true");
        var loadingText = document.createElement('h1');
        loadingText.textContent = "Laster...";
        loadingText.className = "loadingText";
        courseContentArea.appendChild(loadingText);
        
        //Remove footer
        const footer = id("copyright");
        footer.parentNode.removeChild(footer);
    },
    
    unfuck: function() {
        var data = {};
    
        data.course = {name: courseAnnouncementsModule.firstElementChild.innerHTML};

        data.todos = {};
        data.todos.dueToday = getCourseTodosFromBlock("blocklist::2-dueView:::::2-dueView_1");
        data.todos.dueThisWeek = getCourseTodosFromBlock("blocklist::2-dueView:::::2-dueView_3");
        data.todos.dueFuture = getCourseTodosFromBlock("blocklist::2-dueView:::::2-dueView_4");
        data.todos.duePast = getCourseTodosFromBlock("blocklist::1-pastDueView:::::1-pastDueView_pastdue_block");
    
        //rescue usable modules
        const announcementsHtml = courseAnnouncementsModule.innerHTML;
        const quickLinksHtml = document.body.getElementsByClassName("vtbegenerated")[0].innerHTML;

        Cactus.render(CourseCac, data, courseContentArea);
        
        //inject usable modules
        id("bis_announcements_inject").innerHTML += announcementsHtml;
        id("bis_quicklinks_inject").innerHTML += quickLinksHtml;
        
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
var CourseCac = `
<div class="bis_row">
<div id="bis_left_column">
{{course}}<h1 class="ufCourseHeading">{name}</h1>
    <div id="bis_course_announcements">
        <table class="ufTable">
            <tr class="ufTr"><th class="ufTh dark">Kunngjøringer</th></tr>
            <tr class="ufTr"><td class="ufTd" id="bis_announcements_inject"></td></tr>
        </table>
    </div>
    <div id="bis_quicklinks">
        <table class="ufTable">
            <tr class="ufTr"><th class="ufTh dark">Quick links</th></tr>
            <tr class="ufTr"><td class="ufTd" id="bis_quicklinks_inject"></td></tr>
        </table>
    </div>
</div>
<div class="bis_todos bis_course_todos">
    <h1 class="ufTodoTitle">Todo</h1>
    <table class="ufTable">
    <tr class="ufTr">
{{todos.dueToday}}<th class="ufTh">I dag ({length})</th>
        <th class="ufTh">Deadline</th>
    </tr>
[todos.dueToday]<tr class="ufTr"><td class="ufTd"><a class="ufAssignmentName" onclick="{onclick}" href="{href}">{title}</a></td><td class="ufTd"><span class="red">{due}</span></td></tr>
    </table>
    <table class="ufTable">
    <tr class="ufTr">
{{todos.dueThisWeek}}<th class="ufTh">Denne uken ({length})</th>
        <th class="ufTh">Deadline</th>
    </tr>
[todos.dueThisWeek]<tr class="ufTr"><td class="ufTd"><a class="ufAssignmentName" onclick="{onclick}" href="{href}">{title}</span></a></td><td class="ufTd">{due}</td></tr>
    </table>
    <table class="ufTable">
    <tr class="ufTr">
{{todos.dueFuture}}<th class="ufTh">Fremtid ({length})</th>
        <th class="ufTh">Deadline</th>
    </tr>
[todos.dueFuture]<tr class="ufTr"><td class="ufTd"><a class="ufAssignmentName" onclick="{onclick}" href="{href}">{title}</span></a></td><td class="ufTd">{due}</td></tr>
    </table>
    <table class="ufTable">
    <tr class="ufTr">
{{todos.duePast}}<th class="ufTh"><span class="red">Overskredet tidsfrist ({length})</span></th>
        <th class="ufTh">Deadline</th>
    </tr>
[todos.duePast]<tr class="ufTr"><td class="ufTd"><a class="ufAssignmentName" onclick="{onclick}" href="{href}">{title}</a></td><td class="ufTd"><span class="red">{due}</span></td></tr>
    </table>
</div>

<!-- Avoiding BBs annoying error detection -->

<div class="collapsible" style="overflow: auto;" hidden>
<div id="whatsNewModule" class="eudModule">
    <div style="display: none" class="eudModule-inner">
        <div class="moduleActions clearfix">
            <!--  actions menu -->
            <div id="clearMenu" class="u_floatThis-right eud-button-wrap">
                <a href="#" class="actionMenuButton" id="whatsNewViewMenu">
      Handlinger &nbsp;
                    <img  src="/images/ci/ng/more_options.gif"  alt=""/>
                </a>
            </div>
            <img src="/images/ci/ng/default_profile_avatar.png" width="20" alt="" class="eud-avatar" height="20" />
            <a target="_top" class="actionMenuButton" href="/webapps/blackboard/execute/nautilus/notificationSettingsCaret?action=display">Rediger meldingsinnstillinger</a>
        </div>
        <!-- placeholder for what's new content -->
        <div id="whatsNewView" style="clear: both"></div>
        <!-- placeholder for Unread Information of DiscussionBoard -->
        <ul id="discussionBoardUl" class="itemGroups hierarchyList" style="display: none;"></ul>
        <!-- placeholder for Unread Information of Blogs -->
        <ul id="blogUl" class="itemGroups hierarchyList" style="display: none"></ul>
        <!-- placeholder for Unread Information of Journals -->
        <ul id="journalUl" class="itemGroups hierarchyList" style="display: none"></ul>
        <!-- placeholder for refresh date -->
        <div class="portletInfoFooter"></div>
    </div>
</div>
</div>

<!-- END: Avoiding BBs annoying error detection -->

</div>
`; //Last section: Need a "whatsNewView" to avoid BB freaking out over the missing item during their XML/HTML injection
