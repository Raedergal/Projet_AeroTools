const { PrismaClient } = require("../generated/prisma/client")
const validateForm = require("../middleware/extensions/validateForm")
const prisma = new PrismaClient().$extends(validateForm)

exports.displayTools = async (req, res) => {

}