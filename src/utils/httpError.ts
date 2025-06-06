import { httpError } from "./errorContructor";

export class badRequestError extends httpError {
    constructor(message:string = "Bad Request") {
        super(400,message);
    }
}

export class notFoundError extends httpError {
    constructor(message:string = "Not Found"){
    super(404,message)
    }
}

export class unauthorizedError extends httpError{
    constructor(message:string = "Unauthorized"){
        super(401,message)
    }
}