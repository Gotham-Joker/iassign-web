# 表单设计器(form designer)
表单设计器是一个在线的、拖拽式生成的可视化编辑器，您可以将表单项拖入布局页面中，完成您的表单定义。

点击系统菜单："工作流" => "表单管理"，进入系统表单管理页面，点击“添加表单”按钮，即可进入表单设计器。
![表单设计器](/images/formDesigner0.png)

## 1. 设计一个简易表单

---
进入表单设计器会如下图所示
![表单设计器](/images/formDesigner1.png)

1. 现在请尝试将“输入框”控件拖拉到中间的容器中，随后你会在右边的配置栏中看到一个配置面板，用户可以在这个面板中对该输入框控件进行定义。
2. 配置面板中的"字段"为必填项且只能是英文，不能输入特殊符号，我们试着输入"subject",
随后在"控件标签"一栏中输入"主题"。
3. 再拖拽一个“文本域”控件到中间的布局中，同样在"字段"填入remark，"控件标签"中填入"备注"。
即可形成如下图的效果。
![简易表单](/images/formDesigner2.png)
4. 若要删除控件，只需要鼠标右键点击相应的表单控件，再点击删除即可，若要调整控件的顺序，请按住ctrl键不放，然后用鼠标拖拽对应的控件即可完成位置交换。
5. 现在们点击保存按钮，输入表单名和描述，这里我们都尝试填入"简易表单"，点击确定即可保存成功。 ![保存表单](/images/formDesigner3.png) 
6. 此时我们按浏览器退后按钮，可回到表单管理页面，对刚刚的表单进行预览。如下图所示![预览表单](/images/formDesigner4.png)

我们还提供了很多控件，您可以逐一尝试，然后自行保存、预览查看效果。

## 2. 高级用法

我们提供了一些案例，包括选择某一选项，展示或隐藏另外一个控件这样的应用场景，以及调用api获得下拉框选项等高级用法，具体案例可在系统内预览，
点击编辑可以查看它们是如何实现的。一般这些高级用法是面向高级的业务人员，以及开发人员。