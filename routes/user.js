const Router = require('koa-router');
const bcrypt = require('bcrypt');
const yup = require('yup');
const validator = require('../middleware/validator');
const userRequired = require('../middleware/userRequired');
const users = require('../db/users');

const router = new Router({
    prefix: '/user',
});

/**
 * @swagger
 * /user/create:
 *      post:
 *          tags: [User]
 *          summary: Creates a user account and logs them in
 *          description: Accepts username and password, compares that to the database, then sets a cookie to store userid for future requests
 *          requestBody:
 *              description: Credentials
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          required:
 *                            - username
 *                            - password
 *                            - firstName
 *                            - lastName
 *                          properties:
 *                              username:
 *                                  type: string
 *                                  description: Login name
 *                                  example: Guest
 *                              password:
 *                                  type: string
 *                                  description: Password for that login
 *                                  example: guest
 *                              firstName:
 *                                  type: string
 *                                  description: First name of this user
 *                                  example: Foo
 *                              lastName:
 *                                  type: string
 *                                  description: Sir name of this user
 *                                  example: Bar
 *                              phone:
 *                                  type: string
 *                                  description: Phone number for this user
 *                                  example: 555-555-5555
 *                              email:
 *                                  type: string
 *                                  description: Email for this user
 *                                  example: test@test.com
 *          responses:
 *              201:
 *                  description: User Successfully Created
 */
router.post(
    '/create',
    validator({
        body: yup.object().shape({
            email: yup.string().email(),
            firstName: yup.string().required(),
            lastName: yup.string().required(),
            password: yup.string().required(),
            phone: yup.string(),
            username: yup.string().required(),
        }),
    }),
    async ctx => {
        const {
            body: { password, username },
            db,
        } = ctx.state;

        const usernameTaken = await users.getByUsername(username, db);
        if (usernameTaken) {
            ctx.throw(409, 'Username Already Taken');
        }

        const pw = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));

        const user = await users
            .create(
                {
                    ...ctx.state.body,
                    password: pw,
                },
                db
            )
            .catch(e => {
                switch (e) {
                    case 409:
                        return;
                    default:
                        ctx.throw(500, e);
                }
            });

        ctx.session.userId = user.id;
        ctx.status = 201;
    }
);

/**
 * @swagger
 * /user/login:
 *      post:
 *          tags: [User]
 *          summary: Logs the user into the site
 *          description: Accepts username and password, compares that to the database, then sets a cookie to store userid for future requests
 *          requestBody:
 *              description: Credentials
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          required:
 *                            - username
 *                            - password
 *                          properties:
 *                              username:
 *                                  type: string
 *                                  description: Login name
 *                                  example: Xmer
 *                              password:
 *                                  type: string
 *                                  description: Password for that login
 *                                  example: password
 *          responses:
 *              202:
 *                  description: Successfully Logged In
 *              403:
 *                  description: Invalid Username/Password combo
 */
router.post(
    '/login',

    validator({
        body: yup.object().shape({
            password: yup.string().required(),
            username: yup.string().required(),
        }),
    }),
    async ctx => {
        const {
            body: { password, username },
            db,
        } = ctx.state;

        const badMatch = () => ctx.throw(409, 'Invalid Username or Password');

        const user = await users.getByUsername(username, db);
        if (!user) {
            return badMatch();
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return badMatch();
        }

        ctx.status = 202;
        ctx.session.userId = user.id;
        ctx.body = {
            id: user.id,
        };
    }
);

/**
 * @swagger
 * /user:
 *      get:
 *          tags: [User]
 *          summary: Returns user info
 *          description: Returns the user object if the user is logged in
 *          responses:
 *              200:
 *                  description: Session checked
 */
router.get('/', async ctx => {
    ctx.body = ctx.state.user;
});

/**
 * @swagger
 * /user/logout:
 *      delete:
 *          tags: [User]
 *          summary: Clears the session for this user
 *          description: If the user is logged in this route should log them out
 *          responses:
 *              202:
 *                  description: Session cleared
 */
router.delete('/logout', userRequired, async ctx => {
    ctx.status = 202;
    ctx.session = null;
    ctx.body = {
        id: null,
    };
});

module.exports = router;
