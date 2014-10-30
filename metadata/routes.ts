import utils = require("mykoop-utils");
export function addRoutes(metaData: utils.MetaData) {
  metaData.addRoute({
    idPath: ["public"],
    component: "wrappers/PublicWrapper",
    name: "Homepage",
    path: "/",
    default: "layout/Homepage"
  });
  metaData.addRoute({
    idPath: ["public", "aboutus"],
    component: "PlaceHolder",
    name: "About Us",
    path: "/aboutus"
  });
  metaData.addRoute({
    idPath: ["public", "shop"],
    component: "wrappers/PlaceHolderWrapper",
    name: "Shop",
    path: "/shop",
    default: "PlaceHolder"
  });
  metaData.addRoute({
    idPath: ["public", "shop", "cart"],
    component: "PlaceHolder",
    name: "Shopping Cart",
    path: "cart"
  });
}
