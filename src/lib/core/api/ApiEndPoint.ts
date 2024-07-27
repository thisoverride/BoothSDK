import type { ProductSearchFilter } from '../../@types/services/ProductService';
import { ListFilter, ProductCategory } from '../../utils/Utils';

export default class ApiEndpoints {
  public static readonly BASE_URL: string = 'https://booth.pm/';

  public static products = {
    listProducts: (index: number = 1, filters: ProductSearchFilter = { sortBy: ListFilter.Popularity }): string => {
      const baseUrl: string = filters.category && filters.category !== ProductCategory.ALL
        ? `browse/${encodeURIComponent(filters.category)}`
        : 'items';

      const queryParams = new URLSearchParams({
        page: index.toString(),
        max_price: '0',
        ...(filters.sortBy && { sort: filters.sortBy })
      });

      if (filters.ageRestriction) {
        queryParams.append('adult', filters.ageRestriction);
      }

      return `${baseUrl}?${queryParams.toString()}`;
    },
    search: (term: string, filters: ProductSearchFilter = { sortBy: ListFilter.Popularity }): string => {
      let baseUrl: string = filters.category && filters.category !== ProductCategory.ALL
        ? `browse/${encodeURIComponent(filters.category)}`
        : 'search/';

      const queryParams = new URLSearchParams({
        max_price: '0',
        ...(filters.sortBy && { sort: filters.sortBy }),
        ...(filters.ageRestriction && { adult: filters.ageRestriction })
      });

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
      return `wish_lists.json?${queryParams.toString()}`;
    },

    autoCompleteSuggestion: (term: string) => `autocomplete/tag.json?term=${term}`,
    getById: (itemId: number) => `items/${itemId}`,
    save: (url: string) => url
  };
}
