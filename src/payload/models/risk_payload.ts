import type { IncomingHttpHeaders } from 'http2';
import type { AddressPayload } from './address_payload';

type TransactionAmountPayload = {
  type: '$fiat' | '$crypto';
  value?: string;
  currency?: string;
  [key: string]: any;
};

type PaymentMethodPayload = {
  type: string;
  fingerprint?: string;
  holder_name?: string;
  bank_name?: string;
  country_code?: string;
  billing_address?: AddressPayload;
  card?: {
    bin?: string;
    last4?: string;
    exp_month?: number;
    exp_year?: number;
    network?: string;
    funding?: string;
    [key: string]: any;
  };
  [key: string]: any;
};

type MerchantPayload = {
  id?: string;
  name?: string;
  category?: {
    code?: string;
    description?: string;
    [key: string]: any;
  };
  address?: AddressPayload;
  [key: string]: any;
};

export type TransactionPayload = {
  id: string;
  type: string;
  base_amount?: string;
  amount?: TransactionAmountPayload;
  payment_method?: PaymentMethodPayload;
  shipping_address?: AddressPayload;
  merchant?: MerchantPayload;
  [key: string]: any;
};

type BaseRiskPayload = {
  user: {
    id: string;
    phone?: string;
    email?: string;
    registered_at?: string;
    traits?: { [key: string]: any };
    name?: string;
    address?: AddressPayload;
  };
  properties?: { [key: string]: any };
  created_at?: string;
  product?: {
    id: string;
  };
  session?: {
    id: string;
    created_at?: string;
  };
  authentication_method?: {
    type: string;
    variant?: string;
    email?: string;
    phone?: string;
  };
  status?: string;
  name?: string;
  address?: AddressPayload;
  transaction?: TransactionPayload;
  skip_request_token_validation?: boolean;
  skip_context_validation?: boolean;
} & ({ event: string } | { type: string });

type Context = {
  ip: string;
  headers: IncomingHttpHeaders | { [key: string]: string | boolean };
};

type RequiredContextAndToken = BaseRiskPayload & {
  request_token: string;
  context: Context;
  skip_request_token_validation?: false;
  skip_context_validation?: false;
};

type SkipRequestToken = BaseRiskPayload & {
  request_token?: string;
  context: Context;
  skip_request_token_validation: true;
  skip_context_validation?: false;
};

type SkipContext = BaseRiskPayload & {
  request_token: string;
  context?: Context;
  skip_request_token_validation?: false;
  skip_context_validation: true;
};

type SkipBoth = BaseRiskPayload & {
  request_token?: string;
  context?: Context;
  skip_request_token_validation: true;
  skip_context_validation: true;
};

export type RiskPayload =
  | RequiredContextAndToken
  | SkipRequestToken
  | SkipContext
  | SkipBoth;
