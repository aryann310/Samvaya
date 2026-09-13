import type { User, SanitizedUser, SignupDTO, LoginDTO } from '../models/user.model.js';
export declare class UserService {
    private static users;
    private static initialized;
    private static loadUsers;
    private static saveUsers;
    private static ensureInitialized;
    static findByEmail(email: string): User | undefined;
    static findById(id: string): User | undefined;
    static createUser(dto: SignupDTO): Promise<SanitizedUser>;
    static authenticate(dto: LoginDTO): Promise<SanitizedUser | null>;
    static getAllUsersSanitized(): SanitizedUser[];
}
//# sourceMappingURL=userService.d.ts.map