const localServer = "localhost:50051";
const t2Micro = "ec2-43-203-120-228.ap-northeast-2.compute.amazonaws.com:50051";
const t2Large = "ec2-52-78-127-116.ap-northeast-2.compute.amazonaws.com:50051";
const c5Large = "ec2-13-125-254-66.ap-northeast-2.compute.amazonaws.com:50051";
const c54xLarge =
  "ec2-52-79-241-117.ap-northeast-2.compute.amazonaws.com:50051";

export const server = c54xLarge;
// export const server = t2Large;
// export const server = t2Micro;
// export const server = localServer;

// points = s^10 * LENGTH
// client = LENGTH
export const LENGTH = 8;
