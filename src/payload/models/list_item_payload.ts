export type ListItemAuthorType =
  | '$analyst_email'
  | '$castle_dashboard_user'
  | '$castle_policy'
  | '$user'
  | '$user_email'
  | '$other';

export type ListItemMode =
  | '$error'
  | '$replace'
  | '$update'
  | '$update_or_replace';

export type ListItemPayload = {
  list_id: string;
  primary_value: string;
  author: {
    type: ListItemAuthorType;
    identifier: string;
  };
  secondary_value?: string;
  comment?: string;
  auto_archives_at?: string;
  mode?: ListItemMode;
};
