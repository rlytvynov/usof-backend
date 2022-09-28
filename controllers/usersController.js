const User = require('../models/UserModel')
const mailer = require('../utils/mailer')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const {validateEmail, generateActivationToken} = require('../utils/validationFeatures')

const usersController = {
    getUsers: async function (req, res) {
        try {
            const users = await User.findAll()
            const newUsers = []
            users.forEach(element => {
                newUsers.push({
                    id: element.id, 
                    email: element.email,
                    fullName: element.fullName,
                    profilePicture: element.profilePicture,
                    rating: element.rating
                })
            });
            return res.status(200).json(newUsers)
        } catch (error) {
            return res.status(500).json({msg: error})
        }
    },

    getUser: async function (req, res) {
        try {
            const userId = req.params.user_id
            const candidate = await User.findOne({where: {id: userId}})
            if(candidate) {
                return res.status(200).json({
                        id: candidate.id, 
                        email: candidate.email,
                        fullName: candidate.fullName,
                        profilePicture: candidate.profilePicture,
                        rating: candidate.rating
                    })
            } else {
                return res.status(404).json({msg: 'There isn\'t such user'})
            }
        } catch (error) {
            return res.status(500).json({msg: error})
        }
    },

    createNewUser: async (req, res) => {
        try {
            console.log('hui')
            const {login, email, password, passwordConfirmation, fullName, role} = req.body

            if(!login || !email || !password)
                return res.status(400).json({msg: "Please fill in all fields."})

            if(!validateEmail(email))
                return res.status(400).json({msg: "Invalid email."})

            let user = await User.findOne({where: {email: email}})
            if(user)
                return res.status(400).json({msg: "This email already exist."})
            else {
                user = await User.findOne({where: {login: login}})
                if(user)
                    return res.status(400).json({msg: "This login already exist."})
            }

            if(password.length < 6) {
                return res.status(400).json({msg: "Password must be at list 6 characters."})
            }

            if(password !== passwordConfirmation) {
                return res.status(400).json({msg: "Passwords does not match"})
            }

            if(role !== 'admin' && role !== 'user') {
                console.log(typeof role)
                return res.status(400).json({msg: "There is only admin or user roles"})
            }

            const passwordHash = await bcrypt.hash(password, 12)

            User.create({
                login: login,
                password: passwordHash,
                email: email,
                fullName: fullName ? fullName : null,
                role: role
            })

            return res.status(200).json({msg: "Succesfully created"})
        } catch (err) {
            return res.status(500).json({msge: err.message})
        }
    },

    updateUser: async (req, res) => {
        try {
            if(!req.params.user_id) req.params.user_id = req.user.id
            if(req.user.id != req.params.user_id) {
                return res.status(400).json({msg: `You can't update other users)`})
            } else {
                const {fullName, login, email} = req.body

                if(!validateEmail(email)) {
                    return res.status(400).json({msg: "Invalid email."})
                }

                const anotherUserWithEmail = await User.findOne({where: {email: email}})
                const anotherUserWithLogin = await User.findOne({where: {login: login}})

                if(anotherUserWithEmail && anotherUserWithEmail.id!=req.user.id ||
                    anotherUserWithLogin && anotherUserWithLogin.id!=req.user.id) {
                        return res.status(400).json({ msg: 'User with such login or email is already exists'})
                }

                const userData = await User.findOne({where: {id: req.user.id}})
                let newUser = {}
                if(email == userData.email) {
                    newUser = {id: req.user.id, login, fullName}
                    await User.update({
                        fullName: fullName ? newUser.fullName : userData.fullName,
                        login: login ? newUser.login : userData.login
                    }, {where: {id: newUser.id}})
                    return res.status(200).json({msg: 'User was updated'})
                } else {
                    newUser = {id: req.user.id, login, email, fullName}
                    const activationToken = generateActivationToken(newUser)
                    const mailOptions = {
                        from: process.env.EMAIL_USER,
                        to: email,
                        subject: 'Confirm email',
                        text: `http://${process.env.HOST}:${process.env.APP_PORT}/api/users/updateActivation/${activationToken}`
                    }
                    mailer(mailOptions)
                    return res.status(200).json({msg: 'Activate your new email.'})
                }
            }
        } catch (error) {
            return res.status(500).json({msge: error.message})
        }
    },

    uploadPhoto: async (req, res) => {
        try {
            if(req.file) {
                const user = await User.findOne({
                    where: {id: req.user.id}
                })
                if (!user)
                    return res.status(404).json({msg: "Authorize please"})
                //console.log(req.file.filename + ' hello')
                await user.update({
                    profilePicture: `http://localhost:5000/${req.file.filename}`
                })
                return res.status(200).json({msg: "Avatar updated"})
            } else
                return res.status(400).json({msg: "File is not image"})
        } catch (error) {
            return res.status(500).json({msge: error.message})
        }
    },

    updateUserConfirmEmail: async (req, res) => {
        try {
            const {activationToken} = req.params
            jwt.verify(activationToken, process.env.ACTIVATION_TOKEN_SECRET, (err, user) => {
                if(err) return res.status(400).json({msg: err.message})

                req.userChange = user
 
            })
            const {id, login, email, fullName} = req.userChange
            const userData = await User.findOne({where: {id: id}})
            User.update({
                fullName: fullName ? fullName : userData.fullName,
                login: login ? login : userData.login,
                email: email ? email : userData.email
            },
            {where: {id: id}})  
            return res.status(200).json({msg: 'The user was change succesfully'})
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },

    deleteUser: async (req, res) => {
        try {
            if(req.user.role === 'admin') {
                if(req.user.id != req.params.user_id) {
                    const user = await User.findOne({where: {id: req.params.user_id}})
                    if(!user)  {
                        return res.status(400).json({msg: "User not found"})
                    }
                    await user.destroy()
                    return res.status(200).json({msg: "User deleted"})
                } else {
                    res.clearCookie('refreshToken');
                    const user = await User.findOne({where: {id: req.user.id}})
                    await user.destroy()
                    return res.status(200).json({msg: "User deleted"})
                }
            } else {
                if(req.user.id != req.params.user_id) {
                    return res.status(400).json({msg: `You can't update other users)`})
                } else {
                    res.clearCookie('refreshToken');
                    const user = await User.findOne({where: {id: req.user.id}})
                    await user.destroy()
                    return res.status(200).json({msg: "User deleted"})
                }
            }
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    }
}

module.exports = usersController