import { Controller, Get,Req,Post,Redirect,Body,Query,Put,Delete,Param, UseGuards} from '@nestjs/common';
import { AppService } from './app.service';
import { CreatePostDto } from './create-post.dto';
import { AuthGuard } from './guards/auth.guard';


@UseGuards(AuthGuard)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

@Get()
index() {
  return `Home Page`;
}


@Post()
async create(@Body() createPostDto: CreatePostDto) {
  return 'This action adds a new cat';
}

@Get('all-posts')
  findAll() {
    return `This action returns all posts`;
  }

 
  @Get('posts/:title')
  findOne(@Param('title') title: string) {
    return `This action returns a ${title} cat`;
  }

  @Put(':title')
  update(@Param('title') id: string, @Body() updateCatDto: CreatePostDto) {
    return `This action updates a ${id} cat`;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `This action removes a ${id} cat`;
  }
}
