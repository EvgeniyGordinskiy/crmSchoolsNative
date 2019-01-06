import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class MainInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let url = 'http://ec2-52-14-29-229.us-east-2.compute.amazonaws.com/api/';
    if (document.location.hostname == 'localhost') {
       url = 'http://localhost:8000/api/';
    }
    req = req.clone({
      url: url + req.url
    });
    return next.handle(req);
  }
}
