import { UserGender } from "../enums/userGender";

export class User{
    userId?:number;
    title!:string;
    userFirst!: string;
    userLast!: string;
    userDob!: Date;
    userGender!: UserGender;
    password!: string;
    remark!: string;
}