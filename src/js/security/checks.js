export function isAdmin(claims) {
  return claims.IS_ADMIN;
}

/**
 * can manage any project whats inside them
 */

export function canManageAnyProjects(claims) {
  return isAdmin(claims) || claims.GLOBAL_MANAGE_PROJECTS;
}

/**
 * can manage any users and roles and assignements
 */
export function canManageUsersAndRoles(claims) {
  return isAdmin(claims) || claims.GLOBAL_MANAGE_USERS_AND_ROLES;
}

/**
 * Projects assigned to user
 */
export function canEditProjectAssigned(claims) {
  return (
    isAdmin(claims) ||
    canManageAnyProjects(claims) ||
    claims.PROJECTS_ASSIGNED_MODIFY
  );
}

export function canManageTodosOfProjectAssigned(claims) {
  return (
    isAdmin(claims) ||
    canManageAnyProjects(claims) ||
    claims.PROJECTS_ASSIGNED_MODIFY_TODO
  );
}

export function canManageTicketsOfProjectAssigned(claims) {
  return (
    isAdmin(claims) ||
    canManageAnyProjects(claims) ||
    claims.PROJECTS_ASSIGNED_MODIFY_TICKETS
  );
}

/**
 * Tickets assigned to user
 */
export function canModifyTicketsAssigned(claims) {
  return (
    isAdmin(claims) ||
    canManageAnyProjects(claims) ||
    claims.TICKETS_ASSIGNED_MODIFY
  );
}

export function canChangeStatusOfTicketsAssigned(claims) {
  return (
    isAdmin(claims) ||
    canManageAnyProjects(claims) ||
    claims.TICKETS_ASSIGNED_CHANGE_STATUS
  );
}

export function canAddCommentsToTicketsAssigned(claims) {
  return (
    isAdmin(claims) ||
    canManageAnyProjects(claims) ||
    claims.TICKETS_ASSIGNED_ADD_COMMENT
  );
}

export function canAddAttachementToTicketsAssigned(claims) {
  return (
    isAdmin(claims) ||
    canManageAnyProjects(claims) ||
    claims.TICKETS_ASSIGNED_ADD_ATTACHEMENT
  );
}
