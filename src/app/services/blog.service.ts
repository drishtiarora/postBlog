import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Http, Headers, RequestOptions } from '@angular/http';
import { map } from "rxjs/operators";


@Injectable({
  providedIn: 'root'
})
export class BlogService {

  options;

  constructor(private _authService: AuthService,
              private _http : Http) { }

  createAuthenticationHeaders() {
    this._authService.loadToken(); // Get token so it can be attached to headers
    // Headers configuration options
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json', // Format set to JSON
        'authorization': this._authService.authToken // Attach token
      })
    });
  }
  
  newBlog(blog){
    this.createAuthenticationHeaders();
    return this._http.post('http://localhost:3000/blogs/newBlog',blog, this.options)
    .pipe(map(data => data.json())) 
  }

  getAlllBlogs(){
    this.createAuthenticationHeaders();
    return this._http.get('http://localhost:3000/blogs/allblogs', this.options)
    .pipe(map(data => data.json())) 
  }

  getSingleBlog(id){
    this.createAuthenticationHeaders();
    return this._http.get('http://localhost:3000/blogs/singleBlog/'+ id , this.options)
    .pipe(map(data=>data.json()))
  }

  getEditBlog(blog){
    this.createAuthenticationHeaders();
    return this._http.put('http://localhost:3000/blogs/updateBlog', blog, this.options)
    .pipe(map(data=>data.json()))
  }
}
