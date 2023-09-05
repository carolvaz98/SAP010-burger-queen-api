const jwt = require('jsonwebtoken');

module.exports = (secrets) => (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    console.info('Authorization header missing');
    return next();
  }

  const [type, token] = authorization.split(' ');

  if (type.toLowerCase() !== 'bearer') {
    console.warn('Invalid authorization type');
    return next();
  }

  jwt.verify(token, secrets, (err, decodedToken) => {
    if (err) {
      console.error('Token verification failed:', err);
      return res.status(403).send('Acesso proibido');
    }

    console.info('Token verified:', decodedToken);
    req.user = decodedToken;
    next();
  });
};

module.exports.isAuthenticated = (req) => req.user !== undefined;

module.exports.isAdmin = (req) => req.user && req.user.role && req.user.role === 'admin';

module.exports.requireAuth = (req, res, next) => {
  if (!module.exports.isAuthenticated(req)) {
    return res.status(401).send('Autenticação necessária');
  }
  next();
};

module.exports.requireAdmin = (req, res, next) => {
  if (!module.exports.isAuthenticated(req)) {
    return res.status(401).send('Autenticação necessária');
  }
  if (!module.exports.isAdmin(req)) {
    return res.status(403).send('Acesso proibido');
  }
  next();
};
