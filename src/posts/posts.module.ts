import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post } from './post.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),  // Add Post entity
    UserModule,                        // Import UserModule here
  ],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}


