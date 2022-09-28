const jwt = require('jsonwebtoken')

const checkAuthUser = (req, res, next) => {
    try {
        const token = req.cookies.refreshToken
        if(!token) {
            return res.status(400).json({msg: 'Not authorized'})
        } else {
            jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if(err) return res.status(400).json({msg: 'Not authorized'})

                req.user = user
                next()
            })
        }
    } catch (error) {
        return res.send(500).json({msg: error.message})
    }
}

const checkAdmin = async (req, res, next) => {
    console.log(req.user.role)
    if(req.user.role === 'admin') {
        next()
    } else {
        return res.status(400).json({msg: 'Not admin'})
    }
}

module.exports = {checkAuthUser, checkAdmin}