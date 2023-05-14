const checkUserForBuyerApproval = (userStatus) => {
  let status = "You have Missing";
  if (userStatus.cnicNumber == null) {
    status += " Cnic Number";
    console.log("cnic number not available");
  }
  if (userStatus.cnicFront == null) {
    status += " Cnic front picture,";
    console.log("cnic FP not available");
  }
  if (userStatus.cnicBack == null) {
    status += " Cnic Back picture,";
    console.log("cnic BP not available");
  }
  if (userStatus.dp == null) {
    status += " user profile picture,";
    console.log("user Dp not available");
  }
  status += " for approval";
  if (
    userStatus.cnicNumber &&
    userStatus.cnicNumber &&
    userStatus.cnicBack &&
    userStatus.dp
  ) {
    status = "Your req has gone to admin for approval or disapproval";
    console.log("cnic ok");
  }
  return status;
};

module.exports = checkUserForBuyerApproval;
