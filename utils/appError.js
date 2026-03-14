class AppError extends Error{
    constructor(message,statusCode)
    {
        super(message);
        error.statusCode = `${statusCode}`.startsWith('4') ? 'Error' : 'Fail';
        error.message = message;
        
        
        
    }
}