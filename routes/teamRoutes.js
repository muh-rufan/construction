const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const TeamController = require('../controllers/teamController');
const { isAdmin } = require('../middleware/authMiddleware');

// Multer config (reuse uploads folder)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});
const upload = multer({ storage });

// Admin team routes
router.get('/admin/team', isAdmin, TeamController.manageTeam);
router.get('/admin/team/add', isAdmin, TeamController.showAddTeam);
router.post(
  '/admin/team/add',
  isAdmin,
  upload.single('photo'),
  TeamController.addTeam
);

router.get('/admin/team/edit/:id', isAdmin, TeamController.showEditTeam);
router.post(
  '/admin/team/edit/:id',
  isAdmin,
  upload.single('photo'),
  TeamController.editTeam
);

router.post('/admin/team/delete/:id', isAdmin, TeamController.deleteTeam);

module.exports = router;
