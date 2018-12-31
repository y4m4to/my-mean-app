import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";

import { IPost } from "./post.model";
import { pipe } from '@angular/core/src/render3';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: IPost[] = [];
  private postsUpdated = new Subject<IPost[]>();

  constructor(private http: HttpClient) {}

  getPosts() {
    this.http
      .get<{ message: string, posts: any }>('http://localhost:3000/api/posts')
      .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.title,
            id: post._id
          }
        })
      }))
      .subscribe(transformedPosts => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: IPost = { id: null, title: title, content: content };
    this.http
    .post<{ message: string, postId: string }>(
      'http://localhost:3000/api/posts',
      post
    )
    .subscribe((responseData) => {
      const postId = responseData.postId;
      post.id = postId;
      this.posts.push(post);
      this.postsUpdated.next([...this.posts]);
    });
  }

  deletePost(postId: string) {
    this.http.delete('http://localhost:3000/api/posts/' + postId)
      .subscribe(() => {
        const postUpdated = this.posts.filter(post => post.id !== postId);
        this.posts = postUpdated;
        this.postsUpdated.next([...this.posts]);
      });
  }
}
