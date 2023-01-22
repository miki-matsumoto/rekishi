export interface Actions {
  created_at: string;
  id: string;
  name: string;
  title: string | null;
  updated_at: string;
}

export interface AuditLogs {
  action_id: string;
  context_id: string;
  created_at: string;
  id: string;
  occurred_at: string;
  organization_id: string;
  user_id: string;
}

export interface Context {
  id: string;
  location: string | null;
  user_agent: string | null;
}

export interface EventTarget {
  audit_log_id: string;
  id: string;
  target_id: string;
}

export interface Organizations {
  avatar: string | null;
  created_at: string;
  id: string;
  name: string | null;
  organization_id: string;
  updated_at: string;
}

export interface Targets {
  created_at: string;
  id: string;
  name: string;
  updated_at: string;
}

export interface TargetsOnActions {
  action_id: string;
  target_id: string;
}

export interface Users {
  avatar: string | null;
  created_at: string;
  id: string;
  name: string | null;
  organization_id: string;
  updated_at: string;
  user_id: string;
}

export interface DB {
  actions: Actions;
  audit_logs: AuditLogs;
  context: Context;
  event_target: EventTarget;
  organizations: Organizations;
  targets: Targets;
  targets_on_actions: TargetsOnActions;
  users: Users;
}
