const allRoles = {
  USER: ['GET_USERS'],
  ADMIN: ['GET_USERS', 'MANAGE_USERS']
}

const rolesConfig = Object.keys(allRoles)
const roleRights = new Map(Object.entries(allRoles))

export { rolesConfig, roleRights }
