export function getMenuTree() {
  return fetchAxios.get<Menu[]>('/api/menu/tree')
}
