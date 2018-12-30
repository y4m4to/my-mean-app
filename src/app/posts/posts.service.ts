import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";

import { IPost } from "./post.model";

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: IPost[] = [];
  private postsUpdated = new Subject<IPost[]>();

  constructor(private http: HttpClient) {}

  getPosts() {
    this.http
      .get<{ message: string, posts: IPost[] }>(
        'http://localhost:3000/api/posts'
      )
      .subscribe(postData => {
        this.posts = postData.posts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: IPost = { id: null, title: title, content: content };
    this.posts.push(post);
    this.postsUpdated.next([...this.posts]);
  }
}
