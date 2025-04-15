import mongoose from 'mongoose';

const connectDatabase = async ()=>{
    try{
        await mongoose.connect("mongodb://localhost:27017/SEWAMATE",{

        });
        console.log("Database is connected");

    } catch (err){
        console.log("Error connecting to the Database :",err)
    }
}
connectDatabase();
export default connectDatabase
