const Project = require('../models/projectModel');
const Notification = require('../models/notificationModel');
const Team = require('../models/teamModel');
const Message = require('../models/messageModel');

const ProjectController = {
  // Public pages
  async showHome(req, res) {
    try {
      const projects = await Project.getAll();
      const team = await Team.getAll();
      res.render('user/home', { projects: projects.slice(0, 3), team: team.slice(0, 3) });
    } catch (err) {
      console.error(err);
      res.render('user/home', { projects: [], team: [] });
    }
  },

  showAbout(req, res) {
    res.render('user/about');
  },

  showServices(req, res) {
    res.render('user/services');
  },

  async showProjects(req, res) {
    try {
      const projects = await Project.getAll();
      res.render('user/projects', { projects });
    } catch (err) {
      console.error(err);
      res.render('user/projects', { projects: [] });
    }
  },

  async showTeam(req, res) {
    try {
      const team = await Team.getAll();
      res.render('user/team', { team });
    } catch (err) {
      console.error(err);
      res.render('user/team', { team: [] });
    }
  },

  // Admin dashboard overview
  async showAdminDashboard(req, res) {
    try {
      const [projects, team, messages] = await Promise.all([
        Project.getAll(),
        Team.getAll(),
        Message.getAll()
      ]);

      res.render('admin/dashboard', {
        projectCount: projects.length,
        teamCount: team.length,
        messageCount: messages.length
      });
    } catch (err) {
      console.error(err);
      res.render('admin/dashboard', {
        projectCount: 0,
        teamCount: 0,
        messageCount: 0
      });
    }
  },

  // Admin project CRUD
  showAddProject(req, res) {
    res.render('admin/addProject', { error: null });
  },

  async addProject(req, res) {
    try {
      const { title, description } = req.body;
      const file = req.file;

      if (!title || !description) {
        return res.render('admin/addProject', { error: 'Title and description are required.' });
      }

      const imagePath = file ? `/uploads/${file.filename}` : null;
      const projectId = await Project.create(title, description, imagePath);

      // Create notification for all users
      const notificationId = await Notification.create(
        'New Project Added',
        `A new project "${title}" has been added.`
      );
      await Notification.assignToAllUsers(notificationId);

      console.log('Created project with id:', projectId);
      res.redirect('/admin/projects');
    } catch (err) {
      console.error(err);
      res.render('admin/addProject', { error: 'Failed to add project.' });
    }
  },

  async manageProjects(req, res) {
    try {
      const projects = await Project.getAll();
      res.render('admin/manageProjects', { projects });
    } catch (err) {
      console.error(err);
      res.render('admin/manageProjects', { projects: [] });
    }
  },

  async showEditProject(req, res) {
    try {
      const project = await Project.getById(req.params.id);
      if (!project) {
        return res.redirect('/admin/projects');
      }
      res.render('admin/editProject', { project, error: null });
    } catch (err) {
      console.error(err);
      res.redirect('/admin/projects');
    }
  },

  async editProject(req, res) {
    try {
      const { title, description } = req.body;
      const file = req.file;
      const id = req.params.id;

      if (!title || !description) {
        const project = await Project.getById(id);
        return res.render('admin/editProject', {
          project,
          error: 'Title and description are required.'
        });
      }

      const imagePath = file ? `/uploads/${file.filename}` : null;
      await Project.update(id, title, description, imagePath);
      res.redirect('/admin/projects');
    } catch (err) {
      console.error(err);
      res.redirect('/admin/projects');
    }
  },

  async deleteProject(req, res) {
    try {
      await Project.delete(req.params.id);
      res.redirect('/admin/projects');
    } catch (err) {
      console.error(err);
      res.redirect('/admin/projects');
    }
  }
};

module.exports = ProjectController;
