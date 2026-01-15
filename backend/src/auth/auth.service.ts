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

    async handleGoogleLogin(googleUser: any) {
        // Check if user exists by email
        const users = await this.db.query(
            `SELECT id, email, full_name FROM users WHERE email = $1`,
            [googleUser.email],
        );

        let user;

        if (users.length > 0) {
            // User exists, check if they have Google provider
            user = users[0];

            const providers = await this.db.query(
                `SELECT id FROM auth_providers WHERE user_id = $1 AND provider = 'google'`,
                [user.id],
            );

            // If Google provider doesn't exist, add it (no password for OAuth)
            if (providers.length === 0) {
                await this.db.query(
                    `
          INSERT INTO auth_providers (user_id, provider)
          VALUES ($1, 'google')
          `,
                    [user.id],
                );
            }
        } else {
            // Create new user from Google profile
            const fullName = `${googleUser.firstName} ${googleUser.lastName}`;

            const [newUser] = await this.db.query(
                `
        INSERT INTO users (email, full_name)
        VALUES ($1, $2)
        RETURNING id, email, full_name
        `,
                [googleUser.email, fullName],
            );

            user = newUser;

            // Add Google provider (no password for OAuth users)
            await this.db.query(
                `
        INSERT INTO auth_providers (user_id, provider)
        VALUES ($1, 'google')
        `,
                [user.id],
            );
        }

        // Generate JWT token
        const payload = {
            sub: user.id,
            email: user.email,
        };

        const accessToken = this.jwtService.sign(payload);

        return { accessToken, user };
    }
}
