export default class BoothProductOverviewDto {
  private readonly productId: number;
  private readonly productBrand: string;
  private readonly productCategory: number;
  private readonly productName: string;
  private readonly productPrice: number;
  private readonly imageURL: string | undefined;
  private readonly shopName: string;
  private readonly shopURL: string | undefined;
  private readonly shopImageURL: string | undefined;

  constructor (
    productId: number,
    productBrand: string,
    productCategory: number,
    productName: string,
    productPrice: number,
    imageURL: string | undefined,
    shopName: string,
    shopURL: string | undefined,
    shopImageURL: string | undefined
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
