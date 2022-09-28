const User = require('../models/UserModel')
const mailer = require('../utils/mailer')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const {validateEmail, generateAccessToken, generateActivationToken, generateRefreshToken} = require('../utils/validationFeatures')

const authController = {
    register: async function (req, res) {
        try {
            const {login, email, password, fullName} = req.body
            if(!login || !email || !password) {
                return res.status(400).json({msg: "Please fill in all fields."})
            }
            if(!validateEmail(email)) {
                return res.status(400).json({msg: "Invalid email."})
            }

            const user = await User.findOne({where: {email: email}})
            console.log(user)
            if(user) {
                return res.status(400).json({msg: `This user is already exists`})
            }
            if(password.length < 8) {
                return res.status(400).json({msg: "Password must be at list 8 characters."})
            }

            const passwordHash = await bcrypt.hash(password, 12)
            const newUser = {login, email, password: passwordHash, fullName}

            const activationToken = generateActivationToken(newUser)
            //console.log(activationToken)
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Confirm email',
                text: `http://localhost:${process.env.APP_PORT}/api/auth/activation/${activationToken}`
            }
            mailer(mailOptions)
            res.status(200).json({msg: "Register Success! Please activate your email."})
        } catch(err) {
            res.status(500).json({msg: err.message})
        }
    },

    confirmEmail: async function (req, res) {
        try {
            const {activationToken} = req.params
            const user = jwt.verify(activationToken, process.env.ACTIVATION_TOKEN_SECRET)

            const {login, email, password, fullName} = user
  
            let candidate = await User.findOne({where: {email: email}})
            if(candidate) return res.status(400).json({msg: "This user has been already activated."})
            else {
                candidate = await User.findOne({where: {login: login}})
                if(candidate) return res.status(400).json({msg: "This login already exist."})
            }
  
            await User.create({
                login: login,
                email: email,
                password: password,
                fullName: fullName
            })
  
            res.json({msg: "Account has been activated."})
  
        } catch (error) {
            return res.status(500).json({msg: error.msg})
        }
    },

    login: async function(req, res) {
        try {
            const {login, password, email} = req.body
            let candidate = undefined

            if(login) {
                candidate = await User.findOne({where: {login: login}})
            } 
            if(email){
                candidate = await User.findOne({where: {email: email}})
            }


            if(candidate) {
                let passwordResult = bcrypt.compareSync(password, candidate.password) 
                if(passwordResult) {
                    const refreshToken = generateRefreshToken({id: candidate.id, role: candidate.role})
                    //console.log(refreshToken)
                    res.clearCookie('connect.sid');
                    res.cookie('refreshToken', refreshToken, {
                        httpOnly: true, //protect from XSS(malicious client side script )
                        maxAge: 7*24*60*60*1000
                    })
                    return res.status(200).json({msg: `Hi, ${candidate.login}`})
                } else {
                    return res.status(401).json({msg: 'Password is not correct'})
                }
            } 
            else {
                return res.status(404).json({msg: "This user doesn't registered or unauthorized"})
            }
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },

    logout: async function (req, res) {
        try {
            res.clearCookie('refreshToken')
            return res.status(200).json({msg: "Logged out"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    forgetPassword: async function (req, res) {
        try {
            const {email} = req.body
            const candidate = await User.findOne({where: {email: email}})

            if(candidate) {
                const confirm_token = generateAccessToken({id: candidate.id})

                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: req.body.email,
                    subject: 'Reset password',
                    text: `http://localhost:3000/api/auth/password-reset/${confirm_token}`
                }
                mailer(mailOptions)
                res.status(200).json({msg: "Re-send the password, please check your email."})
            } else {
                return res.status(400).json({msg: "This email does not exist."})
            }
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },

    resetPassword: async function (req, res) {
        try {
            const token = req.params.confirm_token
            if(!token) return res.status(400).json({msg: "Invalid authentication."})

            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
                if (err) return res.status(400).json({msg: "Invalid authentication."})

                req.user = user
            })

            const {password} = req.body
            if(!password) {
                return res.status(400).json({msg: "Please, enter new password"})
            }
            if(password.length < 6) {
                return res.status(400).json({msg: "Password must be at list 6 characters."})
            }

            const user = await User.findOne({where: {id: req.user.id}})
            if(user){
                const passwordHash = await bcrypt.hash(password, 12)
                await user.update(
                    {password: passwordHash},
                    {where: {id: user.id}}
                )
            }
            res.status(200).json({msg:'Password was changed succesfully'})
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    }
}

module.exports = authController