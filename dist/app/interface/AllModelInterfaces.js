"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewStatus = exports.ActiveStatus = exports.Status = exports.Role = void 0;
var Role;
(function (Role) {
    Role["USER"] = "USER";
    Role["COMPANY"] = "COMPANY";
    Role["ADMIN"] = "ADMIN";
})(Role || (exports.Role = Role = {}));
var Status;
(function (Status) {
    Status["ACTIVE"] = "ACTIVE";
    Status["INACTIVE"] = "INACTIVE";
    Status["SUSPENDED"] = "SUSPENDED";
})(Status || (exports.Status = Status = {}));
var ActiveStatus;
(function (ActiveStatus) {
    ActiveStatus["ACTIVE"] = "ACTIVE";
    ActiveStatus["INACTIVE"] = "INACTIVE";
})(ActiveStatus || (exports.ActiveStatus = ActiveStatus = {}));
var ReviewStatus;
(function (ReviewStatus) {
    ReviewStatus["PENDING"] = "PENDING";
    ReviewStatus["APPROVED"] = "APPROVED";
    ReviewStatus["UNPUBLISHED"] = "UNPUBLISHED";
})(ReviewStatus || (exports.ReviewStatus = ReviewStatus = {}));
