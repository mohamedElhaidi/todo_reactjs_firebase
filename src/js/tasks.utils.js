// returns a text description of a task severity property
export const TASK_SEVERITY_LOW = "low";
export const TASK_SEVERITY_NORMAL = "normal";
export const TASK_SEVERITY_HIGH = "high";
export const TASK_SEVERITY_LOW_CODE = 0;
export const TASK_SEVERITY_NORMAL_CODE = 1;
export const TASK_SEVERITY_HIGH_CODE = 2;

export function getTaskSeverity(n) {
  switch (n) {
    case TASK_SEVERITY_LOW_CODE:
      return TASK_SEVERITY_LOW;
    case TASK_SEVERITY_NORMAL_CODE:
      return TASK_SEVERITY_NORMAL;
    case TASK_SEVERITY_HIGH_CODE:
      return TASK_SEVERITY_HIGH;
  }
  return null;
}
export function getTaskSeverityId(str) {
  switch (str.toLowerCase()) {
    case TASK_SEVERITY_LOW:
      return TASK_SEVERITY_LOW_CODE;
    case TASK_SEVERITY_NORMAL:
      return TASK_SEVERITY_NORMAL_CODE;
    case TASK_SEVERITY_HIGH:
      return TASK_SEVERITY_HIGH_CODE;
  }
  return null;
}
