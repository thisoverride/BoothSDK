import type { ProductSearchFilter } from '../../@types/services/ProductService';
import { ListFilter, ProductCategory } from '../../utils/Utils';

export default class ApiEndpoints {
  public static readonly BASE_URL: string = 'https://booth.pm/';

  public static user = {
    updateNickname: () => {
      console.log('');
    }
  };

  public static products = {
    listProducts: (index: number = 1, filters: ProductSearchFilter = { sortBy: ListFilter.POPULARITY, onlyFreeProducts: false }): string => {
      const baseUrl: string = filters.category && filters.category !== ProductCategory.ALL
        ? `browse/${encodeURIComponent(filters.category as string)}`
        : 'items';

      const queryParams: URLSearchParams = new URLSearchParams({ page: index.toString() });

      filters.sortBy && queryParams.append('sort', filters.sortBy);
      filters.ageRestriction && queryParams.append('adult', filters.ageRestriction);
      filters.onlyFreeProducts && queryParams.append('max_price', '0');

      return `${baseUrl}?${queryParams.toString()}`;
    },
    search: (term: string, filters: ProductSearchFilter = { sortBy: ListFilter.POPULARITY }): string => {
      let baseUrl: string = filters.category && filters.category !== ProductCategory.ALL
        ? `browse/${encodeURIComponent(filters.category as string)}`
        : 'search/';

      const queryParams: URLSearchParams = new URLSearchParams();
      filters.sortBy && queryParams.append('sort', filters.sortBy);
      filters.onlyFreeProducts && queryParams.append('max_price', '0');
      filters.ageRestriction && queryParams.append('adult', filters.ageRestriction);

      if (baseUrl === 'search/') {
        baseUrl += `${term}?${queryParams.toString()}`;
      } else {
        queryParams.append('q', term);
        baseUrl += `?${queryParams.toString()}`;
      }

      return baseUrl;
    },

    wishLists: (itemIds: number[]): string => {
      const queryParams = new URLSearchParams();
      itemIds.forEach(id => {
        queryParams.append('item_ids[]', id.toString());
      });
      return `https://accounts.booth.pm/wish_lists.json?${queryParams.toString()}`;
    },

    autoCompleteSuggestion: (term: string) => `https://booth.pm/autocomplete/tag.json?term=${encodeURIComponent(term)}`,
    getById: (itemId: number) => `items/${itemId}`,
    save: (url: string) => url
  };
}
