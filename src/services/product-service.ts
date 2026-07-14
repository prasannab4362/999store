import { Product } from "@/types/product";
import { products } from "@/data/mock/products";
import { categories } from "@/data/mock/categories";
import { collections } from "@/data/mock/collections";

const LATENCY = 300; // Configurable mock latency (300ms)

const delay = <T>(value: T): Promise<T> => {
  return new Promise((resolve) => setTimeout(() => resolve(value), LATENCY));
};

export interface IProductService {
  getProducts(filters?: { gender?: string; categoryId?: string; search?: string }): Promise<Product[]>;
  getProductBySlug(slug: string): Promise<Product | null>;
  getCategories(): Promise<typeof categories>;
  getCollections(): Promise<typeof collections>;
}

export class MockProductService implements IProductService {
  async getProducts(filters?: { gender?: string; categoryId?: string; search?: string }): Promise<Product[]> {
    let result = [...products];

    if (filters) {
      if (filters.gender) {
        result = result.filter((p) => p.gender === filters.gender || p.gender === "unisex");
      }
      if (filters.categoryId) {
        result = result.filter((p) => p.categoryId === filters.categoryId);
      }
      if (filters.search) {
        const query = filters.search.toLowerCase();
        result = result.filter(
          (p) =>
            p.name.toLowerCase().includes(query) ||
            p.productCode.toLowerCase().includes(query) ||
            p.subcategory.toLowerCase().includes(query)
        );
      }
    }

    return delay(result);
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    const product = products.find((p) => p.slug === slug) || null;
    return delay(product);
  }

  async getCategories(): Promise<typeof categories> {
    return delay(categories);
  }

  async getCollections(): Promise<typeof collections> {
    return delay(collections);
  }
}

export const productService = new MockProductService();
export default productService;
