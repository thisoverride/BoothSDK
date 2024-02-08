import HttpStatusCodes from "../external/HttpStatusCodes";
import { HttpResponse } from "../../@types/ControllerInterface";
import * as cheerio from "cheerio";
import { ProductService } from "../../@types/service/ProductService";
import axios, { AxiosInstance } from "axios";


export default class ProductServiceImpl extends HttpStatusCodes implements ProductService {
  public dd: AxiosInstance;
    constructor (t:AxiosInstance){
      super()
    this.dd = t
    }

  private readonly SERACH_URL_FREE = 'https://booth.pm/en/items?max_price=0&sort=new';
    public async getItems(): Promise<HttpResponse> {
      try {
        const response = await axios.get(this.SERACH_URL_FREE);
        const $ = cheerio.load(response.data);
    
        const titles = $('.item-card__title').map((_index, element) => $(element).text().trim()).get();
        const categories = $('.item-card__category-anchor').map((_index, element) => $(element).text().trim()).get();
    
        const linksAndOriginalsArray = $('.item-card__thumbnail').map((_index, element) => {
          const link = $(element).find('a').attr('href') || null;
          const original = $(element).find('a').attr('data-original') || null;
          return { link, original };
        }).get();
    
        const data = titles.map((title, index) => ({
          title,
          category: categories[index],
          ...linksAndOriginalsArray[index]
        }));
    
        return { message: data, status: this.OK };
      } catch (error) {
        console.error(error);
        return this.handleError(error);
      }
    }

    public async extractItemDetail(itemID: string): Promise<HttpResponse> {
      try {
        if (!itemID) {
          throw new Error('Item ID is not provided.');
        }
  
        const response = await this.dd.get(`/items/${itemID}`);
        // const response = await axios.get(`https://booth.pm/en/items/${itemID}`);
  
        if (response.status !== 200) {
          throw new Error(`HTTP request failed with status code: ${response.status}`);
        }

        const $ = cheerio.load(response.data);
        const detailsContent = $('.autolink').text().trim();
    
        const buttons = $('.cart-button-wrap a.btn.add-cart.full-length').map((_index, element) => {
          const title = $(element).attr('title');
          const href = $(element).attr('href');
          return { title, href };
        }).get();
    
      
        const mainImage = $('.market-item-detail-item-image').attr('data-origin');
        const thumbnails = $('.slick-thumbnail-border img').map((_index, element) => {
          const src = $(element).attr('src');
          return { src };
        }).get();
    

        if (!detailsContent && buttons.length === 0 && !mainImage && thumbnails.length === 0) {
          const ageVerification = $('#age-confirmation').text().trim()
          if(ageVerification){
            throw new Error('Items required age confirmation');
          }else{
            throw new Error('Item details could not be extracted successfully.');
          }
        }
    

        return { message: {
          detailsContent,
          buttons,
          mainImage,
          thumbnails,
        }, status: this.OK };
      } catch (error: any) {
        console.error('Error while extracting item details:', error.message);
        return this.handleError(error);
      }
    }

    public async searchProduct(qurey: string): Promise<HttpResponse> {
      try {
        if (!qurey) {
          throw new Error('Item ID is not provided.');
        }
  
        const response = await axios.get(`https://booth.pm/en/search/${encodeURIComponent(qurey)}?max_price=0&sort=new`);
  
        if (response.status !== 200) {
          throw new Error(`HTTP request failed with status code: ${response.status}`);
        }
    
 

        return { message: response.data, status: this.OK };
      } catch (error: any) {
        console.error('Error while extracting item details:', error.message);
        return this.handleError(error);
      }
    }
    
  
  private handleError(error: any) {
    return { message: error.message, status: error.status || this.INTERNAL_SERVER_ERROR };
  }
}
