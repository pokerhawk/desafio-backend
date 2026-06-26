import { User } from "@prisma/client";

export const userToReturnMapper = (user:User):Partial<User> =>{
    return {
        id: user.id,
        operator: user.operator,
        email: user.email
    }
}

