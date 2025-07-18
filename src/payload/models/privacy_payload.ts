export type RequestUserDataPayload = {
  identifier: string;
  identifier_type: '$id' | '$email';
};

export type DeleteUserDataPayload = {
  identifier: string;
  identifier_type: '$id' | '$email';
};
