const { default: mongoose } = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

main()
  .then((res) => {
    console.log("Connection to DB");
  })
  .catch((err) => {
    console.log(err);
  });

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "6a84894dbd62589325e2d548",
  }));
  await Listing.insertMany(initData.data);
  console.log("Data was initialised");
};

initDB();
