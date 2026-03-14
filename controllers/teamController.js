const Team = require('../models/teamModel');

const TeamController = {
  showAddTeam(req, res) {
    res.render('admin/addTeam', { error: null });
  },

  async addTeam(req, res) {
    try {
      const { name, position, email } = req.body;
      const file = req.file;

      if (!name || !position || !email) {
        return res.render('admin/addTeam', { error: 'All fields are required.' });
      }

      const photoPath = file ? `/uploads/${file.filename}` : null;
      await Team.create(name, position, email, photoPath);
      res.redirect('/admin/team');
    } catch (err) {
      console.error(err);
      res.render('admin/addTeam', { error: 'Failed to add team member.' });
    }
  },

  async manageTeam(req, res) {
    try {
      const team = await Team.getAll();
      res.render('admin/manageTeam', { team });
    } catch (err) {
      console.error(err);
      res.render('admin/manageTeam', { team: [] });
    }
  },

  async showEditTeam(req, res) {
    try {
      const member = await Team.getById(req.params.id);
      if (!member) {
        return res.redirect('/admin/team');
      }
      res.render('admin/editTeam', { member, error: null });
    } catch (err) {
      console.error(err);
      res.redirect('/admin/team');
    }
  },

  async editTeam(req, res) {
    try {
      const { name, position, email } = req.body;
      const file = req.file;
      const id = req.params.id;

      if (!name || !position || !email) {
        const member = await Team.getById(id);
        return res.render('admin/editTeam', {
          member,
          error: 'All fields are required.'
        });
      }

      const photoPath = file ? `/uploads/${file.filename}` : null;
      await Team.update(id, name, position, email, photoPath);
      res.redirect('/admin/team');
    } catch (err) {
      console.error(err);
      res.redirect('/admin/team');
    }
  },

  async deleteTeam(req, res) {
    try {
      await Team.delete(req.params.id);
      res.redirect('/admin/team');
    } catch (err) {
      console.error(err);
      res.redirect('/admin/team');
    }
  }
};

module.exports = TeamController;
