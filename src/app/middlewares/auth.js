import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';

export default async (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log('passou no midleware ', authHeader);
    if (!authHeader) {
        return res.status(401).json({ error: 'Token not provided' });
    }

    const [, token] = authHeader.split(' ');
    console.log('token', token);
    try {
        const decoded = await promisify(jwt.verify)(token, authConfig.secret);
        console.log(decoded);

        req.userId = decoded.id;

        return next();
    } catch (err) {
        return res.status(401).json({ error: 'Token Invalid' });
    }
};
