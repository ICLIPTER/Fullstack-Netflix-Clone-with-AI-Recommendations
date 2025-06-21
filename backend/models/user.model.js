import mongoose from "mongoose";

const userschema = mongoose.Schema(
    {
        username: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true},

    });

    const User = mongoose.models.User || mongoose.model("User", userschema);

    export default User;