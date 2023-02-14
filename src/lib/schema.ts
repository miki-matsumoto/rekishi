export interface Actions {
  code: string;
  created_at: string;
  id: string;
  title: string | null;
  updated_at: string;
}

export interface Context {
  device: string | null;
  id: string;
  location: string | null;
  user_agent: string | null;
}

export interface Events {
  action_id: string;
  context_id: string;
  created_at: string;
  id: string;
  occurred_at: string;
  organization_id: string;
  user_id: string | null;
}

export interface EventTarget {
  audit_log_id: string;
  event_target_id: string;
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
  email: string | null;
  id: string;
  name: string | null;
  organization_id: string;
  updated_at: string;
  user_id: string;
}

export interface DB {
  actions: Actions;
  context: Context;
  event_target: EventTarget;
  events: Events;
  organizations: Organizations;
  targets: Targets;
  targets_on_actions: TargetsOnActions;
  users: Users;
}
