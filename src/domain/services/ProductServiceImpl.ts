import HttpStatusCodes from "../external/HttpStatusCodes";
import { HttpResponse } from "../../@types/ControllerInterface";
import * as cheerio from "cheerio";
import { ProductService } from "../../@types/service/ProductService";
import axios, { AxiosInstance } from "axios";
import ProductEntity from "../entity/ProductEntity";


export default class ProductServiceImpl extends HttpStatusCodes {
  public axios: AxiosInstance;
    constructor (axios :AxiosInstance){
      super()
    this.axios = axios;
    }

    public async getItems(page: number): Promise<HttpResponse> {
      try {
        const response = await this.axios.get(`/items?page=${page}&sort=new`);
        const $ = cheerio.load(response.data);
    
        const elements = $('.l-cards-5cols li[data-product-id]');
        let totalArticle: string = $('.container b').text();
        let totalPage: number = 0;
    
        if (totalArticle && totalArticle.trim() !== '') {
          totalArticle = totalArticle.replace(/\D/g, '');
          totalPage = Math.ceil(Number(totalArticle) / 60); 
        }
    
        const itemsData: ProductEntity[] = [];
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
    
          itemsData.push(new ProductEntity(
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
    
        return { 
          message: {
            count: totalPage,
            current: page, 
            items: itemsData 
          }, 
          status: this.OK 
        };
      } catch (error: any) {
        console.error('Error while extracting item details:', error.message);
        return this.handleError(error);
      }
    }
    
    public async getItem(id: number): Promise<HttpResponse> {
      try {
        const response = await this.axios.get(`/items/${id}`);
        const $: cheerio.CheerioAPI = cheerio.load(response.data);
        const ageVerification = $('#age-confirmation .u-tpg-title1.u-m-0').text();

        if(ageVerification){
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

        return { message: itemsData, status: this.OK };
      } catch (error: any) {
        return this.handleError(error);
      }
    }


    public async searchProduct(qurey: string | null): Promise<HttpResponse> {
      try {
        if (!qurey) {
          throw new Error('Item ID is not provided.');
        }

        const response = await this.axios.get(`/search/${encodeURIComponent(qurey)}`);
        const $ = cheerio.load(response.data);
    
        const elements = $('.l-cards-5cols li[data-product-id]');
        let totalArticle: string = $('.container b').text();
        let totalPage : number = 0;
        let totalProductCount: number = 0;
    
        if (totalArticle && totalArticle.trim() !== '') {
          totalProductCount = Number(totalArticle.replace(/\D/g, ''));
          totalPage = Math.ceil(Number(totalProductCount) / 60); 
        }
    
        const itemsData: ProductEntity[] = [];
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
    
          itemsData.push(new ProductEntity(
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
    
        return { 
          message: {
            count: totalProductCount,
            totalPage: totalPage,
            items: itemsData 
          }, 
          status: this.OK 
        };
      } catch (error: any) {
        console.error('Error while extracting item details:', error.message);
        return this.handleError(error);
      }
    }
    
  
  private handleError(error: any) {
    return { message: error.message, status: error.status || this.INTERNAL_SERVER_ERROR };
  }
}
