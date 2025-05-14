import { ShopifyCheckout } from "../types";

export function getFullName(checkout: ShopifyCheckout): string {
  const nameFromCustomer = `${checkout?.customer?.first_name ?? ""} ${
    checkout?.customer?.last_name ?? ""
  }`.trim();
  const nameFromShipping = `${checkout?.shipping_address?.first_name ?? ""} ${
    checkout?.shipping_address?.last_name ?? ""
  }`.trim();
  const nameFromBilling = `${checkout?.billing_address?.first_name ?? ""} ${
    checkout?.billing_address?.last_name ?? ""
  }`.trim();

  if (nameFromCustomer) return nameFromCustomer;
  if (nameFromShipping) return nameFromShipping;
  if (nameFromBilling) return nameFromBilling;

  return "Unknown User";
}

export function getFirstName(checkout: ShopifyCheckout): string {
  const firstNameFromCustomer = checkout?.customer?.first_name?.trim();
  const firstNameFromShipping = checkout?.shipping_address?.first_name?.trim();
  const firstNameFromBilling = checkout?.billing_address?.first_name?.trim();

  if (firstNameFromCustomer) return firstNameFromCustomer;
  if (firstNameFromShipping) return firstNameFromShipping;
  if (firstNameFromBilling) return firstNameFromBilling;

  return "User";
}

export function getRawPhone(checkout: ShopifyCheckout): string {
  return (
    checkout?.customer?.phone ??
    checkout?.shipping_address?.phone ??
    checkout?.billing_address?.phone ??
    ""
  );
}
