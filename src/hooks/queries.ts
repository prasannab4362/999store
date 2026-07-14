import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/product-service";
import { orderService } from "@/services/order-service";
import { claimService } from "@/services/claim-service";

export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters: any) => [...productKeys.lists(), { filters }] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (slug: string) => [...productKeys.details(), slug] as const,
};

export const categoryKeys = {
  all: ["categories"] as const,
};

export const collectionKeys = {
  all: ["collections"] as const,
};

export const orderKeys = {
  all: ["orders"] as const,
  detail: (orderId: string, phone: string) => [...orderKeys.all, "detail", orderId, phone] as const,
};

export const claimKeys = {
  all: ["claims"] as const,
};

// 1. Fetch products list
export function useProducts(filters?: { gender?: string; categoryId?: string; search?: string }) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => productService.getProducts(filters),
  });
}

// 2. Fetch single product by slug
export function useProduct(slug: string) {
  return useQuery({
    queryKey: productKeys.detail(slug),
    queryFn: () => productService.getProductBySlug(slug),
    enabled: !!slug,
  });
}

// 3. Fetch categories
export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.all,
    queryFn: () => productService.getCategories(),
  });
}

// 4. Fetch collections
export function useCollections() {
  return useQuery({
    queryKey: collectionKeys.all,
    queryFn: () => productService.getCollections(),
  });
}

// 5. Fetch orders list
export function useCustomerOrders() {
  return useQuery({
    queryKey: orderKeys.all,
    queryFn: () => orderService.getCustomerOrders(),
  });
}

// 6. Track order using ID & Phone number
export function useTrackOrder(orderId: string, phone: string) {
  return useQuery({
    queryKey: orderKeys.detail(orderId, phone),
    queryFn: () => orderService.getOrder(orderId, phone),
    enabled: !!orderId && !!phone,
  });
}

// 7. Fetch claims list
export function useClaims() {
  return useQuery({
    queryKey: claimKeys.all,
    queryFn: () => claimService.getClaims(),
  });
}
