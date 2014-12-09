function addRoutes(metaDataBuilder) {
    /* Public routes. */
    metaDataBuilder.addFrontendRoute({
        idPath: ["public"],
        component: "wrappers/PublicWrapper",
        name: "home",
        path: "/",
        default: "layout/Homepage",
        i18nKey: "navbar.homepage"
    });
    metaDataBuilder.addFrontendRoute({
        idPath: ["public", "aboutus"],
        component: "layout/AboutUsPage",
        name: "about",
        path: "aboutus",
        i18nKey: "navbar.aboutus"
    });
    /* Simple wrapper. */
    metaDataBuilder.addFrontendRoute({
        idPath: ["simple"],
        component: "wrappers/SimplePageWrapper",
        path: "/"
    });
    /* Dashboard wrapper. */
    metaDataBuilder.addFrontendRoute({
        idPath: ["dashboard"],
        component: "wrappers/DashboardWrapper",
        path: "/dashboard",
        default: "layout/Homepage",
        i18nKey: "user::navbar.dashboard"
    });
    metaDataBuilder.addFrontendRoute({
        idPath: ["dashboard", "settings"],
        name: "settings",
        component: "layout/SettingsPage",
        path: "settings",
        i18nKey: "sidebar.settings",
        permissions: {
            website: {
                settings: true
            }
        }
    });
}
exports.addRoutes = addRoutes;
