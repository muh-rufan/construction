const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const Admin = require('../models/adminModel');
const { generateVerificationToken } = require('../utils/tokenGenerator');
const { sendVerificationEmail } = require('../services/emailService');

const AuthController = {
  showLogin(req, res) {
    res.render('user/login', {
      error: null,
      success: null,
      info: null,
      loginType: null,
      showResend: false,
      resendEmail: null
    });
  },

  showRegister(req, res) {
    res.render('user/register', {
      error: null,
      success: null,
      formData: { name: '', email: '' }
    });
  },

  async register(req, res) {
    try {
      const { name, email, password, confirmPassword } = req.body;

      // Basic server-side validation
      const formData = { name: name || '', email: email || '' };

      if (!name || !email || !password || !confirmPassword) {
        return res.render('user/register', {
          error: 'All fields are required.',
          success: null,
          formData
        });
      }

      if (name.trim().length < 3) {
        return res.render('user/register', {
          error: 'Name must be at least 3 characters long.',
          success: null,
          formData
        });
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        return res.render('user/register', {
          error: 'Please enter a valid email address.',
          success: null,
          formData
        });
      }

      if (password.length < 6) {
        return res.render('user/register', {
          error: 'Password must be at least 6 characters long.',
          success: null,
          formData
        });
      }

      if (password !== confirmPassword) {
        return res.render('user/register', {
          error: 'Passwords do not match.',
          success: null,
          formData
        });
      }

      const existing = await User.findByEmail(email);
      if (existing) {
        return res.render('user/register', {
          error: 'Email is already registered.',
          success: null,
          formData
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const verificationToken = generateVerificationToken();
      const tokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      const userId = await User.create(name, email, hashedPassword, verificationToken, tokenExpiresAt);
      const user = await User.findById(userId);

      try {
        await sendVerificationEmail(user.email, verificationToken);
      } catch (emailErr) {
        console.error('Error sending verification email:', emailErr);
      }

      return res.render('user/login', {
        error: null,
        success: 'Registration successful. Please check your email to verify your account.',
        info: null,
        loginType: 'user',
        showResend: true,
        resendEmail: user.email
      });
    } catch (err) {
      console.error(err);
      res.render('user/register', {
        error: 'Registration failed. Try again.',
        success: null,
        formData: { name: req.body.name || '', email: req.body.email || '' }
      });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.render('user/login', {
          error: 'Email and password are required.',
          success: null,
          info: null,
          loginType: 'user',
          showResend: false,
          resendEmail: null
        });
      }

      const user = await User.findByEmail(email);
      if (!user) {
        return res.render('user/login', {
          error: 'Invalid credentials.',
          success: null,
          info: null,
          loginType: 'user',
          showResend: false,
          resendEmail: null
        });
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.render('user/login', {
          error: 'Invalid credentials.',
          success: null,
          info: null,
          loginType: 'user',
          showResend: false,
          resendEmail: null
        });
      }

      if (!user.is_verified) {
        return res.render('user/login', {
          error: 'You must verify your email before logging in.',
          success: null,
          info: 'Please check your inbox for the verification link.',
          loginType: 'user',
          showResend: true,
          resendEmail: user.email
        });
      }

      req.session.user = { id: user.id, name: user.name, email: user.email };
      res.redirect('/');
    } catch (err) {
      console.error(err);
      res.render('user/login', {
        error: 'Login failed. Try again.',
        success: null,
        info: null,
        loginType: 'user',
        showResend: false,
        resendEmail: null
      });
    }
  },

  logout(req, res) {
    req.session.destroy(() => {
      res.redirect('/');
    });
  },

  showAdminLogin(req, res) {
    res.render('admin/login', {
      error: null,
      success: null,
      info: null,
      loginType: 'admin',
      showResend: false,
      resendEmail: null
    });
  },

  async adminLogin(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.render('admin/login', {
          error: 'Username and password are required.',
          success: null,
          info: null,
          loginType: 'admin',
          showResend: false,
          resendEmail: null
        });
      }

      const admin = await Admin.findByUsername(username);
      if (!admin) {
        return res.render('admin/login', {
          error: 'Invalid credentials.',
          success: null,
          info: null,
          loginType: 'admin',
          showResend: false,
          resendEmail: null
        });
      }

      const valid = await bcrypt.compare(password, admin.password);
      if (!valid) {
        return res.render('admin/login', {
          error: 'Invalid credentials.',
          success: null,
          info: null,
          loginType: 'admin',
          showResend: false,
          resendEmail: null
        });
      }

      req.session.admin = { id: admin.id, username: admin.username };
      res.redirect('/admin/dashboard');
    } catch (err) {
      console.error(err);
      res.render('admin/login', {
        error: 'Login failed. Try again.',
        success: null,
        info: null,
        loginType: 'admin',
        showResend: false,
        resendEmail: null
      });
    }
  },

  adminLogout(req, res) {
    req.session.destroy(() => {
      res.redirect('/login');
    });
  },

  async verifyEmail(req, res) {
    try {
      const { token } = req.params;
      if (!token) {
        return res.render('user/login', {
          error: 'Verification link is invalid or has expired.',
          success: null,
          info: null,
          loginType: 'user',
          showResend: false,
          resendEmail: null
        });
      }

      const user = await User.findByVerificationToken(token);
      if (!user || !user.verification_token_expires) {
        return res.render('user/login', {
          error: 'Verification link is invalid or has expired.',
          success: null,
          info: null,
          loginType: 'user',
          showResend: false,
          resendEmail: null
        });
      }

      const now = new Date();
      const expiresAt = new Date(user.verification_token_expires);
      if (expiresAt < now) {
        return res.render('user/login', {
          error: 'Verification link is invalid or has expired.',
          success: null,
          info: null,
          loginType: 'user',
          showResend: true,
          resendEmail: user.email
        });
      }

      await User.markVerified(user.id);

      return res.render('user/login', {
        error: null,
        success: 'Your email has been verified successfully. You can now log in.',
        info: null,
        loginType: 'user',
        showResend: false,
        resendEmail: null
      });
    } catch (err) {
      console.error('Error verifying email:', err);
      return res.render('user/login', {
        error: 'Could not verify email. Please try again.',
        success: null,
        info: null,
        loginType: 'user',
        showResend: false,
        resendEmail: null
      });
    }
  },

  async resendVerification(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.render('user/login', {
          error: 'Email is required to resend verification.',
          success: null,
          info: null,
          loginType: 'user',
          showResend: false,
          resendEmail: null
        });
      }

      const user = await User.findByEmail(email);

      if (!user) {
        return res.render('user/login', {
          error: null,
          success: null,
          info: 'If an account with that email exists, you will receive a verification email shortly.',
          loginType: 'user',
          showResend: false,
          resendEmail: null
        });
      }

      if (user.is_verified) {
        return res.render('user/login', {
          error: null,
          success: null,
          info: 'This email is already verified. You can log in now.',
          loginType: 'user',
          showResend: false,
          resendEmail: null
        });
      }

      const verificationToken = generateVerificationToken();
      const tokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await User.updateVerificationToken(user.id, verificationToken, tokenExpiresAt);

      try {
        await sendVerificationEmail(user.email, verificationToken);
      } catch (emailErr) {
        console.error('Error resending verification email:', emailErr);
      }

      return res.render('user/login', {
        error: null,
        success: null,
        info: 'If an account with that email exists, you will receive a verification email shortly.',
        loginType: 'user',
        showResend: false,
        resendEmail: null
      });
    } catch (err) {
      console.error('Error in resendVerification:', err);
      return res.render('user/login', {
        error: 'Could not resend verification email. Please try again.',
        success: null,
        info: null,
        loginType: 'user',
        showResend: false,
        resendEmail: null
      });
    }
  }
};

module.exports = AuthController;
