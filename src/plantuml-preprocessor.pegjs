plantumlfile
  = noise filelines:umllines noise { return filelines; }
umllines
  = lines:(umlline*) {  for (var i = 0; i < lines.length; i++) { if (lines[i]===null) { lines.splice(i, 1); i--; } } return lines; }
umlline
  = define:define newline { return define }
  / noise def:ifdef noise key:objectname noise newline { var IfDef = require("./IfDef"); return new IfDef(def,key); }
  / noise "!else" noise newline { var Else = require("./Else"); return new Else; }
  / noise "!endif" noise newline { var EndIf = require("./EndIf"); return new EndIf; }
  / noise "!include" noise file:filename noise newline { var Include = require("./Include"); return new Include(file); }
  / noise newline { return null }
  / commentline { return null }
  / noise code:code noise newline? { return code }
ifdef
 = "!ifdef" { return true }
 / "!ifndef" { return false }
define
  = noise "!define" noise key:objectname noise body:code? noise? { var Define = require("./Define"); return new Define(key,body) }
code
  = char:[^\r\n/]+ { return char.join("")  }
  / char:[/]!"'" { return "/" }
commentline
  = noise "'" [^\r\n]+ noise
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
objectname
  = objectname:([A-Za-z_][A-Za-z0-9.]*) { return [objectname[0], objectname[1].join("")].join("") }
filename
  = filename:[$A-Za-z0-9/\.]+ { return filename.join("") }
