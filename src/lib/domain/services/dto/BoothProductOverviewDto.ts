import type { BoothProductOverview } from '../../../@types/services/dto/Dto';

export default class BoothProductOverviewDto implements BoothProductOverview {
  public readonly productId: number;
  public readonly productBrand: string;
  public readonly productCategory: number;
  public readonly productName: string;
  public readonly isAdult: boolean;
  public readonly productPrice: number;
  public readonly shopName: string;
  public readonly shopURL: string;
  public readonly shopImageURL: string;
  public readonly imageURL: string;

  constructor (
    productId: number,
    productBrand: string,
    productCategory: number,
    productName: string,
    isAdult: boolean,
    productPrice: number,
    imageURL: string,
    shopName: string,
    shopURL: string,
    shopImageURL: string) {
    this.productId = productId;
    this.productBrand = productBrand;
    this.productCategory = productCategory;
    this.productName = productName;
    this.isAdult = isAdult;
    this.productPrice = productPrice;
    this.imageURL = imageURL;
    this.shopName = shopName;
    this.shopURL = shopURL;
    this.shopImageURL = shopImageURL;
  }
}
