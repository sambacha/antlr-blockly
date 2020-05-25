/**
 * use : 
 * ---
 * 
 * converter = new Converter().main(grammerFile);
 * 
 * ---
 * 
 * converter = new Converter();
 * converter.main(grammerFile,{Function_0:function(){
 *   this.evisitor.statementColor=230;
 * }});
 * 
 * ---
 * 
 * converter = new Converter().main(grammerFile,{},'Abc.html');
 * 
 * ===
 * @param {!String} grammerFile is [.g4 File] as String
 */

antlr4 = require('./antlr4/index');
var BlocklyGrammerVisitor = require('./BlocklyGrammerVisitor').
  BlocklyGrammerVisitor;
var BlocklyGrammerLexer = require('./BlocklyGrammerLexer').BlocklyGrammerLexer;
var BlocklyGrammerParser = require('./BlocklyGrammerParser').BlocklyGrammerParser;
var Visitors = require('./Visitors');
var SymbolVisitor=Visitors.SymbolVisitor;
var EvalVisitor=Visitors.EvalVisitor;
var tpl = require('./tpl');

//__all__=['converter','Converter','antlr4'];

function Converter() {
  return this;
}

Converter.prototype.constructor = Converter;

Converter.prototype.init = function () {
  this.toolboxGap=5;
  this.toolboxId='toolbox';
  this.blocklyDivId='blocklyDiv';
  this.workSpaceName='workspace';
  this.codeAreaId='codeArea';
  return this;
}

Converter.prototype.main = function (grammerFile,functions,filename) {
  this.init();
  this.generBlocks(grammerFile,functions);
  this.renderGrammerName();
  this.generToolbox();
  this.generMainFile(functions);
  this.writeMainFile(filename);
  return this;
}

Converter.prototype.generBlocks = function(grammerFile,functions) {
  if(!functions)functions={};

  var temp_consoleError = console.error;
  console.error = function(err){throw new Error(err);}
  var chars = new antlr4.InputStream(grammerFile);
  var lexer = new BlocklyGrammerLexer(chars);
  var tokens  = new antlr4.CommonTokenStream(lexer);
  var parser = new BlocklyGrammerParser(tokens);
  parser.buildParseTrees = true;
  var tree = parser.grammarFile();
  console.error = temp_consoleError;
  
  //test: print all tokens
  //tokens.tokens.forEach(function(v){console.log(v.toString())});

  var svisitor = new SymbolVisitor().init();
  this.svisitor = svisitor;
  svisitor.visit(tree);
  console.log(svisitor);

  svisitor.checkSymbol();

  var evisitor = new EvalVisitor().init(svisitor,grammerFile);
  this.evisitor = evisitor;

  /* Function_0
  // 此处是整体修改
  // 能够修改以下变量
  this.evisitor.valueColor=330;
  this.evisitor.statementColor=160;
  this.evisitor.entryColor=230;

  this.evisitor.generLanguage='JavaScript';
  this.evisitor.recieveOrder='ORDER_ATOMIC';
  this.evisitor.sendOrder='ORDER_NONE';
  this.evisitor.varPrefix='';

  this.toolboxGap=5;
  this.toolboxId='toolbox';
  this.blocklyDivId='blocklyDiv';
  this.workSpaceName='workspace';
  this.codeAreaId='codeArea';
   */
  eval(this.evisitor.matchInject('Function_0'));
  if(functions['Function_0'])functions['Function_0'].call(this);

  evisitor.visit(tree);
  /* Function_1
  // 此处修改各个具体方块
   */
  eval(this.evisitor.matchInject('Function_1'));
  if(functions['Function_1'])functions['Function_1'].call(this);

  evisitor.generBlocks();
  console.log(evisitor);
  this.blocks = evisitor.blocks;
  
  /* Function_2
  // 此处是整体修改
  可以通过对this.blocks进行replace替换,
  修改各复杂词法规则的默认值
   */
  eval(this.evisitor.matchInject('Function_2'));
  if(functions['Function_2'])functions['Function_2'].call(this);
  return this;
}

Converter.prototype.renderGrammerName = function() {
  this.grammerName = this.svisitor.grammerName;
  this.generLanguage = this.evisitor.generLanguage;//在generBlocks中可修改

  var grammerName = this.grammerName;
  var generLanguage = this.generLanguage;

  this.OmitedError = tpl.OmitedError();
  this.Functions_pre = tpl.Functions_pre(grammerName);
  this.Functions_fieldDefault = tpl.Functions_fieldDefault(grammerName);
  this.Functions_xmlText=tpl.Functions_xmlText(grammerName);
  this.Functions_blocksIniter = 
    tpl.Functions_blocksIniter(grammerName,generLanguage);

  this.mainFileTPL = tpl.mainFileTPL;
  return this;
}

