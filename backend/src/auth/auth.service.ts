import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { RegisterDto } from './dto/register.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly db: DatabaseService,
    ) { }

    async register(dto: RegisterDto) {
        const users = await this.db.query(
            `SELECT id FROM users WHERE email = $1`,
            [dto.email],
        );

        if (users.length > 0) {
            throw new BadRequestException('Email already registered');
        }

        const passwordHash = await bcrypt.hash(dto.password, 10);

        const [user] = await this.db.query(
            `
      INSERT INTO users (email, full_name)
      VALUES ($1, $2)
      RETURNING id
      `,
            [dto.email, dto.fullName],
        );

        await this.db.query(
            `
      INSERT INTO auth_providers (user_id, provider, password_hash)
      VALUES ($1, 'local', $2)
      `,
            [user.id, passwordHash],
        );

        return { message: 'User registered successfully' };
    }

    async login(email: string, password: string) {
        const providers = await this.db.query(
            `
      SELECT ap.password_hash, u.id, u.email
      FROM auth_providers ap
      JOIN users u ON u.id = ap.user_id
      WHERE ap.provider = 'local' AND u.email = $1
      `,
            [email],
        );

        if (providers.length === 0) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const provider = providers[0];

        const valid = await bcrypt.compare(password, provider.password_hash);
        if (!valid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = {
            sub: provider.id,
            email: provider.email,
        };

        const accessToken = this.jwtService.sign(payload);

        return { accessToken };
    }
}
