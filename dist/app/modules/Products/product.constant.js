"use strict";
// export const productSearchTerm: string[] = [
//     'name',
//     'description',
//     'company',
// ];
Object.defineProperty(exports, "__esModule", { value: true });
exports.productPaginationFields = exports.productFilterableFields = void 0;
exports.productFilterableFields = [
    'searchTerm',
    'name',
    'company',
    'price',
];
exports.productPaginationFields = [
    'page',
    'limit',
    'sortBy',
    'sortOrder'
];
