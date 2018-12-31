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
  private postsSubscription: Subscription;

  constructor(public postsService: PostsService) {
  }

  ngOnInit() {
    this.postsService.getPosts();
    this.postsSubscription = this.postsService.getPostUpdateListener()
      .subscribe((posts: IPost[]) => {
        this.posts = posts;
      });
  }

  ngOnDestroy() {
    this.postsSubscription.unsubscribe();
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }
}
