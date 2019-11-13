'use strict';

var PORT;

if (process.env.NODE_ENV == 'test') {
    PORT = 8001;
} else if (process.env.NODE_ENV == 'dev') {
    PORT = 8002;
} else if (process.env.NODE_ENV == 'dev1') {
    PORT = 8004;
} else {
    PORT = 8000;
}
var JWT_KEY = "dsadsadsad"

var SERVER = {
    APP_NAME: 'LC',
    PORTS: {
        HAPI: PORT
    },
    TOKEN_EXPIRATION_IN_MINUTES: 600,
    COUNTRY_CODE: '+91',
    DOMAIN_NAME: 'https://nodeapi.communication.com/',
    SUPPORT_EMAIL: 'support@amitrana.com'
};

var DATABASE = {
    PROFILE_PIC_PREFIX: {
        ORIGINAL: 'profilePic_',
        THUMB: 'profileThumb_'
    },
    LOGO_PREFIX: {
        ORIGINAL: 'logo_',
        THUMB: 'logoThumb_'
    },
    DOCUMENT_PREFIX: 'document_',
    USER_ROLES: {
        SUPERADMIN:'SUPERADMIN',
        ADMIN: 'ADMIN',
        SCHOOL: 'SCHOOL',
        STUDENT: 'STUDENT',
        STAFF: 'STAFF',
        GUARDIAN: 'GUARDIAN'
    },
    FILE_TYPES: {
        LICENSE:'LICENSE',
        CERTIFICATES:'CERTIFICATES',
        LOGO: 'LOGO',
        DOCUMENT: 'DOCUMENT',
        OTHERS: 'OTHERS'
    },
    VEHICLE_TYPE: {
        BICYCLE: 'BICYCLE',
        SCOOTER: 'SCOOTER',
        CAR: 'CAR'
    },
    DEVICE_TYPES: {
        IOS: 'IOS',
        ANDROID: 'ANDROID'
    },
    LANGUAGE: {
        EN: 'EN',
        ES_MX: 'ES_MX'
    },
    PAYMENT_OPTIONS: {
        CREDIT_DEBIT_CARD: 'CREDIT_DEBIT_CARD',
        PAYPAL: 'PAYPAL',
        BITCOIN: 'BITCOIN',
        GOOGLE_WALLET: 'GOOGLE_WALLET',
        APPLE_PAY: 'APPLE_PAY',
        EIYA_CASH: 'EIYA_CASH'
    }
};

var STATUS_MSG = {
    SUCCESS: {
        CREATED: {
            statusCode: 201,
            customMessage: 'Created Successfully',
            type: 'CREATED'
        },
        DEFAULT: {
            statusCode: 200,
            customMessage: 'Success',
            type: 'DEFAULT'
        },
        UPDATED: {
            statusCode: 200,
            customMessage: 'Updated Successfully',
            type: 'UPDATED'
        },
        LOGOUT: {
            statusCode: 200,
            customMessage: 'Logged Out Successfully',
            type: 'LOGOUT'
        },
        DELETED: {
            statusCode: 200,
            customMessage: 'Deleted Successfully',
            type: 'DELETED'
        }
    },
    ERROR: {
        INVALID_SUBSCRIBER_TYPE: {
            statusCode: 400,
            customMessage: 'Invalid subscriber type id',
            type: 'INVALID_SUBSCRIBER_TYPE'
        },
        COUNTRY_CODE_REQUIRED: {
            statusCode: 400,
            customMessage: 'Country code or Country name required!',
            type: 'COUNTRY_CODE_REQUIRED'
        },
        PHONE_EMAIL_REQUIRED: {
            statusCode: 400,
            customMessage: 'Phone No. or Email required!',
            type: 'PHONE_EMAIL_REQUIRED'
        },
        INVALID_SUBSCRIBER_VALUE: {
            statusCode: 400,
            customMessage: 'Invalid subscriber id',
            type: 'INVALID_SUBSCRIBER_VALUE'
        },
        INVALID_CUSTOMFIELDID_VALUE: {
            statusCode: 400,
            customMessage: 'Invalid custom field id',
            type: 'INVALID_CUSTOMFIELDID_VALUE'
        },
        SUBSCRIBER_NOT_EMPTY: {
            statusCode: 400,
            customMessage: 'Subscriber not empty',
            type: 'SUBSCRIBER_NOT_EMPTY'
        },
        DUPLICATE: {
            statusCode: 400,
            customMessage: 'Record already exist!',
            type: 'DUPLICATE'
        },
        UNAUTHORISED_ACCESS:{
            statusCode: 401,
            error: "Unauthorized",
            customMessage: "UNAUTHORISED_ACCESS"
        },
        INVALID_PASS: {
            statusCode: 401,
            type: 'INVALID_PASS',
            customMessage: 'Invalid password'
        },
        INVALID_EMAIL: {
            statusCode: 401,
            type: 'INVALID_EMAIL',
            customMessage: 'Invalid email'
        },
        INVALID_USER_PASS: {
            statusCode: 401,
            type: 'INVALID_USER_PASS',
            customMessage: 'Invalid username or password'
        },
        TOKEN_ALREADY_EXPIRED: {
            statusCode: 401,
            customMessage: 'Token Already Expired',
            type: 'TOKEN_ALREADY_EXPIRED'
        },
        DB_ERROR: {
            statusCode: 400,
            customMessage: 'DB Error : ',
            type: 'DB_ERROR'
        },
        IMP_ERROR: {
            statusCode: 500,
            customMessage: 'Implementation Error',
            type: 'IMP_ERROR'
        },
        APP_VERSION_ERROR: {
            statusCode: 400,
            customMessage: 'One of the latest version or updated version value must be present',
            type: 'APP_VERSION_ERROR'
        },
        INVALID_TOKEN: {
            statusCode: 401,
            customMessage: 'Invalid token provided',
            type: 'INVALID_TOKEN'
        },
        INVALID_CODE: {
            statusCode: 400,
            customMessage: 'Invalid Verification Code',
            type: 'INVALID_CODE'
        },
        DEFAULT: {
            statusCode: 400,
            customMessage: 'Error',
            type: 'DEFAULT'
        },
        PHONE_NO_EXIST: {
            statusCode: 400,
            customMessage: 'Phone No Already Exist',
            type: 'PHONE_NO_EXIST'
        },
        EMAIL_EXIST: {
            statusCode: 400,
            customMessage: 'Email Already Exist',
            type: 'EMAIL_EXIST'
        },
        EMPTY_VALUE: {
            statusCode: 400,
            customMessage: 'Empty String Not Allowed',
            type: 'EMPTY_VALUE'
        }

    },
    
};


var swaggerDefaultResponseMessages = [
    { code: 200, message: 'OK' },
    { code: 400, message: 'Bad Request' },
    { code: 401, message: 'Unauthorized' },
    { code: 404, message: 'Data Not Found' },
    { code: 500, message: 'Internal Server Error' }
];


var SWAGGER_INFO = {
    title: "EEG API Documentation"
};


var APP_CONSTANTS = {
    SERVER: SERVER,
    DATABASE: DATABASE,
    STATUS_MSG: STATUS_MSG,
    SWAGGER_INFO: SWAGGER_INFO,
    JWT_KEY:JWT_KEY,
    swaggerDefaultResponseMessages: swaggerDefaultResponseMessages
};

module.exports = APP_CONSTANTS;
