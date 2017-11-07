import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import uniqueValidator from 'mongoose-unique-validator'

/* add add uniqueness and eameil validations to email field */

const schema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            lowercase: true,
            index: true,
            unique: true
        },
        passwordHash: { type: String, required: true },
        comfirmed: { type: Boolean, default: true }
    },
    { timestamps: true }
)

schema.methods.isValidPassword = function isValidPassword (password) {
    return bcrypt.compareSync(password, this.passwordHash)
}

schema.methods.setPassword = function setPassword (password) {
    this.passwordHash = bcrypt.hashSync(password, 10)
}

schema.methods.generateJWT = function generateJWT() {
    return jwt.sign(
        {
            email: this.email
        },
        process.env.JWT_SECRET
    )
}
schema.methods.toAuthJSON = function toAuthJSON () {
    return {
        email: this.email,
        comfirmed: this.comfirmed,
        token: this.generateJWT()
    }
}

schema.plugin(uniqueValidator, {massage: 'This email is allready taken'})

export default mongoose.model('User',  schema)