import bcrypt from 'bcryptjs';

export const passwordHash = async(password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password,salt);
}