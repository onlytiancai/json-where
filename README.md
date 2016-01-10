### 介绍

以类似SQL语法的形式对json对象进行过滤

    name == 'Alice'
    name != 'Alice'
    age > 30
    age >= 30
    age < 30
    age <= 30
    age in '25, 30'
    name like 'lice'
    age >= 30 && male == true
    age >= 30 || male == true
    age >= 30 || !(male == true)
    age >= 30 && email != 1 || age < 31
    age > -30

### 测试

    mocha
