import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { CreatePostDto } from 'src/dtos/create-post.dto';
import { User } from 'src/user/user.entity';
import { UpdatePostDto } from 'src/dtos/updatePost.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,

    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  async findAll(userId: number): Promise<Post[]> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    
    return this.postsRepository.find({ where: { user: { id: userId } } });
  }

  findOne(id: number): Promise<Post> {
    return this.postsRepository.findOneBy({ id });
  }

  async createPost(username: string, createPostDto: CreatePostDto): Promise<Post> {
    const user = await this.usersRepository.findOne({ where: { username:username } });
    if (!user) {
      throw new Error('User not found');
    }

    const post = this.postsRepository.create({
      ...createPostDto,
      user, 
    });

    return this.postsRepository.save(post);
  }

  async update(postId: number, username: string, updatePostDto: UpdatePostDto): Promise<Post> {
    const existingPost = await this.postsRepository.findOne({ where: { id: postId }, relations: ['user'] });
    if (!existingPost) {
      throw new NotFoundException(`Post with ID ${postId} not found.`);
    }
  
    
    if (existingPost.user.username !== username) {
      throw new ForbiddenException(`User ${username} is not authorized to update this post.`);
    }
  
    existingPost.body = updatePostDto.body;
    existingPost.title = updatePostDto.title;
  
  
    return this.postsRepository.save(existingPost);
  }
  async remove(username: string, id: number): Promise<void> {
    
    const post = await this.postsRepository.findOne({ where: { id }, relations: ['user'] });  
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found.`);
    }
    if (post.user.username !== username) {
      throw new ForbiddenException(`User ${username} is not authorized to delete this post.`);
    }
    await this.postsRepository.delete(id);
  }

  async findPostsByUsername(username: string): Promise<Post[]> {
    const user = await this.usersRepository.findOne({ where: { username } });
    if (!user) {
      throw new Error('User not found');
    }
    
    return this.postsRepository.find({ where: { user: { id: user.id } } });
  }
}