Converter.prototype.generToolbox = function() {
  eval(this.grammerName+'Functions={};');
  eval(this.Functions_xmlText);
  eval(this.blocks);
  eval('var blocksobj = '+this.grammerName+'Blocks;');
  console.log(blocksobj);
  var text = [];
  text.push('<xml id="'+this.toolboxId+'" style="display:none">');
  text.push('<category name="statement">');
  for(var key in blocksobj) {
    var value = blocksobj[key];
    if(value instanceof Array)continue;
    if(value.type==='value')continue;
    if(/^[A-Z].*$/.exec(key))continue;
    text.push(value.xmlText());
    text.push('<sep gap="'+this.toolboxGap+'"></sep>');
  }
  text.pop();
  text.push('</category>');
  text.push('<sep gap="'+this.toolboxGap*3+'"></sep>');
  text.push('<category name="value">');
  for(var key in blocksobj) {
    var value = blocksobj[key];
    if(value instanceof Array)continue;
    if(value.type==='statement')continue;
    if(/^[A-Z].*$/.exec(key))continue;
    text.push(value.xmlText());
    text.push('<sep gap="'+this.toolboxGap+'"></sep>');
  }
  text.pop();
  text.push('</category>');
  text.push('</xml>');
  this.toolbox=this.textToPrettyText(text.join(''));
  return this;
}

Converter.prototype.generMainFile = function(functions){
  if(!functions)functions={};

  var text = [];

  var grammerName = this.grammerName;

  text.push(this.blocks);
  text.push('\n\n');
  text.push(this.OmitedError);
  text.push('\n\n');
  text.push(grammerName+'Functions={}\n\n');
  text.push(this.evisitor.matchInject('Functions'));
  /* Functions
  // 此处可以嵌入词法规则的转义函数,例如
  XxxFunctions.IdString_pre = function(IdString){
    if (IdString.indexOf('__temp_name__')!==-1) throw new Error('请修改__temp_name__');
    if (IdString && !(/^[a-zA-Z_][0-9a-zA-Z_\-]*$/.test(IdString)))throw new Error('id: '+IdString+'中包含了0-9 a-z A-Z _ - 之外的字符');
    return IdString;
  }
   */
  if(functions['Functions'])text.push(functions['Functions']);
  text.push('\n\n');
  text.push(this.Functions_pre);
  text.push('\n\n');
  text.push(this.Functions_fieldDefault);
  text.push('\n\n');
  text.push(this.Functions_xmlText);
  text.push('\n\n');
  text.push(this.Functions_blocksIniter);
  text.push('\n\n');
  text.push(grammerName+'Functions.blocksIniter();\n\n');

  this.mainFile = this.mainFileTPL(
    grammerName,this.generLanguage,
    this.blocklyDivId,this.codeAreaId,
    this.toolbox,this.workSpaceName,this.toolboxId,
    text.join('')
  );
}

Converter.prototype.writeMainFile = function(filename) {
  if(!filename)filename=this.grammerName+'index.html';
  this.createAndDownloadFile(this.mainFile.join(''), filename, 'html');
}

///////////////////////////////////////////////////////////////////////////////

Converter.prototype.block = function(blockname) {
  var obj = this.evisitor.expressionRules[blockname];
  if(!obj) obj = this.evisitor.statementRules[blockname];
  if(!obj || obj.checklength===1)return null;
  return obj.blockjs;
}

/**
 * Converts XML text into properly indented text.
 * from Blockly.Xml.domToPrettyText
 * https://github.com/google/blockly/blob/master/core/xml.js
 * @param {!String} blob XML Text in one line.
 * @return {string} Text representation.
 */
Converter.prototype.textToPrettyText = function(blob) {
  // This function is not guaranteed to be correct for all XML.
  // But it handles the XML that Blockly generates.

  // Place every open and close tag on its own line.
  var lines = blob.split('<');
  // Indent every line.
  var indent = '';
  for (var i = 1; i < lines.length; i++) {
    var line = lines[i];
    if (line[0] == '/') {
      indent = indent.substring(2);
    }
    lines[i] = indent + '<' + line;
    if (line[0] != '/' && line.slice(-2) != '/>') {
      indent += '  ';
    }
  }
  // Pull simple tags back together.
  // E.g. <foo></foo>
  var text = lines.join('\n');
  text = text.replace(/(<(\w+)\b[^>]*>[^\n]*)\n *<\/\2>/g, '$1</$2>');
  // Trim leading blank line.
  return text.replace(/^\n/, '');
};

/**
 * Create a file with the given attributes and download it.
 * from FactoryUtils.createAndDownloadFile
 * https://github.com/google/blockly/blob/master/demos/blockfactory/factory_utils.js
 * @param {string} contents The contents of the file.
 * @param {string} filename The name of the file to save to.
 * @param {string} fileType The type of the file to save.
 */
Converter.prototype.createAndDownloadFile = function(contents, filename, fileType) {
  var data = new Blob([contents], {type: 'text/' + fileType});
  var clickEvent = new MouseEvent("click", {
    "view": window,
    "bubbles": true,
    "cancelable": false
  });

  var a = document.createElement('a');
  a.href = window.URL.createObjectURL(data);
  a.download = filename;
  a.textContent = 'Download file!';
  a.dispatchEvent(clickEvent);
};

exports.Converter = Converter;