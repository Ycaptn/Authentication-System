
export class httpError extends Error{
    message: string;
    success: boolean;
    statusCode: number;

    constructor(statusCode:number,message:string,success:boolean = false){
    super()
    this.message = message;
    this.statusCode = statusCode;
    this.success = success

    }

}