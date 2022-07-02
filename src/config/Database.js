import mongoose from "mongoose";


class Database {
  uri = "mongodb+srv://superadmin:123@cluster0.4zddaay.mongodb.net/?retryWrites=true&w=majority";

  connect() {
    mongoose.connect(this.uri, {})
    .catch(error => console.log(error));
  }
}

export default Database;