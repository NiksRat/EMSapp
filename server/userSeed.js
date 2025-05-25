import User from './models/User.js'
import bcrypt from 'bcrypt'
import connectToDatabase from './db/db.js'

const userRegister = async () => {
    connectToDatabase()
    try {
        const hashPassword = await bcrypt.hash("12345", 10)
        const newUser = new User({
            name: "Бухгалет",
            email: "accountant@gmail.com",
            password: hashPassword,
            role: "accountant"
        })
        await newUser.save()
    } catch(error) {
        console.log(error)
    }
}

userRegister();