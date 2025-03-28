import { UserGender } from "../enums/userGender";

export class UserUpdate{
    userId?:number;
    title!:string;
    userFirst!: string;
    userLast!: string;
    userDob!: Date;
    userGender!: UserGender;
    remark!: string;
}