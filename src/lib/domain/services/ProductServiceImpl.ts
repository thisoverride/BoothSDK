import * as cheerio from 'cheerio';
import type { AxiosInstance } from 'axios';
import BoothProduct from '../entity/BoothProduct';
import fs from 'fs';

interface ProductEndpoints {
  search: string;
  listItems: string;
  getById: string;
};

// interface BoothProductI {
//   productId: number;
//   productBrand: string;
//   productCategory: number;
//   productName: string;
//   productPrice: number;
//   imageURL: string;
//   shopName: string;
//   shopURL: string;
//   shopImageURL: string;
// }
interface BoothProductItem {
  id: number;
  title: string;
  detail: string;
  images: string[];
  sellerName: string;
  sellerPic: string;
  downloadLinks: downloadDataInfo[];
}
interface Downloadable {
  path?: string;
  boothProductItem: BoothProductItem;
}

interface downloadDataInfo {
  itemTitle: string;
  itemLink: string;
}

interface CollectionBoothProduct {
  count: number;
  items: BoothProduct[];
}

export default class ProductServiceImpl {
  private static PATH_PRODUCT: ProductEndpoints;
  private readonly axios: AxiosInstance;

  constructor (bootConfigPaths: ProductEndpoints, axios: AxiosInstance) {
    ProductServiceImpl.PATH_PRODUCT = bootConfigPaths;
    this.axios = axios;
  }

  public async getItems (page: number): Promise<any> {
    const response = await this.axios.get(
      ProductServiceImpl.PATH_PRODUCT.listItems + page + '&sort=new');
    const collectionBoothProduct: CollectionBoothProduct = this._extractProducts(response.data);

    return collectionBoothProduct;
  }

  public async getItem (id: number): Promise<any> {
    try {
      const response = await this.axios.get(ProductServiceImpl.PATH_PRODUCT.getById + id);
      const $: cheerio.CheerioAPI = cheerio.load(response.data);
      const ageVerification = $('#age-confirmation .u-tpg-title1.u-m-0').text();

      if (ageVerification) {
        throw new Error('Adulte Content is not enabled');
      }

      const header = $('header.shop__text');
      const articleTitle = header.find('.font-bold').text().trim();
      const sellerName = header.find('a').text().trim();
      const sellerPic = header.find('img').attr('src');

      const downloadLinks: any[] = [];
      $('.cart-button-wrap a').each((_, link) => {
        const itemTitle = $(link).attr('title');
        const itemLink = $(link).attr('href');
        if (itemLink) {
          downloadLinks.push({ itemTitle, itemLink });
        }
      });

      const description = $('.container')
        .find('.js-market-item-detail-description.description p')
        .text()
        .trim()
        .replace(/\n/g, '');

      const images: string[] = [];
      $('img[data-origin]').each((_, element) => {
        const dataOrigin = $(element).attr('data-origin');
        if (dataOrigin) {
          images.push(dataOrigin);
        }
      });

      const itemsData = {
        id: id,
        title: articleTitle,
        detail: description,
        images: images,
        sellerName: sellerName,
        sellerPic: sellerPic,
        downloadLinks: downloadLinks
      };
      return itemsData;
    } catch (error: any) {
      console.log(error);
    }
  }

  public async searchProduct (qurey: string | null): Promise<any> {
    if (!qurey) {
      throw new Error('Item ID is not provided.');
    }
    const response = await this.axios.get(
      ProductServiceImpl.PATH_PRODUCT.search + encodeURIComponent(qurey) + '?&sort=new');
    const collectionBoothProduct: CollectionBoothProduct = this._extractProducts(response.data);

    return collectionBoothProduct;
  }

  private _extractProducts (html: any): CollectionBoothProduct {
    const $ = cheerio.load(html as string);

    const ageVerification = $('#age-confirmation .u-tpg-title1.u-m-0').text();
    if (ageVerification) {
      throw new Error('Adulte Content is not enabled');
    }

    const elements = $('.l-cards-5cols li[data-product-id]');
    let totalArticle: string = $('.container b').text();
    let totalPage: number = 0;

    if (totalArticle && totalArticle.trim() !== '') {
      totalArticle = totalArticle.replace(/\D/g, '');
      totalPage = Math.ceil(Number(totalArticle) / 60);
    }

    const itemsData: BoothProduct[] = [];
    elements.each((index, element) => {
      const productId = $(element).attr('data-product-id');
      const productBrand = $(element).attr('data-product-brand');
      const productCategory = $(element).attr('data-product-category');
      const productName = $(element).find('.item-card__title-anchor--multiline').text().trim();
      const productPrice = $(element).attr('data-product-price');
      const imageURL = $(element).find('.js-thumbnail-image').attr('data-original');
      const shopName = $(element).find('.item-card__shop-info .item-card__shop-name').text().trim();
      const shopURL = $(element).find('.item-card__shop-info .item-card__shop-name-anchor').attr('href');
      const shopImageURL = $(element).find('.item-card__shop-info .user-avatar').attr('src');

      itemsData.push(new BoothProduct(
        Number(productId),
        productBrand ?? '',
        Number(productCategory),
        productName,
        Number(productPrice),
        imageURL ?? '',
        shopName,
        shopURL ?? '',
        shopImageURL ?? ''
      ));
    });

    const collectionBoothProduct: CollectionBoothProduct = {
      count: totalPage,
      items: itemsData
    };

    return collectionBoothProduct;
  }

  public async downloadProduct (downloadable: Downloadable): Promise<any> {
    const downloadLinks = downloadable.boothProductItem.downloadLinks;

    for (const linkInfo of downloadLinks) {
      const rs = await this.axios.get(linkInfo.itemLink, { responseType: 'stream' });

      const file = fs.createWriteStream(`${downloadable.path}/${linkInfo.itemTitle}`);
      rs.data.pipe(file);

      file.on('finish', () => {
        console.log('Fichier téléchargé avec succès.');
      });

      file.on('error', (error) => {
        console.error('Erreur lors du téléchargement du fichier:', error);
      });
    }
  }
}
