import utils = require("mykoop-utils");
export function addRoutes(metaData: utils.MetaData) {
  metaData.addRoute({
    idPath: ["public"],
    component: "PublicWrapper",
    name: "Homepage",
    path: "/",
    default: "Homepage"
  });
  metaData.addRoute({
    idPath: ["public", "aboutus"],
    component: "PlaceHolder",
    name: "About Us",
    path: "/aboutus"
  });
  metaData.addRoute({
    idPath: ["public", "myAccount"],
    component: "MyAccountPage",
    name: "My Account",
    path: "/myaccount"
  });
  metaData.addRoute({
    idPath: ["public", "shop"],
    component: "ParentPlaceHolder",
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
