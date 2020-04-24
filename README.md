族谱项目
common：包下的是工具类和全局一些东西。
BusinessException是自定义业务异常类，当出现业务异常错误时主动抛出此异常。
Constant是常量类，将项目中公共的字符串常量放入此类，方便管理。
GlobalExceptionHandler是异常捕获切面类，捕获所有的Controller抛出的异常，统一处理。
familytree是业务代码。
cache：缓存相关，原来的想法是用来缓存用户注册时的手机验证码，防止用户恶意刷码，使用用户ip为key，每个ip限制一定时间内只能发送一条验证码短信，缓存里存放了ip，以后可能修改为数据库存储。
common：里面放了业务相关管理类，
InsertIntercept类是一个mybatis拦截器类，拦截插入和更新语句，添加BaseEntity中的插入和更新字段。
SessionManage类是session管理类，提取代码中的session相关操作，统一管理，方便后期修改。
config：包放置了一些配置类，AppConfig放置了配置Bean，AppFilter过滤器（暂时没什么作用），MpProperties和WxMpConfiguration是微信公众号认证相关工具类，SmsProperties是短信发送配置类。
controller
dto：业务传输对象，前端传输一个对象给后端，可以在这自定义一个类来当成接收对象。
entity
mapper
service
vo：视图对象，controller返回数据给前端时，可以在这个包创建一个类做为返回数据的包装类。
resources资源包：
static：静态资源目录，assets/css前端css，assets/js前端js，images图片。
MP_verify_2Rtn0lCiNOPcavWM.txt微信公众号认证服务器时的文件。
templates:thymeleaf模板html。可以根据业务划分不同目录方便管理。
error：默认的错误码显示页面。
auth：族谱认证相关页面，如登陆，注册，注册后搜索等页面。

业务流程：
在紫荆堂田氏族谱公众号的菜单栏点击族谱后，微信根据族谱菜单配置的链接跳转到本应用的WechatController getUserInfo接口，并携带一个针对访问的微信用户的code值，
getUserInfo接口通过微信公众号接口认证后通过code值得到访问的微信用户的基本信息，如果微信用户在数据库表weixin_user不存在则插入，否则则更新。
然后再根据weixin_user是否跟member_basic_info关联决定跳转那个页面，memberId不为null即关联了则跳转到显示家族树的页面，否则跳转到注册页面，
注册页面用户填写了手机号等信息后提交注册，如果用户的手机号已注册或已有账号，可以点击登陆页直接去登陆页登陆，登陆时会自动将weixin_user和member_basic_info关联。
注册成功后，引导用户进入搜索家族分支页面，用户输入名字和地域和父亲名字等信息后开始搜索，后端去家族分支找寻跟输入名字和地域匹配的member_basic_info记录，
返回找到的列表，列表中每一个记录对应一个member_basic_info，用户选择其中某一个点击申请加入，流程结束。如果用户发现列表中没有想要的，可以选择添加家族分支，
进入新增家族分支，输入家族分支基本信息后提交，后端在famliy_branch表添加一条记录，并在family_branch_admin添加一条记录（创建分支的人是分支管理员）。
创建好家族分支后，可以在家族分支页面添加分支中的成员，也可以在我的页面中查看新用户的申请加入记录，如果发现符合的则可通过申请，参考FamilyBranchController的approvel接口。

目前只有一个家族，对应famliy表中的田氏，对应默认的这个家族超级管理员在member_basic_info中有一个管理员admin的记录，对应的家族辈份表famliy_basic中的辈份，超级管理员可以通过登陆页面直接使用admin登陆，然后在我的页面管理家族辈份等信息。
家族分支管理员只能管理创建的家族分支，审批新用户的加入申请。
普通注册的新用户可以申请加入家族分支，加入家族分支成功后可以查看家族分支的信息，可以管理其上下两代的成员信息。

代码解释，数据库主键策略采用的是自增方案，对应实体类的主键上@GeneratedValue(strategy = GenerationType.IDENTITY)，采用tk mybatis的insert会自动给插入实体加上自增后的主键。

前端thymeleaf解释：
具体说明可以参考官方文档，此处只简介项目用到的部分。
<base th:href="${#request.getContextPath()}+'/'">定义了页面请求地址的相对路径，所以页面中的请求可以不加servlet路径，直接写controller的mappingurl，如register，不要在url前面加/，静态资源也一样，前面不用加/，因为请求都是相对baseurl的。
ajax请求可以参考已有的页面js，由于项目采用的是weui单页面方式，也就是一次把所有页面整合在一个页面里面，采用锚导航方式跳转，各页面代码写在<script type="text/html" id="tpl_home"></script>里面。
各页面跳转时采用window.location.hash='home';这种方式，这个home就是上面script中的id去掉前缀tel_。
但是各部分之间html的id会相互影响（意思是在script里面的页面js可以获取到另外一个script中的html元素），各部分js可相互取值（意思是在一个script中定义的变量，可以在另外一个script中访问）。
我们可以使用thymeleaf的页面包含方式将多个页面组合在一起，具体参考auth目录下的registered.html。
文件命名和接口命名可能不规范，可以根据实际修改名称。

登陆流程：用户从微信进入，如果用户没有注册，跳转登陆页面，否则直接登陆，直接登陆分情况考虑，如果当前用户处于申请加入分支状态或申请创建分支状态则进入注册页的成功申请等待页面，
如果当前用户处于申请加入分支或申请创建分支被拒绝状态，则进入注册页的申请拒绝页面。
用户输入账号密码登陆，此时session里面存放了WeixinUser对象，跳转到家族树页面。
用户点击我的，后台获取用户权限信息(超级管理员，分支管理员，普通用户)，存放在session，前端根据权限判断相应功能是否显示.
