export type SearchEventsResponse = {
  data: Array<Event>;
  total_count: number;
};

export type Event = {
  id: string;
  type: string;
  status: string;
  risk: number | null;
  signals: Array<EventSignal>;
  properties: Record<
    string,
    | string
    | number
    | boolean
    | object
    | Array<string>
    | Array<string | number | boolean>
  >;
  product: {
    id: string;
  };
  device: {
    user_agent: string;
    fingerprint: string;
    hardware: {
      type: string;
      name: string | null;
      brand: string | null;
      display: {
        width: number;
        height: number;
      };
      model: {
        name: string | null;
        code: string | null;
      };
    };
    os: {
      name: string;
      version: {
        major: string;
        full: string | null;
      };
    };
    software: {
      type: string;
      name: string;
      languages: Array<string>;
      version: {
        major: string;
        full: string;
      };
      fingerprint: string;
    };
    timezone?: {
      offset?: number;
      name?: string;
    };
    screen?: {
      screen?: number;
      orientation?: string;
    };
  };
  ip: {
    asn: number;
    location: {
      city: string;
      continent_code: string;
      country_code: string;
      postal_code: string;
      region_code: string;
      latitude: number;
      longitude: number;
    };
    address: string;
    isp: {
      name?: string;
      organization?: string;
    };
    type: string;
    privacy?: {
      anonymous?: boolean;
      datacenter?: boolean;
      proxy?: boolean;
      tor?: boolean;
    };
  };
  policy: {
    name: string;
    id: string;
    revision_id: string | null; // @Deprecated
    action: string | null;
    response?: {
      status_code: number;
      body: string;
      headers?: Array<{
        name: string;
        value: string;
      }>;
    } | null;
  };
  user: {
    id: string;
    registered_at: string;
    last_seen_at: string;
    risk: number | null;
    devices_count: number | null;
    name: string | null;
    email: string | null;
    phone: string | null;
    traits?: Record<string, string | number | boolean | object>;
    address?: {
      country_code: string;
      line1?: string;
      line2?: string;
      city?: string;
      region_code?: string;
      postal_code?: string;
      fingerprint?: string;
    };
  };
  created_at: string;
  params: {
    email?: string;
    phone?: string;
    username?: string;
  };
  transaction?: {
    type: string;
    id: string;
    base_amount: string;
    amount: {
      type: string;
      value: string;
      currency: string;
    };
    payment_method?: {
      type: string;
      fingerprint: string;
      holder_name: string;
      bank_name: string;
      country_code: string;
      billing_address?: {
        line1?: string;
        line2?: string;
        city?: string;
        country_code?: string;
        region_code?: string;
        postal_code?: string;
        fingerprint?: string;
      };
      card?: {
        bin?: string;
        last4?: string;
        exp_month?: number;
        exp_year?: number;
        network?: string;
        funding?: string;
      };
    };
    shipping_address?: {
      line1?: string;
      line2?: string;
      city?: string;
      country_code?: string;
      region_code?: string;
      postal_code?: string;
      fingerprint?: string;
    };
    merchant: {
      id: string;
      name: string;
      category: {
        code: string;
        description: string;
      };
      address?: {
        country_code: string;
        line1?: string;
        line2?: string;
        city?: string;
        region_code?: string;
        postal_code?: string;
        fingerprint?: string;
      };
    };
  };
  authentication_method?: {
    type: EventAuthenticationMethod;
    variant?: string;
    email?: string;
    phone?: string;
  };
  page: {
    name: string;
    url: string;
    referrer?: string;
  };
  screen?: {
    name: string;
  };
  scores?: {
    account_sharing?: {
      score: number;
    };
    account_takeover?: {
      score: number;
    };
    bot?: {
      score: number;
    };
    multi_accounting?: {
      score: number;
    };
    spoofed_device?: {
      score: number;
    };
    spoofed_location?: {
      score: number;
    };
    unified?: {
      score: number;
    };
  };
  changeset?:
    | {
        [key: string]: {
          changed: boolean;
        };
      }
    | {
        from: string | null;
        to: string | null;
      };
};

export enum EventSignal {
  ABUSE_IP = 'abuse_ip',
  BOT_BEHAVIOR = 'bot_behavior',
  CREDENTIAL_STUFFING = 'credential_stuffing',
  DISPOSABLE_EMAIL_DOMAIN = 'disposable_email_domain',
  GENERATED_EMAIL = 'generated_email',
  HEADLESS_BROWSER = 'headless_browser',
  HTTP_CLIENT_LIBRARY = 'http_client_library',
  IMPOSSIBLE_TRAVEL = 'impossible_travel',
  INVALID_EMAIL = 'invalid_email',
  INVALID_DEVICE_DATA = 'invalid_device_data',
  MISSING_DEVICE_DATA = 'missing_device_data',
  MISSING_HEADERS = 'missing_headers',
  MULTIPLE_ACCOUNTS_PER_DEVICE = 'multiple_accounts_per_device',
  MULTIPLE_ALIASES_PER_EMAIL = 'multiple_aliases_per_email',
  NEW_COUNTRY = 'new_country',
  NEW_DEVICE = 'new_device',
  NEW_DEVICE_TYPE = 'new_device_type',
  NEW_ISP = 'new_isp',
  NEW_LANGUAGE = 'new_language',
  NEW_OS = 'new_os',
  HIGH_ACTIVITY_DEVICE = 'high_activity_device',
  HIGH_ACTIVITY_IP = 'high_activity_ip',
  HIGH_ACTIVITY_ACCOUNT = 'high_activity_account',
  SPOOFED_DEVICE = 'spoofed_device',
  WEB_CRAWLER = 'web_crawler',
}

export enum EventAuthenticationMethod {
  AUTHENTICATOR = '$authenticator',
  BIOMETRICS = '$biometrics',
  EMAIL = '$email',
  PASSWORD = '$password',
  PHONE = '$phone',
  PUSH = '$push',
  SECURITY_KEY = '$security_key',
  SOCIAL = '$social',
  SSO = '$sso',
  KBA = '$kba',
  ELECTRONIC_ID = '$electronic_id',
  PHYSICAL_ID = '$physical_id',
  DOCUMENT = '$document',
  VIDEO = '$video',
  PASSKEY = '$passkey',
  OTHER = '$other',
}
