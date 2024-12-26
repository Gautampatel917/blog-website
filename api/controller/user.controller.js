export const test = (req, res) => {
    res.setHeader('Content-Type', 'application/json'); // Set the Content-Type header
    res.status(200).json({
        message: "Test API is working...",
    });
}