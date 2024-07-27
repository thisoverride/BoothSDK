import fs from 'fs';

interface LocalWishlistItem {
  productId: number;
  productName: string;
  addedAt: Date;
}

export default class WishlistService {
  private static readonly JSON_FILE_PATH = './wishlist.json';

  private _getLocalWishlist (): LocalWishlistItem[] {
    try {
      const wishlistJson = fs.readFileSync(WishlistService.JSON_FILE_PATH, 'utf8');
      return JSON.parse(wishlistJson);
    } catch (err) {
      return [];
    }
  }

  private _saveLocalWishlist (wishlist: LocalWishlistItem[]): void {
    try {
      const wishlistJson = JSON.stringify(wishlist, null, 2);
      fs.writeFileSync(WishlistService.JSON_FILE_PATH, wishlistJson, 'utf8');
    } catch (err) {
      console.error('Error saving wishlist JSON file:', err);
    }
  }

  public addToWishlist (productId: number, productName: string): void {
    const currentWishlist = this._getLocalWishlist();
    const newItem: LocalWishlistItem = {
      productId,
      productName,
      addedAt: new Date()
    };
    currentWishlist.push(newItem);
    this._saveLocalWishlist(currentWishlist);
  }

  public getWishlistItems (): Array<{ productId: number; productName: string; }> {
    return this._getLocalWishlist().map(item => ({
      productId: item.productId,
      productName: item.productName
    }));
  }

  public clearWishlist (): void {
    this._saveLocalWishlist([]);
  }

  public removeFromWishlist (productId: number): void {
    const currentWishlist = this._getLocalWishlist();
    const updatedWishlist = currentWishlist.filter(item => item.productId !== productId);
    this._saveLocalWishlist(updatedWishlist);
  }
}
