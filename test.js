const SplitBills = require('./index.js');
const splitObj = new SplitBills();

  splitObj.createUser("satyam", "abc123");
  splitObj.createUser("shivam", "abc123");
  splitObj.createUser("rahul", "abc123");
  splitObj.createGroup("satyam", "flat rent");
  splitObj.addMember("shivam","flat rent");
  splitObj.addMember("rahul", "flat rent");

  const bill = {
    title: "flat rent for Oct",
    amount: 21000,
    splits: [
      {username:"satyam", paid: 14000},
      {username: "shivam", paid: 7000},
      {username: "rahul", paid: 0}
    ]
  };
  splitObj.addBill("flat rent", bill);
   const balanceForSatyam = splitObj.getGroupwiseBalance("satyam");
   console.log(balanceForSatyam);
