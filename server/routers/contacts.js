const express = require('express');
const router = express.Router();

const contactsController = require('../controllers/ContactsController');

router.post('/', contactsController.storeContact); // store a contact
router.post('/list', contactsController.getListOfContacts); // get list of contacts
router.get('/:id', contactsController.getContact); // get a contact by contact ID
router.put('/:id', contactsController.updateContact); // update a contact by contact ID
router.delete('/:id', contactsController.deleteContact); // delete a contact by contact ID
router.post('/delete', contactsController.multiDeleteContact); // delete multi contacts
router.get('/search/:contactName', contactsController.findContact); // find a contact by contact name

module.exports = router;