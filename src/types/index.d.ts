import { Timestamp } from "firebase/firestore";

type Category = {
  id: string;
  imageURL: string;
  name: string;
  description: string;
  createDate: Timestamp;
};

type Chapter = {
  id: string;
  name: string;
  order: number;
  timestamp: Timestamp;
  categoryId: Category.id;
};
