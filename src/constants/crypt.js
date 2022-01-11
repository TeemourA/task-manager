import bcrypt from 'bcryptjs';

const DEFAULT_SALT = 8;

export const appSalt = bcrypt.genSaltSync(DEFAULT_SALT);