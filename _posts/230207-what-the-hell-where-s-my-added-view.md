---
title: |-
  What the hell, where's my added view?
date: 2009-05-14T08:17:00Z
tags:
  - Entity Framework
---
This behavior may confuse you. You're adding new shiny view and it's not added into the model. Where's the problem?

Well the problem is caused by the fact, that every object in EDM has (must have) key ([EntityKey][1]). And because usually you have no one on view the view is added but it's commented out. Hence if you open your EDMX file in XML editor, you'll see the comment and you can uncomment it. The designer is trying to infer the key from not null columns, but that's may not be true in your case. Thus you may need to edit selected columns in [<Key>][2] <small>([CSDL][3])</small> element. Then save and you're done. You can use the view in your model.

[1]: http://msdn.microsoft.com/en-us/library/system.data.entitykey.aspx
[2]: http://msdn.microsoft.com/en-us/library/bb399377.aspx
[3]: http://msdn.microsoft.com/en-us/library/bb399288.aspx