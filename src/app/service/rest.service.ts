import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from "@angular/common/http";
import { BehaviorSubject, Observable, of } from "rxjs";
import { environment } from "../../environments/environment";
import { throwError } from "rxjs";
import { map, catchError, tap, retryWhen } from "rxjs/operators";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class RestService {
  localItem: any;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
  }

  // Set localstorage for user login
  setSessionStorage(value: any) {
    this.localItem = value;
    localStorage.setItem('DfsUser', value);
  }

  getSessionStorage() {
    return localStorage.getItem('DfsUser');
  }

  // refrshToken(expiredToken: any) {
  //   return this.post(`refresh`, '', expiredToken);
  // }

  refrshToken(expiredToken: any) {
    this.post('refresh', {}, expiredToken).subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          console.log(res.data.token, "res.data.token");
          // return res.data.token;
        }
      },
      error: error => {
        console.log("error", error.message);
      }
    });
  }

  // API call for get service and packages data
  get(url: any, token: any) {
    const headers = new HttpHeaders().set("Authorization", "Bearer " + token);
    return this.http
      .get(environment.APiURL + url, {
        headers: headers
      })
      .pipe(catchError(this.handleError.bind(this)));
  }

  getWithoutToken(url: any) {
    return this.http
      .get(environment.APiURL + url)
      .pipe(catchError(this.handleError.bind(this)));
  }

  post(url: any, data: any, token: any) {
    const headers = new HttpHeaders().set("Authorization", "Bearer " + token).set("Access-Control-Allow-Headers", "Access-Control-Allow-Headers");
    return this.http
      .post(environment.APiURL + url, data, {
        headers: headers
      })
      .pipe(catchError(this.handleError.bind(this)));
  }

  put(url: any, data: any, token: any) {
    const headers = new HttpHeaders().set("Authorization", "Bearer " + token);
    return this.http
      .put(environment.APiURL + url, data, {
        headers: headers
      })
      .pipe(catchError(this.handleError.bind(this)));
  }

  patch(url: any, data: any, token: any) {
    const headers = new HttpHeaders().set("Authorization", "Bearer " + token);
    return this.http
      .patch(environment.APiURL + url, data, {
        headers: headers
      })
      .pipe(catchError(this.handleError.bind(this)));
  }

  delete(url: any, token: any) {
    const headers = new HttpHeaders().set("Authorization", "Bearer " + token);
    return this.http
      .delete(environment.APiURL + url)
      .pipe(catchError(this.handleError.bind(this)));
  }

  private handleError(error: HttpErrorResponse) {
    console.log(error.error, "dsds")
    if (error.error instanceof ErrorEvent) {
      console.error("An error occurred:", error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
      if (error.status == 401) {
        sessionStorage.clear();
        localStorage.clear();
        this.router.navigate(["login"]);
      //   var oldToken = JSON.parse(localStorage.getItem('DfsUser') || '');
      //   console.log(oldToken.token);
      //   // console.log(oldToken, "oldToken oldToken oldToken oldToken oldToken")
      //   this.refrshToken(oldToken.token);
      }
    }

    return throwError(error.error);
  }

}
