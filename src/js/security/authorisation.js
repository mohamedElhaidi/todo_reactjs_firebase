export const permissionGroups = [
  {
    name: "global permissions",
    permissions: [
      {
        label: "is admin",
        code: "IS_ADMIN",
      },
      {
        label: "manage any project",
        code: "GLOBAL_MANAGE_PROJECTS",
      },
      {
        label: "manage users and roles",
        code: "GLOBAL_MANAGE_USERS_AND_ROLES",
      },
    ],
  },
  {
    name: "projects assigned to them",
    permissions: [
      {
        label: "can edit project informations",
        code: "PROJECTS_ASSIGNED_MODIFY",
      },
      {
        label: "manage tickets",
        code: "PROJECTS_ASSIGNED_MODIFY_TICKETS",
      },
      {
        label: "manage todo lists",
        code: "PROJECTS_ASSIGNED_MODIFY_TODO",
      },
    ],
  },
  {
    name: "tickets assigned to them",
    permissions: [
      {
        // ----------
        label: "modify ticket informations",
        code: "TICKETS_ASSIGNED_MODIFY",
      },
      {
        label: "change status",
        code: "TICKETS_ASSIGNED_CHANGE_STATUS", //***************** */
      },
      {
        label: "add comment",
        code: "TICKETS_ASSIGNED_ADD_COMMENT",
      },
      {
        label: "add attachement",
        code: "TICKETS_ASSIGNED_ADD_ATTACHEMENT",
      },
    ],
  },
  // {
  //   name: "todos assigned to them",
  //   permissions: [
  //     {
  //       //--------
  //       label: "modify todo-list informations",
  //       code: "TODOS_ASSIGNED_MODIFY",
  //     },
  //     {
  //       label: "manage tasks",
  //       code: "TODOS_ASSIGNED_MANAGE_TASK",
  //     },
  //     {
  //       label: "manage statuses",
  //       code: "TODOS_ASSIGNED_MANAGE_STATUSES",
  //     },
  //   ],
  // },
  {
    name: "tasks assigned to them",
    permissions: [
      {
        label: "modify task info",
        code: "TASKS_ASSIGNED_MODIFY",
      },
      {
        label: "change status",
        code: "TASKS_ASSIGNED_CHANGE_STATUS",
      },
      {
        label: "add comment",
        code: "TASKS_ASSIGNED_ADD_COMMENT",
      },
    ],
  },
];

function fn(params) {}
