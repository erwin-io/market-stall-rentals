
import { Files } from './files.model';

export class Users {
    userId: string;
    userName: string;
    fullName: string;
    gender: 'MALE' | 'FEMALE' | 'OTHERS';
    birthDate: string;
    mobileNumber: string;
    accessGranted: boolean;
    active: boolean;
    userCode: string;
    address: string;
    userProfilePic: UserProfilePic;
    totalUnreadNotif: string;
    userType: 'STAFF' | 'COLLECTOR' | 'TENANT';
  }

  export class UserProfilePic {
    userId: string;
    file: Files;
    user: Users;
  }
