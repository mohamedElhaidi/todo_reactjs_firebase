export const TICKET_TYPE_SUGGETION_FEATURE = "suggetion/feature";
export const TICKET_TYPE_BUG_ISSUE = "bug/issue";
export const TICKET_TYPE_OTHER = "other";
export const TICKET_TYPE_SUGGETION_FEATURE_CODE = 0;
export const TICKET_TYPE_BUG_ISSUE_CODE = 1;
export const TICKET_TYPE_OTHER_CODE = 2;

export function getTicketType(n) {
  switch (n) {
    case TICKET_TYPE_SUGGETION_FEATURE_CODE:
      return TICKET_TYPE_SUGGETION_FEATURE;
    case TICKET_TYPE_BUG_ISSUE_CODE:
      return TICKET_TYPE_BUG_ISSUE;
    case TICKET_TYPE_OTHER_CODE:
      return TICKET_TYPE_OTHER;
  }
  return null;
}
export function getTicketTypeId(str) {
  switch (str.toLowerCase()) {
    case TICKET_TYPE_SUGGETION_FEATURE:
      return TICKET_TYPE_SUGGETION_FEATURE_CODE;
    case TICKET_TYPE_BUG_ISSUE:
      return TICKET_TYPE_BUG_ISSUE_CODE;
    case TICKET_TYPE_OTHER:
      return TICKET_TYPE_OTHER_CODE;
  }
  return null;
}

const TICKET_STATUS_OPEN = "open";
const TICKET_STATUS_CLOSED = "closed";
const TICKET_STATUS_OPEN_CODE = 1;
const TICKET_STATUS_CLOSED_CODE = 0;

// ticket statuses
export function getTicketStatusText(n) {
  switch (n) {
    case TICKET_STATUS_OPEN_CODE:
      return TICKET_STATUS_OPEN;
    case TICKET_STATUS_CLOSED_CODE:
      return TICKET_STATUS_CLOSED;
  }
  return null;
}
export function getTicketStatusId(str) {
  switch (str) {
    case TICKET_STATUS_CLOSED:
      return TICKET_STATUS_OPEN_CODE;
    case TICKET_STATUS_CLOSED:
      return TICKET_STATUS_CLOSED_CODE;
  }
  return null;
}

export function getTicketTypesCodes() {
  return [
    TICKET_TYPE_SUGGETION_FEATURE_CODE,
    TICKET_TYPE_BUG_ISSUE_CODE,
    TICKET_TYPE_OTHER_CODE,
  ];
}

export function getTicketSeverityCodes() {
  return [
    TICKET_SEVERITY_LOW_CODE,
    TICKET_SEVERITY_NORMAL_CODE,
    TICKET_SEVERITY_HIGH_CODE,
  ];
}

const TICKET_SEVERITY_LOW = "low";
const TICKET_SEVERITY_NORMAL = "normal";
const TICKET_SEVERITY_HIGH = "high";
const TICKET_SEVERITY_LOW_CODE = 0;
const TICKET_SEVERITY_NORMAL_CODE = 1;
const TICKET_SEVERITY_HIGH_CODE = 2;

// returns a text description of a ticket severity property
export function getTicketSeverity(n) {
  switch (n) {
    case TICKET_SEVERITY_LOW_CODE:
      return TICKET_SEVERITY_LOW;
    case TICKET_SEVERITY_NORMAL_CODE:
      return TICKET_SEVERITY_NORMAL;
    case TICKET_SEVERITY_HIGH_CODE:
      return TICKET_SEVERITY_HIGH;
  }
  return null;
}
export function getTicketSeverityId(str) {
  switch (str.toLowerCase()) {
    case TICKET_SEVERITY_LOW:
      return TICKET_SEVERITY_LOW_CODE;
    case TICKET_SEVERITY_NORMAL:
      return TICKET_SEVERITY_NORMAL_CODE;
    case TICKET_SEVERITY_HIGH:
      return TICKET_SEVERITY_HIGH_CODE;
  }
  return null;
}
