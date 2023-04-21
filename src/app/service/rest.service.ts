import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from "@angular/common/http";
import { BehaviorSubject, Observable, of } from "rxjs";
import { environment } from "../../environments/environment";
import { throwError } from "rxjs";
import { map, catchError, tap } from "rxjs/operators";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class RestService {
  localItem: any;

  constructor(
    private http: HttpClient
  ) {
}

// Set localstorage for user login
setSessionStorage(value: any) {
  this.localItem = value;
  // sessionStorage.setItem('htseaFoodUser', value);
  localStorage.setItem('htseaFoodUser', value);
}

getSessionStorage() {
  // return sessionStorage.getItem('htseaFoodUser');
  return localStorage.getItem('htseaFoodUser');
}

// API call for get service and packages data
get(url: any, token: any) {
  const headers = new HttpHeaders().set("Auth", token);
  return this.http
    .get(environment.APiURL + url, {
      headers: headers
    })
    .pipe(catchError(this.handleError));
}

getWithoutToken(url: any) {
  return this.http
    .get(environment.APiURL + url)
    .pipe(catchError(this.handleError));
}

post(url: any, data: any, token: any) {
  const headers = new HttpHeaders().set("Auth", token).set("Access-Control-Allow-Headers","Access-Control-Allow-Headers");
  return this.http
    .post(environment.APiURL + url, data, {
      headers: headers
    })
    .pipe(catchError(this.handleError));
}

put(url: any, data: any, token: any) {
  const headers = new HttpHeaders().set("Auth", token);
  return this.http
    .put(environment.APiURL + url, data, {
      headers: headers
    })
    .pipe(catchError(this.handleError));
}

patch(url: any, data: any, token: any) {
  const headers = new HttpHeaders().set("Auth", token);
  return this.http
    .patch(environment.APiURL + url, data, {
      headers: headers
    })
    .pipe(catchError(this.handleError));
}

delete (url: any, token: any) {
  const headers = new HttpHeaders().set("Auth", token);
  return this.http
    .delete(environment.APiURL + url)
    .pipe(catchError(this.handleError));
}

  private handleError(error: HttpErrorResponse) {
  if (error.error instanceof ErrorEvent) {
    console.error("An error occurred:", error.error.message);
  } else {
    console.error(
      `Backend returned code ${error.status}, ` + `body was: ${error.error}`
    );
  }

  return throwError(error.error);
}
}
