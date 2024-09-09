import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModule } from 'src/posts/posts.module';
import { Post } from 'src/posts/post.entity';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { RefreshToken } from './refresh_token/refresh_token.entity';

@Module({
  imports: [
    JwtModule.register({global:true,secret:'123'}),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'kostara1998', 
      database: 'posts',
      entities: [Post, User,RefreshToken], 
      synchronize: true,
    }),
    PostsModule, 
    UserModule,  
  ],
})
export class AppModule {}
