import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthUserDto } from './dto';
import * as argon from 'argon2'
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor (
        private prisma : PrismaService,
        private config : ConfigService,
        private jwt : JwtService
    ) {}

    async signUp(dto : AuthUserDto) {

        try {
            const hash = await argon.hash(dto.password)

            const user = await this.prisma.user.create({
                data : {
                    email : dto.email,
                    hashedPassword : hash,
                    username : dto.username
                }
            })

            return this.signToken(user.id, user.email) 
        } catch (error) {
            if(error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Credential taken')
                }
            }
            throw error
        }

    }

    async signIn(dto : AuthUserDto) {
        const user = await this.prisma.user.findUnique({
            where : {
                email : dto.email
            }
        })

        if(!user) {
            throw new ForbiddenException('Credential invalid')
        }

        const password = await argon.verify(user.hashedPassword, dto.password)

        if(!password) {
            throw new ForbiddenException('Credential invalid')
        }

        return this.signToken(user.id, user.email)
    }

    async signToken(userId : string, email : string) : Promise<{acess_token : string}> {
        const secret = this.config.get('JWT_SECRET')

        const payload = {
            sub : userId,
            email : email
        }

        const token = await this.jwt.signAsync(payload, {secret : secret})
        return {
            acess_token : token
        }
    }
}
