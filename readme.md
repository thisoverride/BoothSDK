## はじめに

<p>日本語版は<a href="[readme.md](http://readme.md/)">こちら</a></p>

<img src="banner.jpg">

Booth SDKは、人気のあるeコマースプラットフォーム<a href="[https://booth.pm](https://booth.pm/)">Booth.pm</a>からさまざまな商品情報を抽出するためのウェブスクレイピングツールです。サイト上のすべての無料および有料商品の詳細情報を取得でき、無料商品のダウンロードも可能です。

## 貢献

Booth SDKの機能と使いやすさを向上させるための貢献を心より歓迎します。バグを見つけた場合、機能のリクエストがある場合、またはコードに貢献したい場合は、貢献ガイドラインに従ってください。

## 使用例

以下は、Booth SDKの使用例です。

```jsx
import type { BoothProductOverview } from './@types/services/dto/Dto';
import type { CollectionBoothProduct } from './@types/services/ProductService';
import BoothPm from './core/BoothPm';

void (async () => {
    const booth = new BoothPm({ lang: 'en' });
    const listResult: CollectionBoothProduct = await booth.listProducts(0, {
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

- `listProducts(index: number = 1, filterOn?: ProductSearchFilter)`: 商品のリストを取得します。インデックスはページインデックスを指定し、デフォルトは1です。`filterOn`を使用して商品リストにフィルターを適用できます。
- `getProduct(productId: number)`: 特定の商品IDの詳細を取得します。
- `find(term: string, filterOn?: ProductSearchFilter)`: 指定された検索用語を使用して商品を検索します。`filterOn`で追加のフィルタリングが可能です。
- `autocomplete(query: string)`: クエリに基づいてオートコンプリートの提案を提供します。
- `save(downloadableData: DownloadableData)`: 指定された商品をダウンロードします。商品情報を含む`downloadableData`オブジェクトが必要です。

## ウィッシュリスト

- `addToWishlist(productId: number, productName: string)`: 商品をウィッシュリストに追加します。
- `getWishlistItems()`: ウィッシュリスト内のすべてのアイテムを取得します。
- `clearWishlist()`: ウィッシュリストをクリアします。
- `removeFromWishlist(productId: number)`: 商品IDでウィッシュリストから商品を削除します。

## ライセンス

このプロジェクトはMITライセンスの下でライセンスされています。詳細についてはLICENSEファイルをご参照ください。