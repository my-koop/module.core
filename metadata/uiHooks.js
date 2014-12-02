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
    sidebar: {
        settings: {
            type: "item",
            content: {
                icon: "cogs",
                text: "sidebar.settings",
                link: "settings"
            },
            priority: 1000
        }
    }
};
module.exports = uiHooks;
