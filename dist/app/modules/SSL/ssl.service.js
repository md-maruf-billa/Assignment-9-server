"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SSLService = void 0;
const axios_1 = __importDefault(require("axios"));
const http_status_1 = __importStar(require("http-status"));
const configs_1 = __importDefault(require("../../configs"));
const AppError_1 = require("../../utils/AppError");
const initPayment = (paymentData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = {
            store_id: configs_1.default.ssl.storeId,
            store_passwd: configs_1.default.ssl.storePass,
            total_amount: paymentData.amount,
            currency: 'BDT',
            tran_id: paymentData.transactionId,
            success_url: configs_1.default.ssl.successUrl,
            fail_url: configs_1.default.ssl.failUrl,
            cancel_url: configs_1.default.ssl.cancelUrl,
            ipn_url: 'http://localhost:3030/ipn', // need to change 
            shipping_method: 'N/A',
            product_name: 'Appointment',
            product_category: 'Service',
            product_profile: 'general',
            cus_name: paymentData.name,
            cus_email: paymentData.email,
            cus_add1: paymentData.address,
            cus_add2: 'N/A',
            cus_city: 'Dhaka',
            cus_state: 'Dhaka',
            cus_postcode: '1000',
            cus_country: 'Bangladesh',
            cus_phone: paymentData.phoneNumber,
            cus_fax: '01711111111',
            ship_name: 'N/A',
            ship_add1: 'N/A',
            ship_add2: 'N/A',
            ship_city: 'N/A',
            ship_state: 'N/A',
            ship_postcode: 1000,
            ship_country: 'N/A',
        };
        const response = yield (0, axios_1.default)({
            method: 'post',
            url: configs_1.default.ssl.sslPaymentUrl,
            data: data,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        return response.data;
    }
    catch (err) {
        throw new AppError_1.AppError("Payment erro occured!", http_status_1.status.BAD_REQUEST);
    }
});
const validatePayment = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield (0, axios_1.default)({
            method: 'GET',
            url: `${configs_1.default.ssl.sslValidateUrl}?val_id=${payload.val_id}&store_id=${configs_1.default.ssl.storeId}&store_passwd=${configs_1.default.ssl.storePass}&format=json`
        });
        return response.data;
    }
    catch (err) {
        throw new AppError_1.AppError("Payment validation failed!", http_status_1.default.BAD_REQUEST);
    }
});
exports.SSLService = {
    initPayment,
    validatePayment
};
