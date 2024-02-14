import { Timestamp } from "firebase/firestore";

type Category = {
  id: string;
  imageURL: string;
  name: string;
  description: string;
  createDate: Timestamp;
};
