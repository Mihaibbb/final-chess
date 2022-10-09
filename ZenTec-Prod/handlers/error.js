class ErrorResponse extends Error {
    constructor(message, status, res) {
        super(message);
        this.status = status;

        res.status(status).json({ message: message });
        
    }
};  

module.exports = ErrorResponse;