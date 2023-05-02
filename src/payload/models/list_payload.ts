export type ListPayload = {
  id: string;
};

export type CreateListPayload = {
  name: string;
  color: string;
  primary_field: string;
  description?: string;
  default_item_archivation_time?: null | number;
  secondary_field?: null | string;
};

export type UpdateListPayload = {
  id: string;
  name?: string;
  color?: string;
  description?: string;
  default_item_archivation_time?: null | number;
};
