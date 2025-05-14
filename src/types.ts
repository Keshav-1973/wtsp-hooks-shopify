export interface ShopifyCheckout {
  id: string;
  name?: string;
  customer?: {
    id?: number;
    email?: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    state?: string;
    verified_email?: boolean;
    default_address?: {
      address1?: string;
      city?: string;
      country?: string;
      province?: string;
      zip?: string;
      phone?: string;
    };
  };
  email?: string;
  currency?: string;
  created_at?: string;
  completed_at?: string;
  line_items?: {
    id?: number;
    title?: string;
    variant_title?: string;
    sku?: string;
    quantity?: number;
    price?: string;
  }[];
  shipping_address?: {
    first_name?: string;
    last_name?: string;
    address1?: string;
    address2?: string;
    city?: string;
    province?: string;
    zip?: string;
    country?: string;
    phone?: string;
  };
  billing_address?: {
    first_name?: string;
    last_name?: string;
    address1?: string;
    address2?: string;
    city?: string;
    province?: string;
    zip?: string;
    country?: string;
    phone?: string;
  };
  total_price?: string;
  subtotal_price?: string;
  total_tax?: string;
  shipping_line?: {
    title?: string;
    price?: string;
  };
  tax_lines?: {
    title?: string;
    price?: string;
    rate?: number;
  }[];
  applied_discount?: {
    title?: string;
    description?: string;
    amount?: string;
    value_type?: string;
  };
  invoice_url?: string;
}

export type WhatsAppMessageRequest = {
  messaging_product: "whatsapp";
  to: string;
  type: string;
  [key: string]: any; // for additional fields like "template", "text", etc.
};

export type WhatsAppMessageResponse = {
  messaging_product: "whatsapp";
  contacts: { input: string; wa_id: string }[];
  messages: { id: string; message_status: string }[];
};

export type FirestoreLikeTimestamp = {
  _seconds: number;
  _nanoseconds: number;
};

export type WhatsAppApiError = {
  message: string; // e.g., "(#132001) Template name does not exist in the translation"
  type: "OAuthException";
  code: number; // e.g., 132001
  error_data: {
    messaging_product: "whatsapp";
    details: string; // e.g., "template name (ORDER_CREATE_TEMPLATE) does not exist in en"
  };
  fbtrace_id: string; // Facebook trace ID for debugging
};
