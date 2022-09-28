const AdminBro = require('admin-bro');
const AdminBroExpress = require('admin-bro-expressjs');
const AdminBroSequelize = require('@admin-bro/sequelize');
const { sequelize } = require('../database/db');
const User = require('../models/UserModel')
const Post = require('../models/PostModel')
const Category = require('../models/CategoryModel')
const Like = require('../models/LikeModel')
const Comment = require('../models/CommentModel')
const PostCategory = require('../models/PostToCategory')
const bcrypt = require('bcryptjs')

AdminBro.registerAdapter(AdminBroSequelize);

const LikesParent = {
  name: 'Likes',
  icon: 'Favorite'
}

const UsersParent = {
  name: 'Users',
  icon: 'User'
}

const PostsParent = {
  name: 'Posts',
  icon: 'Account'
}

const CategoriesParent = {
  name: 'Categories',
  icon: 'Categories'
}
 
const CommentsParent = {
  name: 'Comments',
  icon: 'Chat'
}

const adminBro = new AdminBro({
    Databases: [sequelize],
    resources:[
        {
            resource: User,
            options: {
              properties: {
                encryptedPassword: {
                  isVisible: false,
                },
                password: {
                  type: 'string',
                  isVisible: {
                    list: false, edit: true, filter: false, show: false,
                  },
                },
              },
              actions: {
                new: {
                  before: async (request) => {
                    if(request.payload.password) {
                      request.payload = {
                        ...request.payload,
                        password: await bcrypt.hash(request.payload.password, 12)
                      }
                    }
                    return request
                  },
                }
              },

              parent: UsersParent
            }
        },
      {resource: Post, options: { parent: PostsParent }},
      {resource: Category, options: { parent: CategoriesParent }},
      {resource: PostCategory, options: { parent: CategoriesParent }},
      {resource: Comment, options: { parent: CommentsParent }},
      {resource: Like, options: { parent: LikesParent }},
    ], 
    rootPath: '/admin',
    branding: {
      companyName: 'Admin Panel',
    },
});

//const routerAdmin = AdminBroExpress.buildRouter(adminBro)

/*const router = AdminBroExpressjs.buildAuthenticatedRouter(adminBro, {
    authenticate: async (email, password) => {
      if (ADMIN.password === password && ADMIN.email === email) {
        return ADMIN
      }
      return null
    },
    cookieName: 'adminbro',
    cookiePassword: 'somepassword',
}, router)*/

const  routerAdmin = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
    authenticate: async (email, password) => {
            console.log('JOPAAAAAAAAAAAAAAAAAAAAAA')
            const user = await User.findOne({where: {email: email}})
            console.log(user)
            if(user && user.role === 'admin') {
                if(await bcrypt.compare(password, user.password)) {
                    return user.toJSON()
                }
            }
            return null;
    },
    cookieName: 'adminbro',
    cookiePassword: 'jopahuisrakapidarasblyatadminbrodeveloperpidaras'
});

module.exports = { routerAdmin, adminBro }