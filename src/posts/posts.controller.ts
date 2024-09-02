import { Controller, Get, Post, Body, Param, Delete, Put, Res,HttpStatus } from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post as PostEntity } from './post.entity';
import { Response } from 'express';
import { CreatePostDto } from 'src/create-post.dto';
import { join } from 'path';

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

  @Get('data')
  async getAllPostsData() {
    return this.postsService.findAll();
  }
 

  @Post('create_post')
  create(@Body() createPostDto: CreatePostDto) {
  return this.postsService.create(createPostDto);
}
  @Get('new_post')
  newPostsPage(@Res() response: Response) {
    const filePath = join(__dirname, '..', '..', 'public', 'create-post.html');
    return response.sendFile(filePath);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() post: PostEntity) {
    return this.postsService.update(+id, post);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.postsService.remove(+id);
  }
}
