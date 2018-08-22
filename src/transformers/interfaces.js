"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var OPERATION_KIND;
(function (OPERATION_KIND) {
    OPERATION_KIND[OPERATION_KIND["Remove"] = 0] = "Remove";
    OPERATION_KIND[OPERATION_KIND["Add"] = 1] = "Add";
    OPERATION_KIND[OPERATION_KIND["Replace"] = 2] = "Replace";
})(OPERATION_KIND = exports.OPERATION_KIND || (exports.OPERATION_KIND = {}));
var TransformOperation = /** @class */ (function () {
    function TransformOperation(kind, sourceFile, target) {
        this.kind = kind;
        this.sourceFile = sourceFile;
        this.target = target;
    }
    return TransformOperation;
}());
exports.TransformOperation = TransformOperation;
var RemoveNodeOperation = /** @class */ (function (_super) {
    __extends(RemoveNodeOperation, _super);
    function RemoveNodeOperation(sourceFile, target) {
        return _super.call(this, OPERATION_KIND.Remove, sourceFile, target) || this;
    }
    return RemoveNodeOperation;
}(TransformOperation));
exports.RemoveNodeOperation = RemoveNodeOperation;
var AddNodeOperation = /** @class */ (function (_super) {
    __extends(AddNodeOperation, _super);
    function AddNodeOperation(sourceFile, target, before, after) {
        var _this = _super.call(this, OPERATION_KIND.Add, sourceFile, target) || this;
        _this.before = before;
        _this.after = after;
        return _this;
    }
    return AddNodeOperation;
}(TransformOperation));
exports.AddNodeOperation = AddNodeOperation;
var ReplaceNodeOperation = /** @class */ (function (_super) {
    __extends(ReplaceNodeOperation, _super);
    function ReplaceNodeOperation(sourceFile, target, replacement) {
        var _this = _super.call(this, OPERATION_KIND.Replace, sourceFile, target) || this;
        _this.replacement = replacement;
        return _this;
    }
    return ReplaceNodeOperation;
}(TransformOperation));
exports.ReplaceNodeOperation = ReplaceNodeOperation;
