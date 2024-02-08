import ExpressApp from './framework/express/ExpressApp';

void (async () => {
  // const port: number = 8001;
  const expressApp = new ExpressApp();
  await expressApp.startEngine(8001);
})();
