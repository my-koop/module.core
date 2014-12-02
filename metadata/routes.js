function addRoutes(metaDataBuilder) {
    /* Public routes. */
    metaDataBuilder.addFrontendRoute({
        idPath: ["public"],
        component: "wrappers/PublicWrapper",
        name: "home",
        path: "/",
        default: "layout/Homepage"
    });
    metaDataBuilder.addFrontendRoute({
        idPath: ["public", "aboutus"],
        component: "PlaceHolder",
        name: "about",
        path: "aboutus"
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
        default: "layout/Homepage"
    });
    metaDataBuilder.addFrontendRoute({
        idPath: ["dashboard", "settings"],
        name: "settings",
        component: "layout/SettingsPage",
        path: "settings",
    });
}
exports.addRoutes = addRoutes;
