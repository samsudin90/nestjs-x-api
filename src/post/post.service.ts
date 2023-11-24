import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PostDto } from './dto';
import { isNumber } from 'class-validator';

@Injectable()
export class PostService {
    constructor(private prisma : PrismaService) {}


    async create(userId : string, dto : PostDto) {
        const post = await this.prisma.post.create({
            data : {
                userId : userId,
                body : dto.body
            },
            include : {
                comments : true
            }
        })

        return post
    }

    async getPagination(page : number) {
        if(!page) {
            page = 1
        }

        if(page <= 0) {
            page = 1
        }
        let p = Number(page)

        if(Number.isNaN(p)) {
            return new NotFoundException
        }

        const num = 10
        try {
            const posts = await this.prisma.post.findMany({
                take : num,
                skip : num*(page-1),
                include : {
                    user : {
                        select : {
                            id : true,
                            name : true,
                            username : true,
                            profileImage : true
                        }
                    },
                    comments : true
                },
                orderBy : {
                    createdAt : 'desc'
                }
            })

            return posts
        } catch (error) {
            throw error
        }
    }

    async getPostMe(userId : string) {
        const posts = await this.prisma.post.findMany({
            where : {
                userId : userId
            },
            orderBy : {
                createdAt : 'desc'
            }
        })

        return posts
    }

    async getByUserId(userId : string, page : number) {
        if(!page) {
            page = 1
        }

        if(page <= 0) {
            page = 1
        }
        let p = Number(page)

        if(Number.isNaN(p)) {
            return new NotFoundException
        }

        const num = 10
        try {
            
            if (userId.length != 24) {
                return new NotFoundException
            }

            const user = await this.prisma.user.findUnique({
                where : {
                    id : userId
                },
                include : {
                    posts : {
                        take : num,
                        skip : num*(page-1),
                        include : {
                            comments : true
                        },
                        orderBy : {
                            createdAt : 'desc'
                        }
                    },
                },
            })

            if(!user) {
                return new NotFoundException
            }

            delete user.hashedPassword

            return user
        } catch (error) {
            throw error
        }
    }

    async getById(id : string) {
        try {
            if (id.length != 24) {
                return new NotFoundException
            }
            const post = await this.prisma.post.findUnique({
                where : {
                    id : id
                },
                include : {
                    user : {
                        select : {
                            id : true,
                            name : true,
                            username : true,
                            profileImage : true
                        }
                    },
                    comments : true
                },
            })

            if(!post) {
                return new NotFoundException
            }

            return post
        } catch (error) {
            throw error
        }
    }

    async like(id: string, userId : string) {
        try {
            if (id.length != 24) {
                return new NotFoundException
            }

            const post = await this.prisma.post.findUnique({
                where : {
                    id : id
                }
            })

            if(!post) {
                return new NotFoundException
            }

            let updatedLikes = [...(post.likeIds || [] )]

            if(post.likeIds.includes(userId) ) {
                updatedLikes = updatedLikes.filter(likeId => likeId != userId)
            } else {
                updatedLikes.push(userId)
            }

            const updatedPost = await this.prisma.post.update({
                where : {
                    id : id
                },
                data : {
                    likeIds : updatedLikes
                }
            })

            return updatedPost
        } catch (error) {
            throw error
        }
    }
    
}
