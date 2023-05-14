// const date1 = new Date();
// const date2 = new Date("2023-05-02T12:49:25.856Z");
// console.log("date1 is", date1);
// console.log("date2 is", date2);

// // const diff = dateDiffInDays(date1, date2);
// const diff = date1.getMinutes() - date2.getMinutes();
// const diffMinute = date1.getSeconds() - date2.getSeconds();
// console.log("diffrence is", diff);
// console.log("diffrence in seconds is", diffMinute);
// // let seconds = Math.floor(diff / 1000);
// // console.log("difference in seconds is ", seconds);
// const userModel = require("./src/models/users/user");
// const newMethod = async () => {
//   try {
//     const newUser = await userModel.findOne({
//       firstName: "china",
//     });
//     console.log(newUser);
//   } catch (error) {
//     console.log(error.message);
//   }
// };
// // newMethod();

const otpGenerator = require("otp-generator");

// const otp = otpGenerator.generate(4, {
//   upperCase: false,
//   lowerCase: false,
//   specialChars: false,
//   digits: true,
// });
const otp = otpGenerator.generate(6, {
  digits: true,
  upperCaseAlphabets: true,
  lowerCaseAlphabets: false,
  specialChars: false,
});
console.log(`otp is \n ${otp}`);
