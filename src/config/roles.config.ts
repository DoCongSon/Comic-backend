const allRoles = {
  user: [],
  userPremium: [],
  admin: ['GET_USERS', 'MANAGE_USERS']
}

const rolesConfig = Object.keys(allRoles)
const roleRights = new Map(Object.entries(allRoles))

export { rolesConfig, roleRights }
