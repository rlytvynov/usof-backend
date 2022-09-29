const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')
const {checkAdmin, checkAuthUser} = require('../utils/authCheck')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './avatars')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix + '.' + (file.mimetype.split('/'))[1])
    }
  })
  
const upload = multer({ 
    storage: storage,
    limit: {
        fileSize: 2 * 512 * 512
    }, 
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
            cb(null, true)
        } else (
            cb(null, false)
        )
    }
})

router.get ('/', checkAuthUser, checkAdmin, usersController.getUsers)
router.get('/:user_id', usersController.getUser)
router.get('/updateActivation/:activationToken', usersController.updateUserConfirmEmail)
router.post('/', checkAuthUser, checkAdmin, usersController.createNewUser)
router.patch('/avatar', checkAuthUser, upload.single('avatar'), usersController.uploadPhoto)
router.patch('/:user_id', checkAuthUser, usersController.updateUser)
router.delete('/:user_id', checkAuthUser, usersController.deleteUser)


module.exports = router