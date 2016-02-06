---
layout: default
sublayout: blog
title: Swift basic compared with C Sharp
---

###Swift basic compared with C Sharp
Swift takes a lot common features of modern programing languages. C# is one of my primary programing language used at work, therefore I created a language basic comparsion table.
<!--more-->

|                  			|Swift										| C#  |
|Variable delcaration 		|`var s:String ="hello word"` 				|`String s ="hello world"; `  |
|Constant    				|`let s:String = "hello world"`         	|`const String s = "hello world";` |
|String format				|`let result = "\(a) times \(b) equal \(a*b)"`|`String.Format("{0} times {1} equal {3}",a,b,a*b);`|
|Array						|`var names = ["tom","jerry"]`				|`string[] names = new string[]{"tom","jerru"};`|
|Dictionary					|`var dic = ["Jone":34,"Tim:33]`			|`Dictionary<String,int> dic = new Dictionary<String,Int>(){ {"Jone",34},{"Tim",33} };`|
|While loop 				| `while condition{ function()}`			|`while(condition){functions();}`|
|For loop					|`for var i=0;i<10;i++ { function(i)}`		|`for var i=0;i<10;i++ { function(i);}`|
|For in loop 				| `for s in [Arrary or Sring]{ function(s)}`|`foreach(var s in Arrary){function(s);}`|
|Range						|close `1...5`, half close `0..5`			|`Enumerable.Range(1,5);`|
|if statement				|`if condition { function()} else { funciton() }`|`if (condition) { function();} else { funciton() ;}`|
|switch statement 			|`switch legs {case 0: printlin() case 1, 3: println() case 4...8: println() default: printlin()}`|`switch (legs) {case 0: functions();break; case 1:case 3: function(); break; default: statements;}`|
|Optional					|`var name:Int?`							|`Nullable<Int> name;`|
|Unwrraping Optional		|`if let nameOptional = unwrapped or nameOptional!`	|`if(nullablename.HasValue) unwrapped = nullablename.Value;`|
|Optional Chaining			|`nameOptional?.subOptional.?subsubOptioanl.?tofuntion`| nested if statement|
|function 					|`func functioname(para1:String,para2:Int)->String{}` |`String functionName(String para1,int para2){ }`|
|function return tuple		|`func functioname(para1:String,para2:Int)->(Int,String){ return (200,"success") }` |`Tuple<Int,String> functionName(String para1,int para2){ return  Tuple.Create(200,"success");}`|
|Closure					|`{(paras)->(return type) in fucntions}		|lamda expression `(a,b) =>{ statements }`|
|Class						| all properties(instance variable) and methods are public		| have internal, private, protected decorator|
|Class						| `let instance = Class()`					| `var instance = new Class()`|
|Class	override baseClass method|add override before methods 			| use the same name in subclass|
|Class property observer	|willSet and didSet							| custom implement at setter before/after value changed|
|Structure 					|can has its own methods 					| yes we can too|
|Enumerations				|has Associated Values and the ability to infer| um??|
|Extension					|`extension Int{ func extMethod()}`|`public static void extMethod(this int value){}`|
{:.table .table-bordered}