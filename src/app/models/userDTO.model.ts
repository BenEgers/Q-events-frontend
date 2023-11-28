export class UserDTO {
    id?: number;
    name?: string;
    email!: string;
    password!: string;

    
    constructor(email: string, password: string, id?: number, name?: string, ){
        this.name = name,
        this.email = email,
        this.password = password,
        this.id = id
    }
}