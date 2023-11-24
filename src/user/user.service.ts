import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto';

@Injectable()
export class UserService {
    constructor(private prisma : PrismaService) {}

    async editUser(userId : string, dto : UserDto) {
        const user = await this.prisma.user.update({
            where : {
                id : userId
            },
            data : {
                ...dto
            }
        })

        delete user.hashedPassword

        return user
    }

    async search(dto : UserDto) {
        
        const user = await this.prisma.user.findMany({
            where : {
                username : {
                    contains : dto.username
                }
            }
        })

        return user
    }

    async follow(userId : string, dto : UserDto) {
        const user = await this.prisma.user.findUnique({
            where : {
                username : dto.username
            }
        })

        const me = await this.prisma.user.findUnique({
            where : {
                id : userId
            }
        })

        if(!user) {
            throw new NotFoundException
        }

        if(userId === user.id) {
            throw new BadRequestException('invalid username')
        }

        // tambah jika sudah follow return 400
        // disini

        let followers = [...(user.followerIds || [])]
        let following = [...(me.followingIds || [])]

        try {
            followers.push(userId)
            following.push(user.id)
            await this.prisma.user.update({
                where : {
                    username : dto.username
                },
                data : {
                    followerIds : followers
                }
            })

            await this.prisma.user.update({
                where : {
                    id : userId
                },
                data : {
                    followingIds : following
                }
            })

            return "oke"
        } catch (error) {
            throw error
        }
    }

    async unfollow(userId : string, dto : UserDto) {
        const user = await this.prisma.user.findUnique({
            where : {
                username : dto.username
            }
        })

        const me = await this.prisma.user.findUnique({
            where : {
                id : userId
            }
        })

        if(!user) {
            throw new NotFoundException
        }

        if(userId === user.id) {
            throw new BadRequestException('invalid username')
        }

        // tambah jika sudah follow return 400
        // disini

        let followers = [...(user.followerIds || [])]
        let following = [...(me.followingIds || [])]

        try {
            followers = followers.filter(follower => follower != userId)
            following = following.filter(follow => follow != user.id)
            await this.prisma.user.update({
                where : {
                    username : dto.username
                },
                data : {
                    followerIds : followers
                }
            })

            await this.prisma.user.update({
                where : {
                    id : userId
                },
                data : {
                    followingIds : following
                }
            })

            return "oke"
        } catch (error) {
            throw error
        }
    }

}
