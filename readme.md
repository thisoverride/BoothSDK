## **はじめに**
<p>English version <a href="readme-en.md">Here</a></p>
<img src="banner.jpg">
Booth SDKは、人気のあるeコマースプラットフォーム <a href="https://booth.pm">Booth.pm</a> からさまざまな商品情報を抽出するためのウェブスクレイピングツールです。サイト上のすべての無料および有料商品の詳細情報を取得することが可能で、無料の商品のダウンロードも可能です。

## **貢献**

Booth SDKの機能や使いやすさを改善するための貢献を大歓迎します。バグを見つけた場合、機能の要望がある場合、またはコードに貢献したい場合は、私たちの貢献ガイドラインに従ってください。

## **使用例**

Booth SDKの使用例を以下に示します。

```jsx
import type { BoothProductOverview } from './@types/services/dto/Dto';
import type { CollectionBoothProduct } from './@types/services/ProductService';
import BoothPm from './core/BoothPm';

void (async () => {
  const booth = new BoothPm({ lang: 'en' });

  const listResult: CollectionBoothProduct = await booth.listProducts(0,{ 
    sortBy: BoothPm.FILTERS.Loves, 
    category: BoothPm.CATEGORIES.GAMES 
    });
  
  const { productId }: BoothProductOverview = listResult.items[8];
  const product = await booth.getProduct(productId);
  await booth.save({ boothProduct: product, path: './downloads' });
})();


```
# API リファレンス

## 商品

- `listItems(pageIndex?: number)`: アイテムのリストを取得します。`pageIndex`はオプションで、デフォルトは0です。
- `getItem(productID: number)`: 商品IDによる特定のアイテムの詳細を取得します。
- `searchProducts(term: string)`: 提供された検索語で商品を検索します。
- `download(boothProduct: Downloadable)`: 指定した商品をダウンロードします。認証が必要です。

## Authenticator

- `login(email: string, password: string): Promise<void>`: 提供されたメールとパスワードでログインします。
- `connect(): void`: 限定的なアクセスのために認証なしで接続します。

## **ライセンス**

このプロジェクトはMITライセンスの下でライセンスされています - 詳細はLICENSEファイルをご覧ください。
