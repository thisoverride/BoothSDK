## Introduction

<p>Japanese version <a href="[readme.md](http://readme.md/)">here</a></p>

<img src="banner.jpg">

Booth SDK is a web scraping tool designed to extract various product information from the popular e-commerce platform <a href="[https://booth.pm](https://booth.pm/)">Booth.pm</a>. It allows you to obtain detailed information about all free and paid products available on the site and also enables the download of free products.

## Contributions

We warmly welcome contributions aimed at improving the functionality and usability of the Booth SDK. If you find bugs, have feature requests, or want to contribute to the code, please follow our contribution guidelines.

## Usage Example

Here is an example of how to use the Booth SDK.

```jsx
import type { BoothProductOverview } from './@types/services/dto/Dto';
import type { BoothProductCollection } from './@types/services/ProductService';
import BoothPm from './core/BoothPm';

void (async () => {
  const booth = new BoothPm({ lang: 'en' });

  const listResult: BoothProductCollection = await booth.listProducts(0, {
    sortBy: BoothPm.FILTERS.LOVES,
    category: BoothPm.CATEGORIES.MODELS_3D,
    onlyFreeProducts: true
  });
  console.log(listResult);
  const { productId }: BoothProductOverview = listResult.items[8];
  const product = await booth.getProduct(productId);
  await booth.save({ boothProduct: product, path: './downloads' });
})();
```

# API Reference

## Product

- `listProducts(index: number = 1, filterOn?: ProductSearchFilter)`: Retrieves a list of products. The index specifies the page index and defaults to 1. `filterOn` allows you to apply filters to the product list.
- `getProduct(productId: number)`: Retrieves details of a specific product by its ID.
- `find(term: string, filterOn?: ProductSearchFilter)`: Searches for products using the provided search term. `filterOn` allows for additional filtering.
- `autocomplete(query: string)`: Provides autocomplete suggestions based on the query.
- `save(downloadableData: DownloadableData)`: Downloads a specified product. Requires the `downloadableData` object containing product information.

## Wishlist

- `addToWishlist(productId: number, productName: string)`: Adds a product to the wishlist.
- `getWishlistItems()`: Retrieves all items in the wishlist.
- `clearWishlist()`: Clears the wishlist.
- `removeFromWishlist(productId: number)`: Removes a product from the wishlist by its product ID.

## License

This project is licensed under the MIT license. Please see the LICENSE file for more details.