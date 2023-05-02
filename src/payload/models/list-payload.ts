export type ListPayload = {
  id: string;
};

export type CreateListPayload = {
  name: string;
  color: string;
  primary_field: string;
  description?: string;
  secondary_field?: string;
  default_item_archivation_time?: null | number;
};

export type UpdateListPayload = ListPayload & {
  name?: string;
  color?: string;
  description?: string;
  default_item_archivation_time?: null | number;
};

export type SearchListsPayload = {
  sort?: {
    field: string;
    order: string;
  };
  filters?: any[];
  page?: number;
  results_size?: number;
};
