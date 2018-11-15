plantumlfile
  = items:((noise newline { return null }) / (noise startuml noise newline filelines:umllines noise "@enduml" noise { var UMLBlock = require("./UMLBlock"); return new UMLBlock(filelines) }))* { for (var i = 0; i < items.length; i++) { if (items[i] === null) { items.splice(i, 1); i--; } } return items  }
umllines
  = lines:(umlline*) { for (var i = 0; i < lines.length; i++) { if (lines[i]===null) { lines.splice(i, 1); i--; } } return lines; }
umlline
  = propertyset newline { return null }
//  / define newline { return null }
  / titleset newline { return null }
  / noise newline { return null }
  / commentline { return null }
  / notesection newline { return null }
  / noteline { return null }
  / hideline newline { return null }
  / skinparams newline { return null }
  / declaration:togetherdeclaration newline { return declaration }
  / declaration:packagedeclaration newline {return declaration }
  / declaration:namespacedeclaration newline {  return declaration  }
  / declaration:classdeclaration newline { return declaration }
  / declaration:abstractclassdeclaration newline { return declaration }
  / declaration:interfacedeclaration newline {  return declaration }
  / declaration:connectordeclaration newline {  return declaration }
  / declaration:enumdeclaration newline { return declaration }
classline
   = declaration:memberdeclaration newline {  return declaration }
   / noise newline { return null }
   / commentline { return null }
classlines
  = lines:(classline*) { for (var i = 0; i < lines.length; i++) { if (lines[i]===null) { lines.splice(i, 1); i--; } } return lines; }

startuml = "@startuml" { global.defines = new Map(); global.defined = false; }
hideline
  = noise "hide empty members" noise
  / noise "hide" noise objectname noise
skinparams
  = noise "skinparam" noise [^\r\n]+
connectordeclaration
  = noise leftObject:objectname noise connectordescription? noise connector:connectortype noise connectordescription? noise? rightObject:objectname noise? label:connectorlabel? { var Connection = require("./Connection"); return new Connection(leftObject, connector, rightObject,label) }
connectordescription
  = noise ["]([\\]["]/[^"])*["] noise
titleset
  = noise "title " noise [^\r\n]+ noise
commentline
  = noise "'" [^\r\n]+ noise
  / noise ".." [^\r\n\.]+ ".." noise
  / noise "--" [^\r\n\-]+ "--" noise
  / noise "__" [^\r\n\_]+ "__" noise
noteline
    = noise "note " noise [^\r\n]+ noise
notesection
    = noise "note " notedirection "of " noteattachto noise newline+ notetext:notemultiline+ noise "end note" noise { console.log("note: " + notetext.join("") ) }
notedirection
    = "left "
    / "right "
    / "up "
    / "down "
noteattachto
    = objectname "::" objectname
    / objectname
notemultiline
    = char:[^e]+ {return char.join("") }
    / [e]!"nd note" {return "e"}
connectortype
  = item:extends { return item }
  / concatenates { var Composition = require("./Composition"); return new Composition() }
  / aggregates { var Aggregation = require("./Aggregation"); return new Aggregation() }
  / connectorsize { return null }
extends
  = "<|" connectorsize { var Extension = require("./Extension"); return new Extension(true) }
  / connectorsize "|>" { var Extension = require("./Extension"); return new Extension(false) }
connectorsize
  = ".."
  / "--" connectordirection "-"
  / "--" connectordirection
  / "-" connectordirection "--"
  / "-" connectordirection "-"
  / "." connectordirection "."
  / "-" connectordirection
  / "---"
  / "--"
  / [.]
  / [-]
connectordirection
 = "up"
 / "down"
 / "left"
 / "right"
 / "[hidden]"
 / [udlr]
concatenates
  = "*" connectorsize
  / connectorsize [*]
aggregates
  = "o" connectorsize
  / connectorsize [o]
connectorlabel
  = noise [:] noise label:directedlabel {return label}
directedlabel
  = [<] noise label:objectname {var ConnectorLabel = require("./ConnectorLabel"); return new ConnectorLabel(true,label)}
  / label:objectname noise [>] {var ConnectorLabel = require("./ConnectorLabel"); return new ConnectorLabel(false,label)}
  / [>] noise label:objectname {var ConnectorLabel = require("./ConnectorLabel"); return new ConnectorLabel(false,label)}
  / label:objectname noise [<] {var ConnectorLabel = require("./ConnectorLabel"); return new ConnectorLabel(true,label)}
startblock
  = noise [{] noise
endblock
  = noise [}]
propertyset
  = "setpropname.*"
packagedeclaration
  = "package " objectname startblock newline lines:umllines endblock { var Package = require("./Package"); return new Package(lines) }
  / "package " objectname newline umllines "end package" { var Package = require("./Package"); return new Package(lines) }
abstractclassdeclaration
  = noise "abstract " noise "class "? noise classname:objectname noise startblock lines:classlines endblock { var AbstractClass = require("./AbstractClass"); return new AbstractClass(classname, lines) }
  / noise "abstract " noise "class "? noise classname:objectname noise { var AbstractClass = require("./AbstractClass"); return new AbstractClass(classname) }
  / noise "abstract " noise "class "? noise classname:objectname noise newline noise lines:classlines "end class" { var AbstractClass = require("./AbstractClass"); return new AbstractClass(classname, lines) }
