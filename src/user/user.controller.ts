import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/guard';
import { Request } from 'express';
import { UserDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname, join } from 'path';
import { diskStorage } from 'multer';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  me(@Req() req: Request) {
    return req.user;
  }

  @Post('search')
  search(@Body() dto : UserDto) {
    return this.userService.search(dto)
  }

  @Post('follow')
  follow(@Req() req : Request, @Body() dto : UserDto){
    return this.userService.follow(req.user['id'], dto)
  }

  @Delete('unfollow')
  unfollow(@Req() req : Request, @Body() dto : UserDto) {
    return this.userService.unfollow(req.user['id'], dto)
  }

  @Patch()
  edit(@Req() req: Request, @Body() dto: UserDto) {
    return this.userService.editUser(req.user['id'], dto);
  }

  @Post('avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      fileFilter(req, file, callback) {
        var ext = extname(file.originalname);
        ext = ext.toLowerCase();
        if (ext !== '.jpg' && ext !== '.jpeg') {
          return callback(null, false);
        }
        callback(null, true);
      },
      storage: diskStorage({
        destination: './upload',
        filename(req, file, callback) {
          callback(
            null,
            `${Date.now()}-${file.originalname.split('.')[0]}${extname(
              file.originalname,
            )}`,
          );
        },
      }),
    }),
  )
  avatar(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    const dto = {
      profileImage: file.filename,
    };
    return this.userService.editUser(req.user['id'], dto);
  }

  @Post('cover')
  @UseInterceptors(
    FileInterceptor('cover', {
      fileFilter(req, file, callback) {
        var ext = extname(file.originalname);
        ext = ext.toLowerCase();
        if (ext !== '.jpg' && ext !== '.jpeg') {
          return callback(null, false);
        }
        callback(null, true);
      },
      storage: diskStorage({
        destination: './upload',
        filename(req, file, callback) {
          callback(
            null,
            `${Date.now()}-${file.originalname.split('.')[0]}${extname(
              file.originalname,
            )}`,
          );
        },
      }),
    }),
  )
  cover(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    const dto = {
      coverImage: file.filename,
    };
    return this.userService.editUser(req.user['id'], dto);
  }

}
