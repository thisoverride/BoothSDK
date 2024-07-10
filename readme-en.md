## **Introduction**
<p>Japanese version<a href="readme.md"> Here</a></p>
<img src="banner.jpg">
Booth SDK is a web scraping tool designed to extract various product information from the popular e-commerce platform <a href="https://booth.pm">Booth.pm</a>. It allows you to obtain detailed information about all free and paid products available on the site, and also enables the download of free products.

## **Contributions**

We warmly welcome contributions aimed at improving the functionality and usability of the Booth SDK. If you find bugs, have feature requests, or want to contribute to the code, please follow our contribution guidelines.

## **Usage Example**

Here is an example of how to use the Booth SDK.

```jsx
import BoothPm from './core/BoothPm';

void (async () => {
  const booth = new BoothPm({ lang: 'en', adultContent: true });

  const listResult = await booth.listProducts(0, { filter: 'New' });
  const productDetails = await booth.getProduct(listResult.items[6].productId);
  const saveResult = await booth.save({ boothProduct: productDetails, path: './downloads' });

  console.log(saveResult);
})();

```

# API Reference

## Product

- `listItems(pageIndex?: number)`: Retrieves a list of items. `pageIndex` is optional and defaults to 0.
- `getItem(productID: number)`: Retrieves details of a specific item by its product ID.
- `searchProducts(term: string)`: Searches for products using the provided search term.
- `download(boothProduct: Downloadable)`: Downloads a specified product. Requires authentication.

## Authenticator

- `login(email: string, password: string): Promise<void>`: Logs in with the provided email and password.
- `connect(): void`: Connects without credentials for limited access.



## **License**

This project is licensed under the MIT license - please see the LICENSE file for more details.
