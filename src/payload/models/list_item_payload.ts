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
  id: string;
  list_id: string;
};

export type CreateListItemPayload = {
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

export type UpdateListItemPayload = ListItemPayload & {
  comment: string;
};

export type SearchListItemsPayload = {
  list_id: string;
  sort?: {
    field: string;
    order: string;
  };
  filters?: any[];
  page?: number;
  results_size?: number;
};
