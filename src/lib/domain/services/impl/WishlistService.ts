interface LocalWishlistItem {
  productId: number;
  productName: string;
  addedAt: Date;
}

export default class WishlistService {
  private _saveLocalWishlist (wishlist: LocalWishlistItem[]): void {
  }

  public addToWishlist (productId: number, productName: string): void {

  }

  public getItems (): void {
  }

  public clearWishlist (): void {
    this._saveLocalWishlist([]);
  }

  public removeFromWishlist (productId: number): void {}
}
