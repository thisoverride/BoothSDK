export default class ApiEndpoints {
  public static readonly BASE_URL: string = 'https://booth.pm/';
  public static products = {
    listProducts: (index?: number, filterOn?: string) => `items?page=${index ?? 1}&sort=${filterOn ?? 'new'}&max_price=0`,
    search: (term: string, filterOn?: string) => `search/${term}?max_price=0${filterOn ? `&sort=${filterOn}` : ''}`,
    getById: (itemId: number) => `items/${itemId}`,
    save: (url: string) => url
  };
}
