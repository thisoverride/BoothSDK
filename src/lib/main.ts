import BoothSDK from './BoothSDK';

void (async () => {
  const boothSDK = new BoothSDK({ lang: 'en', adulteContent: true });
  boothSDK.authenticator.connect();
  const boothProduct = await boothSDK.product.getItem(5763862);
  const ddd = await boothSDK.product.download({ path: './downloads', boothProductItem: boothProduct });
  boothSDK.authenticator.connect();
})();
