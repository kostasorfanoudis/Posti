import { Controller, Get, Post, Body, Param, Delete, Put, Res,HttpStatus, Patch, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post  as PostEntity} from './post.entity';
import { Response } from 'express';
import { CreatePostDto } from 'src/dtos/create-post.dto';
import { join } from 'path';
import { UpdatePostDto } from 'src/dtos/updatePost.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('home')
  goHome(@Res() response: Response){
    const filePath = join(__dirname, '..', '..', 'public', 'home.html');
    return response.sendFile(filePath);
  }

  @Get('all')
  getAllPostsPage(@Res() response: Response) {
    const filePath = join(__dirname, '..', '..', 'public', 'all-posts.html');
    return response.sendFile(filePath);
  }

  @Get(':userId/data')
  async getAllPostsData(@Param('userId') userId: number) {
    return this.postsService.findAll(userId);
  }
 

  @Post(':username/create_post')
  createPost(
    @Param('username') username: string,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postsService.createPost(username, createPostDto);
  }
  
  @Patch(':username/:postId')
  async updatePost(
    @Param('postId') postId: number,
    @Body() updatePostDto: UpdatePostDto,
    @Param('username') username: string ): Promise<PostEntity> {
    return this.postsService.update(postId, username, updatePostDto);
  }

  @Delete(':username/:id')
  remove(@Param('username') username: string,@Param('id') id: number) {
    return this.postsService.remove(username,+id);
  }

  @Get(':username')
  async getUserPosts(@Param('username') username: string, @Res() res: Response) {
    try {
      const posts = await this.postsService.findPostsByUsername(username);
      return res.status(200).json(posts);
    } catch (error) {
      console.error('Error fetching user posts:', error);
      return res.status(500).json({ message: 'Failed to fetch user posts' });
    }
  }
}
