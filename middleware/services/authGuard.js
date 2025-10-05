const { PrismaClient } = require('../../generated/prisma/client')
const prisma = new PrismaClient()

const authGuard = async (req, res, next) => {
    try {
        if (req.session) {
            const user = await prisma.user.findUnique({
                where: {
                    id: req.session.user.id
                }
            })
            if (user) {
                return next()
            }
        }
    } catch (error) {
        res.redirect('/login')
    }
}

module.exports = authGuard