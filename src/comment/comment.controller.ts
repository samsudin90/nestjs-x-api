import { Body, Controller, Post, Query, Req, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { JwtGuard } from 'src/auth/guard';
import { Request } from 'express';
import { commentDto } from './dto';

@UseGuards(JwtGuard)
@Controller('comment')
export class CommentController {
    constructor (private commentService : CommentService) {}

    @Post()
    create(@Req() req : Request, @Query('postId') postId : string, @Body() dto : commentDto) {
        return this.commentService.create(postId, req.user['id'], dto.body)
    }
}
