import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  apiUrlSingle = "http://localhost:3030/data-single";
  apiUrlTwo = "http://localhost:3030/data-two";
  constructor(private httpClient: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders ({
      'Content-Type': 'application/json'
    })
  }
  sendPostRequestSingle(data: Object): Observable<Object> {
    return this.httpClient.post(this.apiUrlSingle, data, this.httpOptions);
  }
  sendPostRequestTwo(data: Object): Observable<Object> {
    return this.httpClient.post(this.apiUrlTwo, data, this.httpOptions);
  }
}
