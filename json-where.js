var jsep = require('jsep');
jsep.addBinaryOp("in", 10);
jsep.addBinaryOp("like", 10);

function parse(data, ast) {
    if (ast.type == 'BinaryExpression') {
        var right = ast.right.value;
        if (ast.right.type == 'UnaryExpression') {
            right = -ast.right.argument.value;
        }
        switch(ast.operator) {
            case "==":
                return data[ast.left.name] == right;
            case "!=":
                return data[ast.left.name] != right;
            case ">":
                return data[ast.left.name] > right;
            case "<":
                return data[ast.left.name] < right;
            case "<=":
                return data[ast.left.name] <= right;
            case ">=":
                return data[ast.left.name] >= right;
            case "in":
                var arr = right.split(',');
                var name = data[ast.left.name].toString();
                return arr.filter(function(x){ return x.trim() == name}).length > 0;
            case "like":
                var name = data[ast.left.name].toString();
                return name.indexOf(right.toString()) > -1;
            default:
                throw new Error("unknow op: " + ast.operator);
        }
    } else if(ast.type == 'LogicalExpression') {
        switch(ast.operator) { 
            case "&&":
                var left = parse(data, ast.left);
                var right = parse(data, ast.right);
                return left && right;
            case "||":
                var left = parse(data, ast.left);
                var right = parse(data, ast.right);
                return left || right;
            default: 
                throw new Error("unknow op: " + ast.operator);
        }
    } else if(ast.type == 'UnaryExpression') {
        switch(ast.operator) { 
            case "!":
                var arg = parse(data, ast.argument);
                return !arg;
            case "-":
                return -ast.argument.value;
            default: 
                throw new Error("unknow op: " + ast.operator);
        }

    }else {
        throw new Error("unknow type: " + ast.type);
    }

}

function jsonWhere(cond) {
    var ast = jsep(cond);

    return function(data) {
        try{ return parse(data, ast); }
        catch(e) { 
            console.error(e);
            return false; 
        }
    };
}


module.exports = jsonWhere;
