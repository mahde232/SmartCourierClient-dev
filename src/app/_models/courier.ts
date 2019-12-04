import { Delivery, Salary} from './index';

export class Courier {
    id: number;
    email: string;
    password: string;
    phone: string;
    firstName: string;
    lastName: string;
    delivery: Delivery[];
  //  currentTotalPaid: string;//this field is not exist in data base, so don't send it to DB.
  //  delivery: Delivery[];
    //salary: Salary[];
}
