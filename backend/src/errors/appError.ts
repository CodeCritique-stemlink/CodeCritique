export class AppError extends Error{
    public readonly statusCode: number;
    public readonly isOperationalError: boolean;

    constructor(message:string, statusCode:number){
        super(message);
        this.statusCode =statusCode;
        this.isOperationalError=true;

        Error.captureStackTrace(this, this.constructor);

    }
}

export class UnauthorizedError extends AppError{
    constructor(message:string = "Unauthorized access"){
        super(message,401)
    }
}
export class BadRequestError extends AppError{
    constructor(message:string = "Bad Request"){
        super(message,400)
    }
}
export class ForbiddenError extends AppError{
    constructor(message:string = "Forbidde: Action not allowed"){
        super(message,403)
    }
}
export class NotFoundError extends AppError{
    constructor(message:string = "Requested resource not found"){
        super(message,404)
    }
}