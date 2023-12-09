export class UserDTO {
    id?: number;
    name?: string;
    email?: string;

    
    constructor(id: number, email?: string, name?: string ){
        this.id = id,
        this.name = name,
        this.email = email
    }
}