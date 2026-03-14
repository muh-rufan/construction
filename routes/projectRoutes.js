const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const ProjectController = require('../controllers/projectController');
const { isAdmin } = require('../middleware/authMiddleware');

// Multer config
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

// Public site routes
router.get('/', ProjectController.showHome);
router.get('/about', ProjectController.showAbout);
router.get('/services', ProjectController.showServices);
router.get('/projects', ProjectController.showProjects);
router.get('/team', ProjectController.showTeam);

// Admin project routes
router.get('/admin/dashboard', isAdmin, ProjectController.showAdminDashboard);
router.get('/admin/projects', isAdmin, ProjectController.manageProjects);
router.get('/admin/projects/add', isAdmin, ProjectController.showAddProject);
router.post(
  '/admin/projects/add',
  isAdmin,
  upload.single('image'),
  ProjectController.addProject
);
router.get('/admin/projects/edit/:id', isAdmin, ProjectController.showEditProject);
router.post(
  '/admin/projects/edit/:id',
  isAdmin,
  upload.single('image'),
  ProjectController.editProject
);
router.post('/admin/projects/delete/:id', isAdmin, ProjectController.deleteProject);

module.exports = router;
