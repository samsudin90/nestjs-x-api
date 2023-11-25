import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommentService {
    constructor (private prisma : PrismaService) {}

    async create(postId : string, userId : string, body : string) {
        try {
            const post = await this.prisma.post.findUnique({
                where : {
                    id : postId
                }
            })

            if(!post) {
                throw new NotFoundException
            }

            const comment = await this.prisma.comment.create({
                data : {
                    body : body,
                    userId : userId,
                    postId : postId
                }
            })

            return comment

        } catch (error) {
            throw error
        }
    }
}
