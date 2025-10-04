import mongoose from 'mongoose'
import { DB_NAME } from '../constants.js'
async function connect() {
    try {
     const connectionInstance =   await mongoose.connect(`${process.env.DB_URL}/${DB_NAME}`)
     console.log('MongoDB connected !! DB Host: ',connectionInstance.connection.host)
    } catch (error) {
        console.log('Error in connecting database')
        process.exit(1)
    }
}

export default connect
