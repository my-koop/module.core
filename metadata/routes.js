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
    metaDataBuilder.addFrontendRoute({
        idPath: ["public", "shop"],
        component: "wrappers/PlaceHolderWrapper",
        name: "shop",
        path: "shop",
        default: "PlaceHolder"
    });
    metaDataBuilder.addFrontendRoute({
        idPath: ["public", "shop", "cart"],
        component: "PlaceHolder",
        name: "shoppingCart",
        path: "cart"
    });

    /* Simple wrapper. */
    metaDataBuilder.addFrontendRoute({
        idPath: ["simple"],
        component: "wrappers/SimplePageWrapper"
    });

    /*FIXME: Cannot use it as long as it is in website.
    metaDataBuilder.addFrontendRoute({
    idPath: ["simple"],
    component: "PasswordRecoveryPage",
    name: "passwordRecovery",
    path: "/lostpassword"
    });
    */
    /* Dashboard wrapper. */
    metaDataBuilder.addFrontendRoute({
        idPath: ["dashboard"],
        component: "wrappers/DashboardWrapper",
        path: "/dashboard",
        default: "layout/Homepage"
    });

    metaDataBuilder.addFrontendRoute({
        idPath: ["dashboard", "stats"],
        component: "PlaceHolder",
        name: "stats",
        path: "stats"
    });

    metaDataBuilder.addFrontendRoute({
        idPath: ["dashboard", "events"],
        component: "wrappers/PlaceHolderWrapper",
        name: "events",
        path: "events",
        default: "PlaceHolder"
    });

    metaDataBuilder.addFrontendRoute({
        idPath: ["dashboard", "events", "new"],
        component: "PlaceHolder",
        path: "new"
    });

    /*TODO: Experiment with this.
    metaDataBuilder.addFrontendRoute({
    idPath: ["dashboard", "events", ":id"],
    component: "PlaceHolder",
    path: ""
    });
    */
    //FIXME: Remove when done in module.inventory.
    metaDataBuilder.addFrontendRoute({
        idPath: ["dashboard", "inventory"],
        component: "wrappers/PlaceHolderWrapper",
        path: "inventory",
        default: "PlaceHolder"
    });

    metaDataBuilder.addFrontendRoute({
        idPath: ["dashboard", "inventory", "supplier"],
        component: "PlaceHolder",
        name: "supplier",
        path: "supplier"
    });

    metaDataBuilder.addFrontendRoute({
        idPath: ["dashboard", "mailing"],
        component: "wrappers/PlaceHolderWrapper",
        path: "mailing",
        default: "PlaceHolder"
    });

    metaDataBuilder.addFrontendRoute({
        idPath: ["dashboard", "mailing", "send"],
        component: "PlaceHolder",
        name: "send",
        path: "send"
    });

    metaDataBuilder.addFrontendRoute({
        idPath: ["dashboard", "mailing", "subscribe"],
        component: "PlaceHolder",
        name: "subscribe",
        path: "subscribe"
    });

    metaDataBuilder.addFrontendRoute({
        idPath: ["dashboard", "members"],
        component: "wrappers/PlaceHolderWrapper",
        name: "members",
        path: "members",
        default: "PlaceHolder"
    });

    metaDataBuilder.addFrontendRoute({
        idPath: ["dashboard", "members", "schedule"],
        component: "PlaceHolder",
        name: "schedule",
        path: "schedule"
    });
}
exports.addRoutes = addRoutes;
