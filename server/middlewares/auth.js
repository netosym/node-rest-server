const jwt = require('jsonwebtoken');

//VALIDATE TOKEN
const authToken = (req, res, next) => {
  try {
    let token = req.get('auth-token');
    const validToken = jwt.verify(token, process.env.SEED);
    if (!validToken) {
      return res.status(401).json({
        ok: false,
        message: 'Invalid Token - Access denied',
      });
    }
    req.user = validToken.user;
    next();
  } catch (error) {
    res.status(400).json({
      ok: false,
      message: error,
    });
  }
};

//VALIDATE ADMIN ROLE
const authAdmin = (req, res, next) => {
  try {
    let user = req.user;
    if (user.role === 'ADMIN_ROLE') {
      next();
    } else {
      return res.status(401).json({
        ok: false,
        message: 'You are not an admin',
      });
    }
  } catch (error) {
    res.status(400).json({
      ok: false,
      message: error,
    });
  }
};

//VALIDATE IMAGE TOKEN
const authImageToken = (req, res, next) => {
  try {
    const token = req.query.authToken;
    const validToken = jwt.verify(token, process.env.SEED);
    if (!validToken) {
      return res.status(401).json({
        ok: false,
        message: 'Invalid Token - Access denied',
      });
    }
    req.user = validToken.user;
    next();
  } catch (error) {
    res.status(400).json({
      ok: false,
      message: error,
    });
  }
};

module.exports = {
  authToken,
  authAdmin,
  authImageToken,
};
