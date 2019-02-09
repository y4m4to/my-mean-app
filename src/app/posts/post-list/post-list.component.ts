import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from "rxjs";
import { IPost } from "../post.model";
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: IPost[] = [];
  isLoading = false;
  private postsSubscription: Subscription;

  constructor(public postsService: PostsService) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts();
    this.postsSubscription = this.postsService.getPostUpdateListener()
      .subscribe((posts: IPost[]) => {
        this.isLoading = false;
        this.posts = posts;
        console.log(posts);
        console.log(this.posts);
      });
  }

  ngOnDestroy() {
    this.postsSubscription.unsubscribe();
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }
}
