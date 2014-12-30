var uiHooks = {
    navbar_main_public: {
        homepage: {
            type: "item",
            content: {
                icon: "home",
                text: "navbar.homepage",
                link: "home"
            },
            priority: 100
        },
        aboutus: {
            type: "item",
            content: {
                icon: "question",
                text: "navbar.aboutus",
                link: "about"
            },
            priority: 200
        }
    },
    navbar_main_dashboard: {
        quickactions: {
            type: "item",
            content: {
                icon: "bolt",
                text: "navbar.quickactions",
            },
            priority: 500
        }
    },
    sidebar: {
        settings: {
            type: "item",
            content: {
                icon: "cogs",
                text: "sidebar.settings",
                link: "settings"
            },
            priority: 1000,
            permissions: {
                website: {
                    settings: true
                }
            }
        }
    }
};
module.exports = uiHooks;
