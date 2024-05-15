import BoothSDK from './lib/BoothSDK';

void (async () => {
  const boothSDK = new BoothSDK({ lang: 'en', adulteContent: true });
  boothSDK.authenticator.connect();

  const respose = await boothSDK.product.getItem(3787377);
  await boothSDK.product.download({ path: './downloads', boothProductItem: respose });
})();
