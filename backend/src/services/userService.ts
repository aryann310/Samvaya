import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { UserDAL } from '../dal/userDal.js';
import type { User, SanitizedUser, SignupDTO, LoginDTO } from '../models/user.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const usersFilePath = path.join(__dirname, '../data/users.json');

export class UserService {
  private static users: User[] = [];
  private static initialized = false;

  private static loadUsers(): void {
    try {
      if (fs.existsSync(usersFilePath)) {
        const raw = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));
        if (Array.isArray(raw)) {
          this.users = raw.map((u) => UserDAL.decryptUser(u));
        } else {
          this.users = [];
        }
      } else {
        this.users = [];
      }
      this.initialized = true;
    } catch (err) {
      console.error('Failed to load users from storage:', err);
      this.users = [];
      this.initialized = true;
    }
  }

  private static saveUsers(): void {
    const encryptedUsers = this.users.map((u) => UserDAL.encryptUser(u));
    fs.writeFileSync(usersFilePath, JSON.stringify(encryptedUsers, null, 2), 'utf-8');
  }

  private static ensureInitialized(): void {
    if (!this.initialized) {
      this.loadUsers();
    }
  }

  static findByEmail(email: string): User | undefined {
    this.ensureInitialized();
    const normalized = email.trim().toLowerCase();
    return this.users.find((u) => u.email.toLowerCase() === normalized);
  }

  static findById(id: string): User | undefined {
    this.ensureInitialized();
    return this.users.find((u) => u.id === id);
  }

  static async createUser(dto: SignupDTO): Promise<SanitizedUser> {
    this.ensureInitialized();
    const normalizedEmail = dto.email.trim().toLowerCase();

    if (this.findByEmail(normalizedEmail)) {
      throw new Error('User already exists with this email address');
    }

    const passwordHash = await UserDAL.hashPassword(dto.password);
    const now = new Date().toISOString();

    const newUser: User = {
      id: `usr-${uuidv4().substring(0, 8)}`,
      name: dto.name.trim(),
      email: normalizedEmail,
      phone: dto.phone.trim(),
      passwordHash,
      role: dto.role || 'entrepreneur',
      businessId: 'biz-001', // Default link to Kirana store for prototype
      createdAt: now,
      updatedAt: now,
    };

    this.users.push(newUser);
    this.saveUsers();

    return UserDAL.sanitize(newUser);
  }

  static async authenticate(dto: LoginDTO): Promise<SanitizedUser | null> {
    this.ensureInitialized();
    const user = this.findByEmail(dto.email);
    if (!user) {
      return null;
    }

    const isMatch = await UserDAL.verifyPassword(dto.password, user.passwordHash);
    if (!isMatch) {
      return null;
    }

    return UserDAL.sanitize(user);
  }

  static getAllUsersSanitized(): SanitizedUser[] {
    this.ensureInitialized();
    return this.users.map((u) => UserDAL.sanitize(u));
  }
}
