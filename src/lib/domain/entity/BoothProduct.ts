export default class BoothProduct {
  private readonly productId: number;
  private readonly productBrand: string;
  private readonly productCategory: number;
  private readonly productName: string;
  private readonly productPrice: number;
  private readonly imageURL: string;
  private readonly shopName: string;
  private readonly shopURL: string;
  private readonly shopImageURL: string;

  constructor (
    productId: number,
    productBrand: string,
    productCategory: number,
    productName: string,
    productPrice: number,
    imageURL: string,
    shopName: string,
    shopURL: string,
    shopImageURL: string
  ) {
    this.productId = productId;
    this.productBrand = productBrand;
    this.productCategory = productCategory;
    this.productName = productName;
    this.productPrice = productPrice;
    this.imageURL = imageURL;
    this.shopName = shopName;
    this.shopURL = shopURL;
    this.shopImageURL = shopImageURL;
  }
}
