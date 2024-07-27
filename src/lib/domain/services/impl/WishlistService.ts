import fs from 'fs';

interface LocalWishlistItem {
  productId: number;
  productName: string;
  addedAt: Date;
}

export default class WishlistService {
  private static readonly JSON_FILE_PATH = './wishlist.json';

  private getLocalWishlist (): LocalWishlistItem[] {
    try {
      const wishlistJson = fs.readFileSync(WishlistService.JSON_FILE_PATH, 'utf8');
      return JSON.parse(wishlistJson);
    } catch (err) {
      // En cas d'erreur (fichier inexistant ou JSON invalide), retourner un tableau vide
      console.error('Error reading wishlist JSON file:', err);
      return [];
    }
  }

  private saveLocalWishlist (wishlist: LocalWishlistItem[]): void {
    try {
      const wishlistJson = JSON.stringify(wishlist, null, 2);
      fs.writeFileSync(WishlistService.JSON_FILE_PATH, wishlistJson, 'utf8');
    } catch (err) {
      console.error('Error saving wishlist JSON file:', err);
    }
  }

  public addToWishlist (productId: number, productName: string): void {
    const currentWishlist = this.getLocalWishlist();
    const newItem: LocalWishlistItem = {
      productId,
      productName,
      addedAt: new Date()
    };
    currentWishlist.push(newItem);
    this.saveLocalWishlist(currentWishlist);
  }

  public getWishlistItems (): Array<{ productId: number; productName: string; }> {
    return this.getLocalWishlist().map(item => ({
      productId: item.productId,
      productName: item.productName
    }));
  }

  public clearWishlist (): void {
    this.saveLocalWishlist([]);
  }
}
