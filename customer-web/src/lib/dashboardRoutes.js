export const DASHBOARD_ROUTES = {

  "/app/orders": { title: "My Sessions" },

  "/app/addresses": { title: "Where to come?" },

  "/app/profile": { title: "Your profile" },

  "/app/support": { title: "Help" },

};



export function getPageTitle(pathname) {

  if (pathname.startsWith("/app/orders/") && pathname !== "/app/orders") {

    return "Your booking";

  }

  return DASHBOARD_ROUTES[pathname]?.title || "My Sessions";

}



export function isOrderDetailRoute(pathname) {

  return /^\/app\/orders\/[^/]+$/.test(pathname);

}


