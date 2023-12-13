export const getErrorMessage = (error: unknown): string => {
    let message: string;
    if (error instanceof Error) {
        message = error.message;
    }
    else if (error && typeof error === "object" && "message" in error) {
        message = String(error.message);
    }
    else if (typeof error == "string") {
        message = error;
    }
    else {
        message = "Something went wrong";
    }
    return message;
}

export const formatServerErrors = (errorMessages: string[]) => {
    if (!Array.isArray(errorMessages) || errorMessages.length === 0) {
        return;
    }

    return errorMessages.join('. ');
}