noise
  = multilinecomment
  / [ \t]*
multilinecomment
  = [ \t]* "/'" [^']* endcomment
endcomment
  = "'/" [ \t]*
  / ['][^']+ endcomment
newline
  = [\r\n]
  / [\n]
interfacedeclaration
  = noise "interface " noise classname:objectname noise startblock lines:classlines endblock { var Class = require("./Class"); return new Class(classname, lines) }
  / noise "interface " noise classname:objectname noise { var Class = require("./Class"); return new Class(classname) }
classdeclaration
  = noise "class " noise classname:objectname noise (stereotype noise)? startblock lines:classlines endblock { var Class = require("./Class"); return new Class(classname, lines) }
  /// noise "class " noise classname:objectname noise "<<" noise [^>]+ noise ">>" noise { var Class = require("./Class"); return new Class(classname) }
  / noise "class " noise classname:objectname noise { var Class = require("./Class"); return new Class(classname) }
  / noise "class " noise classname:objectname noise newline noise lines:classlines "end class" { var Class = require("./Class"); return new Class(classname, lines) }
stereotype
  = "<<" noise ("(" [A-Za-z] "," objectname ")")? noise st:objectname noise ">>" {return st};
color
  = [#][0-9a-fA-F]+
namespacedeclaration
  = noise "namespace " noise namespacename:objectname noise color? noise startblock lines:umllines endblock { var Namespace = require("./Namespace"); return new Namespace(namespacename, lines) }
  / noise "namespace " noise namespacename:objectname noise newline umllines "end namespace" { var Namespace = require("./Namespace"); return new Namespace(namespacename) }
staticmemberdeclaration
  = "static " memberdeclaration
memberdeclaration
  = declaration:methoddeclaration { return declaration }
  / declaration:fielddeclaration { return declaration }
fielddeclaration
  = noise accessortype:accessortype noise membername:membername noise? [:] noise returntype:returntype array:array noise constraint:constraint? noise? { var Field = require("./Field"); return new Field(accessortype, returntype, array, membername, constraint) }
  / noise accessortype:accessortype noise membername:membername noise? [:] noise returntype:returntype array:array noise constraint:constraint? noise? { var Field = require("./Field"); return new Field(accessortype, returntype, array, membername, constraint) }
  / noise accessortype:accessortype noise returntype:returntype array:array noise membername:membername noise { var Field = require("./Field"); return new Field(accessortype, returntype, array, membername) }
  / noise accessortype:accessortype noise membername:membername noise constraint:constraint? noise? { var Field = require("./Field"); return new Field(accessortype, "void", false, membername,constraint) }
  / noise membername:membername noise? [:] noise returntype:returntype array:array noise constraint:constraint? noise? { var Field = require("./Field"); return new Field("", returntype, array, membername,constraint) }
  / noise returntype:returntype array:array noise membername:membername noise { var Field = require("./Field"); return new Field("+", returntype, array, membername) }
  / noise membername:membername noise constraint:constraint? noise? { var Field = require("./Field"); return new Field("", "void", array, membername,constraint) }
methoddeclaration
  = noise field:fielddeclaration [(] parameters:methodparameters [)] noise { var Method = require("./Method"); return new Method(field.getAccessType(), field.getReturnType(), field.getName(), parameters); }
methodparameters
  = items:methodparameter* { return items; }
methodparameter
  = noise item:returntype membername:([ ] membername)? [,]? { var Parameter = require("./Parameter"); return new Parameter(item, membername ? membername[1] : null); }
returntype
  = items:[^ ,\n\r\t\[\](){}]+ { return items.join("") }
array
  = "[]" {return true}
  / "" {return false}
objectname
  = o1:objectnamebase "::" o2:objectnamebase { return o1+"::"+o2 }
  / o:objectnamebase { return o}
objectnamebase
  = objectname:([A-Za-z_][A-Za-z0-9.]*) { return [objectname[0], objectname[1].join("")].join("") }
membername
  = items:([A-Za-z_][A-Za-z0-9_]*) { return [items[0], items[1].join("")].join("") }
accessortype
  = publicaccessor
  / privateaccessor
  / protectedaccessor
publicaccessor
  = [+]
privateaccessor
  = [-]
protectedaccessor
  = [#]
enumdeclaration
  = noise "enum " noise enumname:objectname noise startblock noise newline lines:enumline+ endblock { var Enumeration = require("./Enumeration"); return new Enumeration(enumname, lines) }
enumline
  = noise char:[^\r\n}]+ newline {return char.join("") }
togetherdeclaration
  = noise "together " noise startblock lines:umllines endblock { var Namespace = require("./Namespace"); return new Namespace(null, lines) }
constraint
  = [{] char:constrchar+ [}] {return char.join("") }
constrchar
  = [^}]
  / [}]![ \t\r\n]


