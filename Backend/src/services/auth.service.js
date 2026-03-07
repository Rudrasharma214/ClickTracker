import { STATUS } from "../constant/statusCodes.js";
import { UserRepository } from "../repositories/user.repository.js";

const userRepo = new UserRepository();

export class AuthService {
    // Register a new user
    async signup(name, email, password) {
        try {
            const existingUser = await userRepo.findByEmail(email);
            if (existingUser) {
                return {
                    success: false,
                    status: STATUS.CONFLICT,
                    message: "User already exists"
                };
            }

            const userData = { name, email, password };
            const user = await userRepo.create(userData);

            return {
                success: true,
                status: STATUS.CREATED,
                message: "User created successfully",
                data: user
            };
        } catch (error) {
            return {
                success: false,
                status: STATUS.INTERNAL_ERROR,
                message: "An error occurred while signing up",
                error: error.message
            }
        }
    };
}