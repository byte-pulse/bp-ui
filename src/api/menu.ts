export function getMenuTree() {
  return fetchAxios.get<Menu[]>('/api/menus')
}

export function getRouteTree() {
  return fetchAxios.get<Menu[]>('/api/routes')
}
