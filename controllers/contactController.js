const Message = require('../models/messageModel');

const ContactController = {
  showContact(req, res) {
    res.render('user/contact', { success: null, error: null });
  },

  async submitContact(req, res) {
    try {
      const { name, email, message } = req.body;

      if (!name || !email || !message) {
        return res.render('user/contact', {
          success: null,
          error: 'All fields are required.'
        });
      }

      await Message.create(name, email, message);
      res.render('user/contact', {
        success: 'Message sent successfully.',
        error: null
      });
    } catch (err) {
      console.error(err);
      res.render('user/contact', {
        success: null,
        error: 'Failed to send message.'
      });
    }
  },

  async listMessages(req, res) {
    try {
      const messages = await Message.getAll();
      res.render('admin/messages', { messages });
    } catch (err) {
      console.error(err);
      res.render('admin/messages', { messages: [] });
    }
  }
};

module.exports = ContactController;
