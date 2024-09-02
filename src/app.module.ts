import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModule } from 'src/posts/posts.module';
import { Post } from 'src/posts/post.entity';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'kostara1998', // Replace with your actual password
      database: 'posts',
      entities: [Post, User],  // Combine Post and User entities in a single array
      synchronize: true,
    }),
    PostsModule, // Ensure PostsModule is correctly set up
    UserModule,  // Ensure UserModule is correctly set up
  ],
})
export class AppModule {}
