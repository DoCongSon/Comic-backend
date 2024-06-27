const allRoles = {
  USER: [],
  USERVIP: ['VIP'],
  ADMIN: ['GET_USERS', 'MANAGE_USERS', 'GET_ACHIEVEMENTS', 'MANAGE_ACHIEVEMENTS']
}

const rolesConfig = Object.keys(allRoles)
const roleRights = new Map(Object.entries(allRoles))

export { rolesConfig, roleRights }
