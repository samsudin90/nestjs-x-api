import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { Request } from 'express';
import { PostDto, PostUserDto } from './dto';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('posts')
export class PostController {
    constructor(private postService : PostService) {}

    @Post('create')
    create(@Req() req : Request, @Body() dto : PostDto) {
        return this.postService.create(req.user['id'], dto)
    }

    // gak guna
    @Get('me')
    getPostMe(@Req() req : Request) {
        return this.postService.getPostMe(req.user['id'])
    }

    @Get('user/:id')
    getByUserId(@Param('id') id : string, @Query('page') page : number) {
        return this.postService.getByUserId(id, page)
    }

    @Get(':id')
    getById(@Param('id') id : string) {
        return this.postService.getById(id)
    }

    @Get()
    getPagination(@Query('page') page : number) {
        return this.postService.getPagination(page)
    }

    @Post(':id')
    like(@Param('id') id : string, @Req() req : Request) {
        return this.postService.like(id, req.user['id'])
    }
}
