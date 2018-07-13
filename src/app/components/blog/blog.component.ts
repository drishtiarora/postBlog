import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup,FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { BlogService } from '../../services/blog.service';


@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  messageClass;
  message;
  newPost = false;  
  loadingBlogs =false;
  form;
  username;
  processing = false;
  blogPosts;

  constructor(private formBuilder: FormBuilder,
              private _authService: AuthService,
              private _blogService : BlogService)
         {
    this.createNewBlogForm();
   }

  ngOnInit() {
    this._authService.getProfile().subscribe(profile =>{
      this.username = profile.user.username;
    })
    this.getAllBlogs(); 
    // console.log(this.getAllBlogs());
  }

  createNewBlogForm(){
    this.form = this.formBuilder.group({
      title : ['', Validators.compose([
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(5),
        this.alphanumericValidation
      ])],
      body : ['' , Validators.compose([
        Validators.required,
        Validators.maxLength(100),
        Validators.minLength(20)
      ])]
    });
  }

  alphanumericValidation(controls){

    const regex = new RegExp(/[^a-zA-z0-9]+$/);
      if(regex.test(controls.value)){
        return null;
      }
      else{
        return {'alphanumericValidation' : true}
      }


  }

  newBlogForm(){
    this.newPost = true;
  }

  onBlogSubmit(){
    this.processing = true;

    const blog = {
      title : this.form.get('title').value,
      body : this.form.get('body').value,
      createdBy: this.username
    }

    console.log("Blog object");

    this._blogService.newBlog(blog).subscribe((data=>{
      console.log("data from server",data);
      if(!data.success){
        this.messageClass = 'alert alert-danger';
        this.message = data.msg;
        this.processing = false;
      }
      else{
        this.messageClass = 'alert alert-success';
        this.message = data.msg;
        this.getAllBlogs();

        setTimeout(()=>{
          this.newPost = false;
          this.processing=false;
          this.message=false;
          this.form.reset();
        },2000);
      }
    }))
  }

  reloadBlogs(){
    this.loadingBlogs = true;
    //to retrieve all blogs
    this.getAllBlogs();

    setTimeout(()=>{
      this.loadingBlogs = false;
    },4000);
  }

  getAllBlogs(){
    this._blogService.getAlllBlogs().subscribe(data=>{
       console.log(data);
      this.blogPosts = data.msg;
    })
  }

  goBack(){
    window.location.reload()
  }

  draftComment(){
    
  }

}
