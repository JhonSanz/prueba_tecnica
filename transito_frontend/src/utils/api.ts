import fetchWithInterceptor from './interceptor';

abstract class AbstractHttpService {

  protected URL_API = "http://127.0.0.1:8000";
  protected URL: string | undefined;

  async get(params: any = '', token?: string): Promise<any> {
    const param = params ? `?${this.objToQueryString(params)}` : '';
    const response = await fetchWithInterceptor(`${this.URL_API + this.URL + param}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      },
      token
    )
    return response;
  }

  async post(body: any, params: any = ''): Promise<any> {
    const param = params ? `?${this.objToQueryString(params)}` : '';
    const response = await fetchWithInterceptor(`${this.URL_API + this.URL + param}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    )

    return response;
  }

  async put(id: string, body: any, params: any = ''): Promise<any> {
    const param = params ? `?${this.objToQueryString(params)}` : '';
    const response = await fetchWithInterceptor(`${this.URL_API}${this.URL}${id}/${param}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    )

    return response;
  }

  async patch(id: string, body: any, params: any = ''): Promise<any> {
    const param = params ? `?${this.objToQueryString(params)}` : '';
    const response = await fetchWithInterceptor(`${this.URL_API}${this.URL}${id}/${param}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    )

    return response;
  }

  async del(id: string, params: any = ''): Promise<any> {
    const param = params ? `?${this.objToQueryString(params)}` : '';
    const response = await fetchWithInterceptor(`${this.URL_API}${this.URL}${id}/${param}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )

    return response;
  }

  async uploadFile(file: File, params: any = ''): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);

    const param = params ? `?${this.objToQueryString(params)}` : '';
    const response = await fetchWithInterceptor(`${this.URL_API + this.URL + param}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: formData,
      }
    )

    return response;
  }

  protected objToQueryString(obj: any): string {
    const keyValuePairs: string[] = [];
    Object.keys(obj).forEach((element) => {
      keyValuePairs.push(`${encodeURIComponent(element)}=${encodeURIComponent(obj[element])}`);
    });
    return keyValuePairs.join('&');
  }
}

export default AbstractHttpService;