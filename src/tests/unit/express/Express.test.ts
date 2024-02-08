import morgan from "morgan";
import ContainerController from "../../../../adapter/controller/AuthenticationController";
import PathValidator from "../../../../framework/validator/PathValidator";
import ExpressApp from "../../../../framework/express/ExpressApp";

describe("ExpressApp class", () => {
  let expressApp: ExpressApp;

  beforeEach(() => {
    expressApp = new ExpressApp();
  });

  describe("ExpressApp constructor", () => {
    it("should have a morgan middleware", () => {
      expect(expressApp.app.use(morgan("dev"))).toBeTruthy();
    });
    it("should have a PathValidator instance", () => {
      expect(expressApp.PathValidator).toBeInstanceOf(PathValidator);
    });
    it("should have a ContainerController instance", () => {
      expect(expressApp.controller[0]).toBeInstanceOf(ContainerController);
    });
  });

  describe("ExpressApp injector function", () => {
    it("should inject the controllers into the Express application", () => {
      const controllerRoutesMock = ["@GET(/mockroute)"];

      controllerRoutesMock.forEach((controllerProperties: any) => {
        const [method, path] =expressApp.PathValidator.checkPath(controllerProperties);
        const mockController = () => {};

        switch (method) {
          case "GET":
            expect(expressApp.app.get(path, mockController)).toBeTruthy();
            break;
          case "POST":
            expect(expressApp.app.post(path, mockController)).toBeTruthy();
            break;
          case "PUT":
            expect(expressApp.app.put(path, mockController)).toBeTruthy();
            break;
          case "DELETE":
            expect(expressApp.app.delete(path, mockController)).toBeTruthy();
            break;
          default:
            break;
        }
      });
    });
  });
});
