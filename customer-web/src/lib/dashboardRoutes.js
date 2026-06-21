export const DASHBOARD_ROUTES = {
  "/app/orders": { title: "My Orders" },
  "/app/addresses": { title: "My Addresses" },
  "/app/profile": { title: "Account" },
  "/app/support": { title: "Support" },
};

export function getPageTitle(pathname) {
  if (pathname.startsWith("/app/orders/") && pathname !== "/app/orders") {
    return "Order details";
  }
  return DASHBOARD_ROUTES[pathname]?.title || "My Orders";
}

export function isOrderDetailRoute(pathname) {
  return /^\/app\/orders\/[^/]+$/.test(pathname);
}
