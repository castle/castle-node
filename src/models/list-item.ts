import { ListItemAuthorType } from '../payload/models/list_item_payload';

export interface ListItem {
  id: string;
  list_id: string;
  primary_value: string;
  secondary_value?: string;
  comment?: string;
  author: {
    type: ListItemAuthorType;
    identifier: string;
  };
  auto_archives_at?: string;
  archived?: boolean;
  created_at?: string;
}
