import * as cheerio from 'cheerio';
import type { AxiosInstance, AxiosResponse } from 'axios';
import BoothProduct from '../entity/BoothProduct';
import fs from 'fs';
import type {
  BoothProductItem,
  CollectionBoothProduct,
  DownloadDataInfo,
  DownloadStats,
  Downloadable,
  ProductEndpoints,
  ProductService
} from '../../@types/services/ProductService';

export default class ProductServiceImpl implements ProductService {
  private static PATH_PRODUCT: ProductEndpoints;
  private readonly axios: AxiosInstance;

  constructor (bootConfigPaths: ProductEndpoints, axios: AxiosInstance) {
    ProductServiceImpl.PATH_PRODUCT = bootConfigPaths;
    this.axios = axios;
  }

  public async getListItems (page: number): Promise<CollectionBoothProduct> {
    const response = await this.axios.get(
      ProductServiceImpl.PATH_PRODUCT.listItems + page + '&sort=new'
    );
    const collectionBoothProduct: CollectionBoothProduct =
      this._extractProducts(response.data);
    return collectionBoothProduct;
  }

  public async getItem (articleId: number): Promise<BoothProductItem | null> {
    try {
      if (!Number(articleId)) {
        throw new Error('Article id is not a number');
      }
      const response: AxiosResponse<any, any> = await this.axios.get(
        ProductServiceImpl.PATH_PRODUCT.getById + articleId
      );
      const html = response.data as string;
      const $: cheerio.CheerioAPI = cheerio.load(html);
      const ageVerification: string = $(
        '#age-confirmation .u-tpg-title1.u-m-0'
      ).text();

      if (ageVerification) {
        throw new Error('Adulte Content is not enabled');
      }

      const header: cheerio.Cheerio<cheerio.Element> = $('header.shop__text');
      const articleTitle: string = header.find('.font-bold').text().trim();
      const sellerUsername: string = header.find('a').text().trim();
      const sellerPic: string = header.find('img').attr('src') ?? '';

      const articleDownloadLinks: any[] = [];
      $('.cart-button-wrap a').each((_, link) => {
        const itemTitle = $(link).attr('title');
        const itemLink = $(link).attr('href');
        if (itemLink) {
          articleDownloadLinks.push({ itemTitle, itemLink });
        }
      });

      const description: string = $('.container')
        .find('.js-market-item-detail-description.description p')
        .text()
        .trim()
        .replace(/\n/g, '');

      const articleImages: string[] = [];
      $('img[data-origin]').each((_, element) => {
        const dataOrigin = $(element).attr('data-origin');
        if (dataOrigin) {
          articleImages.push(dataOrigin);
        }
      });

      const itemsData: BoothProductItem = {
        id: articleId,
        title: articleTitle,
        detail: description,
        images: articleImages,
        sellerName: sellerUsername,
        sellerPic: sellerPic ?? '',
        downloadLinks: articleDownloadLinks
      };
      return itemsData;
    } catch (error: any) {
      if (error.code === 'ERR_BAD_REQUEST') {
        return null;
      } else {
        throw new Error(`Error: ${error.message}`);
      }
    }
  }

  public async find (qurey: string | null): Promise<any> {
    if (!qurey) {
      throw new Error('Item ID is not provided.');
    }
    const response = await this.axios.get(
      ProductServiceImpl.PATH_PRODUCT.search +
        encodeURIComponent(qurey) +
        '?&sort=new'
    );
    const collectionBoothProduct: CollectionBoothProduct =
      this._extractProducts(response.data);

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
    elements.each((_index, element) => {
      const productId = $(element).attr('data-product-id');
      const productBrand = $(element).attr('data-product-brand');
      const productCategory = $(element).attr('data-product-category');
      const productName = $(element)
        .find('.item-card__title-anchor--multiline')
        .text()
        .trim();
      const productPrice = $(element).attr('data-product-price');
      const imageURL = $(element)
        .find('.js-thumbnail-image')
        .attr('data-original');
      const shopName = $(element)
        .find('.item-card__shop-info .item-card__shop-name')
        .text()
        .trim();
      const shopURL = $(element)
        .find('.item-card__shop-info .item-card__shop-name-anchor')
        .attr('href');
      const shopImageURL = $(element)
        .find('.item-card__shop-info .user-avatar')
        .attr('src');

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

  public async download (downloadable: Downloadable): Promise<DownloadStats> {
    const downloadLinks: DownloadDataInfo[] =
    downloadable.boothProductItem.downloadLinks;
    let successfulDownloads = 0;
    let failedDownloads = 0;
    for (const linkInfo of downloadLinks) {
      try {
        const rs = await this.axios.get(linkInfo.itemLink, {
          responseType: 'stream'
        });
        const file: fs.WriteStream = fs.createWriteStream(
          `${downloadable.path}/${linkInfo.itemTitle}`
        );
        rs.data.pipe(file);
        await new Promise<void>((resolve, reject) => {
          file.on('finish', () => {
            successfulDownloads++;
            resolve();
          });
          file.on('error', (error) => {
            failedDownloads++;
            reject(error);
          });
        });
      } catch (e) {
        failedDownloads++;
      }
    }
    return { successfulDownloads, failedDownloads };
  }
}
