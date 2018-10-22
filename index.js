const checkUserExist = (state, username) => {
  let response = -1;
  state.users.forEach((user, index) => {
    if (user.username == username) response = index;
  });
  return response;
}

const checkGroupExist = (state, groupName) => {
  let response = -1;
  state.groups.forEach((group, index) => {
    if (group.name === groupName) response = index;
  })
  return response;
}

checkUsersBelongToGroup = (state, usernames, groupName) => {
  const groupIdx = checkGroupExist(state, groupName);
  if(groupIdx === -1) return false;
  for(username in usernames){
    if (checkUserExist(state, username) !== -1 && groupIdx !== -1) {
      const memberIdx = state.groups[groupIdx].members.indexOf(username);
      if (memberIdx === -1) return false;
    }
  }
  return true;
}

class SplitBills{
  constructor(){
    this.state = {
      users: [],
      groups: []
    };
  }
  createUser(username, password){
    if (username && password)
      this.state.users.push({ username, password })
  };
  createGroup(username, groupName){
    console.log(checkUserExist(this.state, username));
    if (checkUserExist(this.state, username) !== -1) {
      console.log("creating group");
      const members = [];
      members.push(username);
      const group = {
        name: groupName,
        bills: [],
        members
      };
      this.state.groups.push(group);
    }
  }

  addMember(username, groupName){
    const groupIdx = checkGroupExist(this.state, groupName);
    if (checkUserExist(this.state, username) !== -1 && groupIdx !== -1) {
      this.state.groups[groupIdx].members.push(username);
    }
  }
  addBill(groupName, billObj){
    const groupIdx = checkGroupExist(this.state,groupName);
    if (groupIdx !== -1) {
      const { title, amount, splits } = billObj;
      const members = splits.map(split => split.username);
      if (checkUsersBelongToGroup(this.state, members, groupName)) {
        const perMemberShare = (amount / members.length).toFixed(2);
        const shares = splits.map(split => {
          let toPay = 0, toReceive = 0;
          if (split.paid > perMemberShare) {
            toReceive = split.paid - perMemberShare;
          }
          if (split.paid < perMemberShare) {
            toPay = perMemberShare - split.paid;
          }
          return { username:split.username,paid: split.paid, toPay, toReceive };
        });
        const bill = {
          title,
          groupName,
          amount,
          shares
        };
        this.state.groups[groupIdx].bills.push(bill);
      }
    }
  }
  getGroupwiseBalance(username){
    if (checkUserExist(this.state, username) !== -1) {
      const result = [];
      const members = [username];
      this.state.groups.forEach(group => {
        if (checkUsersBelongToGroup(this.state, members, group.name)) {
          let toPay = 0;
          let toReceive = 0;
          let paid = 0;
          group.bills.forEach(bill => {
            const userSplit = bill.shares.filter(split => split.username === username);
            if (userSplit.length === 1) {
              toPay += userSplit[0].toPay;
              toReceive += userSplit[0].toReceive;
              paid += userSplit[0].paid;
            }
          });
          result.push({ groupName: group.name, toPay, toReceive, paid });
        }
      });
      return result;
    } else {
      throw new Error("user does not exist");
    }
  }
  
  totalBalanceForUser(username){
    const paid = 0;
    const toPay = 0;
    const toReceive = 0;
    const groupWiseBalance = getGroupwiseBalance(username);
    groupWiseBalance.forEach(gwb => {
      paid += gwb.paid;
      toPay = gwp.toPay;
      toReceive += gwp.toReceive;
    });
    return { paid, toPay, toReceive };
  }  
}

// billObj = {title: string, totalamount: number, splits:[{username:string, paid: number, isPercent:boolean}]}



module.exports = SplitBills;
