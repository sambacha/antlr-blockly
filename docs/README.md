# antlr-blockly说明文档

**为保证效果, 请使用docsify版: [antlr-blockly 使用文档说明(docsify)](https://zhaouv.github.io/antlr-blockly/docs/#/README)**

[blockly](https://github.com/google/blockly) 是一个可视化的程序编辑器, 通过拖拽图块来编程.  

配置好每个图块的拼接逻辑并写好其`产生的代码的函数`, 就可以产生某个语言下的代码, 或者是生成出javascript代码进而直接在页面上执行, 经常被用于编程教育.  
事实上, blockly作为领域特定语言或者新的编程语言的代码编辑器, 也是相当具有优势的.([领域特定语言](https://en.wikipedia.org/wiki/Domain-specific_language) :dsl, 可以理解为具有一定格式, 能被某些工具解析的伪代码, 例如正则表达式和嵌入式SQL)

每个方块独立配置, 需要选择其每个输入的类型, 给每个输入命名等, 过程比较繁琐.  
用户拖拽的方块的过程本质上是绕开了编辑code的过程直接编辑语法树(ast), 再通过ast生成code或者直接执行ast.(详见[blockly运行机制简介](blockly.md))

通过 [antlr4](https://github.com/antlr/antlr4) 可以非常简洁的创造一个新语言(dsl), 用非常自然易懂的`.g4`文件来描述语法, 并继承listenner或visitor来遍历语法树, 可以优雅的实现一个语言, 并且很容易做到语法树和code间的互相转换.

通过antlr-blockly, 可以借助antlr4的语法的来描述语言, 自动产生描述每个方块的json, 并且能够类似在antlr4编辑visitor一样, 更为简洁方便的写`方块产生的代码的函数`, 来遍历blockly产生的语法树.  
能够简化blockly的配置, 并且可以很方便的统一为各种类型设置"转义"或者缺省时的行为.  
结合antlr4产生visitor使用的话, 很容易做到blockly图块和code双向转化

antlr-blockly面向有`可视化编辑"领域特定语言"`需求的使用者, 可以高效的产生一个图形的编辑器.

主要面向blockly使用者, 简化其blockly方块的配置, 无需学习antlr4.  
对于antlr4使用者, 提供了一个高效产生其dsl的开发工具的手段, 只需要略微了解blockly如何布局到网页中.

> 使用blockly作ide相比让用户直接编辑dsl文本的好处:不会有格式错误和关键字拼写错误, 学习成本低, 语句块天然的语法高亮, 和帮助文档能够紧密结合.  
> ~~通过此文档, 不需要有antlr4或blockly的使用经验, 就可以搭建出自己的blockly程序~~  

- - -

- **Start Page**  
- [antlr4语法简介](antlr4.md)  
- [blockly运行机制简介](blockly.md)  
- [语法文件规则](grammarfile.md)  
- [demo](demo.md)  