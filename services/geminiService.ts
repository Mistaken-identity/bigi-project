
import { Product } from '../types';
import { LOCAL_PRODUCTS } from '../data';

/**
 * Fetches products for a given category from the local data source.
 * The function is kept async to maintain a consistent signature with potential future API calls.
 * @param categoryName - The name of the category to fetch products for.
 * @returns A promise that resolves to an array of products.
 */
export const generateProductsForCategory = async (categoryName:string): Promise<Product[]> => {
  console.log(`Fetching local products for category: ${categoryName}`);
  const products = LOCAL_PRODUCTS[categoryName];

  if (products) {
    return Promise.resolve(products);
  } else {
    console.warn(`No local products found for category: ${categoryName}. Returning empty array.`);
    return Promise.resolve([]);
  }
};

/**
 * Searches for products in the local data source with a highly precise matching logic.
 * The search is case-insensitive and only considers product names.
 * Results are sorted to prioritize exact matches first, then by the length of the name.
 * @param query - The search term entered by the user.
 * @returns A promise that resolves to an array of matching products, sorted by relevance.
 */
export const searchProducts = async (query: string): Promise<Product[]> => {
  if (!query || query.trim().length < 2) {
    return Promise.resolve([]);
  }

  const lowerCaseQuery = query.toLowerCase().trim();
  const allProducts: Product[] = Object.values(LOCAL_PRODUCTS).flat();

  // Filter products where the name includes the query
  const matchedProducts = allProducts.filter(product => {
    const lowerCaseName = product.name.toLowerCase();
    return lowerCaseName.includes(lowerCaseQuery);
  });

  // Sort the filtered results for relevance
  matchedProducts.sort((a, b) => {
    const aName = a.name.toLowerCase();
    const bName = b.name.toLowerCase();

    // An exact match for 'a' should come before 'b'
    if (aName === lowerCaseQuery && bName !== lowerCaseQuery) {
      return -1;
    }
    // An exact match for 'b' should come before 'a'
    if (bName === lowerCaseQuery && aName !== lowerCaseQuery) {
      return 1;
    }

    // If both are partial matches, the one with the shorter name is likely more relevant
    return aName.length - bName.length;
  });

  console.log(`Found ${matchedProducts.length} local products for exact search: "${query}"`);
  return Promise.resolve(matchedProducts);
};
