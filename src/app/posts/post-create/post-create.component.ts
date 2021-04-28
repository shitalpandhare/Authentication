import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
  enteredTitle = '';
  enteredContent = '';

  @ViewChild('f') form: NgForm;
  constructor(public postsService: PostsService) {}

  ngOnInit(): void {}

  onAddPost() {
    const post: Post = {
      id: null,
      title: this.form.value.title,
      content: this.form.value.content,
    };
    this.postsService.addPost(post);
    this.form.resetForm();
  }
}
