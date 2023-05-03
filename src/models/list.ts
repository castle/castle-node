export interface List {
  id: string;
  name: string;
  color: string;
  primary_field: string;
  description?: string;
  secondary_field?: string;
  default_item_archivation_time?: null | number;
  archived_at?: string;
  created_at?: string;
}
