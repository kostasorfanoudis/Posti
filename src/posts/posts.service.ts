import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  findAll(): Promise<Post[]> {
    return this.postsRepository.find();
  }

  findOne(id: number): Promise<Post> {
    return this.postsRepository.findOneBy({ id });
  }
  async findOneAsString(id: number): Promise<string> {
    const post = await this.findOne(id);
    if (!post) {
      return `Post with id ${id} not found.`;
    }
    return `ID: ${post.id}, Title: ${post.title}, Body: ${post.body}, Creator: ${post.creator}, Creation Date: ${post.creationDate}`;
  }
  async create(post: Partial<Post>): Promise<Post> {
    return this.postsRepository.save(post);
  }

  async update(id: number, updatedPost: Partial<Post>): Promise<Post> {
    const existingPost = await this.postsRepository.findOneBy({ id });
    if (!existingPost) {
      throw new Error(`Post with id ${id} not found.`);
    }
  
    // Merge existing post with updated values
    const postToUpdate = this.postsRepository.findOneBy({id});
    (await postToUpdate).title = updatedPost.title;
    (await postToUpdate).creator = updatedPost.creator;
    (await postToUpdate).body = updatedPost.body;
    (await postToUpdate).creationDate = updatedPost.creationDate;



  
    // Save the updated entity
    await this.postsRepository.save((await postToUpdate));
    return this.postsRepository.findOneBy({ id });
  }
  
  
  
  

  async remove(id: number): Promise<void> {
    await this.postsRepository.delete(id);
  }
}
