var fakestk = require('fakestk'),
    menu = require('terminal-menu')({
      width:30,
      fg: 'black',
      bg: 'yellow',
      x:2,
      y:2
    }),
    clc = require('cli-color');
var repl = require('repl');

var VERSIONS = [
  "InDesign-6.0 (CS4)",
  "InDesign-7.0 (CS5)",
  "InDesign-7.5 (CS5.5)",
  "InDesign-8.0 (CS6)",
  "InDesign-9.064 (CC)"
];

function showMenu(){
  menu.reset();

  menu.write("IndRepl\n");
  menu.write("--------\n");

  VERSIONS.forEach(function(o){
    menu.add(o);
  });

  menu.add('EXIT');
  menu.createStream().pipe(process.stdout);

  return menu;
};

function run(v){
  var _version = "#target "+((v===undefined)? "InDesign-7.0" : v);
  var _target_engine = "#targetengine 'indrel'";

  repl.start({
    prompt: _version+"> ",
    input: process.stdin,
    output: process.stdout,
    eval: function(cmd,context,fname,cb){
      var _tgt = _version+"\n";
      var _tgt_eng = _target_engine+"\n";
      var _cmd = [
        _tgt,
        _tgt_eng,
        '$.write(',
        cmd,
        ')'
      ].join("\n");

      fakestk.run(_cmd,function(err,res){
        if(err){ 
          return cb(err);
        }
        cb(null,res);
      });

    }
  }).on('exit',function(){
    console.log(clc.cyan("\nbye!"));
  });
};

module.exports = function(){
  showMenu().on('select',function(v){
    this.close();

    if(v==="EXIT"){
      process.exit(0);
    }else{
      run(v.split(" ")[0]);
    }
  });
};

