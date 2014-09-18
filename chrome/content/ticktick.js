/*
Firefox plugin for TickTick.

AUTHOR
    TickTick: http://ticktick.com/

*/

var XULTickTick = {

    init: function() {
        XULTickTick.TickTick_SRC = 'http://ticktick.com/';
        XULTickTick.TickTick_SIGN_OUT = 'http://ticktick.com/signout';
        XULTickTick.TickTick_INTER_FACE = null;
        XULTickTick.initInterface();
    },

    initInterface: function() {
        var sidebarBox = document.getElementById("sidebar-box"),
            sidebarTitle = document.getElementById('sidebar-title');

        if(!sidebarBox.hidden && sidebarTitle.value.indexOf('TickTick') != -1) {
            XULTickTick.toggleTickTickSidebar();

            /* for firefox restart*/
            XULTickTick.toggleTickTickSidebar();
        }

        let firstRunPref = "extensions.ticktick_n.firstRunDone";
        
        if (!Application.prefs.getValue(firstRunPref, null)) {
            Application.prefs.setValue(firstRunPref, true);
            // addToolbarButton;
            XULTickTick.installButton("nav-bar", "ticktick_sidebar_button");
            // The "addon-bar" is available since Firefox 4
            XULTickTick.installButton("addon-bar", "ticktick_sidebar_button");
        }

    },

    /**
     * Installs the toolbar button with the given ID into the given
     * toolbar, if it is not already present in the document.
     *
     * @param {string} toolbarId The ID of the toolbar to install to.
     * @param {string} id The ID of the button to install.
     * @param {string} afterId The ID of the element to insert after. @optional
     */
    installButton: function (toolbarId, id, afterId) {
        if (!document.getElementById(id)) {
            var toolbar = document.getElementById(toolbarId);

            // If no afterId is given, then append the item to the toolbar
            var before = null;
            if (afterId) {
                let elem = document.getElementById(afterId);
                if (elem && elem.parentNode == toolbar)
                    before = elem.nextElementSibling;
            }

            toolbar.insertItem(id, before);
            toolbar.setAttribute("currentset", toolbar.currentSet);
            document.persist(toolbar.id, "currentset");

            if (toolbarId == "addon-bar")
                toolbar.collapsed = false;
        }
    },

    createMenu: function() {
        var menu = document.createElement('menupopup'),
            reload_label = document.createElement('menuitem'),
            login_logout_label = document.createElement('menuitem');

        menu.setAttribute('id', 'ticktick-menu');

        if (navigator.language.substr(0,2) == 'zh') {
            reload_label.setAttribute('label', '刷新');
            login_logout_label.setAttribute('label', '登出');
        }else{
            reload_label.setAttribute('label', 'Reload');
            login_logout_label.setAttribute('label', 'Signout');
        }
        
        reload_label.addEventListener('click', function(ev) {
            XULTickTick.TickTick_INTER_FACE.reload();
        }, true);
        menu.appendChild(reload_label);

        login_logout_label.addEventListener('click', function(ev) {
            XULTickTick.TickTick_INTER_FACE.setAttribute('src', XULTickTick.TickTick_SIGN_OUT);
        }, true);

        menu.appendChild(login_logout_label);

        document.getElementById("sidebar-box").appendChild(menu);
    },

    toggleTickTickSidebar: function() {
        var sidebarBox = document.getElementById("sidebar-box"),
            sidebarTitle = document.getElementById("sidebar-title"),
            sidebar = top.document.getElementById('sidebar');
        
        toggleSidebar('view_ticktick_sidebar');

        if(!sidebarBox.hidden) {
            if(!XULTickTick.TickTick_INTER_FACE) {
                var TickTick_INTER_FACE = XULTickTick.TickTick_INTER_FACE = sidebar.cloneNode(true);
                TickTick_INTER_FACE.id = 'ticktick_sidebar_holder';
                TickTick_INTER_FACE.setAttribute('src', XULTickTick.TickTick_SRC);
                TickTick_INTER_FACE.setAttribute('minwidth', 400);
                TickTick_INTER_FACE.setAttribute('type', 'content');
                TickTick_INTER_FACE.setAttribute('context', 'ticktick-menu');
                XULTickTick.createMenu();
                sidebarBox.appendChild(TickTick_INTER_FACE);
                sidebar.addEventListener("unload", XULTickTick.hideTickTick, true);
            }
            XULTickTick.TickTick_INTER_FACE.hidden = false;
            sidebar.hidden = true;
        }
    },

    hideTickTick: function() {
        var sidebarTitle = document.getElementById("sidebar-title"),
            sidebar = top.document.getElementById('sidebar');

        if(XULTickTick.TickTick_INTER_FACE && sidebarTitle.value.indexOf('TickTick') == -1) {
            XULTickTick.TickTick_INTER_FACE.hidden = true;
            sidebar.hidden = false;
        }
    },

};

window.addEventListener("load", function() { 
    XULTickTick.init(); 
}, false);
