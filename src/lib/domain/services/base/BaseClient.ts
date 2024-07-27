export default class BaseService {
  protected async performRequest<T>(requestFunction: () => Promise<T>): Promise<T> {
    try {
      const response = await requestFunction();
      return response;
    } catch (error) {
      console.error('Error in performRequest:', error);
      throw error;
    }
  }
}
