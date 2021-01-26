import { IData } from "./Data";

export class PromiseAPI {
  private _http<T>(request: RequestInfo): Promise<T> {
    return fetch(request)
      .then((response) => {
        return response.json();
      })
      .catch((e) => {
        console.log(e);
      });
  }

  private _get<T>(
    path: string,
    args: RequestInit = { method: "get" }
  ): Promise<T> {
    return this._http<T>(new Request(path, args));
  }

  // TODO uncomment these functions when we add api calls with post and put
  /* private _put<T>( path: string,  body: any,  args: RequestInit = { method: "put", body: JSON.stringify(body) }): Promise<T> {
            return this._http<T>(new Request(path, args));
        }; */

  /* private _post<T>( path: string, body: any, args: RequestInit = { method: "post", body: JSON.stringify(body) }): Promise<T>  {
  return this._http<T>(new Request(path, args));
} */

  public Example(): Promise<IData> {
    return this._get("http://www.example.com/example");
  }
}
