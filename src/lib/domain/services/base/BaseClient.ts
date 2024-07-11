export default class BaseService {
  protected async performRequest (requestFunction: () => Promise<any>): Promise<any> {
    try {
      const response = await requestFunction();
      return response;
    } catch (error) {
      console.error('Error in performRequest:', error);
      throw error;
    }
  }
}
